import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HTextInput} from "~/common/h";
import HCodeEditor from "~/editor/components/HCodeEditor/HCodeEditor.js";

export default class HWindowScript extends HWindow {
	constructor(manager, editor, script) {
		super(manager);
		this.editor = editor;
		this.resource = script;
		this.script = script;

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "window-script"}) ) );

				const inputName = add( new HTextInput("Name:", script.name) );

				this.codeEditor = add( new HCodeEditor(script.code) );

				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.project.changeResourceName(script, inputName.getValue());
					script.code = this.codeEditor.getValue();

					this.updateTitle();
				},
				() => {
					this.close();
				},
			);

			this.codeEditor.setNextElem(this.applyButton);

			endparent();
	}

	updateTitle() {
		this.title.html.textContent = "Script Properties: "+this.script.name;
	}
}