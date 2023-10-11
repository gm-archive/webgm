import * as ohm from "ohm-js";
import * as ohmExtras from "ohm-js/extras";

import {toInteger, forceString, forceReal, forceInteger, asString, forceBool} from "~/common/tools.js";
import WebGMException from "~/common/WebGMException.js";

import BuiltInFunctions from "./BuiltInFunctions.js";
import {ExitException} from "./Game.js";
import GMLGrammar from "./GMLGrammar.js";
import VariableHolder, {VariableException} from "./VariableHolder.js";

export default class GML {
	constructor(game) {
		this.game = game;

		this.vars = new VariableHolder();
		this.currentInstance = null;
		this.currentOther = null;

		this.arguments = [];
		this.argumentRelative = false;

		this.grammar = ohm.grammar(GMLGrammar.getText());

		/* I'm not directly calling addOperation so I can allow async functions. I syncronously convert it into an AST using ohmExtras.toAST and this.mapping (this basically stores just the arguments), then look at it manually. When encountering a nonterminal I run the proper function asyncronously in this.astActions. If ohm adds support for async functions this will no longer be necessary. */

		this.mapping = {
			Start: {_code: 0},
			Block: 1,
			StatementWithSemicolon: 0, // Statement
			If: {_conditionExpression: 1, _code: 2, _elseStatement: 3,
				_conditionExpressionNode: c => c[1]},
			// Else: 1,
			Repeat: {_timesExpression: 1, _code: 2,
				_timesExpressionNode: c => c[1]},
			While: {_conditionExpression: 1, _code: 2,
				_conditionExpressionNode: c => c[1]},
			DoUntil: {_code: 1, _conditionExpression: 4,
				_conditionExpressionNode: c => c[4]},
			For: {_initStatement: 2, _conditionExpression: 3, _iterationStatement: 5, _code: 7,
				_conditionExpressionNode: c => c[3]},
			Switch: {_switchExpression: 1, _code: 2},
			Case: {_caseExpression: 1,
				_caseExpressionNode: c => c[1]},
			Default: function(_0, _1) { return {type: this._node.ruleName, _node: this}; },
			With: {_objectExpression: 1, _code: 2,
				_objectExpressionNode: c => c[1]},
			// Exit: {},
			Return: {_value: 1},
			// Break: {},
			// Continue: {},
			Function: {_name: 0, _args: 2},
			VarDeclare: {_names: 1},
			GlobalVarDeclare: {_names: 1},
			Assignment: {_variable: 0, _expression: 2,
				_variableNode: c => c[0]},
			AssignmentAdd: {_variable: 0, _expression: 2,
				_variableNode: c => c[0]},
			AssignmentSubtract: {_variable: 0, _expression: 2,
				_variableNode: c => c[0]},
			AssignmentMultiply: {_variable: 0, _expression: 2,
				_variableNode: c => c[0]},
			AssignmentDivide: {_variable: 0, _expression: 2,
				_variableNode: c => c[0]},
			Variable: {_object: 0, _name: 1, _arrayIndexes: 2,
				_objectNode: c => c[0]},
			ArrayIndexes: {_index1: 1, _index2: 2,
				_index1Node: c => c[1], _index2Node: c => c[2]},
			// ArrayIndex2: 1,
			Not: {_a: 1,
				_aNode: c => c[1]},
			Negate: {_a: 1,
				_aNode: c => c[1]},
			NegateBitwise: {_a: 1,
				_aNode: c => c[1]},
			And: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			Or: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			Xor: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			Less: {_a: 0, _b: 2,
				_1Node: c => c[1]},
			LessOrEqual: {_a: 0, _b: 2,
				_1Node: c => c[1]},
			Equal: {_a: 0, _b: 2,
				_1Node: c => c[1]},
			Different: {_a: 0, _b: 2,
				_1Node: c => c[1]},
			Greater: {_a: 0, _b: 2,
				_1Node: c => c[1]},
			GreaterOrEqual: {_a: 0, _b: 2,
				_1Node: c => c[1]},
			BitwiseAnd: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			BitwiseOr: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			BitwiseXor: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			BitwiseShiftLeft: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			BitwiseShiftRight: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			Add: {_a: 0, _b: 2,
				_1Node: c => c[1]},
			Subtract: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			Multiply: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			Divide: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			IntegerDivision: {_a: 0, _b: 3,
				_aNode: c => c[0], _bNode: c => c[3]},
			Modulo: {_a: 0, _b: 3,
				_aNode: c => c[0], _bNode: c => c[3]},
			// Parentheses: 1,
			Number: function(_integer, _dot, _decimals) { return Number(this.sourceString); }, // eslint-disable-line no-unused-vars
			String: function(_0, _string, _1) { return _string.sourceString; }, // eslint-disable-line no-unused-vars
			VariableGet: {_variable: 0,
				_variableNode: c => c[0]},
		};

		this.astActions = {
			Start: async ({_code}) => {
				await this.interpretASTNode(_code);
				return 0;
			},
			If: async ({_conditionExpression, _conditionExpressionNode, _code, _elseStatement}) => {
				const condition = await this.interpretASTNode(_conditionExpression);
				this.checkIsNumber(condition, `Expression expected (condition "${condition}" is not a number)`, _conditionExpressionNode);

				if (this.toBool(condition)) {
					await this.interpretASTNode(_code);
				} else {
					await this.interpretASTNode(_elseStatement);
				}
			},
			Repeat: async ({_timesExpression, _timesExpressionNode, _code}) => {
				let times = await this.interpretASTNode(_timesExpression);
				this.checkIsNumber(times, `Repeat count must be a number ("${times}")`, _timesExpressionNode);

				times = toInteger(times);

				for (let i=0; i<times; ++i) {
					try {
						await this.interpretASTNode(_code);
					} catch (e) {
						if (e instanceof BreakException) {
							break;
						} if (e instanceof ContinueException) {
							continue;
						} else {
							throw e;
						}
					}
				}
			},
			While: async ({_conditionExpression, _conditionExpressionNode, _code}) => {
				while (true) {
					const condition = await this.interpretASTNode(_conditionExpression);
					this.checkIsNumber(condition, `Expression expected (condition "${condition}" is not a number)`, _conditionExpressionNode);

					if (!(this.toBool(condition))) break;

					try {
						await this.interpretASTNode(_code);
					} catch (e) {
						if (e instanceof BreakException) {
							break;
						} if (e instanceof ContinueException) {
							continue;
						} else {
							throw e;
						}
					}
				}
			},
			DoUntil: async ({_code, _conditionExpression, _conditionExpressionNode}) => {
				while (true) {
					try {
						await this.interpretASTNode(_code);
					} catch (e) {
						if (e instanceof BreakException) {
							break;
						} if (e instanceof ContinueException) {
							continue;
						} else {
							throw e;
						}
					}

					const condition = await this.interpretASTNode(_conditionExpression);
					this.checkIsNumber(condition, `Expression expected (condition "${condition}" is not a number)`, _conditionExpressionNode);

					if (this.toBool(condition)) break;
				}
			},
			For: async ({_initStatement, _conditionExpression, _conditionExpressionNode, _iterationStatement, _code}) => {
				await this.interpretASTNode(_initStatement);

				while (true) {
					const condition = await this.interpretASTNode(_conditionExpression);
					this.checkIsNumber(condition, `Expression expected (condition "${condition}" is not a number)`, _conditionExpressionNode);

					if (!this.toBool(condition)) break;

					try {
						await this.interpretASTNode(_code);
					} catch (e) {
						if (e instanceof BreakException) {
							break;
						} if (e instanceof ContinueException) {
							continue;
						} else {
							throw e;
						}
					}
					await this.interpretASTNode(_iterationStatement);
				}
			},
			Switch: async ({_switchExpression, _code}) => {
				const switchValue = await this.interpretASTNode(_switchExpression);

				let caseIsTrue = false;
				for (const statement of _code) {
					if (statement.type == "Case") {
						if (caseIsTrue) continue;

						const caseValue = await this.interpretASTNode(statement, {inSwitch: true});
						if (switchValue == caseValue) {
							caseIsTrue = true;
						}
					} else if (statement.type == "Default") {
						caseIsTrue = true;
					} else {
						if (caseIsTrue) {
							try {
								await this.interpretASTNode(statement);
							} catch (e) {
								if (e instanceof BreakException || e instanceof ContinueException) {
									break;
								} else {
									throw e;
								}
							}
						}
					}
				}
			},
			Case: async ({_caseExpression, _caseExpressionNode}, context) => {
				if (!context?.inSwitch) {
					throw this.makeErrorInGMLNode("Case statement only allowed inside switch statement.", _caseExpressionNode);
				}
				return await this.interpretASTNode(_caseExpression);
			},
			Default: async ({_node}, context) => {
				throw this.makeErrorInGMLNode("Default statement only allowed inside switch statement.", _node);
			},
			With: async ({_objectExpression, _objectExpressionNode, _code}) => {
				const object = await this.interpretASTNode(_objectExpression);
				this.checkIsNumber(object, `Object id expected ("${object}" is not a number)`, _objectExpressionNode);

				const instances = this.objectReferenceToInstances(object);

				if (instances == null) return;
				if (instances == "global") {
					throw this.makeErrorInGMLNode("Cannot use global in with statement.", _objectExpressionNode);
				}

				const previousInstance = this.currentInstance;
				const previousOther = this.currentOther;

				for (const instance of instances) {
					this.currentInstance = instance;
					this.currentOther = previousInstance;

					try {
						await this.interpretASTNode(_code);
					} catch (e) {
						if (e instanceof BreakException) {
							break;
						} if (e instanceof ContinueException) {
							continue;
						} else {
							throw e;
						}
					} finally {
						this.currentInstance = previousInstance;
						this.currentOther = previousOther;
					}
				}
			},
			Exit: () => {
				throw new ExitException();
			},
			Return: async ({_value}) => {
				throw new ReturnException(await this.interpretASTNode(_value));
			},
			Break: () => {
				throw new BreakException();
			},
			Continue: () => {
				throw new ContinueException();
			},
			Function: async ({_name, _args}) => {
				const name = _name; // no need to interpret?
				const args = await this.interpretASTNode(_args);

				const script = this.game.project.resources.ProjectScript.find(x => x.name == name);

				if (script) {
					return this.execute(this.game.loadedProject.gmlCache.get(script), this.currentInstance, this.currentOther, args);
				} else {
					return this.builtInFunction(name, this.currentInstance, this.currentOther, args);
				}
			},
			VarDeclare: async ({_names}) => {
				// TODO throw "Cannot redeclare a builtin variable." (global and local)
				for (const name of _names) { // is _names always an array of strings?
					if (!this.vars.exists(name)) {
						await this.vars.set(name, null);
					} // TODO check what if the variable exists
				}
			},
			GlobalVarDeclare: async ({_names}) => {
				for (const name of _names) {
					// TODO throw "Cannot redeclare a builtin variable." (global and local)
					if (this.game.globalObjectVars.exists(name)) {
						const saved = this.game.globalObjectVars.save(name);
						this.game.globalVars.load(name, saved);
					} else {
						await this.game.globalVars.set(name, 0);
					}
				}
			},
			Assignment: async ({_variable, _variableNode, _expression}) => {
				const varInfo = await this.interpretASTNode(_variable);
				const value = await this.interpretASTNode(_expression);
				await this.varSet(varInfo, value, _variableNode);
			},
			// Note: In GM, assignment operations don't error out when they should, and they have weird behavior. It's replicated here.
			AssignmentAdd: async ({_variable, _variableNode, _expression}) => {
				const varInfo = await this.interpretASTNode(_variable);
				const value = await this.interpretASTNode(_expression);
				await this.varModify(varInfo, old => {
					if (typeof old === typeof value) {
						return old + value; // Works for both numbers (addition) and strings (concatenation).
					}
					return old;
				}, _variableNode);
			},
			AssignmentSubtract: async ({_variable, _variableNode, _expression}) => {
				const varInfo = await this.interpretASTNode(_variable);
				const value = await this.interpretASTNode(_expression);
				await this.varModify(varInfo, old => {
					if (typeof old === "number" && typeof value == "number") {
						return old - value;
					}
					return old;
				}, _variableNode);
			},
			AssignmentMultiply: async ({_variable, _variableNode, _expression}) => {
				const varInfo = await this.interpretASTNode(_variable);
				const value = await this.interpretASTNode(_expression);
				await this.varModify(varInfo, old => {
					if (typeof old === "number" && typeof value == "string") {
						// Yeah, wtf. *= repeats the string like in Python, but only if the original value was a real and the new one a string. I have no idea why.
						return value.repeat(old);
					}
					if (typeof old === "number" && typeof value == "number") {
						return old * value;
					}
					return old;
				}, _variableNode);
			},
			AssignmentDivide: async ({_variable, _variableNode, _expression}) => {
				const varInfo = await this.interpretASTNode(_variable);
				const value = await this.interpretASTNode(_expression);
				await this.varModify(varInfo, old => {
					if (typeof old === "number" && typeof value == "number") {
						return old / value;
					}
					return old;
				}, _variableNode);
			},
			Variable: async ({_object, _objectNode, _name, _arrayIndexes}) => {
				const varInfo = {};
				varInfo.name = _name; // no need to interpret?
				varInfo.object = await this.interpretASTNode(_object);
				if (varInfo.object != null) {
					this.checkIsNumber(varInfo.object,
						"Wrong type of variable index ("+varInfo.object.toString()+" is not a number to be an object)", _objectNode);
				}
				varInfo.indexes = await this.interpretASTNode(_arrayIndexes);
				return varInfo;
			},
			ArrayIndexes: async ({_index1, _index1Node, _index2, _index2Node}) => {
				const indexes = [];

				indexes.push(this.arrayIndexValidate(await this.interpretASTNode(_index1), _index1Node));
				if (_index2 != null) {
					indexes.push(this.arrayIndexValidate(await this.interpretASTNode(_index2), _index2Node));
				}

				return indexes;
			},
			Not: async ({_a, _aNode}) => {
				const a = this.toBool(this.checkIsNumber(await this.interpretASTNode(_a),
					"Wrong type of arguments to unary operator.", _aNode));
				return (!a) ? 1 : 0;
			},
			Negate: async ({_a, _aNode}) => {
				const a = this.checkIsNumber(await this.interpretASTNode(_a),
					"Wrong type of arguments to unary operator.", _aNode);
				return (-a);
			},
			NegateBitwise: async ({_a, _aNode}) => {
				const a = this.checkIsNumber(await this.interpretASTNode(_a),
					"Wrong type of arguments to unary operator.", _aNode);
				return (~a);
			},
			And: async ({_a, _aNode, _b, _bNode}) => {
				const a = this.toBool(this.checkIsNumber(await this.interpretASTNode(_a),
					"Wrong type of arguments for &&.", _aNode));
				const b = this.toBool(this.checkIsNumber(await this.interpretASTNode(_b),
					"Wrong type of arguments for &&.", _bNode));
				return (a && b) ? 1 : 0;
			},
			Or: async ({_a, _aNode, _b, _bNode}) => {
				const a = this.toBool(this.checkIsNumber(await this.interpretASTNode(_a),
					"Wrong type of arguments for ||.", _aNode));
				const b = this.toBool(this.checkIsNumber(await this.interpretASTNode(_b),
					"Wrong type of arguments for ||.", _bNode));
				return (a || b) ? 1 : 0;
			},
			Xor: async ({_a, _aNode, _b, _bNode}) => {
				const a = this.toBool(this.checkIsNumber(await this.interpretASTNode(_a),
					"Wrong type of arguments for ^^.", _aNode));
				const b = this.toBool(this.checkIsNumber(await this.interpretASTNode(_b),
					"Wrong type of arguments for ^^.", _bNode));
				return (a != b) ? 1 : 0;
			},
			Less: async ({_a, _1Node, _b}) => {
				const b = await this.interpretASTNode(_b);
				const a = await this.interpretASTNode(_a);
				this.checkIsSameType(a, b, "Cannot compare arguments.", _1Node);
				return (a < b) ? 1 : 0;
			},
			LessOrEqual: async ({_a, _1Node, _b}) => {
				const b = await this.interpretASTNode(_b);
				const a = await this.interpretASTNode(_a);
				this.checkIsSameType(a, b, "Cannot compare arguments.", _1Node);
				return (a <= b) ? 1 : 0;
			},
			Equal: async ({_a, _1Node, _b}) => {
				const b = await this.interpretASTNode(_b);
				const a = await this.interpretASTNode(_a);
				this.checkIsSameType(a, b, "Cannot compare arguments.", _1Node);
				return (a === b) ? 1 : 0;
			},
			Different: async ({_a, _1Node, _b}) => {
				const b = await this.interpretASTNode(_b);
				const a = await this.interpretASTNode(_a);
				this.checkIsSameType(a, b, "Cannot compare arguments.", _1Node);
				return (a !== b) ? 1 : 0;
			},
			Greater: async ({_a, _1Node, _b}) => {
				const b = await this.interpretASTNode(_b);
				const a = await this.interpretASTNode(_a);
				this.checkIsSameType(a, b, "Cannot compare arguments.", _1Node);
				return (a > b) ? 1 : 0;
			},
			GreaterOrEqual: async ({_a, _1Node, _b}) => {
				const b = await this.interpretASTNode(_b);
				const a = await this.interpretASTNode(_a);
				this.checkIsSameType(a, b, "Cannot compare arguments.", _1Node);
				return (a >= b) ? 1 : 0;
			},
			BitwiseAnd: async ({_a, _aNode, _b, _bNode}) => {
				const a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments for &.", _aNode);
				const b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments for &.", _bNode);
				return a & b;
			},
			BitwiseOr: async ({_a, _aNode, _b, _bNode}) => {
				const a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments for |.", _aNode);
				const b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments for |.", _bNode);
				return a | b;
			},
			BitwiseXor: async ({_a, _aNode, _b, _bNode}) => {
				const a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments for ^.", _aNode);
				const b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments for ^.", _bNode);
				return a ^ b;
			},
			BitwiseShiftLeft: async ({_a, _aNode, _b, _bNode}) => {
				const a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments for <<.", _aNode);
				const b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments for <<.", _bNode);
				return a << b;
			},
			BitwiseShiftRight: async ({_a, _aNode, _b, _bNode}) => {
				const a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments for >>.", _aNode);
				const b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments for >>.", _bNode);
				return a >> b;
			},
			Add: async ({_a, _1Node, _b}) => {
				const a = await this.interpretASTNode(_a);
				const b = await this.interpretASTNode(_b);
				this.checkIsSameType(a, b, "Wrong type of arguments to +.", _1Node);
				return a + b;
			},
			Subtract: async ({_a, _aNode, _b, _bNode}) => {
				const a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments to -.", _aNode);
				const b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments to -.", _bNode);
				return a - b;
			},
			Multiply: async ({_a, _aNode, _b, _bNode}) => {
				const a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments to *.", _aNode);
				const b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments to *.", _bNode);
				return a * b;
			},
			Divide: async ({_a, _aNode, _b, _bNode}) => {
				const a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments to /.", _aNode);
				const b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments to /.", _bNode);
				return a / b;
			},
			IntegerDivision: async ({_a, _aNode, _b, _bNode}) => {
				const a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments to div.", _aNode);
				const b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments to div.", _bNode);
				return Math.floor(a / b);
			},
			Modulo: async ({_a, _aNode, _b, _bNode}) => {
				const a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments to mod.", _aNode);
				const b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments to mod.", _bNode);
				return a % b; // TODO check negative numbers
			},
			VariableGet: async ({_variable, _variableNode}) => {
				const varInfo = await this.interpretASTNode(_variable);
				const value = this.varGet(varInfo, _variableNode);
				return value;
			},
		};
	}

