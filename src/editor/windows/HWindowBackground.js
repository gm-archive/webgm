import AbstractImage from '../../common/AbstractImage.js'
import {parent, endparent, add, HElement, HButton, HTextInput, HImage, setOnFileDrop} from '../../common/H.js'
import VirtualFileSystem from '../../common/VirtualFileSystem.js'
import HPropertiesWindow from '../HPropertiesWindow.js';

export default class HWindowBackground extends HPropertiesWindow {
	
	constructor(manager, id, editor) {
		super(manager, id, editor);

		this.background = id;

		this.title.html.textContent = 'Edit Background '+this.background.name;

		parent(this.client)
			parent( add( new HElement('div', {class: 'grid-resource resource-background'}) ) )
				parent( add( new HElement('div') ) )

					this.paramImage = this.background.image;

					const inputName = add( new HTextInput('Name:', this.background.name) );

					this.buttonLoadBackground = add( new HButton('Load Background', () => {

						VirtualFileSystem.openDialog('image/*')
						.then(file => {
							this.loadBackgroundFromFile(file);
						});

					}) )

					parent( add( new HElement('div', {}, 'Width: ')) )
						this.divWidth = add( new HElement('span', {}, '0') )
						endparent()

					parent( add( new HElement('div', {}, 'Height: ')) )
						this.divHeight = add( new HElement('span', {}, '0') )
						endparent()
					
					endparent()

				parent( add( new HElement('div', {class: 'preview'}) ) )
					this.imgBackground = add( new HImage() )
					endparent()

				this.updateImageInfo();

				endparent()

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(this.background, inputName.getValue());
					this.editor.changeBackgroundImage(this.background, this.paramImage);
				},
				() => this.close()
			);
			endparent();

		// Open file if dropped in the window body
		setOnFileDrop(this.html, file => this.loadBackgroundFromFile(file));
	}

	loadBackgroundFromFile(file) {
		this.buttonLoadBackground.setDisabled(true);

		const image = new AbstractImage(file);

		image.promise.then(() => {
			this.paramImage = image;
			this.updateImageInfo();
		}).catch(e => {
			// this.updateImageInfo();
			alert("Error when opening image");

		}).finally(() => {
			this.buttonLoadBackground.setDisabled(false);
		})
	}

	updateImageInfo() {
		if (this.paramImage != null) {

			this.imgBackground.setSrc(this.paramImage.image.src);
			this.paramImage.promise.then(() => {
				this.divWidth.html.textContent = this.paramImage.image.width;
				this.divHeight.html.textContent = this.paramImage.image.height;
			})

		} else {
			this.imgBackground.setSrc(null);
			this.divWidth.html.textContent = '0';
			this.divHeight.html.textContent = '0';
		}

	}
}