export default class GMLGrammar {
	static getText() {
		return String.raw`

GameMakerLanguage {

	Start
		= Code

	space += comment | multiComment

	comment = "//" #(~eol any)*
	multiComment = "/*" #(~"*/" any)* "*/"

	eol = "\n" | "\r"

	name = (letter | "_") namePart*
	namePart = (alnum | "_")

	Code
		= Block
		| ListOfStatements

	BeginSymbol = "{" | #("begin" ~namePart)
	EndSymbol = "}" | #("end" ~namePart)

	Block
		= BeginSymbol ListOfStatements EndSymbol

	ListOfStatements
		= StatementWithSemicolon*

	StatementWithSemicolon
		= Statement ";"*

	BlockOrStatement
		= Block
		| StatementWithSemicolon

	Statement
		= If
		| Repeat
		| While
		| DoUntil
		| For
		| Switch
		| Case
		| Default
		| With
		| Exit
		| Return
		| Break
		| Continue
		| Function
		| VarDeclare
		| GlobalVarDeclare
		| Assignment
		| AssignmentAdd
		| AssignmentSubtract
		| AssignmentMultiply
		| AssignmentDivide

	If
		= #("if" ~namePart) Expression BlockOrStatement Else?
	Else
		= #("else" ~namePart) BlockOrStatement

	Repeat
		= #("repeat" ~namePart) Expression BlockOrStatement

	While
		= #("while" ~namePart) Expression BlockOrStatement

	DoUntil
		= #("do" ~namePart) BlockOrStatement spaces #("until" ~namePart) Expression

	For
		= #("for" ~namePart) "(" BlockOrStatement Expression ";"? BlockOrStatement ")" BlockOrStatement

	Switch
		= #("switch" ~namePart) Expression Block
	Case
		= #("case" ~namePart) Expression ":"
	Default
		= #("default" ~namePart) ":"

	With
		= #("with" ~namePart) Expression BlockOrStatement

	Exit
		= #("exit" ~namePart)
	Return
		= #("return" ~namePart) Expression
	Break
		= #("break" ~namePart)
	Continue
		= #("continue" ~namePart)

	Function
		= name "(" ListOf<Expression,","> ")"

	VarDeclare
		= #("var" ~namePart) NonemptyListOf<name, ",">
	GlobalVarDeclare
		= #("globalvar" ~namePart) NonemptyListOf<name, ",">

	Assignment
		= Variable "=" Expression
	AssignmentAdd
		= Variable "+=" Expression
	AssignmentSubtract
		= Variable "-=" Expression
	AssignmentMultiply
		= Variable "*=" Expression
	AssignmentDivide
		= Variable "/=" Expression

	Variable
		= Object? name ArrayIndexes?
	Object
		= (VariableGet | Parentheses) "."
	ArrayIndexes
		= "[" Expression ArrayIndex2? "]"
	ArrayIndex2
		= "," Expression

	Expression
		= ExpressionBooleanComparison

	ExpressionBooleanComparison
		= And
		| Or
		| Xor
		| ExpressionComparison

	AndSymbol = "&&" | #("and" ~namePart)
	OrSymbol = "||" | #("or" ~namePart)
	XorSymbol = "^^" | #("xor" ~namePart)

	And
		= ExpressionBooleanComparison AndSymbol ExpressionComparison
	Or
		= ExpressionBooleanComparison OrSymbol ExpressionComparison
	Xor
		= ExpressionBooleanComparison XorSymbol ExpressionComparison

	ExpressionComparison
		= Less
		| LessOrEqual
		| Equal
		| Different
		| Greater
		| GreaterOrEqual
		| ExpressionBitwise

	Less
		= ExpressionComparison "<" ExpressionBitwise
	LessOrEqual
		= ExpressionComparison "<=" ExpressionBitwise
	Equal
		= ExpressionComparison equalSymbol ExpressionBitwise
	equalSymbol
		= "=" "="?
	Different
		= ExpressionComparison "!=" ExpressionBitwise
	Greater
		= ExpressionComparison ">" ExpressionBitwise
	GreaterOrEqual
		= ExpressionComparison ">=" ExpressionBitwise

	ExpressionBitwise
		= BitwiseAnd
		| BitwiseOr
		| BitwiseXor
		| ExpressionBitwiseShift

	BitwiseAnd
		= ExpressionBitwise "&" ExpressionBitwiseShift
	BitwiseOr
		= ExpressionBitwise "|" ExpressionBitwiseShift
	BitwiseXor
		= ExpressionBitwise "^" ExpressionBitwiseShift

	ExpressionBitwiseShift
		= BitwiseShiftLeft
		| BitwiseShiftRight
		| ExpressionAddOrSubtract

	BitwiseShiftLeft
		= ExpressionBitwiseShift "<<" ExpressionAddOrSubtract
	BitwiseShiftRight
		= ExpressionBitwiseShift ">>" ExpressionAddOrSubtract

	ExpressionAddOrSubtract
		= Add
		| Subtract
		| ExpressionMultiplyOrDivide

	Add
		= ExpressionAddOrSubtract "+" ExpressionMultiplyOrDivide
	Subtract
		= ExpressionAddOrSubtract "-" ExpressionMultiplyOrDivide

	ExpressionMultiplyOrDivide
		= Multiply
		| Divide
		| IntegerDivision
		| Modulo
		| ExpressionUnary

	Multiply
		= ExpressionMultiplyOrDivide "*" ExpressionUnary
	Divide
		= ExpressionMultiplyOrDivide "/" ExpressionUnary
	IntegerDivision
		= ExpressionMultiplyOrDivide spaces #("div" ~namePart) ExpressionUnary
	Modulo
		= ExpressionMultiplyOrDivide spaces #("mod" ~namePart) ExpressionUnary

	ExpressionUnary
		= Not
		| Negate
		| NegateBitwise
		| OtherExpression

	NotSymbol = "!" | #("not" ~namePart)

	Not
		= NotSymbol OtherExpression
	Negate
		= "-" OtherExpression
	NegateBitwise
		= "~" OtherExpression

	OtherExpression
		= Function
		| Number
		| String
		| VariableGet
		| Parentheses

	Parentheses
		= "(" Expression ")"
	Number
		= digit+ "."? digit*
	String
		= "\"" #(~"\"" any)* "\""
		| "'" #(~"'" any)* "'"
	VariableGet
		= Variable

}

`;
	}
}