	compile(code, startRule) {
		//const trace = this.grammar.trace(code).toString();
		//console.log(trace);

		const matchResult = this.grammar.match(code, startRule);
		//console.log(match);

		if (matchResult.succeeded()) {
			const ast = ohmExtras.toAST(matchResult, this.mapping);
			// console.log(ast);
			return {succeeded: true, ast: ast};
		}

		return {succeeded: false, matchResult: matchResult}; // TODO maybe not store this idk
	}

	async execute(ast, instance, other, args=[], argRelative=false) {
		const previousInstance = this.currentInstance;
		const previousOther = this.currentOther;

		this.currentInstance = instance;
		this.currentOther = other;

		const savedVars = this.vars.saveAll();
		this.vars.clearAll();

		// Save previous arguments
		const previousArguments = this.arguments;
		const previousArgumentRelative = this.argumentRelative;

		// Set new arguments
		this.arguments = [...args]; // Copy just in case
		this.argumentRelative = argRelative;

		let result = 0;

		try {
			result = await this.interpretASTNode(ast);
		} catch (e) {
			if (e instanceof ExitException || e instanceof BreakException || e instanceof ContinueException) {
				// Nothing lol
			} else if (e instanceof ReturnException) {
				result = e.value;
			} else {
				throw e;
			}
		} finally {
			this.currentInstance = previousInstance;
			this.currentOther = previousOther;

			// Load vars/end game in case of non fatal error
			this.vars.loadAll(savedVars);

			// Load previous arguments
			this.arguments = previousArguments;
			this.argumentRelative = previousArgumentRelative;
		}

		return result;
	}

