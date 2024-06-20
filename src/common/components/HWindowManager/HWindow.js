import {parent, endparent, add, HElement, HButton} from "~/common/h";
import {setDraggable} from "~/common/tools";

import HWindowBorder from "./HWindowBorder.js";

export default class HWindow extends HElement {
	constructor(manager) {
		super("div", {class: "h-window"});

		this.manager = manager;

		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;

		this.restore = {x: 0, y: 0, w: 0, h: 0};
		this.isMinimized = false;
		this.isMaximized = false;
		this.isResizable = true;
		this.isClientOnly = false;
		this.escCloses = false;

		this.windowChildren = [];
		this.windowParent = null;

		this.offX = 0;
		this.offY = 0;

		this.modal = null;

		this.keyDownHandler = null;

		parent(this);

			this.html.classList.add("resizable");

			add( new HWindowBorder(this, "top-left") );
			add( new HWindowBorder(this, "top") );
			add( new HWindowBorder(this, "top-right") );
			add( new HWindowBorder(this, "left") );

			parent( add( new HElement("div", {class: "contents"}) ) );

				this.titleBar = parent( add( new HElement("div", {class: "title-bar"}) ) );

					setDraggable(this.titleBar,
						e => { // mousedown
							if (e.target != this.titleBar.html && e.target != this.title.html) return false;
							if (this.isMaximized && !this.isMinimized) return false;

							// Pos relative to window
							const rect = this.html.getBoundingClientRect();
							this.offX = e.clientX - rect.left;
							this.offY = e.clientY - rect.top;
							return true;
						},
						e => { // mousemove
							// Pos relative to window manager
							const rect = manager.html.getBoundingClientRect();
							const style = window.getComputedStyle(manager.html);

							let x = e.clientX - rect.left - parseFloat(style.borderLeftWidth) + manager.html.scrollLeft;
							let y = e.clientY - rect.top - parseFloat(style.borderTopWidth) + manager.html.scrollTop;

							if (x < 0) { x = 0; }
							if (y < 0) { y = 0; }

							this.setPosition(x - this.offX, y - this.offY);
						},
					);

					this.title = add( new HElement("div", {class: "title"}) );

					this.minimizeButton = add( new HButton("🗕", () => this.minimize(), "minimize") );
					this.minimizeButton.html.title = "Minimize";

					this.maximizeButton = add( new HButton("🗖", () => this.maximize(), "maximize") );
					this.maximizeButton.html.title = "Maximize";

					this.closeButton = add( new HButton("🗙", () => this.close(), "close") );
					this.closeButton.html.title = "Close";
					endparent();

				this.client = add( new HElement("div", {class: "client"}) );

				endparent();

			add( new HWindowBorder(this, "right") );
			add( new HWindowBorder(this, "bottom-left") );
			add( new HWindowBorder(this, "bottom") );
			add( new HWindowBorder(this, "bottom-right") );

			endparent();
	}

	onAdd() {
		this.keyDownHandler = e => {
			if (this.manager.focused == this) {
				this.onKeyDown(e);
				if (this.escCloses && e.code == "Escape") {
					this.close();
				}
			}
		};
		document.addEventListener("keydown", this.keyDownHandler);

		this.setSizeToDefault();
		this.setPositionToDefault();
	}

	onRemove() {
		document.removeEventListener("keydown", this.keyDownHandler);
	}

	onKeyDown() {}

	setPosition(x, y) {
		this.x = x;
		this.y = y;

		this.html.style.left = x.toString() + "px";
		this.html.style.top = y.toString() + "px";
	}

	setPositionToCascade() {
		const maxSize = this.getMaxSize();
		let x = this.manager.lastCascadePosition.x;
		let y = this.manager.lastCascadePosition.y;

		if ((x + this.manager.html.scrollLeft + this.w) > maxSize.w || (y + this.manager.html.scrollTop + this.h) > maxSize.h) {
			x = 0;
			y = 0;
		}

		this.setPosition(x + this.manager.html.scrollLeft, y + this.manager.html.scrollTop);

		this.manager.lastCascadePosition = {x, y};
		this.manager.lastCascadePosition.x += this.manager.cascadeDiff;
		this.manager.lastCascadePosition.y += this.manager.cascadeDiff;
	}

	setPositionToCenter() {
		const maxSize = this.getMaxSize();
		this.setPosition(maxSize.w / 2 - this.w / 2, maxSize.h / 2 - this.h / 2);
	}

	setSize(w, h) {
		this.w = w;
		this.h = h;

		this.html.style.width = w.toString() + "px";
		this.html.style.height = h.toString() + "px";
	}

	setSizeAuto(w, h) {
		if (w == null || h == null) {
			if (w == null) {
				this.html.style.removeProperty("width");
			} else {
				this.html.style.width = w.toString() + "px";
			}
			if (h == null) {
				this.html.style.removeProperty("height");
			} else {
				this.html.style.height = h.toString() + "px";
			}

			const style = window.getComputedStyle(this.html);

			if (w == null) {
				w = parseFloat(style.width);
			}
			if (h == null) {
				h = parseFloat(style.height);
			}
		}

		this.w = w;
		this.h = h;

		this.html.style.width = w.toString() + "px";
		this.html.style.height = h.toString() + "px";
	}

	setPositionToDefault() {
		this.setPositionToCascade();
	}

