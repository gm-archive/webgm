import HTMLWindow from './HTMLWindow.js';

import {parent, endparent} from '../common/tools.js'

export default class HTMLWindowExtensionPackages extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient() {
		this.htmlTitle.textContent = 'Extension Packages';

		parent(this.htmlClient)

			this.makeApplyOkButtons(
				() => {
					// changes here
				},
				() => this.editor.deleteWindow(this)
			);
			endparent();
	}
}