	// Compile and execute a GML string.
	async executeString(gml, instance, other, args) {
		const result = this.compile(gml);
		if (!result.succeeded) {
			throw this.game.makeError({header: false, text:
				`COMPILATION ERROR in string to be executed\n`
				+ `${result.matchResult.message}\n`,
			});
		}

		return await this.execute(result.ast, instance, other, args);
	}

	async builtInFunction(name, instance, other, args, relative=false) {
		const func = BuiltInFunctions[name];

		if (func) {
			const previousInstance = this.currentInstance;
			const previousOther = this.currentOther;

			this.currentInstance = instance;
			this.currentOther = other;

			// TODO Non fatal errors should be caught here.

			let result;

			if (typeof func != "function") {
				const typeCheckedArgs = this.typeCheckArgs(args, func.args);
				result = await func.func.call(this, typeCheckedArgs, relative);
			} else {
				result = await func.call(this, args, relative);
			}

			this.currentInstance = previousInstance;
			this.currentOther = previousOther;

			return result;
		} else {
			throw this.game.makeError({text:
				`Unknown function or script: ${name}`,
			});
		}
	}

	typeCheckArgs(args, funcArgs) {
		if (funcArgs == null) return args;
		const properArgs = [];

		let i = 0;
		for (const funcArg of funcArgs) {
			while (true) {
				if (i >= args.length) {
					if (funcArg.infinite) {
						break;
					} else {
						// TODO wrong
						throw this.game.makeError({fatal: true, text:
							`COMPILATION ERROR\n`
							+ `Wrong number of arguments to function or script. (too few arguments)`,
						});
					}
				}

				if (funcArg.type == "any") {
					properArgs[i] = args[i];
				} else if (funcArg.type == "real") {
					properArgs[i] = forceReal(args[i]);
				} else if (funcArg.type == "int") {
					properArgs[i] = forceInteger(args[i]);
				} else if (funcArg.type == "string") {
					properArgs[i] = forceString(args[i]);
				} else if (funcArg.type == "as_string") {
					properArgs[i] = asString(args[i]);
				} else if (funcArg.type == "bool") {
					properArgs[i] = forceBool(args[i]);
				} else {
					throw new Error("Unknown arg type.");
				}
				++i;

				if (!funcArg.infinite) {
					break;
				}
			}
		}

		if (i < args.length) {
			// TODO wrong
			throw this.game.makeError({fatal: true, text:
				`COMPILATION ERROR\n`
				+ `Wrong number of arguments to function or script. (too many arguments)`,
			});
		}

		return properArgs;
	}

