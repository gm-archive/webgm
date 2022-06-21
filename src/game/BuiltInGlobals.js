import Events from '../common/Events.js';
import {NonFatalErrorException} from '../common/Exceptions.js';

import BuiltInFunctions from './BuiltInFunctions.js';

export default class BuiltInGlobals {

	// this = Game

	// GML Language Overview / Scripts

	static argument = {
		direct: true, dimensions: 1,
		directLength() { return 16; },
		directGet(index) {
			return this.arguments[index] != undefined ? this.arguments[index] : 0;
		},
		directSet(value, index) {
			this.argument[index] = value;
		},
	}

	// Not yet supported by terser/webpack, this is defined at the end of the file
	/*
	static {
		for (let i=0; i<16; ++i) {
			this['argument' + i.toString()] = {
				direct: true,
				directGet() {
					return this.arguments[i] != undefined ? this.arguments[i] : 0;
				},
				directSet(value) {
					this.argument[i] = value;
				},
			};
		}
	}
	*/

	static argument_relative = {readOnly: true, direct: true,
		directGet() { return this.argumentRelative; },
	}

	// Game play / Instances

	static instance_count = {readOnly: true, direct: true,
		directGet() { return this.instances.length; },
	};

	static instance_id = {readOnly: true, direct: true, dimensions: 1,
		directLength() { return this.instances.length },
		directGet(index) { return this.instances[index].id },
	};

	// Game play / Timing

	static room_speed = {direct: true, type: 'integer',
		directGet() { return this.room.speed; },
		directSet(value) {
			if (value <= 0) {
				// TODO So, in GM you get 2 errors right after another. I have no idea how to replicate this.
				throw new NonFatalErrorException({
						type: 'trying_to_set_the_room_speed_to_a_value_less_or_equal_than_0',
						text: '\n___________________________________________\n'
							+ 'Trying to set the room speed to a value <= 0. (' + value.toString() + ')\n',
					},
				);
			}
			this.room.speed = value;
		},
	};

	static fps = {readOnly: true, direct: true,
		directGet() { return this.fps; },
	};

	static current_time = {readOnly: true, direct: true, directGet() {
		return Math.floor(performance.now());
	}};
	static current_year = {readOnly: true, direct: true, directGet() {
		return (new Date()).getFullYear();
	}};
	static current_month = {readOnly: true, direct: true, directGet() {
		return (new Date()).getMonth() + 1;
	}};
	static current_day = {readOnly: true, direct: true, directGet() {
		return (new Date()).getDate();
	}};
	static current_weekday = {readOnly: true, direct: true, directGet() {
		return (new Date()).getDay() + 1;
	}};
	static current_hour = {readOnly: true, direct: true, directGet() {
		return (new Date()).getHours();
	}};
	static current_minute = {readOnly: true, direct: true, directGet() {
		return (new Date()).getMinutes();
	}};
	static current_second = {readOnly: true, direct: true, directGet() {
		return (new Date()).getSeconds();
	}};

	// Game play / Rooms
	
	static room = {direct: true, type: 'integer', 
		directGet() { return this.room.resource.id; },
		directSet(value) {
			// TODO check if room value is changed immediately or only after room change
			BuiltInFunctions.room_goto.call(this.gml, [value]);
		},
	};

	static room_first = {readOnly: true, direct: true, directGet() {
		return this.project.resources.ProjectRoom[0].id;
	}};
	static room_last = {readOnly: true, direct: true, directGet() {
		return this.project.resources.ProjectRoom[this.project.resources.ProjectRoom.length - 1].id;
	}};
	static room_width = {readOnly: true, direct: true, directGet() {
		return this.room.width;
	}};
	static room_height = {readOnly: true, direct: true, directGet() {
		return this.room.height;
	}};
	
	static room_caption = {direct: true, type: 'string',
		directGet() { return this.room.caption; },
		directSet(value) { this.room.caption = value; },
	};
	static room_persistent = {direct: true, type: 'bool',
		directGet() { return this.room.persistent; },
		directSet(value) { this.room.persistent = value; },
	};

	static transition_kind = {type: 'integer', default: 0};

	static transition_steps = {type: 'integer', default: 80, set (value) {
		if (value < 1) {
			this.globalVars.vars.setBuiltIn('transition_steps', 1);
		}
	}};

	// Game play / Score

	static score = {type: 'integer', default: 0};

	static lives = {type: 'integer', default: -1, async set (value, previous, indexes) {
		if (value <= 0 && previous > 0) {
			const OTHER_NO_MORE_LIVES = 6;
			for (const instance of this.instances) {
				if (!instance.exists) continue;
				await this.doEvent(this.getEventOfInstance(instance, 'other', OTHER_NO_MORE_LIVES), instance);
			}
		}
	}};

	static health = {type: 'real', default: 100, async set (value, previous, indexes) {
		if (value <= 0 && previous > 0) {
			const OTHER_NO_MORE_HEALTH = 9;
			for (const instance of this.instances) {
				if (!instance.exists) continue;
				await this.doEvent(this.getEventOfInstance(instance, 'other', OTHER_NO_MORE_HEALTH), instance);
			}
		}
	}};