	setSizeToDefault() {
		this.html.style.removeProperty("width");
		this.html.style.removeProperty("height");

		const style = window.getComputedStyle(this.html);

		let w = parseFloat(style.width);
		let h = parseFloat(style.height);

		const maxSize = this.getMaxSize();
		w = Math.min(maxSize.w, w);
		h = Math.min(maxSize.h, h);

		this.setSize(w, h);
	}

	setTitle(title) {
		this.title.html.textContent = title;
	}

	setResizable(value) {
		this.isResizable = value;
		if (value) {
			this.html.classList.add("resizable");
		} else {
			this.html.classList.remove("resizable");
		}
	}

	setMinimizeButton(value) {
		if (value) {
			this.minimizeButton.html.style.removeProperty("display");
		} else {
			this.minimizeButton.html.style.setProperty("display", "none");
		}
	}

	setMaximizeButton(value) {
		if (value) {
			this.maximizeButton.html.style.removeProperty("display");
		} else {
			this.maximizeButton.html.style.setProperty("display", "none");
		}
	}

	setClientOnly(value) {
		this.isClientOnly = value;
		if (value) {
			this.html.classList.add("client-only");
		} else {
			this.html.classList.remove("client-only");
		}
	}

	minimize() {
		if (!this.isMinimized) {
			this.html.classList.add("minimized");
			this.html.classList.remove("resizable");

			if (!this.isMaximized) {
				this.restore = {x: this.x, y: this.y, w: this.w, h: this.h};
			} else {
				this.html.classList.remove("maximized");

				this.maximizeButton.html.textContent = "🗖";
				this.maximizeButton.html.title = "Maximize";
			}

			this.setSizeToDefault();
			this.setSize(this.manager.minimizedSize, this.h);

			const pos = this.getNextMinimizePosition();
			this.setPosition(pos.x, pos.y);

			this.minimizeButton.html.textContent = "🗗";
			this.minimizeButton.html.title = "Restore";

			this.isMinimized = true;
		} else {
			this.html.classList.remove("minimized");
			this.setResizable(this.isResizable);

			if (!this.isMaximized) {
				this.setSize(this.restore.w, this.restore.h);
				this.setPosition(this.restore.x, this.restore.y);
			} else {
				this.html.classList.add("maximized");

				this.html.style.removeProperty("width");
				this.html.style.removeProperty("height");

				this.setPosition(0, 0);

				this.maximizeButton.html.textContent = "🗗";
				this.maximizeButton.html.title = "Restore";
			}

			this.minimizeButton.html.textContent = "🗕";
			this.minimizeButton.html.title = "Minimize";

			this.isMinimized = false;
		}
	}

	maximize() {
		if (this.isMinimized) {
			this.html.classList.remove("minimized");
			this.setResizable(this.isResizable);

			this.minimizeButton.html.textContent = "🗕";
			this.minimizeButton.html.title = "Minimize";

			this.isMinimized = false;

			this.html.classList.add("maximized");

			this.html.style.removeProperty("width");
			this.html.style.removeProperty("height");

			this.setPosition(0, 0);

			this.maximizeButton.html.textContent = "🗗";
			this.maximizeButton.html.title = "Restore";

			this.isMaximized = true;
		} else {
			if (!this.isMaximized) {
				this.html.classList.add("maximized");

				this.restore = {x: this.x, y: this.y, w: this.w, h: this.h};

				this.html.style.removeProperty("width");
				this.html.style.removeProperty("height");

				this.setPosition(0, 0);

				this.maximizeButton.html.textContent = "🗗";
				this.maximizeButton.html.title = "Restore";

				this.isMaximized = true;
			} else {
				this.html.classList.remove("maximized");

				this.setSize(this.restore.w, this.restore.h);
				this.setPosition(this.restore.x, this.restore.y);

				this.maximizeButton.html.textContent = "🗖";
				this.maximizeButton.html.title = "Maximize";

				this.isMaximized = false;
			}
		}
	}

	getMaxSize() {
		const style = window.getComputedStyle(this.manager.html);

		const w = parseFloat(style.width);
		const h = parseFloat(style.height);

		// const w = this.manager.html.scrollWidth;
		// const h = this.manager.html.scrollHeight;

		return {w, h};
	}

	getNextMinimizePosition() {
		let x = 0;
		const y = this.getMaxSize().h - this.h;

		for (const w of [...this.manager.windows].reverse()) {
			if (w.isMinimized && w.x == x && w.y == y) {
				x += this.manager.minimizedSize;
			}
		}

		return {x, y};
	}

	setModal(modal) {
		this.modal = modal;
	}

	openAsChild(windowClass, idFunc, ...args) {
		const w = this.manager.open(windowClass, idFunc, ...args);
		if (w.windowParent == null) {
			w.windowParent = this;
			this.windowChildren.push(w);
		}
	}

	close() {
		for (const child of this.windowChildren) {
			child.close();
		}

		this.manager.delete(this);

		if (this.windowParent) {
			this.windowParent.windowChildren.splice(this.windowParent.windowChildren.indexOf(this), 1);
		}
	}

	forceClose() {
		for (const child of this.windowChildren) {
			child.forceClose();
		}

		this.manager.delete(this);

		if (this.windowParent) {
			this.windowParent.windowChildren.splice(this.windowParent.windowChildren.indexOf(this), 1);
		}
	}
}