	varGet(varInfo, node) {
		try {
			if (varInfo.object == null) {
				if (this.game.constants[varInfo.name] != null)
					return this.game.constants[varInfo.name];
				if (this.vars.exists(varInfo.name))
					return this.vars.get(varInfo.name, varInfo.indexes);
				if (this.game.builtInGlobalVars.exists(varInfo.name))
					return this.game.builtInGlobalVars.get(varInfo.name, varInfo.indexes);
				if (this.game.globalVars.exists(varInfo.name))
					return this.game.globalVars.get(varInfo.name, varInfo.indexes);

				if (this.currentInstance.vars.exists(varInfo.name))
					return this.currentInstance.vars.get(varInfo.name, varInfo.indexes);

				throw this.makeErrorInGMLNode("Unknown variable " + varInfo.name, node);
			} else {
				const instances = this.objectReferenceToInstances(varInfo.object);

				if (instances == null) {
					throw this.makeErrorInGMLNode("Unknown variable " + varInfo.name, node);
				}

				if (instances == "global") {
					if (this.game.globalVars.exists(varInfo.name))
						return this.game.globalVars.get(varInfo.name, varInfo.indexes);
					if (this.game.globalObjectVars.exists(varInfo.name))
						return this.game.globalObjectVars.get(varInfo.name, varInfo.indexes);

					throw this.makeErrorInGMLNode("Unknown variable " + varInfo.name, node);
				}

				if (instances.length > 0) {
					if (instances[0].vars.exists(varInfo.name))
						return instances[0].vars.get(varInfo.name, varInfo.indexes);
				}

				throw this.makeErrorInGMLNode("Unknown variable " + varInfo.name, node);
			}
		} catch (e) {
			if (e instanceof VariableException) {
				switch (e.type) {
					case "index_not_in_bounds":
						throw this.makeErrorInGMLNode("Unknown variable "+varInfo.name+" or array index out of bounds (it's out of bounds.)", node);
				}
			}
			throw e;
		}
	}