	static show_score = {type: 'bool', default: 1};
	static show_lives = {type: 'bool', default: 0};
	static show_health = {type: 'bool', default: 0};
	static caption_health = {type: 'string', default: "Health: "};
	static caption_lives = {type: 'string', default: "Lives: "};
	static caption_score = {type: 'string', default: "Score: "};

	// Game play / Generating events

	static event_type = {readOnly: true, direct: true, directGet() {
		return this.currentEvent ? Events.listEventTypes.find(x => x.value == this.currentEvent.type).id : 0;
	}};
	static event_number = {readOnly: true, direct: true, directGet() {
		return this.currentEvent ? this.currentEvent.subtype : 0;
	}};
	static event_object = {readOnly: true, direct: true, directGet() {
		return this.currentEventInstance ? this.currentEventInstance.object_index : 0;
	}};
	static event_action = {readOnly: true, direct: true, directGet() {
		return this.currentEventActionNumber ? this.currentEventActionNumber : 0;
	}};

	// Game play / Miscellaneous variables and functions

	static error_occurred = {type: 'bool', default: 0};
	static error_last = {type: 'string', default: ""};
	static debug_mode = {default: 0, readOnly: true};
	static gamemaker_pro = {default: 1, readOnly: true};
	static gamemaker_registered = {default: 1, readOnly: true};
	static gamemaker_version = {default: 800, readOnly: true};

	// User Interaction / The Keyboard

	static keyboard_lastkey = {type: 'integer', default: 0};
	static keyboard_key = {type: 'integer', default: 0};
	static keyboard_lastchar = {type: 'char', default: ""};
	static keyboard_string = {type: 'string', default: ""};

	// User Interaction / The Mouse

	static mouse_x = {default: 0, readOnly: true};
	static mouse_y = {default: 0, readOnly: true};
	static mouse_button = {type: 'integer', default: 0}; // TODO I think this is an enum
	static mouse_lastbutton = {type: 'integer', default: 0};

	static cursor_sprite = {type: 'integer', default: -1, set (cursor_sprite) {
		this.cursorSprite = this.getResourceById('ProjectSprite', cursor_sprite);
	}};

	// Game Graphics / Backgrounds

	static background_color = {direct: true, type: 'integer',
		directGet() { return this.room.backgroundColor; },
		directSet(value) { this.room.backgroundColor = value; },
	};
	static background_showcolor = {direct: true, type: 'bool',
		directGet() { return this.room.backgroundShowColor; },
		directSet(value) { this.room.backgroundShowColor = value; },
	};
	
	static background_visible = {type: 'bool', dimensions: 1, default: () => new Array(8).fill(0)};
	static background_foreground = {type: 'bool', dimensions: 1, default: () => new Array(8).fill(0)};
	static background_index = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(-1)};
	static background_x = {type: 'real', dimensions: 1, default: () => new Array(8).fill(0)};
	static background_y = {type: 'real', dimensions: 1, default: () => new Array(8).fill(0)};
	static background_width = {dimensions: 1, default: () => new Array(8).fill(0), readOnly: true};
	static background_height = {dimensions: 1, default: () => new Array(8).fill(0), readOnly: true};
	static background_htiled = {type: 'bool', dimensions: 1, default: () => new Array(8).fill(1)};
	static background_vtiled = {type: 'bool', dimensions: 1, default: () => new Array(8).fill(1)};
	static background_xscale = {type: 'real', dimensions: 1, default: () => new Array(8).fill(1)};
	static background_yscale = {type: 'real', dimensions: 1, default: () => new Array(8).fill(1)};
	static background_hspeed = {type: 'real', dimensions: 1, default: () => new Array(8).fill(0)};
	static background_vspeed = {type: 'real', dimensions: 1, default: () => new Array(8).fill(0)};
	static background_blend = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(16777215)};
	static background_alpha = {type: 'real', dimensions: 1, default: () => new Array(8).fill(1)}

	// Game Graphics / Views

	static view_enabled = {type: 'bool', default: 0};
	static view_current = {default: 0, readOnly: true};
	static view_visible = {type: 'bool', dimensions: 1, default: () => new Array(8).fill(0)};
	static view_xview = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(0)};
	static view_yview = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(0)};
	static view_wview = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(640)};
	static view_hview = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(480)};
	static view_xport = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(0)};
	static view_yport = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(0)};
	static view_wport = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(640)};
	static view_hport = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(480)};
	static view_angle = {type: 'real', dimensions: 1, default: () => new Array(8).fill(0)};
	static view_hborder = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(32)};
	static view_vborder = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(32)};
	static view_hspeed = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(-1)};
	static view_vspeed = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(-1)};
	static view_object = {type: 'integer', dimensions: 1, default: () => new Array(8).fill(-1)};

	// Files, registry, and executing programs / Files

	static game_id = {default: 0, readOnly: true};
	static working_directory = {default: "", readOnly: true};
	static program_directory = {default: "", readOnly: true};
	static temp_directory = {default: "", readOnly: true};

	// Files, registry, and executing programs / Executing programs

	static secure_mode = {default: 0, readOnly: true};
	
}

// Static initialization

for (let i=0; i<16; ++i) {
	BuiltInGlobals['argument' + i.toString()] = {
		direct: true,
		directGet() {
			return BuiltInGlobals.arguments[i] != undefined ? BuiltInGlobals.arguments[i] : 0;
		},
		directSet(value) {
			BuiltInGlobals.argument[i] = value;
		},
	};
}