	async varSet(varInfo, value, node) {
		try {
			if (varInfo.object == null) {
				if (this.game.constants[varInfo.name] != null)
					throw this.makeErrorInGMLNode("Variable name expected. (it's a constant)", node);
				if (this.vars.exists(varInfo.name))
					return await this.vars.set(varInfo.name, value, varInfo.indexes);
				if (this.game.builtInGlobalVars.exists(varInfo.name))
					return await this.game.builtInGlobalVars.set(varInfo.name, value, varInfo.indexes);
				if (this.game.globalVars.exists(varInfo.name))
					return await this.game.globalVars.set(varInfo.name, value, varInfo.indexes);

				return await this.currentInstance.vars.set(varInfo.name, value, varInfo.indexes);
			} else {
				const instances = this.objectReferenceToInstances(varInfo.object);

				if (instances === null) {
					throw this.makeErrorInGMLNode("Cannot assign to the variable", node);
				}

				if (instances == "global") {
					if (this.game.globalVars.exists(varInfo.name))
						return await this.game.globalVars.set(varInfo.name, value, varInfo.indexes);

					return await this.game.globalObjectVars.set(varInfo.name, value, varInfo.indexes);
				}

				for (const instance of instances) {
					await instance.vars.set(varInfo.name, value, varInfo.indexes);
				}
				return null;
			}
		} catch (e) {
			if (e instanceof VariableException) {
				switch (e.type) {
					case "read_only":
						throw this.makeErrorInGMLNode("Cannot assign to the variable ("+varInfo.name+" is read only)", node);
				}
			}
			throw e;
		}
	}

	/*
	Converts an object reference (such as values before a dot in variable names) into a list of instances that corresponds to it. It can return:
	- An array of instances
	- "global"
	- null
	*/
	objectReferenceToInstances(object) {
		if (object >= 0 && object <= 100000) { // object index
			const instances = this.game.instances.filter(instance => instance.exists
				&& (instance.objectIndex == object || this.game.objectIsAncestorByIndex(object, instance.objectIndex)));
			return instances;
		} else if (object > 100000) { // instance id
			const instance = this.game.instances.find(instance => instance.exists && instance.id == object);
			return instance ? [instance] : [];
		} else if (object == -1 || object == -7) { // self or local
			return [this.currentInstance].filter(instance => instance.exists);
		} else if (object == -2) { // other
			return [this.currentOther].filter(instance => instance.exists);
		} else if (object == -3) { // all
			return this.game.instances.filter(instance => instance.exists);
		} else if (object == -4) { // noone
			return null;
		} else if (object == -5) { // global
			return "global";
		} else {
			return null;
		}
	}

	async varModify(varInfo, valueFunc, node) {
		const oldValue = this.varGet(varInfo, node);
		const newValue = valueFunc(oldValue);
		await this.varSet(varInfo, newValue, node);
	}

	arrayIndexValidate(index, node) {
		if (typeof index != "number")
			throw this.makeErrorInGMLNode("Wrong type of array index", node);
		if (index < 0)
			throw this.makeErrorInGMLNode("Negative array index", node);
		return index;
	}

	toBool(value) {
		return value>=0.5;
	}

	checkIsNumber(value, message, node) {
		if (typeof value !== "number") {
			throw this.makeErrorInGMLNode(message, node);
		}
		return value;
	}

	checkIsSameType(a, b, message, node) {
		if (typeof a !== typeof b) {
			throw this.makeErrorInGMLNode(message, node);
		}
	}

	async interpretASTNode(node, context) {
		// _iter
		if (Array.isArray(node)) {
			const results = [];
			for (const child of node) {
				results.push(await this.interpretASTNode(child, context));
			}
			return results;
		}

		// _terminal
		if (node == null || node.type == null) {
			return node;
		}

		// _nonterminal
		const astAction = this.astActions[node.type];
		if (astAction) {
			return await astAction(node, context);
		}

		throw new Error("No possible action to interpret this node! ("+node.type+")");
	}

	makeErrorInGMLNode(message, node, isFatal=false) {
		console.log(node);

		const index = node.source.startIdx;
		const lines = node.source.sourceString.split("\n");
		let totalLength = 0;

		let lineNumber = 1;
		let gmlLine = "";
		let position = 1;
		let arrowString = "^";

		for (let i = 0; i < lines.length; ++i) {
			const lineLength = lines[i].length + 1;
			totalLength += lineLength;
			if (totalLength >= index) {
				lineNumber = i + 1;
				gmlLine = lines[i];
				position = (index - (totalLength - lineLength)) + 1;
				arrowString = " ".repeat(position-1) + "^";

				break;
			}
		}

		return this.game.makeError({
			fatal: isFatal,
			text: `Error in code at line ${lineNumber}:\n`
			+ `${gmlLine}\n`
			+ `${arrowString}\n`
			+ `at position ${position}: ${message}\n`,
		});
	}
}

class ReturnException extends WebGMException {
	constructor(value, ...args) {
		super(...args);
		this.value = value;
	}
}

class BreakException extends WebGMException {}
class ContinueException extends WebGMException {}