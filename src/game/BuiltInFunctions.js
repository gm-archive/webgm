import Events from "~/common/Events.js";
import {toGMDate, toJSDate, decimalToHSV, hsvToDecimal, decimalToHex, decimalToHexAlpha, hexAlphaToDecimal, decimalToRGB, rgbToDecimal, parseArrowString, forceInteger, toInteger, parseNewLineHash} from "~/common/tools.js";

import {EngineException} from "./Game.js";
import GameCollision from "./GameCollision.js";
import HHighscoreWindow from "./HHighscoreWindow.js";
import HMessageWindow from "./HMessageWindow.js";

export default class BuiltInFunctions {
	// this = GML

	// # Computing things

	// ## Constants  // no functions

	// ## Real-valued functions

	static random = {
		args: [{type: "real"}],
		func: function([x]) {
			return this.game.rng() * x;
		},
	};

	static random_range = {
		args: [{type: "real"}, {type: "real"}],
		func: function([x1, x2]) {
			return (this.game.rng() * (x2-x1)) + x1;
		},
	};

	static irandom = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.floor(this.game.rng() * (Math.floor(x) + 1));
		},
	};

	static irandom_range = {
		args: [{type: "real"}, {type: "real"}],
		func: function([x1, x2]) {
			return Math.floor(this.game.rng() * (Math.floor(x1) - Math.floor(x2) + 1)) + Math.floor(x2);
		},
	};

	static random_set_seed = {
		args: [{type: "any"}],
		func: function([seed]) {
			this.game.setRandomSeed(seed);
			return 0;
		},
	};

	static random_get_seed = {
		args: [],
		func: function([]) {
			return this.game.rngSeed;
		},
	};

	static randomize = {
		args: [],
		func: function([]) {
			this.game.setRandomSeed();
			return 0;
		},
	};

	static choose = {
		args: [{type: "any", infinite: true}],
		func: function([...vals]) {
			return vals[Math.floor((this.game.rng()*vals.length))];
		},
	};

	static abs = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.abs(x);
		},
	};

	static sign = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.sign(x);
		},
	};

	static round = {
		args: [{type: "real"}],
		func: function([x]) {
			return toInteger(x);
		},
	};

	static floor = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.floor(x);
		},
	};

	static ceil = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.ceil(x);
		},
	};

	static frac = {
		args: [{type: "real"}],
		func: function([x]) {
			return x % 1;
		},
	};

	static sqrt = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.sqrt(x);
		},
	};

	static sqr = {
		args: [{type: "real"}],
		func: function([x]) {
			return x * x;
		},
	};

	static power = {
		args: [{type: "real"}, {type: "real"}],
		func: function([x, n]) {
			return x ** n;
		},
	};

	static exp = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.exp(x);
		},
	};

	static ln = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.log(x);
		},
	};

	static log2 = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.log2(x);
		},
	};

	static log10 = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.log10(x);
		},
	};

	static logn = {
		args: [{type: "real"}, {type: "real"}],
		func: function([x, n]) {
			return Math.log(x) / Math.log(n);
		},
	};

	static sin = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.sin(x);
		},
	};

	static cos = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.cos(x);
		},
	};

	static tan = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.tan(x);
		},
	};

	static arcsin = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.asin(x);
		},
	};

	static arccos = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.acos(x);
		},
	};

	static arctan = {
		args: [{type: "real"}],
		func: function([x]) {
			return Math.atan(x);
		},
	};

	static arctan2 = {
		args: [{type: "real"}, {type: "real"}],
		func: function([y, x]) {
			return Math.atan2(y, x);
		},
	};

	static degtorad = {
		args: [{type: "real"}],
		func: function([x]) {
			return x * Math.PI / 180;
		},
	};

	static radtodeg = {
		args: [{type: "real"}],
		func: function([x]) {
			return x * (180 / Math.PI);
		},
	};

	static min = {
		args: [{type: "real", infinite: true}], // TODO allow strings
		func: function([...vals]) {
			return Math.min(...vals);
		},
	};

	static max = {
		args: [{type: "real", infinite: true}], // TODO allow strings
		func: function([...vals]) {
			return Math.max(...vals);
		},
	};

	static mean = {
		args: [{type: "real", infinite: true}],
		func: function([...vals]) {
			if (vals.length == 0) return 0;
			return vals.reduce((a, b) => a+b) / vals.length;
		},
	};

	static median = {
		args: [{type: "real", infinite: true}],
		func: function([...vals]) {
			if (vals.length == 0) return 0;
			vals.sort();
			if (vals.length % 2 != 0) {
				return vals[(vals.length-1) / 2];
			} else {
				return Math.min(vals[(vals.length / 2)], vals[(vals.length / 2)-1]);
			}
		},
	};

	static point_distance = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([x1, y1, x2, y2]) {
			return Math.hypot(x2 - x1, y2 - y1);
		},
	};

	static point_direction = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([x1, y1, x2, y2]) {
			return Math.atan2(-(y2 - y1), x2 - x1) * (180 / Math.PI);
		},
	};

	static lengthdir_x = {
		args: [{type: "real"}, {type: "real"}],
		func: function([len, dir]) {
			return Math.cos(dir * Math.PI / 180) * len;
		},
	};

	static lengthdir_y = {
		args: [{type: "real"}, {type: "real"}],
		func: function([len, dir]) {
			return Math.sin(dir * Math.PI / 180) * len;
		},
	};

	static is_real = {
		args: [{type: "any"}],
		func: function([x]) {
			return (typeof x == "number") ? 1 : 0;
		},
	};

	static is_string = {
		args: [{type: "any"}],
		func: function([x]) {
			return (typeof x == "string") ? 1 : 0;
		},
	};

	// ## String handling functions

	static chr = {
		args: [{type: "real"}],
		func: function([val]) {
			return String.fromCharCode(val);
		},
	};

	static ord = {
		args: [{type: "string"}],
		func: function([str]) {
			return str.charCodeAt(0) || 0;
		},
	};

	static real = {
		args: [{type: "any"}],
		func: function([str]) {
			const float = parseFloat(str);
			return (!Number.isNaN(float)) ? float : 0;
		},
	};

	static string = {
		args: [{type: "any"}],
		func: function([val]) {
			if (typeof val == "string") return val;
			return (val % 1 == 0) ? val.toString() : val.toFixed(2);
		},
	};

	static string_format = {
		args: [{type: "any"}, {type: "int"}, {type: "int"}],
		func: function([val, tot, dec]) {
			if (typeof val == "string") return val;
			return val.toFixed(dec).padStart(tot);
		},
	};

	static string_length = {
		args: [{type: "string"}],
		func: function([str]) {
			return str.length;
		},
	};

	static string_pos = {
		args: [{type: "string"}, {type: "string"}],
		func: function([substr, str]) {
			return str.indexOf(substr) + 1;
		},
	};

	static string_copy = {
		args: [{type: "string"}, {type: "int"}, {type: "int"}],
		func: function([str, index, count]) {
			return str.slice(index - 1, index - 1 + count);
		},
	};

	static string_char_at = {
		args: [{type: "string"}, {type: "int"}],
		func: function([str, index]) {
			return str[index - 1];
		},
	};

	static string_delete = {
		args: [{type: "string"}, {type: "int"}, {type: "int"}],
		func: function([str, index, count]) {
			return str.substring(0, index) + str.substring(index+count);
		},
	};

	static string_insert = {
		args: [{type: "string"}, {type: "string"}, {type: "int"}],
		func: function([substr, str, index]) {
			return str.substring(0, index) + substr + str.substring(index);
		},
	};

	static string_replace = {
		args: [{type: "string"}, {type: "string"}, {type: "string"}],
		func: function([str, substr, newstr]) {
			return str.replace(substr, newstr);
		},
	};

	static string_replace_all = {
		args: [{type: "string"}, {type: "string"}, {type: "string"}],
		func: function([str, substr, newstr]) {
			return str.replaceAll(substr, newstr);
		},
	};

	static string_count = {
		args: [{type: "string"}, {type: "string"}],
		func: function([substr, str]) {
			let count = 0;
			let position;

			while (true) {
				position = str.indexOf(substr, position);
				if (position == -1) return count;
				position += substr.length;
				count += 1;
			}
		},
	};

	static string_lower = {
		args: [{type: "string"}],
		func: function([str]) {
			return str.toLowerCase();
		},
	};

	static string_upper = {
		args: [{type: "string"}],
		func: function([str]) {
			return str.toUpperCase();
		},
	};

	static string_repeat = {
		args: [{type: "string"}, {type: "int"}],
		func: function([str, count]) {
			return str.repeat(count);
		},
	};

	static string_letters = {
		args: [{type: "string"}],
		func: function([str]) {
			return str.match(/[A-Za-z]/g).join("");
		},
	};

	static string_digits = {
		args: [{type: "string"}],
		func: function([str]) {
			return str.match(/[0-9]/g).join("");
		},
	};

	static string_lettersdigits = {
		args: [{type: "string"}],
		func: function([str]) {
			return str.match(/[A-Za-z0-9]/g).join("");
		},
	};

	static clipboard_has_text = {
		args: [],
		func: async function([]) {
			let text;
			try {
				text = await navigator.clipboard.readText();
			} catch (e) {
				text = "";
			}
			return (text != "") ? 1 : 0;
		},
	};

	static clipboard_get_text = {
		args: [],
		func: async function([]) {
			let text;
			try {
				text = await navigator.clipboard.readText();
			} catch (e) {
				text = "";
			}
			return text;
		},
	};

	static clipboard_set_text = {
		args: [{type: "as_string"}],
		func: async function([str]) {
			try {
				await navigator.clipboard.writeText(str);
			} catch (e) {
				//
			}
			return 0;
		},
	};

	// ## Dealing with dates and time

	static date_current_datetime = {
		args: [],
		func: function([]) {
			return toGMDate(Date.now());
		},
	};

	static date_current_date = {
		args: [],
		func: function([]) {
			return Math.floor(toGMDate(Date.now()));
		},
	};

	static date_current_time = {
		args: [],
		func: function([]) {
			return toGMDate(Date.now()) % 1;
		},
	};

	static date_create_datetime = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}],
		func: function([year, month, day, hour, minute, second]) {
			return toGMDate(Date.UTC(year, month-1, day, hour, minute, second));
		},
	};

	static date_create_date = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}],
		func: function([year, month, day]) {
			return toGMDate(Date.UTC(year, month-1, day));
		},
	};

	static date_create_time = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}],
		func: function([hour, minute, second]) {
			return toGMDate(Date.UTC(1899, 11, 30, hour, minute, second)); // % 1
		},
	};

	static date_valid_datetime = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}],
		func: function([year, month, day, hour, minute, second]) {
			return (!(year <= 0 || year > 9999
				|| month < 1 || month > 12
				|| day < 1 || day > new Date(Date.UTC(year, month-1+1, 0)).getUTCDate()
				|| hour < 0 || hour > 24
				|| minute < 0 || minute >= 60
				|| second < 0 || second >= 60
			)) ? 1 : 0;
		},
	};

	static date_valid_date = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}],
		func: function([year, month, day]) {
			return (!(year <= 0 || year > 9999
				|| month < 1 || month > 12
				|| day < 1 || day > new Date(Date.UTC(year, month-1+1, 0)).getUTCDate()
			)) ? 1 : 0;
		},
	};

	static date_valid_time = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}],
		func: function([hour, minute, second]) {
			return (!(hour < 0 || hour > 24
				|| minute < 0 || minute >= 60
				|| second < 0 || second >= 60
			)) ? 1 : 0;
		},
	};

	static date_inc_year = {
		args: [{type: "real"}, {type: "int"}],
		func: function([date, amount]) {
			const d = toJSDate(date);
			d.setUTCFullYear(d.getUTCFullYear() + amount);
			return toGMDate(d);
		},
	};

	static date_inc_month = {
		args: [{type: "real"}, {type: "int"}],
		func: function([date, amount]) {
			const d = toJSDate(date);
			d.setUTCMonth(d.getUTCMonth() + amount);
			return toGMDate(d);
		},
	};

	static date_inc_week = {
		args: [{type: "real"}, {type: "int"}],
		func: function([date, amount]) {
			const d = toJSDate(date);
			d.setUTCDate(d.getUTCDate() + (amount * 7));
			return toGMDate(d);
		},
	};

	static date_inc_day = {
		args: [{type: "real"}, {type: "int"}],
		func: function([date, amount]) {
			const d = toJSDate(date);
			d.setUTCDate(d.getUTCDate() + amount);
			return toGMDate(d);
		},
	};

	static date_inc_hour = {
		args: [{type: "real"}, {type: "int"}],
		func: function([date, amount]) {
			const d = toJSDate(date);
			d.setUTCHours(d.getUTCHours() + amount);
			return toGMDate(d);
		},
	};

	static date_inc_minute = {
		args: [{type: "real"}, {type: "int"}],
		func: function([date, amount]) {
			const d = toJSDate(date);
			d.setUTCMinutes(d.getUTCMinutes() + amount);
			return toGMDate(d);
		},
	};

	static date_inc_second = {
		args: [{type: "real"}, {type: "int"}],
		func: function([date, amount]) {
			const d = toJSDate(date);
			d.setUTCSeconds(d.getUTCSeconds() + amount);
			return toGMDate(d);
		},
	};

	static date_get_year = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return d.getUTCFullYear();
		},
	};

	static date_get_month = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return d.getUTCMonth() + 1;
		},
	};

	static date_get_week = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);

			const tempDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
			tempDate.setUTCDate(tempDate.getUTCDate() - (tempDate.getUTCDay() || 7) + 4);
			const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
			return Math.ceil((((tempDate - yearStart) / 1000 / 60 / 60 / 24) + 1) / 7);
		},
	};

	static date_get_day = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return d.getUTCDate();
		},
	};

	static date_get_hour = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return d.getUTCHours();
		},
	};

	static date_get_minute = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return d.getUTCMinutes();
		},
	};

	static date_get_second = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return d.getUTCSeconds();
		},
	};

	static date_get_weekday = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return d.getUTCDay() + 1;
		},
	};

	static date_get_day_of_year = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return Math.round((d - Date.UTC(d.getUTCFullYear(), 0, 1)) / 1000 / 60 / 60 / 24);
		},
	};

	static date_get_hour_of_year = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return Math.round((d - Date.UTC(d.getUTCFullYear(), 0, 1)) / 1000 / 60 / 60);
		},
	};

	static date_get_minute_of_year = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return Math.round((d - Date.UTC(d.getUTCFullYear(), 0, 1)) / 1000 / 60);
		},
	};

	static date_get_second_of_year = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return Math.round((d - Date.UTC(d.getUTCFullYear(), 0, 1)) / 1000);
		},
	};

	static date_year_span = {
		args: [{type: "real"}, {type: "real"}],
		func: function([date1, date2]) {
			return Math.abs((date2 - date1) / 365.25); // Note: that's completely wrong.
		},
	};

	static date_month_span = {
		args: [{type: "real"}, {type: "real"}],
		func: function([date1, date2]) {
			return Math.abs((date2 - date1) / 30.4375);
		},
	};

	static date_week_span = {
		args: [{type: "real"}, {type: "real"}],
		func: function([date1, date2]) {
			return Math.abs((date2 - date1) / 7);
		},
	};

	static date_day_span = {
		args: [{type: "real"}, {type: "real"}],
		func: function([date1, date2]) {
			return Math.abs(date2 - date1);
		},
	};

	static date_hour_span = {
		args: [{type: "real"}, {type: "real"}],
		func: function([date1, date2]) {
			return Math.abs((date2 - date1) * 24);
		},
	};

	static date_minute_span = {
		args: [{type: "real"}, {type: "real"}],
		func: function([date1, date2]) {
			return Math.abs((date2 - date1) * 24 * 60);
		},
	};

	static date_second_span = {
		args: [{type: "real"}, {type: "real"}],
		func: function([date1, date2]) {
			return Math.abs((date2 - date1) * 24 * 60 * 60);
		},
	};

	static date_compare_datetime = {
		args: [{type: "real"}, {type: "real"}],
		func: function([date1, date2]) {
			return Math.sign(date1 - date2);
		},
	};

	static date_compare_date = {
		args: [{type: "real"}, {type: "real"}],
		func: function([date1, date2]) {
			return Math.sign(Math.floor(date1) - Math.floor(date2));
		},
	};

	static date_compare_time = {
		args: [{type: "real"}, {type: "real"}],
		func: function([date1, date2]) {
			return Math.sign((date1 % 1) - (date2 % 1));
		},
	};

	static date_date_of = {
		args: [{type: "real"}],
		func: function([date]) {
			return Math.floor(date);
		},
	};

	static date_time_of = {
		args: [{type: "real"}],
		func: function([date]) {
			return date % 1;
		},
	};

	static date_datetime_string = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return d.toLocaleString();
		},
	};

	static date_date_string = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return d.toLocaleDateString();
		},
	};

	static date_time_string = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return d.toLocaleTimeString();
		},
	};

	static date_days_in_month = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth()+1, 0)).getUTCDate();
		},
	};

	static date_days_in_year = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			return (Date.UTC(d.getUTCFullYear()+1, 0, 1) - Date.UTC(d.getUTCFullYear(), 0, 1)) / 1000 / 60 / 60 / 24;
		},
	};

	static date_leap_year = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			const year = d.getUTCFullYear();
			return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
		},
	};

	static date_is_today = {
		args: [{type: "real"}],
		func: function([date]) {
			const d = toJSDate(date);
			const today = new Date();
			return (d.getUTCFullYear() == today.getUTCFullYear()
				&& d.getUTCMonth() == today.getUTCMonth()
				&& d.getUTCDate() == today.getUTCDate());
		},
	};

	// # Game play

	// ## Moving around

	static motion_set = {
		args: [{type: "real"}, {type: "real"}],
		func: function([dir, speed]) {
			this.currentInstance.setDirectionAndSpeed(dir, speed);
			return 0;
		},
	};

	static motion_add = {
		args: [{type: "real"}, {type: "real"}],
		func: function([dir, speed]) {
			const dirRadians = dir * (Math.PI / 180);
			this.currentInstance.setHspeedAndVspeed(
				this.currentInstance.hSpeed + Math.cos(dirRadians) * speed,
				this.currentInstance.vSpeed + -Math.sin(dirRadians) * speed,
			);
			return 0;
		},
	};

	static place_free = {
		args: [{type: "real"}, {type: "real"}],
		func: function([x, y]) {
			return !this.game.collision.instanceOnInstances(this.currentInstance, this.game.instances, x, y, true) ? 1 : 0;
		},
	};

	static place_empty = {
		args: [{type: "real"}, {type: "real"}],
		func: function([x, y]) {
			return !this.game.collision.instanceOnInstances(this.currentInstance, this.game.instances, x, y, false) ? 1 : 0;
		},
	};

	static place_meeting = {
		args: [{type: "real"}, {type: "real"}, {type: "int"}],
		func: function([x, y, obj]) {
			const instances = this.objectReferenceToInstances(obj);
			if (!Array.isArray(instances)) { return 0; }
			return this.game.collision.instanceOnInstances(this.currentInstance, instances, x, y, false) ? 1 : 0;
		},
	};

	static place_snapped = {
		args: [{type: "real"}, {type: "real"}],
		func: function([hsnap, vsnap]) {
			return (this.currentInstance.x % hsnap == 0) && (this.currentInstance.y % vsnap == 0);
		},
	};

	static move_random = {
		args: [{type: "real"}, {type: "real"}],
		func: function([hsnap, vsnap]) {
			hsnap = hsnap <= 0 ? 1 : hsnap;
			vsnap = vsnap <= 0 ? 1 : vsnap;

			// TODO: figure out what GM really does.

			let x, y;
			for (let i=0; i<100; ++i) {
				x = Math.floor((this.game.rng() * this.game.room.width) / hsnap) * hsnap;
				y = Math.floor((this.game.rng() * this.game.room.height) / vsnap) * vsnap;

				if (!this.game.collision.instanceOnInstances(this.currentInstance, this.game.instances, x, y, true)) {
					this.currentInstance.x = x;
					this.currentInstance.y = y;
					break;
				}
			}

			return 0;
		},
	};

	static move_snap = {
		args: [{type: "real"}, {type: "real"}],
		func: function([hsnap, vsnap]) {
			this.currentInstance.x = Math.floor(this.currentInstance.x / hsnap) * hsnap;
			this.currentInstance.y = Math.floor(this.currentInstance.y / vsnap) * vsnap;
			return 0;
		},
	};

	static move_wrap = {
		args: [{type: "bool"}, {type: "bool"}, {type: "real"}],
		func: function([hor, vert, margin]) {
			if (hor) {
				const x = this.currentInstance.x;
				if (x >= this.game.room.width + margin) {
					this.currentInstance.x = x - this.game.room.width - margin*2;
				} else
				if (x < 0 - margin) {
					this.currentInstance.x = this.game.room.width + x + margin*2;
				}
			}

			if (vert) {
				const y = this.currentInstance.y;
				if (y >= this.game.room.height + margin) {
					this.currentInstance.y = y - this.game.room.height - margin*2;
				} else
				if (y < 0 - margin) {
					this.currentInstance.y = this.game.room.height + y - margin*2;
				}
			}
			return 0;
		},
	};

	static move_towards_point = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}],
		func: function([x, y, sp]) {
			const cx = this.currentInstance.x;
			const cy = this.currentInstance.y;
			this.currentInstance.setDirectionAndSpeed(Math.atan2(-(y - cy), x - cx) * (180 / Math.PI), sp);
			return 0;
		},
	};

	static move_bounce_solid = {
		args: [{type: "bool"}],
		func: function([adv]) {
			this.game.collision.moveBounce(this.currentInstance, adv, true);
			return 0;
		},
	};

	static move_bounce_all = {
		args: [{type: "bool"}],
		func: function([adv]) {
			this.game.collision.moveBounce(this.currentInstance, adv, false);
			return 0;
		},
	};

	static move_contact_solid = {
		args: [{type: "real"}, {type: "real"}],
		func: function([dir, maxdist]) {
			this.game.collision.moveContact(this.currentInstance, dir, maxdist, true);
			return 0;
		},
	};

	static move_contact_all = {
		args: [{type: "real"}, {type: "real"}],
		func: function([dir, maxdist]) {
			this.game.collision.moveContact(this.currentInstance, dir, maxdist, false);
			return 0;
		},
	};

	static move_outside_solid = {
		args: [{type: "real"}, {type: "real"}],
		func: function([dir, maxdist]) {
			this.game.collision.moveOutside(this.currentInstance, dir, maxdist, true);
			return 0;
		},
	};

	static move_outside_all = {
		args: [{type: "real"}, {type: "real"}],
		func: function([dir, maxdist]) {
			this.game.collision.moveOutside(this.currentInstance, dir, maxdist, false);
			return 0;
		},
	};

	static distance_to_point = {
		args: [{type: "real"}, {type: "real"}],
		func: function([x, y]) {
			const rect = this.currentInstance.getBoundingBox();

			if (GameCollision.pointOnRectangle({x, y}, rect)) {
				return 0;
			}

			const fx = Math.min(Math.max(x, rect.x1), rect.x2);
			const fy = Math.min(Math.max(y, rect.y1), rect.y2);

			return Math.hypot(x - fx, y - fy);
		},
	};

	static distance_to_object = {
		args: [{type: "int"}],
		func: function([obj]) {
			const instances = this.objectReferenceToInstances(obj);
			if (!Array.isArray(instances)) { return 0; } // TODO check

			const rect1 = this.currentInstance.getBoundingBox();

			let closest = Infinity;

			for (const instance of instances) {
				const rect2 = instance.getBoundingBox();

				const distance = GameCollision.closestDistanceBetweenRectangles(rect1, rect2);
				if (distance < closest) {
					closest = distance;
				}
			}

			if (closest == Infinity) closest = 0;
			return closest;
		},
	};

	static position_empty = {
		args: [{type: "real"}, {type: "real"}],
		func: function([x, y]) {
			return !this.game.collision.instancesOnPoint(this.game.instances, {x: x, y: y}) ? 1 : 0;
		},
	};

	static position_meeting = {
		args: [{type: "real"}, {type: "real"}, {type: "int"}],
		func: function([x, y, obj]) {
			const instances = this.objectReferenceToInstances(obj);
			if (!Array.isArray(instances)) { return 0; }
			return this.game.collision.instancesOnPoint(instances, {x: x, y: y}) ? 1 : 0;
		},
	};

	// ## Paths

	static path_start = {
		args: [{type: "int"}, {type: "real"}, {type: "int"}, {type: "bool"}],
		func: function([path, speed, endaction, absolute]) {
			// TODO error check
			const pathResource = this.game.project.getResourceById("ProjectPath", path);
			this.currentInstance.path = pathResource;

			if (!pathResource) return 0;

			this.currentInstance.pathPosition = (speed >= 0 ? 0 : 1);
			this.currentInstance.pathPreviousPosition = this.currentInstance.pathPosition;
			this.currentInstance.pathSpeed = speed;
			this.currentInstance.pathOrientation = 0;
			this.currentInstance.pathScale = 1;
			this.currentInstance.pathEndAction = endaction;

			if (absolute) {
				this.currentInstance.pathStartPosition = pathResource.getStartPosition();
			} else {
				if (speed >= 0) {
					this.currentInstance.pathStartPosition = {x: this.currentInstance.x, y: this.currentInstance.y};
				} else {
					const start = pathResource.getStartPosition();
					const end = pathResource.getEndPosition();
					this.currentInstance.pathStartPosition = {x: this.currentInstance.x - (end.x - start.x), y: this.currentInstance.y - (end.y - start.y)};
				}
			}

			this.currentInstance.x = this.currentInstance.pathStartPosition.x;
			this.currentInstance.y = this.currentInstance.pathStartPosition.y;
			return 0;
		},
	};

	static path_end = {
		args: [],
		func: async function([]) {
			this.currentInstance.path = null;

			await this.game.events.runEventOfInstance("other", Events.OTHER_END_OF_PATH, this.currentInstance);

			return 0;
		},
	};

	// ## Motion planning

	static mp_linear_step = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "bool"}],
		func: function([x, y, stepsize, checkall]) {
			return this.game.collision.linearStep(this.currentInstance, this.game.instances, x, y, stepsize, !checkall) ? 1 : 0;
		},
	};

	static mp_linear_step_object = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "int"}],
		func: function([x, y, stepsize, obj]) {
			let instances = this.objectReferenceToInstances(obj);
			if (!Array.isArray(instances)) { instances = []; }
			return this.game.collision.linearStep(this.currentInstance, instances, x, y, stepsize, false) ? 1 : 0;
		},
	};

	static mp_potential_step = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_potential_step is not implemented");
			// return 0;
		},
	};

	static mp_potential_step_object = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_potential_step_object is not implemented");
			// return 0;
		},
	};

	static mp_potential_settings = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_potential_settings is not implemented");
			// return 0;
		},
	};

	static mp_linear_path = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_linear_path is not implemented");
			// return 0;
		},
	};

	static mp_linear_path_object = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_linear_path_object is not implemented");
			// return 0;
		},
	};

	static mp_potential_path = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_potential_path is not implemented");
			// return 0;
		},
	};

	static mp_potential_path_object = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_potential_path_object is not implemented");
			// return 0;
		},
	};

	static mp_grid_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_grid_create is not implemented");
			// return 0;
		},
	};

	static mp_grid_destroy = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_grid_destroy is not implemented");
			// return 0;
		},
	};

	static mp_grid_clear_all = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_grid_clear_all is not implemented");
			// return 0;
		},
	};

	static mp_grid_clear_cell = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_grid_clear_cell is not implemented");
			// return 0;
		},
	};

	static mp_grid_clear_rectangle = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_grid_clear_rectangle is not implemented");
			// return 0;
		},
	};

	static mp_grid_add_cell = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_grid_add_cell is not implemented");
			// return 0;
		},
	};

	static mp_grid_add_rectangle = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_grid_add_rectangle is not implemented");
			// return 0;
		},
	};

	static mp_grid_add_instances = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_grid_add_instances is not implemented");
			// return 0;
		},
	};

	static mp_grid_path = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_grid_path is not implemented");
			// return 0;
		},
	};

	static mp_grid_draw = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mp_grid_draw is not implemented");
			// return 0;
		},
	};

	// ## Collision checking

	static collision_point = {
		args: [{type: "real"}, {type: "real"}, {type: "int"}, {type: "bool"}, {type: "bool"}],
		func: function([x, y, obj, prec, notme]) {
			let instances = this.objectReferenceToInstances(obj);
			if (!Array.isArray(instances)) return -4;

			if (notme) {
				instances = instances.filter(x => x != this.currentInstance);
			}

			const instance = this.game.collision.getFirstInstanceOnPoint(instances, {x, y}, prec);
			if (instance) {
				return instance.id;
			}

			return -4;
		},
	};

	static collision_rectangle = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "int"}, {type: "bool"}, {type: "bool"}],
		func: function([x1, y1, x2, y2, obj, prec, notme]) {
			let instances = this.objectReferenceToInstances(obj);
			if (!Array.isArray(instances)) return -4;

			if (notme) {
				instances = instances.filter(x => x != this.currentInstance);
			}

			const instance = this.game.collision.getFirstInstanceOnRectangle(instances,
				GameCollision.normalizeRectangle({x1, y1, x2, y2}), prec);
			if (instance) {
				return instance.id;
			}

			return -4;
		},
	};

	static collision_circle = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "int"}, {type: "bool"}, {type: "bool"}],
		func: function([xc, yc, radius, obj, prec, notme]) {
			let instances = this.objectReferenceToInstances(obj);
			if (!Array.isArray(instances)) return -4;

			if (notme) {
				instances = instances.filter(x => x != this.currentInstance);
			}

			const instance = this.game.collision.getFirstInstanceOnCircle(instances, {x: xc, y: yc, r: radius}, prec);
			if (instance) {
				return instance.id;
			}

			return -4;
		},
	};

	static collision_ellipse = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "int"}, {type: "bool"}, {type: "bool"}],
		func: function([x1, y1, x2, y2, obj, prec, notme]) {
			let instances = this.objectReferenceToInstances(obj);
			if (!Array.isArray(instances)) return -4;

			if (notme) {
				instances = instances.filter(x => x != this.currentInstance);
			}

			const instance = this.game.collision.getFirstInstanceOnEllipse(instances, {x1, y1, x2, y2}, prec);
			if (instance) {
				return instance.id;
			}

			return -4;
		},
	};

	static collision_line = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "int"}, {type: "bool"}, {type: "bool"}],
		func: function([x1, y1, x2, y2, obj, prec, notme]) {
			let instances = this.objectReferenceToInstances(obj);
			if (!Array.isArray(instances)) return -4;

			if (notme) {
				instances = instances.filter(x => x != this.currentInstance);
			}

			const instance = this.game.collision.getFirstInstanceOnLine(instances, {x1, y1, x2, y2}, prec);
			if (instance) {
				return instance.id;
			}

			return -4;
		},
	};

	// ## Instances

	static instance_find = {
		args: [{type: "int"}, {type: "int"}],
		func: function([obj, n]) {
			const instances = this.objectReferenceToInstances(obj);

			if (Array.isArray(instances)) {
				if (instances[n]) return instances[n].id;
			}

			return -4;
		},
	};

	static instance_exists = {
		args: [{type: "int"}],
		func: function([obj]) {
			if (obj == -7) { // local
				return 0;
			}

			const instances = this.objectReferenceToInstances(obj);

			if (Array.isArray(instances)) {
				if (instances.length > 0) {
					return 1;
				}
			}

			return 0;
		},
	};

	static instance_number = {
		args: [{type: "int"}],
		func: function([obj]) {
			if (obj == -7) { // local
				return 0;
			}

			const instances = this.objectReferenceToInstances(obj);
			if (Array.isArray(instances)) {
				return instances.length;
			}

			return 0;
		},
	};

	static instance_position = {
		args: [{type: "real"}, {type: "real"}, {type: "int"}],
		func: function([x, y, obj]) {
			const instances = this.objectReferenceToInstances(obj);
			if (!Array.isArray(instances)) { return -4; }

			const instance = this.game.collision.getFirstInstanceOnPoint(instances, {x, y});

			if (!instance) return -4;
			return instance.id;
		},
	};

	static instance_nearest = {
		args: [{type: "real"}, {type: "real"}, {type: "int"}],
		func: function([x, y, obj]) {
			const instances = this.objectReferenceToInstances(obj);
			if (!Array.isArray(instances)) { return -4; }

			let closest = Infinity;
			let closestInstance;
			const rect1 = {x1: x, y1: y, x2: x, y2: y};

			for (const instance of instances) {
				const rect2 = instance.getBoundingBox();

				const distance = GameCollision.closestDistanceBetweenRectangles(rect1, rect2);
				if (distance < closest) {
					closest = distance;
					closestInstance = instance;
				}
			}

			if (!closestInstance) return -4;
			return closestInstance.id;
		},
	};

	static instance_furthest = {
		args: [{type: "real"}, {type: "real"}, {type: "int"}],
		func: function([x, y, obj]) {
			const instances = this.objectReferenceToInstances(obj);
			if (!Array.isArray(instances)) { return -4; }

			let furthest = 0;
			let furthestInstance;
			const rect1 = {x1: x, y1: y, x2: x, y2: y};

			for (const instance of instances) {
				const rect2 = instance.getBoundingBox();

				const distance = GameCollision.closestDistanceBetweenRectangles(rect1, rect2);
				if (distance > furthest) {
					furthest = distance;
					furthestInstance = instance;
				}
			}

			if (!furthestInstance) return -4;
			return furthestInstance.id;
		},
	};

	static instance_place = {
		args: [{type: "real"}, {type: "real"}, {type: "int"}],
		func: function([x, y, obj]) {
			const instances = this.objectReferenceToInstances(obj);
			if (!Array.isArray(instances)) { return -4; }

			const instance = this.game.collision.getFirstInstanceOnInstance(this.currentInstance, instances, x, y);
			if (!instance) return -4;

			return instance;
		},
	};

	static instance_create = {
		args: [{type: "real"}, {type: "real"}, {type: "int"}],
		func: async function([x, y, obj]) {
			const object = this.game.project.getResourceById("ProjectObject", obj);
			if (object == null) {
				throw this.game.makeError({text:
					`Creating instance for non-existing object: ${obj}`,
				});
			}

			return await this.game.instanceCreate(null, x, y, obj);
		},
	};

	static instance_copy = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function instance_copy is not implemented");
			// return 0;
		},
	};

	static instance_destroy = {
		args: [],
		func: async function([]) {
			await this.game.instanceDestroy(this.currentInstance);
			return 0;
		},
	};

	static instance_change = {
		args: [{type: "int"}, {type: "bool"}],
		func: async function([obj, perf]) {
			await this.currentInstance.changeObject(obj, perf);
			return 0;
		},
	};

	static position_destroy = {
		args: [{type: "real"}, {type: "real"}],
		func: async function([x, y]) {
			const instances = this.game.collision.getAllInstancesOnPoint(this.game.instances, {x, y});
			for (const instance of instances) {
				await this.game.instanceDestroy(instance);
			}

			return 0;
		},
	};

	static position_change = {
		args: [{type: "real"}, {type: "real"}, {type: "int"}, {type: "bool"}],
		func: async function([x, y, obj, perf]) {
			const instances = this.game.collision.getAllInstancesOnPoint(this.game.instances, {x, y});
			for (const instance of instances) {
				await instance.changeObject(obj, perf);
			}

			return 0;
		},
	};

	// ## Deactivating instances

	static instance_deactivate_all = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function instance_deactivate_all is not implemented");
			// return 0;
		},
	};

	static instance_deactivate_object = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function instance_deactivate_object is not implemented");
			// return 0;
		},
	};

	static instance_deactivate_region = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function instance_deactivate_region is not implemented");
			// return 0;
		},
	};

	static instance_activate_all = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function instance_activate_all is not implemented");
			// return 0;
		},
	};

	static instance_activate_object = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function instance_activate_object is not implemented");
			// return 0;
		},
	};

	static instance_activate_region = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function instance_activate_region is not implemented");
			// return 0;
		},
	};

	// ## Timing

	static sleep = {
		args: [{type: "real"}],
		func: async function([numb]) {
			await new Promise((resolve) => {
				setTimeout(() => resolve(), numb);
			});
			return 0;
		},
	};

	// ## Rooms

	static room_goto = {
		args: [{type: "int"}],
		func: function([numb]) {
			this.game.loadRoomAtStepStop(numb);
			return 0;
		},
	};

	static room_goto_previous = {
		args: [],
		func: function([]) {
			this.game.loadRoomAtStepStop(BuiltInFunctions.room_previous.func.call(this, [this.game.room.resource.id]));
			return 0;
		},
	};

	static room_goto_next = {
		args: [],
		func: function([]) {
			this.game.loadRoomAtStepStop(BuiltInFunctions.room_next.func.call(this, [this.game.room.resource.id]));
			return 0;
		},
	};

	static room_previous = {
		args: [{type: "int"}],
		func: function([numb]) {
			const index = this.game.project.resources.ProjectRoom.findIndex(x => x.id == numb);
			if (index == null || index == 0) {
				return -1;
			}
			return this.game.project.resources.ProjectRoom[index-1].id;
		},
	};

	static room_next = {
		args: [{type: "int"}],
		func: function([numb]) {
			const index = this.game.project.resources.ProjectRoom.findIndex(x => x.id == numb);
			if (index == null || index == this.game.project.resources.ProjectRoom.length - 1) {
				return -1;
			}
			return this.game.project.resources.ProjectRoom[index+1].id;
		},
	};

	static room_restart = {
		args: [],
		func: function([]) {
			this.game.loadRoomAtStepStop(this.game.room.resource.id);
			return 0;
		},
	};

	static game_end = {
		args: [],
		func: function([]) {
			this.game.stepStopAction = async () => {
				await this.game.end();
			};
			return 0;
		},
	};

	static game_restart = {
		args: [],
		func: function([]) {
			this.game.stepStopAction = async () => {
				await this.game.restart();
			};
			return 0;
		},
	};

	static game_save = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function game_save is not implemented");
			// return 0;
		},
	};

	static game_load = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function game_load is not implemented");
			// return 0;
		},
	};

	static transition_define = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function transition_define is not implemented");
			// return 0;
		},
	};

	static transition_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function transition_exists is not implemented");
			// return 0;
		},
	};

	// ## Score  // no functions

	// ## Generating events

	static event_perform = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function event_perform is not implemented");
			// return 0;
		},
	};

	static event_perform_object = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function event_perform_object is not implemented");
			// return 0;
		},
	};

	static event_user = {
		args: [{type: "int"}],
		func: async function([numb]) {
			if (numb >= 0 && numb <= 15) {
			// User 0 has id of 10
				await this.game.events.runEventOfInstance("other", Events.OTHER_USER + numb, this.currentInstance);
			}
			return 0;
		},
	};

	static event_inherited = {
		args: [],
		func: async function([]) {
			if (this.game.events.state.event) {
				const parent = this.game.project.getResourceById("ProjectObject", this.game.events.state.object.parent_index);
				if (parent) {
					const event = this.game.events.getEventOfObject(parent, this.game.events.state.event.type, this.game.events.state.event.subtype);
					await this.game.events.runEvent(event, this.currentInstance, this.currentOther);
				}
			}
			return 0;
		},
	};

	// ## Miscellaneous variables and functions

	static show_debug_message = {
		args: [{type: "any"}],
		func: function([message]) {
			console.log(message);
			return 0;
		},
	};

	static variable_global_exists = {
		args: [{type: "string"}],
		func: function([name]) {
			return (this.game.globalVars.exists(name) || this.game.globalObjectVars.exists(name)) ? 1 : 0;
		},
	};

	static variable_local_exists = {
		args: [{type: "string"}],
		func: function([name]) {
			return this.currentInstance.vars.exists(name) ? 1 : 0;
		},
	};

	static variable_global_get = {
		args: [{type: "string"}],
		func: function([name]) {
			if (this.game.globalVars.exists(name))
				return this.game.globalVars.get(name);
			if (this.game.globalObjectVars.exists(name))
				return this.game.globalObjectVars.get(name);
			return 0;
		},
	};

	static variable_global_array_get = {
		args: [{type: "string"}, {type: "int"}],
		func: function([name, ind]) {
			if (this.game.globalVars.exists(name))
				return this.game.globalVars.get(name, [ind]);
			if (this.game.globalObjectVars.exists(name))
				return this.game.globalObjectVars.get(name, [ind]);
			return 0;
		},
	};

	static variable_global_array2_get = {
		args: [{type: "string"}, {type: "int"}, {type: "int"}],
		func: function([name, ind1, ind2]) {
			if (this.game.globalVars.exists(name))
				return this.game.globalVars.get(name, [ind1, ind2]);
			if (this.game.globalObjectVars.exists(name))
				return this.game.globalObjectVars.get(name, [ind1, ind2]);
			return 0;
		},
	};

	static variable_local_get = {
		args: [{type: "string"}],
		func: function([name]) {
			if (this.currentInstance.vars.exists(name))
				return this.currentInstance.vars.get(name);
			return 0;
		},
	};

	static variable_local_array_get = {
		args: [{type: "string"}, {type: "int"}],
		func: function([name, ind]) {
			if (this.currentInstance.vars.exists(name))
				return this.currentInstance.vars.get(name, [ind]);
			return 0;
		},
	};

	static variable_local_array2_get = {
		args: [{type: "string"}, {type: "int"}, {type: "int"}],
		func: function([name, ind1, ind2]) {
			if (this.currentInstance.vars.exists(name))
				return this.currentInstance.vars.get(name, [ind1, ind2]);
			return 0;
		},
	};

	static variable_global_set = {
		args: [{type: "string"}, {type: "any"}],
		func: function([name, value]) {
			if (this.game.globalVars.exists(name)) {
				this.game.globalVars.set(name, value);
			} else {
				this.game.globalObjectVars.set(name, value);
			}
			return 0;
		},
	};

	static variable_global_array_set = {
		args: [{type: "string"}, {type: "int"}, {type: "any"}],
		func: function([name, ind, value]) {
			if (this.game.globalVars.exists(name)) {
				this.game.globalVars.set(name, value, [ind]);
			} else {
				this.game.globalObjectVars.set(name, value, [ind]);
			}
			return 0;
		},
	};

	static variable_global_array2_set = {
		args: [{type: "string"}, {type: "int"}, {type: "int"}, {type: "any"}],
		func: function([name, ind1, ind2, value]) {
			if (this.game.globalVars.exists(name)) {
				this.game.globalVars.set(name, value, [ind1, ind2]);
			} else {
				this.game.globalObjectVars.set(name, value, [ind1, ind2]);
			}
			return 0;
		},
	};

	static variable_local_set = {
		args: [{type: "string"}, {type: "any"}],
		func: function([name, value]) {
			this.currentInstance.vars.set(name, value);
			return 0;
		},
	};

	static variable_local_array_set = {
		args: [{type: "string"}, {type: "int"}, {type: "any"}],
		func: function([name, ind, value]) {
			this.currentInstance.vars.set(name, value, [ind]);
			return 0;
		},
	};

	static variable_local_array2_set = {
		args: [{type: "string"}, {type: "int"}, {type: "int"}, {type: "any"}],
		func: function([name, ind1, ind2, value]) {
			this.currentInstance.vars.set(name, value, [ind1, ind2]);
			return 0;
		},
	};

	static set_program_priority = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function set_program_priority is not implemented");
			// return 0;
		},
	};

	static set_application_title = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function set_application_title is not implemented");
			// return 0;
		},
	};

	// # User interaction

	// ## The keyboard

	static keyboard_set_map = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function keyboard_set_map is not implemented");
			// return 0;
		},
	};

	static keyboard_get_map = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function keyboard_get_map is not implemented");
			// return 0;
		},
	};

	static keyboard_unset_map = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function keyboard_unset_map is not implemented");
			// return 0;
		},
	};

	static keyboard_check = {
		args: [{type: "int"}],
		func: function([key]) {
			return this.game.input.getKey(key, this.game.input.key) ? 1 : 0;
		},
	};

	static keyboard_check_pressed = {
		args: [{type: "int"}],
		func: function([key]) {
			return this.game.input.getKey(key, this.game.input.keyPressed) ? 1 : 0;
		},
	};

	static keyboard_check_released = {
		args: [{type: "int"}],
		func: function([key]) {
			return this.game.input.getKey(key, this.game.input.keyReleased) ? 1 : 0;
		},
	};

	static keyboard_check_direct = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function keyboard_check_direct is not implemented");
			// return 0;
		},
	};

	static keyboard_get_numlock = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function keyboard_get_numlock is not implemented");
			// return 0;
		},
	};

	static keyboard_set_numlock = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function keyboard_set_numlock is not implemented");
			// return 0;
		},
	};

	static keyboard_key_press = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function keyboard_key_press is not implemented");
			// return 0;
		},
	};

	static keyboard_key_release = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function keyboard_key_release is not implemented");
			// return 0;
		},
	};

	static keyboard_clear = {
		args: [{type: "int"}],
		func: function([key]) {
			this.game.input.clearKey(key);
			return 0;
		},
	};

	static io_clear = {
		args: [],
		func: function([]) {
			this.game.input.clear();
			return 0;
		},
	};

	static io_handle = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function io_handle is not implemented");
			// return 0;
		},
	};

	static keyboard_wait = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function keyboard_wait is not implemented");
			// return 0;
		},
	};

	// ## The mouse

	static mouse_check_button = {
		args: [{type: "int"}],
		func: function([numb]) {
			return this.game.input.getMouse(numb, this.game.input.mouse) ? 1 : 0;
		},
	};

	static mouse_check_button_pressed = {
		args: [{type: "int"}],
		func: function([numb]) {
			return this.game.input.getMouse(numb, this.game.input.mousePressed) ? 1 : 0;
		},
	};

	static mouse_check_button_released = {
		args: [{type: "int"}],
		func: function([numb]) {
			return this.game.input.getMouse(numb, this.game.input.mouseReleased) ? 1 : 0;
		},
	};

	static mouse_wheel_up = {
		args: [],
		func: function([]) {
			return (this.game.input.mouseWheel < 0);
		},
	};

	static mouse_wheel_down = {
		args: [],
		func: function([]) {
			return (this.game.input.mouseWheel > 0);
		},
	};

	static mouse_clear = {
		args: [{type: "int"}],
		func: function([button]) {
			this.game.input.clearMouse(button);
			return 0;
		},
	};

	// static io_clear ([_]) {} // repeated
	// static io_handle ([_]) {} // repeated

	static mouse_wait = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mouse_wait is not implemented");
			// return 0;
		},
	};

	// ## The joystick

	static joystick_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function joystick_exists is not implemented");
			// return 0;
		},
	};

	static joystick_name = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function joystick_name is not implemented");
			// return 0;
		},
	};

	static joystick_axes = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function joystick_axes is not implemented");
			// return 0;
		},
	};

	static joystick_buttons = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function joystick_buttons is not implemented");
			// return 0;
		},
	};

	static joystick_has_pov = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function joystick_has_pov is not implemented");
			// return 0;
		},
	};

	static joystick_direction = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function joystick_direction is not implemented");
			// return 0;
		},
	};

	static joystick_check_button = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function joystick_check_button is not implemented");
			// return 0;
		},
	};

	static joystick_xpos = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function joystick_xpos is not implemented");
			// return 0;
		},
	};

	static joystick_ypos = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function joystick_ypos is not implemented");
			// return 0;
		},
	};

	static joystick_zpos = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function joystick_zpos is not implemented");
			// return 0;
		},
	};

	static joystick_rpos = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function joystick_rpos is not implemented");
			// return 0;
		},
	};

	static joystick_upos = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function joystick_upos is not implemented");
			// return 0;
		},
	};

	static joystick_vpos = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function joystick_vpos is not implemented");
			// return 0;
		},
	};

	static joystick_pov = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function joystick_pov is not implemented");
			// return 0;
		},
	};

	// # Game graphics

	// ## Sprites and images  // no functions

	// ## Backgrounds  // no functions

	// ## Drawing sprites and backgrounds

	static draw_sprite = {
		args: [{type: "int"}, {type: "int"}, {type: "real"}, {type: "real"}],
		func: function([sprite, subimg, x, y]) {
			this.game.render.drawSprite(sprite, subimg, x, y);
			return 0;
		},
	};

	static draw_sprite_stretched = {
		args: [{type: "int"}, {type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([sprite, subimg, x, y, w, h]) {
			this.game.render.drawSpriteExt(sprite, subimg, x, y, {
				size: {width: w, height: h},
			});
			return 0;
		},
	};

	static draw_sprite_tiled = {
		args: [{type: "int"}, {type: "int"}, {type: "real"}, {type: "real"}],
		func: function([sprite, subimg, x, y]) {
			this.game.render.drawSpriteTiled(sprite, subimg, x, y);
			return 0;
		},
	};

	static draw_sprite_part = {
		args: [{type: "int"}, {type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([sprite, subimg, left, top, width, height, x, y]) {
			this.game.render.drawSpriteExt(sprite, subimg, x, y, {
				part: {left, top, width, height},
			});
			return 0;
		},
	};

	static draw_background = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}],
		func: function([back, x, y]) {
			this.game.render.drawBackground(back, x, y);
			return 0;
		},
	};

	static draw_background_stretched = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([back, x, y, w, h]) {
			this.game.render.drawBackgroundExt(back, x, y, {
				size: {width: w, height: h},
			});
		},
	};

	static draw_background_tiled = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}],
		func: function([back, x, y]) {
			this.game.render.drawBackgroundTiled(back, x, y);
			return 0;
		},
	};

	static draw_background_part = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([back, left, top, width, height, x, y]) {
			this.game.render.drawBackgroundExt(back, x, y, {
				part: {left, top, width, height},
			});
			return 0;
		},
	};

	static draw_sprite_ext = {
		args: [{type: "int"}, {type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "int"}, {type: "real"}],
		func: function([sprite, subimg, x, y, xscale, yscale, rot, color, alpha]) {
			this.game.render.drawSpriteExt(sprite, subimg, x, y, {
				scale: {x: xscale, y: yscale},
				angle: rot,
				blend: decimalToHex(color),
				alpha: alpha,
			});
			return 0;
		},
	};

	static draw_sprite_stretched_ext = {
		args: [{type: "int"}, {type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "int"}, {type: "real"}],
		func: function([sprite, subimg, x, y, w, h, color, alpha]) {
			this.game.render.drawSpriteExt(sprite, subimg, x, y, {
				blend: decimalToHex(color),
				alpha: alpha,
				size: {width: w, height: h},
			});
			return 0;
		},
	};

	static draw_sprite_tiled_ext = {
		args: [{type: "int"}, {type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "int"}, {type: "real"}],
		func: function([sprite, subimg, x, y, xscale, yscale, color, alpha]) {
			this.game.render.drawSpriteTiled(sprite, subimg, x, y, {
				scale: {x: xscale, y: yscale},
				blend: decimalToHex(color),
				alpha: alpha,
			});
			return 0;
		},
	};

	static draw_sprite_part_ext = {
		args: [{type: "int"}, {type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "int"}, {type: "real"}],
		func: function([sprite, subimg, left, top, width, height, x, y, xscale, yscale, color, alpha]) {
			this.game.render.drawSpriteExt(sprite, subimg, x, y, {
				scale: {x: xscale, y: yscale},
				blend: decimalToHex(color),
				alpha: alpha,
				part: {left, top, width, height},
			});
			return 0;
		},
	};

	static draw_sprite_general = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_sprite_general is not implemented");
			// return 0;
		},
	};

	static draw_background_ext = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "int"}, {type: "real"}],
		func: function([back, x, y, xscale, yscale, rot, color, alpha]) {
			this.game.render.drawBackgroundExt(back, x, y, {
				scale: {x: xscale, y: yscale},
				angle: rot,
				blend: decimalToHex(color),
				alpha: alpha,
			});
			return 0;
		},
	};

	static draw_background_stretched_ext = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "int"}, {type: "real"}],
		func: function([back, x, y, w, h, color, alpha]) {
			this.game.render.drawBackgroundExt(back, x, y, {
				blend: decimalToHex(color),
				alpha: alpha,
				size: {width: w, height: h},
			});
			return 0;
		},
	};

	static draw_background_tiled_ext = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "int"}, {type: "real"}],
		func: function([back, x, y, xscale, yscale, color, alpha]) {
			this.game.render.drawBackgroundTiled(back, x, y, {
				scale: {x: xscale, y: yscale},
				blend: decimalToHex(color),
				alpha: alpha,
			});
			return 0;
		},
	};

	static draw_background_part_ext = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "int"}, {type: "real"}],
		func: function([back, left, top, width, height, x, y, xscale, yscale, color, alpha]) {
			this.game.render.drawBackgroundExt(back, x, y, {
				scale: {x: xscale, y: yscale},
				blend: decimalToHex(color),
				alpha: alpha,
				part: {left, top, width, height},
			});
			return 0;
		},
	};

	static draw_background_general = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_background_general is not implemented");
			// return 0;
		},
	};

	// ## Drawing shapes

	static draw_clear = {
		args: [{type: "int"}],
		func: function([col]) {
			this.game.render.drawClear(col);
			return 0;
		},
	};

	static draw_clear_alpha = {
		args: [{type: "int"}, {type: "real"}],
		func: function([col, alpha]) {
			this.game.render.drawClear(col, alpha);
			return 0;
		},
	};

	static draw_point = {
		args: [{type: "real"}, {type: "real"}],
		func: function([x, y]) {
			this.game.render.drawPoint(x, y);
			return 0;
		},
	};

	static draw_line = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([x1, y1, x2, y2]) {
			this.game.render.drawLine(x1, y1, x2, y2);
			return 0;
		},
	};

	static draw_line_width = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([x1, y1, x2, y2, w]) {
			this.game.render.drawLine(x1, y1, x2, y2, w);
			return 0;
		},
	};

	static draw_rectangle = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "bool"}],
		func: function([x1, y1, x2, y2, outline]) {
			this.game.render.drawRectangle(x1, y1, x2, y2, outline);
			return 0;
		},
	};

	static draw_roundrect = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "bool"}],
		func: function([x1, y1, x2, y2, outline]) {
			this.game.render.drawRoundRect(x1, y1, x2, y2, outline);
			return 0;
		},
	};

	static draw_triangle = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "bool"}],
		func: function([x1, y1, x2, y2, x3, y3, outline]) {
			this.game.render.drawTriangle(x1, y1, x2, y2, x3, y3, outline);
			return 0;
		},
	};

	static draw_circle = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "bool"}],
		func: function([x, y, r, outline]) {
			this.game.render.drawCircle(x, y, r, outline);
			return 0;
		},
	};

	static draw_ellipse = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "bool"}],
		func: function([x1, y1, x2, y2, outline]) {
			this.game.render.drawEllipse(x1, y1, x2, y2, outline);
			return 0;
		},
	};

	static draw_set_circle_precision = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_set_circle_precision is not implemented");
			// return 0;
		},
	};

	static draw_arrow = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([x1, y1, x2, y2, size]) {
			this.game.render.drawArrow(x1, y1, x2, y2, size);
			return 0;
		},
	};

	static draw_button = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_button is not implemented");
			// return 0;
		},
	};

	static draw_path = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "bool"}],
		func: function([path, x, y, absolute]) {
			this.game.render.drawPath(path, x, y, absolute);
			return 0;
		},
	};

	static draw_healthbar = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_healthbar is not implemented");
			// return 0;
		},
	};

	static draw_set_color = {
		args: [{type: "int"}],
		func: function([color]) {
			this.game.render.drawColorAlpha = decimalToHexAlpha(color, hexAlphaToDecimal(this.game.render.drawColorAlpha).alpha);
			return 0;
		},
	};

	static draw_set_alpha = {
		args: [{type: "real"}],
		func: function([alpha]) {
			this.game.render.drawColorAlpha = decimalToHexAlpha(hexAlphaToDecimal(this.game.render.drawColorAlpha).color, alpha);
			return 0;
		},
	};

	static draw_get_color = {
		args: [],
		func: function([]) {
			return hexAlphaToDecimal(this.game.render.drawColorAlpha).color;
		},
	};

	static draw_get_alpha = {
		args: [],
		func: function([]) {
			return hexAlphaToDecimal(this.game.render.drawColorAlpha).alpha;
		},
	};

	static make_color_rgb = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}],
		func: function([red, green, blue]) {
			return rgbToDecimal({r: red, g: green, b: blue});
		},
	};

	static make_color_hsv = {
		args: [{type: "real"}, {type: "real"}, {type: "real"}],
		func: function([hue, saturation, value]) {
			return hsvToDecimal({h: hue, s: saturation, v: value});
		},
	};

	static color_get_red = {
		args: [{type: "int"}],
		func: function([col]) {
			return col % 256;
		},
	};

	static color_get_green = {
		args: [{type: "int"}],
		func: function([col]) {
			return Math.floor(col % (256*256) / 256);
		},
	};

	static color_get_blue = {
		args: [{type: "int"}],
		func: function([col]) {
			return Math.floor(col % (256*256*256) / (256*256));
		},
	};

	static color_get_hue = {
		args: [{type: "int"}],
		func: function([col]) {
			return decimalToHSV(col).h;
		},
	};

	static color_get_saturation = {
		args: [{type: "int"}],
		func: function([col]) {
			return decimalToHSV(col).s;
		},
	};

	static color_get_value = {
		args: [{type: "int"}],
		func: function([col]) {
			return decimalToHSV(col).v;
		},
	};

	static merge_color = {
		args: [{type: "int"}, {type: "int"}, {type: "real"}],
		func: function([col1, col2, amount]) {
			col1 = decimalToRGB(col1);
			col2 = decimalToRGB(col2);
			return rgbToDecimal({
				r: Math.round((col1.r * (1-amount)) + (col2.r * amount)),
				g: Math.round((col1.g * (1-amount)) + (col2.g * amount)),
				b: Math.round((col1.b * (1-amount)) + (col2.b * amount)),
			});
		},
	};

	static draw_getpixel = {
		args: [{type: "real"}, {type: "real"}],
		func: function([x, y]) {
			const data = this.game.render.ctx.getImageData(x, y, 1, 1);
			return rgbToDecimal({
				r: data[0], g: data[1], b: data[2],
			});
		},
	};

	static screen_save = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function screen_save is not implemented");
			// return 0;
		},
	};

	static screen_save_part = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function screen_save_part is not implemented");
			// return 0;
		},
	};

	// ## Fonts and text

	static draw_set_font = {
		args: [{type: "int"}],
		func: function([font]) {
			this.game.render.drawFont = font;
			return 0;
		},
	};

	static draw_set_halign = {
		args: [{type: "int"}],
		func: function([halign]) {
			this.game.render.drawHAlign = halign;
			return 0;
		},
	};

	static draw_set_valign = {
		args: [{type: "int"}],
		func: function([valign]) {
			this.game.render.drawVAlign = valign;
			return 0;
		},
	};

	static draw_text = {
		args: [{type: "real"}, {type: "real"}, {type: "as_string"}],
		func: function([x, y, string]) {
			this.game.render.drawText(x, y, string);
			return 0;
		},
	};

	static draw_text_ext = {
		args: [{type: "real"}, {type: "real"}, {type: "as_string"}, {type: "real"}, {type: "real"}],
		func: function([x, y, string, sep, w]) {
			this.game.render.drawText(x, y, string, {sep, w});
			return 0;
		},
	};

	static string_width = {
		args: [{type: "as_string"}],
		func: function([string]) {
			return this.game.render.getTextGeometry(string).width;
		},
	};

	static string_height = {
		args: [{type: "as_string"}],
		func: function([string]) {
			return this.game.render.getTextGeometry(string).height;
		},
	};

	static string_width_ext = {
		args: [{type: "as_string"}, {type: "real"}, {type: "real"}],
		func: function([string, sep, w]) {
			return this.game.render.getTextGeometry(string, sep, w).width;
		},
	};

	static string_height_ext = {
		args: [{type: "as_string"}, {type: "real"}, {type: "real"}],
		func: function([string, sep, w]) {
			return this.game.render.getTextGeometry(string, sep, w).height;
		},
	};

	static draw_text_transformed = {
		args: [{type: "real"}, {type: "real"}, {type: "as_string"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([x, y, string, xscale, yscale, angle]) {
			this.game.render.drawText(x, y, string, {scale: {x: xscale, y: yscale}, angle});
			return 0;
		},
	};

	static draw_text_ext_transformed = {
		args: [{type: "real"}, {type: "real"}, {type: "as_string"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([x, y, string, sep, w, xscale, yscale, angle]) {
			this.game.render.drawText(x, y, string, {sep, w, scale: {x: xscale, y: yscale}, angle});
			return 0;
		},
	};

	static draw_text_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_text_color is not implemented");
			// return 0;
		},
	};

	static draw_text_ext_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_text_ext_color is not implemented");
			// return 0;
		},
	};

	static draw_text_transformed_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_text_transformed_color is not implemented");
			// return 0;
		},
	};

	static draw_text_ext_transformed_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_text_ext_transformed_color is not implemented");
			// return 0;
		},
	};

	// ## Advanced drawing functions

	static draw_point_color = {
		args: [{type: "real"}, {type: "real"}, {type: "int"}],
		func: function([x, y, col1]) {
			this.game.render.ctx.fillStyle = decimalToHex(col1);
			this.game.render.ctx.fillRect(x, y, 1, 1);
			return 0;
		},
	};

	static draw_line_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_line_color is not implemented");
			// return 0;
		},
	};

	static draw_line_width_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_line_width_color is not implemented");
			// return 0;
		},
	};

	static draw_rectangle_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_rectangle_color is not implemented");
			// return 0;
		},
	};

	static draw_roundrect_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_roundrect_color is not implemented");
			// return 0;
		},
	};

	static draw_triangle_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_triangle_color is not implemented");
			// return 0;
		},
	};

	static draw_circle_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_circle_color is not implemented");
			// return 0;
		},
	};

	static draw_ellipse_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_ellipse_color is not implemented");
			// return 0;
		},
	};

	static draw_primitive_begin = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_primitive_begin is not implemented");
			// return 0;
		},
	};

	static draw_vertex = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_vertex is not implemented");
			// return 0;
		},
	};

	static draw_vertex_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_vertex_color is not implemented");
			// return 0;
		},
	};

	static draw_primitive_end = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_primitive_end is not implemented");
			// return 0;
		},
	};

	static sprite_get_texture = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_get_texture is not implemented");
			// return 0;
		},
	};

	static background_get_texture = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_get_texture is not implemented");
			// return 0;
		},
	};

	static texture_preload = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function texture_preload is not implemented");
			// return 0;
		},
	};

	static texture_set_priority = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function texture_set_priority is not implemented");
			// return 0;
		},
	};

	static texture_get_width = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function texture_get_width is not implemented");
			// return 0;
		},
	};

	static texture_get_height = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function texture_get_height is not implemented");
			// return 0;
		},
	};

	static draw_primitive_begin_texture = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_primitive_begin_texture is not implemented");
			// return 0;
		},
	};

	static draw_vertex_texture = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_vertex_texture is not implemented");
			// return 0;
		},
	};

	static draw_vertex_texture_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_vertex_texture_color is not implemented");
			// return 0;
		},
	};

	// static draw_primitive_end ([_]) {} // repeated

	static texture_set_interpolation = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function texture_set_interpolation is not implemented");
			// return 0;
		},
	};

	static texture_set_blending = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function texture_set_blending is not implemented");
			// return 0;
		},
	};

	static texture_set_repeat = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function texture_set_repeat is not implemented");
			// return 0;
		},
	};

	static draw_set_blend_mode = {
		args: null,
		func: function([]) {
			throw new EngineException("Function draw_set_blend_mode is not implemented");
			// return 0;
		},
	};

	static draw_set_blend_mode_ext = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_set_blend_mode_ext is not implemented");
			// return 0;
		},
	};

	// ## Drawing surfaces

	static surface_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function surface_create is not implemented");
			// return 0;
		},
	};

	static surface_free = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function surface_free is not implemented");
			// return 0;
		},
	};

	static surface_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function surface_exists is not implemented");
			// return 0;
		},
	};

	static surface_get_width = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function surface_get_width is not implemented");
			// return 0;
		},
	};

	static surface_get_height = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function surface_get_height is not implemented");
			// return 0;
		},
	};

	static surface_get_texture = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function surface_get_texture is not implemented");
			// return 0;
		},
	};

	static surface_set_target = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function surface_set_target is not implemented");
			// return 0;
		},
	};

	static surface_reset_target = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function surface_reset_target is not implemented");
			// return 0;
		},
	};

	static surface_getpixel = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function surface_getpixel is not implemented");
			// return 0;
		},
	};

	static surface_save = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function surface_save is not implemented");
			// return 0;
		},
	};

	static surface_save_part = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function surface_save_part is not implemented");
			// return 0;
		},
	};

	static draw_surface = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_surface is not implemented");
			// return 0;
		},
	};

	static draw_surface_stretched = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_surface_stretched is not implemented");
			// return 0;
		},
	};

	static draw_surface_tiled = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_surface_tiled is not implemented");
			// return 0;
		},
	};

	static draw_surface_part = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_surface_part is not implemented");
			// return 0;
		},
	};

	static draw_surface_ext = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_surface_ext is not implemented");
			// return 0;
		},
	};

	static draw_surface_stretched_ext = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_surface_stretched_ext is not implemented");
			// return 0;
		},
	};

	static draw_surface_tiled_ext = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_surface_tiled_ext is not implemented");
			// return 0;
		},
	};

	static draw_surface_part_ext = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_surface_part_ext is not implemented");
			// return 0;
		},
	};

	static draw_surface_general = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_surface_general is not implemented");
			// return 0;
		},
	};

	static surface_copy = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function surface_copy is not implemented");
			// return 0;
		},
	};

	static surface_copy_part = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function surface_copy_part is not implemented");
			// return 0;
		},
	};

	// ## Tiles

	static tile_add = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_add is not implemented");
			// return 0;
		},
	};

	static tile_delete = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_delete is not implemented");
			// return 0;
		},
	};

	static tile_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_exists is not implemented");
			// return 0;
		},
	};

	static tile_get_x = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_get_x is not implemented");
			// return 0;
		},
	};

	static tile_get_y = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_get_y is not implemented");
			// return 0;
		},
	};

	static tile_get_left = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_get_left is not implemented");
			// return 0;
		},
	};

	static tile_get_top = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_get_top is not implemented");
			// return 0;
		},
	};

	static tile_get_width = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_get_width is not implemented");
			// return 0;
		},
	};

	static tile_get_height = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_get_height is not implemented");
			// return 0;
		},
	};

	static tile_get_depth = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_get_depth is not implemented");
			// return 0;
		},
	};

	static tile_get_visible = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_get_visible is not implemented");
			// return 0;
		},
	};

	static tile_get_xscale = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_get_xscale is not implemented");
			// return 0;
		},
	};

	static tile_get_yscale = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_get_yscale is not implemented");
			// return 0;
		},
	};

	static tile_get_background = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_get_background is not implemented");
			// return 0;
		},
	};

	static tile_get_blend = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_get_blend is not implemented");
			// return 0;
		},
	};

	static tile_get_alpha = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_get_alpha is not implemented");
			// return 0;
		},
	};

	static tile_set_position = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_set_position is not implemented");
			// return 0;
		},
	};

	static tile_set_region = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_set_region is not implemented");
			// return 0;
		},
	};

	static tile_set_background = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_set_background is not implemented");
			// return 0;
		},
	};

	static tile_set_visible = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_set_visible is not implemented");
			// return 0;
		},
	};

	static tile_set_depth = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_set_depth is not implemented");
			// return 0;
		},
	};

	static tile_set_scale = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_set_scale is not implemented");
			// return 0;
		},
	};

	static tile_set_blend = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_set_blend is not implemented");
			// return 0;
		},
	};

	static tile_set_alpha = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_set_alpha is not implemented");
			// return 0;
		},
	};

	static tile_layer_hide = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_layer_hide is not implemented");
			// return 0;
		},
	};

	static tile_layer_show = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_layer_show is not implemented");
			// return 0;
		},
	};

	static tile_layer_delete = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_layer_delete is not implemented");
			// return 0;
		},
	};

	static tile_layer_shift = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_layer_shift is not implemented");
			// return 0;
		},
	};

	static tile_layer_find = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_layer_find is not implemented");
			// return 0;
		},
	};

	static tile_layer_delete_at = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_layer_delete_at is not implemented");
			// return 0;
		},
	};

	static tile_layer_depth = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_layer_depth is not implemented");
			// return 0;
		},
	};

	// ## The display

	static display_get_width = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function display_get_width is not implemented");
			// return 0;
		},
	};

	static display_get_height = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function display_get_height is not implemented");
			// return 0;
		},
	};

	static display_get_colordepth = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function display_get_colordepth is not implemented");
			// return 0;
		},
	};

	static display_get_frequency = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function display_get_frequency is not implemented");
			// return 0;
		},
	};

	static display_set_size = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function display_set_size is not implemented");
			// return 0;
		},
	};

	static display_set_colordepth = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function display_set_colordepth is not implemented");
			// return 0;
		},
	};

	static display_set_frequency = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function display_set_frequency is not implemented");
			// return 0;
		},
	};

	static display_set_all = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function display_set_all is not implemented");
			// return 0;
		},
	};

	static display_test_all = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function display_test_all is not implemented");
			// return 0;
		},
	};

	static display_reset = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function display_reset is not implemented");
			// return 0;
		},
	};

	static display_mouse_get_x = {
		args: null,
		func: function([]) {
			return this.game.input.mouseDisplayX;
		},
	};

	static display_mouse_get_y = {
		args: null,
		func: function([]) {
			return this.game.input.mouseDisplayY;
		},
	};

	static display_mouse_set = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function display_mouse_set is not implemented");
			// return 0;
		},
	};

	// ## The window

	static window_set_visible = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_set_visible is not implemented");
			// return 0;
		},
	};

	static window_get_visible = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_get_visible is not implemented");
			// return 0;
		},
	};

	static window_set_fullscreen = {
		args: [{type: "bool"}],
		func: async function([full]) {
			await this.game.render.setFullscreen(full);
			return 0;
		},
	};

	static window_get_fullscreen = {
		args: [],
		func: function([]) {
			return this.game.render.getFullscreen() ? 1 : 0;
		},
	};

	static window_set_showborder = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_set_showborder is not implemented");
			// return 0;
		},
	};

	static window_get_showborder = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_get_showborder is not implemented");
			// return 0;
		},
	};

	static window_set_showicons = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_set_showicons is not implemented");
			// return 0;
		},
	};

	static window_get_showicons = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_get_showicons is not implemented");
			// return 0;
		},
	};

	static window_set_stayontop = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_set_stayontop is not implemented");
			// return 0;
		},
	};

	static window_get_stayontop = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_get_stayontop is not implemented");
			// return 0;
		},
	};

	static window_set_sizeable = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_set_sizeable is not implemented");
			// return 0;
		},
	};

	static window_get_sizeable = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_get_sizeable is not implemented");
			// return 0;
		},
	};

	static window_set_caption = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_set_caption is not implemented");
			// return 0;
		},
	};

	static window_get_caption = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_get_caption is not implemented");
			// return 0;
		},
	};

	static window_set_cursor = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_set_cursor is not implemented");
			// return 0;
		},
	};

	static window_get_cursor = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_get_cursor is not implemented");
			// return 0;
		},
	};

	static window_set_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_set_color is not implemented");
			// return 0;
		},
	};

	static window_get_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_get_color is not implemented");
			// return 0;
		},
	};

	static window_set_region_scale = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_set_region_scale is not implemented");
			// return 0;
		},
	};

	static window_get_region_scale = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_get_region_scale is not implemented");
			// return 0;
		},
	};

	static window_set_position = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_set_position is not implemented");
			// return 0;
		},
	};

	static window_set_size = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_set_size is not implemented");
			// return 0;
		},
	};

	static window_set_rectangle = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_set_rectangle is not implemented");
			// return 0;
		},
	};

	static window_center = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_center is not implemented");
			// return 0;
		},
	};

	static window_default = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_default is not implemented");
			// return 0;
		},
	};

	static window_get_x = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_get_x is not implemented");
			// return 0;
		},
	};

	static window_get_y = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_get_y is not implemented");
			// return 0;
		},
	};

	static window_get_width = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_get_width is not implemented");
			// return 0;
		},
	};

	static window_get_height = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_get_height is not implemented");
			// return 0;
		},
	};

	static window_mouse_get_x = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_mouse_get_x is not implemented");
			// return 0;
		},
	};

	static window_mouse_get_y = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_mouse_get_y is not implemented");
			// return 0;
		},
	};

	static window_mouse_set = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_mouse_set is not implemented");
			// return 0;
		},
	};

	// ## Views

	static window_set_region_size = {
		args: [{type: "int"}, {type: "int"}, {type: "bool"}],
		func: function([w, h, adaptwindow]) { // eslint-disable-line no-unused-vars
			// TODO adaptwindow
			this.game.render.setSize(w, h);
			return 0;
		},
	};

	static window_get_region_width = {
		args: [],
		func: function([]) {
			return this.game.render.canvas.width;
		},
	};

	static window_get_region_height = {
		args: [],
		func: function([]) {
			return this.game.render.canvas.height;
		},
	};

	static window_view_mouse_get_x = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.input.getMousePositionOnView(this.game.room.getView(id)).x;
		},
	};

	static window_view_mouse_get_y = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.input.getMousePositionOnView(this.game.room.getView(id)).y;
		},
	};

	static window_view_mouse_set = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_view_mouse_set is not implemented");
			// return 0;
		},
	};

	static window_views_mouse_get_x = {
		args: [],
		func: function([]) {
			return this.game.input.mouseXInCurrentView;
		},
	};

	static window_views_mouse_get_y = {
		args: [],
		func: function([]) {
			return this.game.input.mouseYInCurrentView;
		},
	};

	static window_views_mouse_set = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_views_mouse_set is not implemented");
			// return 0;
		},
	};

	// ## Repainting the screen

	static screen_redraw = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function screen_redraw is not implemented");
			// return 0;
		},
	};

	static screen_refresh = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function screen_refresh is not implemented");
			// return 0;
		},
	};

	static set_automatic_draw = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function set_automatic_draw is not implemented");
			// return 0;
		},
	};

	static set_synchronization = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function set_synchronization is not implemented");
			// return 0;
		},
	};

	static screen_wait_vsync = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function screen_wait_vsync is not implemented");
			// return 0;
		},
	};

	// # Sound and music

	// ## Basic sound functions

	static sound_play = {
		args: [{type: "int"}],
		func: async function([index]) {
			await this.game.audio.playSound(index, false);
			return 0;
		},
	};

	static sound_loop = {
		args: [{type: "int"}],
		func: async function([index]) {
			await this.game.audio.playSound(index, true);
			return 0;
		},
	};

	static sound_stop = {
		args: [{type: "int"}],
		func: function([index]) {
			this.game.audio.stopSound(index);
		},
	};

	static sound_stop_all = {
		args: [],
		func: function([]) {
			this.game.audio.stopAllSounds();
			return 0;
		},
	};

	static sound_isplaying = {
		args: [{type: "int"}],
		func: function([index]) {
			return this.game.audio.isSoundPlaying(index) ? 1 : 0;
		},
	};

	static sound_volume = {
		args: [{type: "int"}, {type: "real"}],
		func: function([index, value]) {
			this.game.audio.setSoundVolume(index, value);
			return 0;
		},
	};

	static sound_global_volume = {
		args: [{type: "real"}],
		func: function([value]) {
			this.game.audio.setGlobalVolume(value);
			return 0;
		},
	};

	static sound_fade = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_fade is not implemented");
			// return 0;
		},
	};

	static sound_pan = {
		args: [{type: "int"}, {type: "real"}],
		func: function([index, value]) {
			this.game.audio.setSoundPan(index, value);
			return 0;
		},
	};

	static sound_background_tempo = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_background_tempo is not implemented");
			// return 0;
		},
	};

	static sound_set_search_directory = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_set_search_directory is not implemented");
			// return 0;
		},
	};

	// ## Sound effects

	static sound_effect_set = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_effect_set is not implemented");
			// return 0;
		},
	};

	static sound_effect_chorus = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_effect_chorus is not implemented");
			// return 0;
		},
	};

	static sound_effect_echo = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_effect_echo is not implemented");
			// return 0;
		},
	};

	static sound_effect_flanger = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_effect_flanger is not implemented");
			// return 0;
		},
	};

	static sound_effect_gargle = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_effect_gargle is not implemented");
			// return 0;
		},
	};

	static sound_effect_reverb = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_effect_reverb is not implemented");
			// return 0;
		},
	};

	static sound_effect_compressor = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_effect_compressor is not implemented");
			// return 0;
		},
	};

	static sound_effect_equalizer = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_effect_equalizer is not implemented");
			// return 0;
		},
	};

	// ## 3D sound

	static sound_3d_set_sound_position = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_3d_set_sound_position is not implemented");
			// return 0;
		},
	};

	static sound_3d_set_sound_velocity = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_3d_set_sound_velocity is not implemented");
			// return 0;
		},
	};

	static sound_3d_set_sound_distance = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_3d_set_sound_distance is not implemented");
			// return 0;
		},
	};

	static sound_3d_set_sound_cone = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_3d_set_sound_cone is not implemented");
			// return 0;
		},
	};

	// ## CD music

	static cd_init = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_init is not implemented");
			// return 0;
		},
	};

	static cd_present = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_present is not implemented");
			// return 0;
		},
	};

	static cd_number = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_number is not implemented");
			// return 0;
		},
	};

	static cd_playing = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_playing is not implemented");
			// return 0;
		},
	};

	static cd_paused = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_paused is not implemented");
			// return 0;
		},
	};

	static cd_track = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_track is not implemented");
			// return 0;
		},
	};

	static cd_length = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_length is not implemented");
			// return 0;
		},
	};

	static cd_track_length = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_track_length is not implemented");
			// return 0;
		},
	};

	static cd_position = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_position is not implemented");
			// return 0;
		},
	};

	static cd_track_position = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_track_position is not implemented");
			// return 0;
		},
	};

	static cd_play = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_play is not implemented");
			// return 0;
		},
	};

	static cd_stop = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_stop is not implemented");
			// return 0;
		},
	};

	static cd_pause = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_pause is not implemented");
			// return 0;
		},
	};

	static cd_resume = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_resume is not implemented");
			// return 0;
		},
	};

	static cd_set_position = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_set_position is not implemented");
			// return 0;
		},
	};

	static cd_set_track_position = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_set_track_position is not implemented");
			// return 0;
		},
	};

	static cd_open_door = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_open_door is not implemented");
			// return 0;
		},
	};

	static cd_close_door = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function cd_close_door is not implemented");
			// return 0;
		},
	};

	static MCI_command = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function MCI_command is not implemented");
			// return 0;
		},
	};

	// # Splash screens, highscores, and other pop-ups

	// ## Splash screens

	static splash_show_video = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_show_video is not implemented");
			// return 0;
		},
	};

	static splash_show_text = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_show_text is not implemented");
			// return 0;
		},
	};

	static splash_show_image = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_show_image is not implemented");
			// return 0;
		},
	};

	static splash_show_web = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_show_web is not implemented");
			// return 0;
		},
	};

	static splash_set_main = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_main is not implemented");
			// return 0;
		},
	};

	static splash_set_scale = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_scale is not implemented");
			// return 0;
		},
	};

	static splash_set_cursor = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_cursor is not implemented");
			// return 0;
		},
	};

	static splash_set_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_color is not implemented");
			// return 0;
		},
	};

	static splash_set_caption = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_caption is not implemented");
			// return 0;
		},
	};

	static splash_set_fullscreen = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_fullscreen is not implemented");
			// return 0;
		},
	};

	static splash_set_border = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_border is not implemented");
			// return 0;
		},
	};

	static splash_set_size = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_size is not implemented");
			// return 0;
		},
	};

	static splash_set_position = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_position is not implemented");
			// return 0;
		},
	};

	static splash_set_adapt = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_adapt is not implemented");
			// return 0;
		},
	};

	static splash_set_top = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_top is not implemented");
			// return 0;
		},
	};

	static splash_set_interrupt = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_interrupt is not implemented");
			// return 0;
		},
	};

	static splash_set_stop_key = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_stop_key is not implemented");
			// return 0;
		},
	};

	static splash_set_stop_mouse = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_stop_mouse is not implemented");
			// return 0;
		},
	};

	static splash_set_close_button = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function splash_set_close_button is not implemented");
			// return 0;
		},
	};

	static show_info = {
		args: [],
		func: async function([]) {
			await this.game.windows.openGameInformation();
			return 0;
		},
	};

	static load_info = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function load_info is not implemented");
			// return 0;
		},
	};

	// ## Pop-up messages and questions

	static show_message = {
		args: [{type: "as_string"}],
		func: async function([str]) {
			await this.game.windows.openModal(HMessageWindow,
				parseNewLineHash(str));
			return 0;
		},
	};

	static show_message_ext = {
		args: [{type: "as_string"}, {type: "string"}, {type: "string"}, {type: "string"}],
		func: async function([str, but1, but2, but3]) {
			// TODO & shortcut
			const result = await this.game.windows.openModal(HMessageWindow,
				parseNewLineHash(str), {buttons: [but1, but2, but3]});
			return result ?? 0;
		},
	};

	static show_question = {
		args: [{type: "as_string"}],
		func: async function([str]) {
			const result = await this.game.windows.openModal(HMessageWindow,
				parseNewLineHash(str), {buttons: ["Yes", "", "No"]});
			return (result == 1) ? 1 : 0;
		},
	};

	static get_integer = {
		args: [{type: "string"}, {type: "int"}],
		func: async function([str, def]) {
			const result = await this.game.windows.openModal(HMessageWindow,
				parseNewLineHash(str), {input: {default: def}});

			if (result === null) return def;

			const value = parseFloat(result);
			if (Number.isNaN(value)) return def;

			return toInteger(value);
		},
	};

	static get_string = {
		args: [{type: "string"}, {type: "string"}],
		func: async function([str, def]) {
			const result = await this.game.windows.openModal(HMessageWindow,
				parseNewLineHash(str), {input: {default: def}});

			if (result === null) return def;

			return result;
		},
	};

	static message_background = {
		args: [{type: "int"}],
		func: function([back]) {
			// TODO one pixel transparency
			this.game.windows.messageBackground = this.game.project.getResourceById("ProjectBackground", back);
			return 0;
		},
	};

	static message_alpha = {
		args: [{type: "real"}],
		func: function([alpha]) {
			this.game.windows.messageAlpha = alpha;
			return 0;
		},
	};

	static message_button = {
		args: [{type: "int"}],
		func: function([spr]) {
			// TODO one pixel transparency
			this.game.windows.messageButtonSprite = this.game.project.getResourceById("ProjectSprite", spr);
			return 0;
		},
	};

	static message_text_font = {
		args: [{type: "string"}, {type: "int"}, {type: "int"}, {type: "int"}],
		func: function([name, size, color, style]) {
			this.game.windows.messageTextFont = {
				font: `${(style == 1 || style == 3) ? "bold " : ""}`
					+ `${(style == 2 || style == 3) ? "italic " : ""}`
					+ `${size}pt "${name}"`,
				color: decimalToHex(color),
			};
			return 0;
		},
	};

	static message_button_font = {
		args: [{type: "string"}, {type: "int"}, {type: "int"}, {type: "int"}],
		func: function([name, size, color, style]) {
			this.game.windows.messageButtonFont = {
				font: `${(style == 1 || style == 3) ? "bold " : ""}`
					+ `${(style == 2 || style == 3) ? "italic " : ""}`
					+ `${size}pt "${name}"`,
				color: decimalToHex(color),
			};
			return 0;
		},
	};

	static message_input_font = {
		args: [{type: "string"}, {type: "int"}, {type: "int"}, {type: "int"}],
		func: function([name, size, color, style]) {
			this.game.windows.messageInputFont = {
				font: `${(style == 1 || style == 3) ? "bold " : ""}`
					+ `${(style == 2 || style == 3) ? "italic " : ""}`
					+ `${size}pt "${name}"`,
				color: decimalToHex(color),
			};
			return 0;
		},
	};

	static message_mouse_color = {
		args: [{type: "int"}],
		func: function([col]) {
			this.game.windows.messageButtonHoverColor = decimalToHex(col);
			return 0;
		},
	};

	static message_input_color = {
		args: [{type: "int"}],
		func: function([col]) {
			this.game.windows.messageInputBackgroundColor = decimalToHex(col);
			return 0;
		},
	};

	static message_caption = {
		args: [{type: "bool"}, {type: "string"}],
		func: function([show, str]) {
			this.game.windows.messageCaption = show ? str : null;
			return 0;
		},
	};

	static message_position = {
		args: [{type: "int"}, {type: "int"}],
		func: function([x, y]) {
			this.game.windows.messagePosition = {x, y};
			return 0;
		},
	};

	static message_size = {
		args: [{type: "int"}, {type: "int"}],
		func: function([w, h]) {
			this.game.windows.messageSize = {w, h};
			return 0;
		},
	};

	static show_menu = {
		args: [{type: "string"}, {type: "int"}],
		func: async function([str, def]) {
			const x = this.game.input.mouseDisplayX;
			const y = this.game.input.mouseDisplayY;

			return await BuiltInFunctions.show_menu_pos.func.call(this, [x, y, str, def]);
		},
	};

	static show_menu_pos = {
		args: [{type: "real"}, {type: "real"}, {type: "string"}, {type: "int"}],
		func: async function([x, y, str, def]) {
			const items = str.split("|").map(text => ( { text: text } ));

			const result = await this.game.menuManager.openMenu(items, {x: x, y: y}).promise;

			if (result == null) return def;
			return result;
		},
	};

	static get_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function get_color is not implemented");
			// return 0;
		},
	};

	static get_open_filename = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function get_open_filename is not implemented");
			// return 0;
		},
	};

	static get_save_filename = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function get_save_filename is not implemented");
			// return 0;
		},
	};

	static get_directory = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function get_directory is not implemented");
			// return 0;
		},
	};

	static get_directory_alt = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function get_directory_alt is not implemented");
			// return 0;
		},
	};

	static show_error = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function show_error is not implemented");
			// return 0;
		},
	};

	// ## Highscore list

	static highscore_show = {
		args: [{type: "int"}],
		func: async function([numb]) {
			const highscoreIndex = this.game.addHighscore(numb);

			const result = await this.game.windows.openModal(HHighscoreWindow, {inputPosition: highscoreIndex});
			if (result && highscoreIndex != null) {
				this.game.highscores[highscoreIndex].name = result;
			}

			return 0;
		},
	};

	static highscore_set_background = {
		args: [{type: "int"}],
		func: function([back]) {
			this.game.windows.highscoreBackground = this.game.project.getResourceById("ProjectBackground", back);
			return 0;
		},
	};

	static highscore_set_border = {
		args: [{type: "bool"}],
		func: function([show]) {
			this.game.windows.highscoreBorder = show;
			return 0;
		},
	};

	static highscore_set_font = {
		args: [{type: "string"}, {type: "int"}, {type: "int"}],
		func: function([name, size, style]) {
			this.game.windows.highscoreFont = {
				name: `"${name}"`,
				size: `${size}`,
				bold: (style == 1 || style == 3) ? "1" : "0",
				italic: (style == 2 || style == 3) ? "1" : "0",
				underline: "0",
				strike: "0",
			};
			return 0;
		},
	};

	static highscore_set_colors = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}],
		func: function([back, _new, other]) {
			this.game.windows.highscoreBackgroundColor = decimalToHex(back);
			this.game.windows.highscoreNewColor = decimalToHex(_new);
			this.game.windows.highscoreOtherColor = decimalToHex(other);
			return 0;
		},
	};

	static highscore_set_strings = {
		args: [{type: "string"}, {type: "string"}, {type: "string"}],
		func: function([caption, nobody, escape]) {
			this.game.windows.highscoreCaptionText = caption;
			this.game.windows.highscoreNobodyText = nobody;
			this.game.windows.highscoreEscapeText = escape;
			return 0;
		},
	};

	static highscore_show_ext = {
		args: [{type: "int"}, {type: "int"}, {type: "bool"}, {type: "int"}, {type: "int"}, {type: "string"}, {type: "int"}],
		func: async function([numb, back, border, col1, col2, name, size]) {
			this.game.windows.highscoreBackground = this.game.project.getResourceById("ProjectBackground", back);
			this.game.windows.highscoreBorder = border;
			this.game.windows.highscoreNewColor = decimalToHex(col1);
			this.game.windows.highscoreOtherColor = decimalToHex(col2);
			this.game.windows.highscoreFont.name = `"${name}"`;
			this.game.windows.highscoreFont.size = `${size}`;

			await BuiltInFunctions.highscore_show.func.call(this, [numb]);
			return 0;
		},
	};

	static highscore_clear = {
		args: [],
		func: function([]) {
			this.game.highscores = [];
			return 0;
		},
	};

	static highscore_add = {
		args: [{type: "string"}, {type: "int"}],
		func: function([str, numb]) {
			const highscoreIndex = this.game.addHighscore(numb);
			if (highscoreIndex) {
				this.game.highscores[highscoreIndex].name = str;
			}
			return 0;
		},
	};

	static highscore_add_current = {
		args: [],
		func: async function([]) {
			const highscoreIndex = this.game.addHighscore(this.game.score);
			if (highscoreIndex) {
				const result = await this.game.windows.openModal(HMessageWindow,
					"You reached a place in the highscore table.\nPlease provide your name.", {input: {default: "player"}});
				this.game.highscores[highscoreIndex].name = result ?? "player";
			}
			return 0;
		},
	};

	static highscore_value = {
		args: [{type: "int"}],
		func: function([place]) {
			return this.game.highscores[place]?.score ?? 0;
		},
	};

	static highscore_name = {
		args: [{type: "int"}],
		func: function([place]) {
			return this.game.highscores[place]?.name ?? this.game.highscoreNobodyText;
		},
	};

	static draw_highscore = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function draw_highscore is not implemented");
			// return 0;
		},
	};

	// # Resources

	// ## Sprites

	static sprite_exists = {
		args: [{type: "int"}],
		func: function([ind]) {
			const sprite = this.game.project.getResourceById("ProjectSprite", ind);
			return sprite ? 1 : 0;
		},
	};

	static sprite_get_name = {
		args: [{type: "int"}],
		func: function([ind]) {
			const sprite = this.game.project.getResourceById("ProjectSprite", ind);
			return sprite?.name ?? "<undefined>";
		},
	};

	static sprite_get_number = {
		args: [{type: "int"}],
		func: function([ind]) {
			const sprite = this.game.project.getResourceById("ProjectSprite", ind);
			return sprite?.images.length ?? -1;
		},
	};

	static sprite_get_width = {
		args: [{type: "int"}],
		func: function([ind]) {
			const sprite = this.game.project.getResourceById("ProjectSprite", ind);
			if (!sprite) return -1;
			return sprite.images[0]?.width ?? 1;
		},
	};

	static sprite_get_height = {
		args: [{type: "int"}],
		func: function([ind]) {
			const sprite = this.game.project.getResourceById("ProjectSprite", ind);
			if (!sprite) return -1;
			return sprite.images[0]?.height ?? 1;
		},
	};

	static sprite_get_xoffset = {
		args: [{type: "int"}],
		func: function([ind]) {
			const sprite = this.game.project.getResourceById("ProjectSprite", ind);
			return sprite?.originx ?? -1;
		},
	};

	static sprite_get_yoffset = {
		args: [{type: "int"}],
		func: function([ind]) {
			const sprite = this.game.project.getResourceById("ProjectSprite", ind);
			return sprite?.originy ?? -1;
		},
	};

	static sprite_get_bbox_left = {
		args: [{type: "int"}],
		func: function([ind]) {
			const sprite = this.game.project.getResourceById("ProjectSprite", ind);
			return sprite?.bbLeft ?? -1;
		},
	};

	static sprite_get_bbox_right = {
		args: [{type: "int"}],
		func: function([ind]) {
			const sprite = this.game.project.getResourceById("ProjectSprite", ind);
			return sprite?.bbRight ?? -1;
		},
	};

	static sprite_get_bbox_top = {
		args: [{type: "int"}],
		func: function([ind]) {
			const sprite = this.game.project.getResourceById("ProjectSprite", ind);
			return sprite?.bbTop ?? -1;
		},
	};

	static sprite_get_bbox_bottom = {
		args: [{type: "int"}],
		func: function([ind]) {
			const sprite = this.game.project.getResourceById("ProjectSprite", ind);
			return sprite?.bbBottom ?? -1;
		},
	};

	static sprite_save = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_save is not implemented");
			// return 0;
		},
	};

	static sprite_save_strip = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_save_strip is not implemented");
			// return 0;
		},
	};

	// ## Sounds

	static sound_exists = {
		args: [{type: "int"}],
		func: function([ind]) {
			const sound = this.game.project.getResourceById("ProjectSound", ind);
			return sound ? 1 : 0;
		},
	};

	static sound_get_name = {
		args: [{type: "int"}],
		func: function([ind]) {
			const sound = this.game.project.getResourceById("ProjectSound", ind);
			return sound?.name ?? "<undefined>";
		},
	};

	static sound_get_kind = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_get_kind is not implemented");
			// return 0;
		},
	};

	static sound_get_preload = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_get_preload is not implemented");
			// return 0;
		},
	};

	static sound_discard = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_discard is not implemented");
			// return 0;
		},
	};

	static sound_restore = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_restore is not implemented");
			// return 0;
		},
	};

	// ## Backgrounds

	static background_exists = {
		args: [{type: "int"}],
		func: function([ind]) {
			const background = this.game.project.getResourceById("ProjectBackground", ind);
			return background ? 1 : 0;
		},
	};

	static background_get_name = {
		args: [{type: "int"}],
		func: function([ind]) {
			const background = this.game.project.getResourceById("ProjectBackground", ind);
			return background?.name ?? "<undefined>";
		},
	};

	static background_get_width = {
		args: [{type: "int"}],
		func: function([ind]) {
			const background = this.game.project.getResourceById("ProjectBackground", ind);
			if (!background) return -1;
			return background.image?.width ?? 0;
		},
	};

	static background_get_height = {
		args: [{type: "int"}],
		func: function([ind]) {
			const background = this.game.project.getResourceById("ProjectBackground", ind);
			if (!background) return -1;
			return background.image?.height ?? 0;
		},
	};

	static background_save = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_save is not implemented");
			// return 0;
		},
	};

	// ## Fonts

	static font_exists = {
		args: [{type: "int"}],
		func: function([ind]) {
			const font = this.game.project.getResourceById("ProjectFont", ind);
			return font ? 1 : 0;
		},
	};

	static font_get_name = {
		args: [{type: "int"}],
		func: function([ind]) {
			const font = this.game.project.getResourceById("ProjectFont", ind);
			return font?.name ?? "<undefined>";
		},
	};

	static font_get_fontname = {
		args: [{type: "int"}],
		func: function([ind]) {
			const font = this.game.project.getResourceById("ProjectFont", ind);
			return font?.font ?? "";
		},
	};

	static font_get_bold = {
		args: [{type: "int"}],
		func: function([ind]) {
			const font = this.game.project.getResourceById("ProjectFont", ind);
			return (font?.bold ? 1 : 0) ?? -1;
		},
	};

	static font_get_italic = {
		args: [{type: "int"}],
		func: function([ind]) {
			const font = this.game.project.getResourceById("ProjectFont", ind);
			return (font?.italic ? 1 : 0) ?? -1;
		},
	};

	static font_get_first = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function font_get_first is not implemented");
			// return 0;
		},
	};

	static font_get_last = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function font_get_last is not implemented");
			// return 0;
		},
	};

	// ## Paths

	static path_exists = {
		args: [{type: "int"}],
		func: function([ind]) {
			const path = this.game.project.getResourceById("ProjectPath", ind);
			return path ? 1 : 0;
		},
	};

	static path_get_name = {
		args: [{type: "int"}],
		func: function([ind]) {
			const path = this.game.project.getResourceById("ProjectPath", ind);
			return path?.name ?? "<undefined>";
		},
	};

	static path_get_length = {
		args: [{type: "int"}],
		func: function([ind]) {
			const path = this.game.project.getResourceById("ProjectPath", ind);
			return path?.getLength() ?? 0;
		},
	};

	static path_get_kind = {
		args: [{type: "int"}],
		func: function([ind]) {
			const path = this.game.project.getResourceById("ProjectPath", ind);
			return (path?.connectionKind == "lines" ? 0 : 1) ?? -1;
		},
	};

	static path_get_closed = {
		args: [{type: "int"}],
		func: function([ind]) {
			const path = this.game.project.getResourceById("ProjectPath", ind);
			return (path?.closed ? 1 : 0) ?? -1;
		},
	};

	static path_get_precision = {
		args: [{type: "int"}],
		func: function([ind]) {
			const path = this.game.project.getResourceById("ProjectPath", ind);
			return path?.precision ?? -1;
		},
	};

	static path_get_number = {
		args: [{type: "int"}],
		func: function([ind]) {
			const path = this.game.project.getResourceById("ProjectPath", ind);
			return path?.points.length ?? -1;
		},
	};

	static path_get_point_x = {
		args: [{type: "int"}, {type: "int"}],
		func: function([ind, n]) {
			const path = this.game.project.getResourceById("ProjectPath", ind);
			return path?.points[n]?.x ?? -1;
		},
	};

	static path_get_point_y = {
		args: [{type: "int"}, {type: "int"}],
		func: function([ind, n]) {
			const path = this.game.project.getResourceById("ProjectPath", ind);
			return path?.points[n]?.y ?? -1;
		},
	};

	static path_get_point_speed = {
		args: [{type: "int"}, {type: "int"}],
		func: function([ind, n]) {
			const path = this.game.project.getResourceById("ProjectPath", ind);
			return path?.points[n]?.sp ?? -1;
		},
	};

	static path_get_x = {
		args: [{type: "int"}, {type: "real"}],
		func: function([ind, pos]) {
			const path = this.game.project.getResourceById("ProjectPath", ind);
			return path?.getPosInfo(pos).x;
		},
	};

	static path_get_y = {
		args: [{type: "int"}, {type: "real"}],
		func: function([ind, pos]) {
			const path = this.game.project.getResourceById("ProjectPath", ind);
			return path?.getPosInfo(pos).y;
		},
	};

	static path_get_speed = {
		args: [{type: "int"}, {type: "real"}],
		func: function([ind, pos]) {
			const path = this.game.project.getResourceById("ProjectPath", ind);
			return path?.getPosInfo(pos).sp;
		},
	};

	// ## Scripts

	static script_exists = {
		args: [{type: "int"}],
		func: function([ind]) {
			const script = this.game.project.getResourceById("ProjectScript", ind);
			return script ? 1 : 0;
		},
	};

	static script_get_name = {
		args: [{type: "int"}],
		func: function([ind]) {
			const script = this.game.project.getResourceById("ProjectScript", ind);
			return script?.name ?? "<undefined>";
		},
	};

	static script_get_text = {
		args: [{type: "int"}],
		func: function([ind]) {
			const script = this.game.project.getResourceById("ProjectScript", ind);
			return script?.code ?? "";
		},
	};

	// ## Time lines

	static timeline_exists = {
		args: [{type: "int"}],
		func: function([ind]) {
			const timeline = this.game.project.getResourceById("ProjectTimeline", ind);
			return timeline ? 1 : 0;
		},
	};

	static timeline_get_name = {
		args: [{type: "int"}],
		func: function([ind]) {
			const timeline = this.game.project.getResourceById("ProjectTimeline", ind);
			return timeline?.name ?? "<undefined>";
		},
	};

	// ## Objects

	static object_exists = {
		args: [{type: "int"}],
		func: function([ind]) {
			const object = this.game.project.getResourceById("ProjectObject", ind);
			return object ? 1 : 0;
		},
	};

	static object_get_name = {
		args: [{type: "int"}],
		func: function([ind]) {
			const object = this.game.project.getResourceById("ProjectObject", ind);
			return object?.name ?? "<undefined>";
		},
	};

	static object_get_sprite = {
		args: [{type: "int"}],
		func: function([ind]) {
			const object = this.game.project.getResourceById("ProjectObject", ind);
			return object?.sprite_index ?? -1;
		},
	};

	static object_get_solid = {
		args: [{type: "int"}],
		func: function([ind]) {
			const object = this.game.project.getResourceById("ProjectObject", ind);
			return (object?.solid ? 1 : 0) ?? -1;
		},
	};

	static object_get_visible = {
		args: [{type: "int"}],
		func: function([ind]) {
			const object = this.game.project.getResourceById("ProjectObject", ind);
			return (object?.visible ? 1 : 0) ?? -1;
		},
	};

	static object_get_depth = {
		args: [{type: "int"}],
		func: function([ind]) {
			const object = this.game.project.getResourceById("ProjectObject", ind);
			return object?.depth ?? -1;
		},
	};

	static object_get_persistent = {
		args: [{type: "int"}],
		func: function([ind]) {
			const object = this.game.project.getResourceById("ProjectObject", ind);
			return (object?.persistent ? 1 : 0) ?? -1;
		},
	};

	static object_get_mask = {
		args: [{type: "int"}],
		func: function([ind]) {
			const object = this.game.project.getResourceById("ProjectObject", ind);
			return object?.mask_index ?? -1;
		},
	};

	static object_get_parent = {
		args: [{type: "int"}],
		func: function([ind]) {
			const object = this.game.project.getResourceById("ProjectObject", ind);
			return object?.parent_index ?? -1;
		},
	};

	static object_is_ancestor = {
		args: [{type: "int"}],
		func: function([ind1, ind2]) {
			return this.game.objectIsAncestorByIndex(ind2, ind1) ? 1 : 0;
		},
	};

	// ## Rooms

	static room_exists = {
		args: [{type: "int"}],
		func: function([ind]) {
			const room = this.game.project.getResourceById("ProjectRoom", ind);
			return room ? 1 : 0;
		},
	};

	static room_get_name = {
		args: [{type: "int"}],
		func: function([ind]) {
			const room = this.game.project.getResourceById("ProjectRoom", ind);
			return room?.name ?? "<undefined>";
		},
	};

	// # Changing resources

	// ## Sprites

	static sprite_set_offset = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_set_offset is not implemented");
			// return 0;
		},
	};

	static sprite_duplicate = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_duplicate is not implemented");
			// return 0;
		},
	};

	static sprite_assign = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_assign is not implemented");
			// return 0;
		},
	};

	static sprite_merge = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_merge is not implemented");
			// return 0;
		},
	};

	static sprite_add = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_add is not implemented");
			// return 0;
		},
	};

	static sprite_replace = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_replace is not implemented");
			// return 0;
		},
	};

	static sprite_add_sprite = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_add_sprite is not implemented");
			// return 0;
		},
	};

	static sprite_replace_sprite = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_replace_sprite is not implemented");
			// return 0;
		},
	};

	static sprite_create_from_screen = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_create_from_screen is not implemented");
			// return 0;
		},
	};

	static sprite_add_from_screen = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_add_from_screen is not implemented");
			// return 0;
		},
	};

	static sprite_create_from_surface = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_create_from_surface is not implemented");
			// return 0;
		},
	};

	static sprite_add_from_surface = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_add_from_surface is not implemented");
			// return 0;
		},
	};

	static sprite_delete = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_delete is not implemented");
			// return 0;
		},
	};

	static sprite_set_alpha_from_sprite = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_set_alpha_from_sprite is not implemented");
			// return 0;
		},
	};

	static sprite_collision_mask = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_collision_mask is not implemented");
			// return 0;
		},
	};

	// ## Sounds

	static sound_add = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_add is not implemented");
			// return 0;
		},
	};

	static sound_replace = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_replace is not implemented");
			// return 0;
		},
	};

	static sound_delete = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_delete is not implemented");
			// return 0;
		},
	};

	// ## Backgrounds

	static background_duplicate = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_duplicate is not implemented");
			// return 0;
		},
	};

	static background_assign = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_assign is not implemented");
			// return 0;
		},
	};

	static background_add = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_add is not implemented");
			// return 0;
		},
	};

	static background_replace = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_replace is not implemented");
			// return 0;
		},
	};

	static background_add_background = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_add_background is not implemented");
			// return 0;
		},
	};

	static background_replace_background = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_replace_background is not implemented");
			// return 0;
		},
	};

	static background_create_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_create_color is not implemented");
			// return 0;
		},
	};

	static background_create_gradient = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_create_gradient is not implemented");
			// return 0;
		},
	};

	static background_create_from_screen = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_create_from_screen is not implemented");
			// return 0;
		},
	};

	static background_create_from_surface = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_create_from_surface is not implemented");
			// return 0;
		},
	};

	static background_delete = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_delete is not implemented");
			// return 0;
		},
	};

	static background_set_alpha_from_background = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_set_alpha_from_background is not implemented");
			// return 0;
		},
	};

	// ## Fonts

	static font_add = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function font_add is not implemented");
			// return 0;
		},
	};

	static font_add_sprite = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function font_add_sprite is not implemented");
			// return 0;
		},
	};

	static font_replace = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function font_replace is not implemented");
			// return 0;
		},
	};

	static font_replace_sprite = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function font_replace_sprite is not implemented");
			// return 0;
		},
	};

	static font_delete = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function font_delete is not implemented");
			// return 0;
		},
	};

	// ## Paths

	static path_set_kind = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_set_kind is not implemented");
			// return 0;
		},
	};

	static path_set_closed = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_set_closed is not implemented");
			// return 0;
		},
	};

	static path_set_precision = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_set_precision is not implemented");
			// return 0;
		},
	};

	static path_add = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_add is not implemented");
			// return 0;
		},
	};

	static path_delete = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_delete is not implemented");
			// return 0;
		},
	};

	static path_duplicate = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_duplicate is not implemented");
			// return 0;
		},
	};

	static path_assign = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_assign is not implemented");
			// return 0;
		},
	};

	static path_append = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_append is not implemented");
			// return 0;
		},
	};

	static path_add_point = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_add_point is not implemented");
			// return 0;
		},
	};

	static path_insert_point = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_insert_point is not implemented");
			// return 0;
		},
	};

	static path_change_point = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_change_point is not implemented");
			// return 0;
		},
	};

	static path_delete_point = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_delete_point is not implemented");
			// return 0;
		},
	};

	static path_clear_points = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_clear_points is not implemented");
			// return 0;
		},
	};

	static path_reverse = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_reverse is not implemented");
			// return 0;
		},
	};

	static path_mirror = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_mirror is not implemented");
			// return 0;
		},
	};

	static path_flip = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_flip is not implemented");
			// return 0;
		},
	};

	static path_rotate = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_rotate is not implemented");
			// return 0;
		},
	};

	static path_scale = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_scale is not implemented");
			// return 0;
		},
	};

	static path_shift = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_shift is not implemented");
			// return 0;
		},
	};

	// ## Scripts

	static execute_string = {
		args: [{type: "string"}, {type: "any", infinite: true}],
		func: async function([str, ...args]) {
			await this.game.gml.executeString(str, this.currentInstance, this.currentOther, args);
			return 0;
		},
	};

	static execute_file = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function execute_file is not implemented");
			// return 0;
		},
	};

	static script_execute = {
		args: [{type: "int"}, {type: "any", infinite: true}],
		func: function([scr, ...args]) {
			const script = this.game.project.getResourceById("ProjectScript", scr);
			if (script) {
				return this.execute(this.game.loadedProject.gmlCache.get(script), this.currentInstance, this.currentOther, args);
			} else {
				throw this.game.makeError({text: `Trying to execute non-existing script. (${scr})`});
			}
		},
	};

	// ## Time lines

	static timeline_add = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function timeline_add is not implemented");
			// return 0;
		},
	};

	static timeline_delete = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function timeline_delete is not implemented");
			// return 0;
		},
	};

	static timeline_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function timeline_clear is not implemented");
			// return 0;
		},
	};

	static timeline_moment_add = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function timeline_moment_add is not implemented");
			// return 0;
		},
	};

	static timeline_moment_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function timeline_moment_clear is not implemented");
			// return 0;
		},
	};

	// ## Objects

	static object_set_sprite = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function object_set_sprite is not implemented");
			// return 0;
		},
	};

	static object_set_solid = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function object_set_solid is not implemented");
			// return 0;
		},
	};

	static object_set_visible = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function object_set_visible is not implemented");
			// return 0;
		},
	};

	static object_set_depth = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function object_set_depth is not implemented");
			// return 0;
		},
	};

	static object_set_persistent = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function object_set_persistent is not implemented");
			// return 0;
		},
	};

	static object_set_mask = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function object_set_mask is not implemented");
			// return 0;
		},
	};

	static object_set_parent = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function object_set_parent is not implemented");
			// return 0;
		},
	};

	static object_add = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function object_add is not implemented");
			// return 0;
		},
	};

	static object_delete = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function object_delete is not implemented");
			// return 0;
		},
	};

	static object_event_add = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function object_event_add is not implemented");
			// return 0;
		},
	};

	static object_event_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function object_event_clear is not implemented");
			// return 0;
		},
	};

	// ## Rooms

	static room_set_width = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_set_width is not implemented");
			// return 0;
		},
	};

	static room_set_height = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_set_height is not implemented");
			// return 0;
		},
	};

	static room_set_caption = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_set_caption is not implemented");
			// return 0;
		},
	};

	static room_set_persistent = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_set_persistent is not implemented");
			// return 0;
		},
	};

	static room_set_code = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_set_code is not implemented");
			// return 0;
		},
	};

	static room_set_background_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_set_background_color is not implemented");
			// return 0;
		},
	};

	static room_set_background = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_set_background is not implemented");
			// return 0;
		},
	};

	static room_set_view = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_set_view is not implemented");
			// return 0;
		},
	};

	static room_set_view_enabled = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_set_view_enabled is not implemented");
			// return 0;
		},
	};

	static room_add = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_add is not implemented");
			// return 0;
		},
	};

	static room_duplicate = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_duplicate is not implemented");
			// return 0;
		},
	};

	static room_assign = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_assign is not implemented");
			// return 0;
		},
	};

	static room_instance_add = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_instance_add is not implemented");
			// return 0;
		},
	};

	static room_instance_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_instance_clear is not implemented");
			// return 0;
		},
	};

	static room_tile_add = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_tile_add is not implemented");
			// return 0;
		},
	};

	static room_tile_add_ext = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_tile_add_ext is not implemented");
			// return 0;
		},
	};

	static room_tile_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_tile_clear is not implemented");
			// return 0;
		},
	};

	// # Files, registry, and executing programs

	// ## Files

	static file_text_open_read = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_text_open_read is not implemented");
			// return 0;
		},
	};

	static file_text_open_write = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_text_open_write is not implemented");
			// return 0;
		},
	};

	static file_text_open_append = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_text_open_append is not implemented");
			// return 0;
		},
	};

	static file_text_close = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_text_close is not implemented");
			// return 0;
		},
	};

	static file_text_write_string = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_text_write_string is not implemented");
			// return 0;
		},
	};

	static file_text_write_real = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_text_write_real is not implemented");
			// return 0;
		},
	};

	static file_text_writeln = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_text_writeln is not implemented");
			// return 0;
		},
	};

	static file_text_read_string = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_text_read_string is not implemented");
			// return 0;
		},
	};

	static file_text_read_real = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_text_read_real is not implemented");
			// return 0;
		},
	};

	static file_text_readln = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_text_readln is not implemented");
			// return 0;
		},
	};

	static file_text_eof = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_text_eof is not implemented");
			// return 0;
		},
	};

	static file_text_eoln = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_text_eoln is not implemented");
			// return 0;
		},
	};

	static file_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_exists is not implemented");
			// return 0;
		},
	};

	static file_delete = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_delete is not implemented");
			// return 0;
		},
	};

	static file_rename = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_rename is not implemented");
			// return 0;
		},
	};

	static file_copy = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_copy is not implemented");
			// return 0;
		},
	};

	static directory_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function directory_create is not implemented");
			// return 0;
		},
	};

	static directory_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function directory_exists is not implemented");
			// return 0;
		},
	};

	static file_find_first = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_find_first is not implemented");
			// return 0;
		},
	};

	static file_find_next = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_find_next is not implemented");
			// return 0;
		},
	};

	static file_find_close = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_find_close is not implemented");
			// return 0;
		},
	};

	static file_attributes = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_attributes is not implemented");
			// return 0;
		},
	};

	static filename_name = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function filename_name is not implemented");
			// return 0;
		},
	};

	static filename_path = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function filename_path is not implemented");
			// return 0;
		},
	};

	static filename_dir = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function filename_dir is not implemented");
			// return 0;
		},
	};

	static filename_drive = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function filename_drive is not implemented");
			// return 0;
		},
	};

	static filename_ext = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function filename_ext is not implemented");
			// return 0;
		},
	};

	static filename_change_ext = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function filename_change_ext is not implemented");
			// return 0;
		},
	};

	static file_bin_open = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_bin_open is not implemented");
			// return 0;
		},
	};

	static file_bin_rewrite = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_bin_rewrite is not implemented");
			// return 0;
		},
	};

	static file_bin_close = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_bin_close is not implemented");
			// return 0;
		},
	};

	static file_bin_size = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_bin_size is not implemented");
			// return 0;
		},
	};

	static file_bin_position = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_bin_position is not implemented");
			// return 0;
		},
	};

	static file_bin_seek = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_bin_seek is not implemented");
			// return 0;
		},
	};

	static file_bin_write_byte = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_bin_write_byte is not implemented");
			// return 0;
		},
	};

	static file_bin_read_byte = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_bin_read_byte is not implemented");
			// return 0;
		},
	};

	static export_include_file = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function export_include_file is not implemented");
			// return 0;
		},
	};

	static export_include_file_location = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function export_include_file_location is not implemented");
			// return 0;
		},
	};

	static discard_include_file = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function discard_include_file is not implemented");
			// return 0;
		},
	};

	static parameter_count = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function parameter_count is not implemented");
			// return 0;
		},
	};

	static parameter_string = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function parameter_string is not implemented");
			// return 0;
		},
	};

	static environment_get_variable = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function environment_get_variable is not implemented");
			// return 0;
		},
	};

	static disk_size = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function disk_size is not implemented");
			// return 0;
		},
	};

	static disk_free = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function disk_free is not implemented");
			// return 0;
		},
	};

	// ## Registry

	static registry_write_string = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function registry_write_string is not implemented");
			// return 0;
		},
	};

	static registry_write_real = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function registry_write_real is not implemented");
			// return 0;
		},
	};

	static registry_read_string = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function registry_read_string is not implemented");
			// return 0;
		},
	};

	static registry_read_real = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function registry_read_real is not implemented");
			// return 0;
		},
	};

	static registry_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function registry_exists is not implemented");
			// return 0;
		},
	};

	static registry_write_string_ext = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function registry_write_string_ext is not implemented");
			// return 0;
		},
	};

	static registry_write_real_ext = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function registry_write_real_ext is not implemented");
			// return 0;
		},
	};

	static registry_read_string_ext = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function registry_read_string_ext is not implemented");
			// return 0;
		},
	};

	static registry_read_real_ext = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function registry_read_real_ext is not implemented");
			// return 0;
		},
	};

	static registry_exists_ext = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function registry_exists_ext is not implemented");
			// return 0;
		},
	};

	static registry_set_root = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function registry_set_root is not implemented");
			// return 0;
		},
	};

	// ## INI files

	static ini_open = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ini_open is not implemented");
			// return 0;
		},
	};

	static ini_close = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ini_close is not implemented");
			// return 0;
		},
	};

	static ini_read_string = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ini_read_string is not implemented");
			// return 0;
		},
	};

	static ini_read_real = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ini_read_real is not implemented");
			// return 0;
		},
	};

	static ini_write_string = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ini_write_string is not implemented");
			// return 0;
		},
	};

	static ini_write_real = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ini_write_real is not implemented");
			// return 0;
		},
	};

	static ini_key_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ini_key_exists is not implemented");
			// return 0;
		},
	};

	static ini_section_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ini_section_exists is not implemented");
			// return 0;
		},
	};

	static ini_key_delete = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ini_key_delete is not implemented");
			// return 0;
		},
	};

	static ini_section_delete = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ini_section_delete is not implemented");
			// return 0;
		},
	};

	// ## Executing programs

	static execute_program = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function execute_program is not implemented");
			// return 0;
		},
	};

	static execute_shell = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function execute_shell is not implemented");
			// return 0;
		},
	};

	// # Data structures

	static ds_set_precision = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ds_set_precision is not implemented");
			// return 0;
		},
	};

	// ## Stacks

	static ds_stack_create = {
		args: [],
		func: function([]) {
			return this.game.dataStructures.create("stack");
		},
	};

	static ds_stack_destroy = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.destroy("stack", id);
		},
	};

	static ds_stack_clear = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.clear("stack", id);
		},
	};

	static ds_stack_copy = {
		args: [{type: "int"}, {type: "int"}],
		func: function([id, source]) {
			return this.game.dataStructures.copy("stack", id, source);
		},
	};

	static ds_stack_size = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.size("stack", id);
		},
	};

	static ds_stack_empty = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.empty("stack", id);
		},
	};

	static ds_stack_push = {
		args: [{type: "int"}, {type: "any"}],
		func: function([id, val]) {
			return this.game.dataStructures.stackPush(id, val);
		},
	};

	static ds_stack_pop = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.stackPop(id);
		},
	};

	static ds_stack_top = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.stackTop(id);
		},
	};

	static ds_stack_write = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ds_stack_write is not implemented");
			// return 0;
		},
	};

	static ds_stack_read = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ds_stack_read is not implemented");
			// return 0;
		},
	};

	// ## Queues

	static ds_queue_create = {
		args: [],
		func: function([]) {
			return this.game.dataStructures.create("queue");
		},
	};

	static ds_queue_destroy = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.destroy("queue", id);
		},
	};

	static ds_queue_clear = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.clear("queue", id);
		},
	};

	static ds_queue_copy = {
		args: [{type: "int"}, {type: "int"}],
		func: function([id, source]) {
			return this.game.dataStructures.copy("queue", id, source);
		},
	};

	static ds_queue_size = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.size("queue", id);
		},
	};

	static ds_queue_empty = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.empty("queue", id);
		},
	};

	static ds_queue_enqueue = {
		args: [{type: "int"}, {type: "any"}],
		func: function([id, val]) {
			return this.game.dataStructures.queueEnqueue(id, val);
		},
	};

	static ds_queue_dequeue = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.queueDequeue(id);
		},
	};

	static ds_queue_head = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.queueHead(id);
		},
	};

	static ds_queue_tail = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.queueTail(id);
		},
	};

	static ds_queue_write = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ds_queue_write is not implemented");
			// return 0;
		},
	};

	static ds_queue_read = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ds_queue_read is not implemented");
			// return 0;
		},
	};

	// ## Lists

	static ds_list_create = {
		args: [],
		func: function([]) {
			return this.game.dataStructures.create("list");
		},
	};

	static ds_list_destroy = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.destroy("list", id);
		},
	};

	static ds_list_clear = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.clear("list", id);
		},
	};

	static ds_list_copy = {
		args: [{type: "int"}, {type: "int"}],
		func: function([id, source]) {
			return this.game.dataStructures.copy("list", id, source);
		},
	};

	static ds_list_size = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.size("list", id);
		},
	};

	static ds_list_empty = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.empty("list", id);
		},
	};

	static ds_list_add = {
		args: [{type: "int"}, {type: "any"}],
		func: function([id, val]) {
			return this.game.dataStructures.listAdd(id, val);
		},
	};

	static ds_list_insert = {
		args: [{type: "int"}, {type: "int"}, {type: "any"}],
		func: function([id, pos, val]) {
			return this.game.dataStructures.listInsert(id, pos, val);
		},
	};

	static ds_list_replace = {
		args: [{type: "int"}, {type: "int"}, {type: "any"}],
		func: function([id, pos, val]) {
			return this.game.dataStructures.listReplace(id, pos, val);
		},
	};

	static ds_list_delete = {
		args: [{type: "int"}, {type: "int"}],
		func: function([id, pos]) {
			return this.game.dataStructures.listDelete(id, pos);
		},
	};

	static ds_list_find_index = {
		args: [{type: "int"}, {type: "any"}],
		func: function([id, val]) {
			return this.game.dataStructures.listFindIndex(id, val);
		},
	};

	static ds_list_find_value = {
		args: [{type: "int"}, {type: "int"}],
		func: function([id, pos]) {
			return this.game.dataStructures.listFindValue(id, pos);
		},
	};

	static ds_list_sort = {
		args: [{type: "int"}, {type: "bool"}],
		func: function([id, ascend]) {
			return this.game.dataStructures.listSort(id, ascend);
		},
	};

	static ds_list_shuffle = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.listShuffle(id);
		},
	};

	static ds_list_write = {
		args: [{type: "int"}],
		func: function([_]) {
			throw new EngineException("Function ds_list_write is not implemented");
			// return 0;
		},
	};

	static ds_list_read = {
		args: [{type: "int"}, {type: "string"}],
		func: function([_]) {
			throw new EngineException("Function ds_list_read is not implemented");
			// return 0;
		},
	};

	// ## Maps

	static ds_map_create = {
		args: [],
		func: function([]) {
			return this.game.dataStructures.create("map");
		},
	};

	static ds_map_destroy = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.destroy("map", id);
		},
	};

	static ds_map_clear = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.clear("map", id);
		},
	};

	static ds_map_copy = {
		args: [{type: "int"}, {type: "int"}],
		func: function([id, source]) {
			return this.game.dataStructures.mapCopy(id, source);
		},
	};

	static ds_map_size = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.size("map", id);
		},
	};

	static ds_map_empty = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.empty("map", id);
		},
	};

	static ds_map_add = {
		args: [{type: "int"}, {type: "any"}, {type: "any"}],
		func: function([id, key, val]) {
			return this.game.dataStructures.mapAdd(id, key, val);
		},
	};

	static ds_map_replace = {
		args: [{type: "int"}, {type: "any"}, {type: "any"}],
		func: function([id, key, val]) {
			return this.game.dataStructures.mapReplace(id, key, val);
		},
	};

	static ds_map_delete = {
		args: [{type: "int"}, {type: "any"}],
		func: function([id, key]) {
			return this.game.dataStructures.mapDelete(id, key);
		},
	};

	static ds_map_exists = {
		args: [{type: "int"}, {type: "any"}],
		func: function([id, key]) {
			return this.game.dataStructures.mapExists(id, key);
		},
	};

	static ds_map_find_value = {
		args: [{type: "int"}, {type: "any"}],
		func: function([id, key]) {
			return this.game.dataStructures.mapFindValue(id, key);
		},
	};

	static ds_map_find_previous = {
		args: [{type: "int"}, {type: "any"}],
		func: function([id, key]) {
			return this.game.dataStructures.mapFindPrevious(id, key);
		},
	};

	static ds_map_find_next = {
		args: [{type: "int"}, {type: "any"}],
		func: function([id, key]) {
			return this.game.dataStructures.mapFindNext(id, key);
		},
	};

	static ds_map_find_first = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.mapFindFirst(id);
		},
	};

	static ds_map_find_last = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.mapFindLast(id);
		},
	};

	static ds_map_write = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ds_map_write is not implemented");
			// return 0;
		},
	};

	static ds_map_read = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ds_map_read is not implemented");
			// return 0;
		},
	};

	// ## Priority queues

	static ds_priority_create = {
		args: [],
		func: function([]) {
			return this.game.dataStructures.create("priority");
		},
	};

	static ds_priority_destroy = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.destroy("priority", id);
		},
	};

	static ds_priority_clear = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.clear("priority", id);
		},
	};

	static ds_priority_copy = {
		args: [{type: "int"}, {type: "int"}],
		func: function([id, source]) {
			return this.game.dataStructures.priorityCopy(id, source);
		},
	};

	static ds_priority_size = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.size("priority", id);
		},
	};

	static ds_priority_empty = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.empty("priority", id);
		},
	};

	static ds_priority_add = {
		args: [{type: "int"}, {type: "any"}, {type: "any"}],
		func: function([id, val, prio]) {
			return this.game.dataStructures.priorityAdd(id, val, prio);
		},
	};

	static ds_priority_change_priority = {
		args: [{type: "int"}, {type: "any"}, {type: "any"}],
		func: function([id, val, prio]) {
			return this.game.dataStructures.priorityChangePriority(id, val, prio);
		},
	};

	static ds_priority_find_priority = {
		args: [{type: "int"}, {type: "any"}],
		func: function([id, val]) {
			return this.game.dataStructures.priorityFindPriority(id, val);
		},
	};

	static ds_priority_delete_value = {
		args: [{type: "int"}, {type: "any"}],
		func: function([id, val]) {
			return this.game.dataStructures.priorityDeleteValue(id, val);
		},
	};

	static ds_priority_delete_min = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.priorityDeleteMin(id);
		},
	};

	static ds_priority_find_min = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.priorityFindMin(id);
		},
	};

	static ds_priority_delete_max = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.priorityDeleteMax(id);
		},
	};

	static ds_priority_find_max = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.priorityFindMax(id);
		},
	};

	static ds_priority_write = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ds_priority_write is not implemented");
			// return 0;
		},
	};

	static ds_priority_read = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ds_priority_read is not implemented");
			// return 0;
		},
	};

	// ## Grids

	static ds_grid_create = {
		args: [{type: "int"}, {type: "int"}],
		func: function([w, h]) {
			return this.game.dataStructures.gridCreate(w, h);
		},
	};

	static ds_grid_destroy = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.destroy("grid", id);
		},
	};

	static ds_grid_copy = {
		args: [{type: "int"}, {type: "int"}],
		func: function([id, source]) {
			return this.game.dataStructures.gridCopy(id, source);
		},
	};

	static ds_grid_resize = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}],
		func: function([id, w, h]) {
			return this.game.dataStructures.gridResize(id, w, h);
		},
	};

	static ds_grid_width = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.gridWidth(id);
		},
	};

	static ds_grid_height = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.gridHeight(id);
		},
	};

	static ds_grid_clear = {
		args: [{type: "int"}, {type: "any"}],
		func: function([id, val]) {
			return this.game.dataStructures.gridClear(id, val);
		},
	};

	static ds_grid_set = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "any"}],
		func: function([id, x, y, val]) {
			return this.game.dataStructures.gridSet(id, x, y, val);
		},
	};

	static ds_grid_add = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "any"}],
		func: function([id, x, y, val]) {
			return this.game.dataStructures.gridAdd(id, x, y, val);
		},
	};

	static ds_grid_multiply = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "any"}],
		func: function([id, x, y, val]) {
			return this.game.dataStructures.gridMultiply(id, x, y, val);
		},
	};

	static ds_grid_set_region = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "any"}],
		func: function([id, x1, y1, x2, y2, val]) {
			return this.game.dataStructures.gridSetRegion(id, x1, y1, x2, y2, val);
		},
	};

	static ds_grid_add_region = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "any"}],
		func: function([id, x1, y1, x2, y2, val]) {
			return this.game.dataStructures.gridAddRegion(id, x1, y1, x2, y2, val);
		},
	};

	static ds_grid_multiply_region = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "any"}],
		func: function([id, x1, y1, x2, y2, val]) {
			return this.game.dataStructures.gridMultiplyRegion(id, x1, y1, x2, y2, val);
		},
	};

	static ds_grid_set_disk = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "any"}],
		func: function([id, xm, ym, r, val]) {
			return this.game.dataStructures.gridSetDisk(id, xm, ym, r, val);
		},
	};

	static ds_grid_add_disk = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "any"}],
		func: function([id, xm, ym, r, val]) {
			return this.game.dataStructures.gridAddDisk(id, xm, ym, r, val);
		},
	};

	static ds_grid_multiply_disk = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "any"}],
		func: function([id, xm, ym, r, val]) {
			return this.game.dataStructures.gridMultiplyDisk(id, xm, ym, r, val);
		},
	};

	static ds_grid_set_grid_region = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}],
		func: function([id, source, x1, y1, x2, y2, xpos, ypos]) {
			return this.game.dataStructures.gridSetGridRegion(id, source, x1, y1, x2, y2, xpos, ypos);
		},
	};

	static ds_grid_add_grid_region = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}],
		func: function([id, source, x1, y1, x2, y2, xpos, ypos]) {
			return this.game.dataStructures.gridAddGridRegion(id, source, x1, y1, x2, y2, xpos, ypos);
		},
	};

	static ds_grid_multiply_grid_region = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}],
		func: function([id, source, x1, y1, x2, y2, xpos, ypos]) {
			return this.game.dataStructures.gridMultiplyGridRegion(id, source, x1, y1, x2, y2, xpos, ypos);
		},
	};

	static ds_grid_get = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}],
		func: function([id, x, y]) {
			return this.game.dataStructures.gridGet(id, x, y);
		},
	};

	static ds_grid_get_sum = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}],
		func: function([id, x1, y1, x2, y2]) {
			return this.game.dataStructures.gridGetSum(id, x1, y1, x2, y2);
		},
	};

	static ds_grid_get_max = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}],
		func: function([id, x1, y1, x2, y2]) {
			return this.game.dataStructures.gridGetMax(id, x1, y1, x2, y2);
		},
	};

	static ds_grid_get_min = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}],
		func: function([id, x1, y1, x2, y2]) {
			return this.game.dataStructures.gridGetMin(id, x1, y1, x2, y2);
		},
	};

	static ds_grid_get_mean = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}],
		func: function([id, x1, y1, x2, y2]) {
			return this.game.dataStructures.gridGetMean(id, x1, y1, x2, y2);
		},
	};

	static ds_grid_get_disk_sum = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([id, xm, ym, r]) {
			return this.game.dataStructures.gridGetDiskSum(id, xm, ym, r);
		},
	};

	static ds_grid_get_disk_min = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([id, xm, ym, r]) {
			return this.game.dataStructures.gridGetDiskMin(id, xm, ym, r);
		},
	};

	static ds_grid_get_disk_max = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([id, xm, ym, r]) {
			return this.game.dataStructures.gridGetDiskMax(id, xm, ym, r);
		},
	};

	static ds_grid_get_disk_mean = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}],
		func: function([id, xm, ym, r]) {
			return this.game.dataStructures.gridGetDiskMean(id, xm, ym, r);
		},
	};

	static ds_grid_value_exists = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "any"}],
		func: function([id, x1, y1, x2, y2, val]) {
			return this.game.dataStructures.gridValueExists(id, x1, y1, x2, y2, val);
		},
	};

	static ds_grid_value_x = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "any"}],
		func: function([id, x1, y1, x2, y2, val]) {
			return this.game.dataStructures.gridValueX(id, x1, y1, x2, y2, val);
		},
	};

	static ds_grid_value_y = {
		args: [{type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "int"}, {type: "any"}],
		func: function([id, x1, y1, x2, y2, val]) {
			return this.game.dataStructures.gridValueY(id, x1, y1, x2, y2, val);
		},
	};

	static ds_grid_value_disk_exists = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "any"}],
		func: function([id, xm, ym, r, val]) {
			return this.game.dataStructures.gridValueDiskExists(id, xm, ym, r, val);
		},
	};

	static ds_grid_value_disk_x = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "any"}],
		func: function([id, xm, ym, r, val]) {
			return this.game.dataStructures.gridValueDiskX(id, xm, ym, r, val);
		},
	};

	static ds_grid_value_disk_y = {
		args: [{type: "int"}, {type: "real"}, {type: "real"}, {type: "real"}, {type: "any"}],
		func: function([id, xm, ym, r, val]) {
			return this.game.dataStructures.gridValueDiskY(id, xm, ym, r, val);
		},
	};

	static ds_grid_shuffle = {
		args: [{type: "int"}],
		func: function([id]) {
			return this.game.dataStructures.gridShuffle(id);
		},
	};

	static ds_grid_write = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ds_grid_write is not implemented");
			// return 0;
		},
	};

	static ds_grid_read = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function ds_grid_read is not implemented");
			// return 0;
		},
	};

	// # Creating particles

	// ## Simple effects

	static effect_create_below = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function effect_create_below is not implemented");
			// return 0;
		},
	};

	static effect_create_above = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function effect_create_above is not implemented");
			// return 0;
		},
	};

	static effect_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function effect_clear is not implemented");
			// return 0;
		},
	};

	// ## Particle types

	static part_type_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_create is not implemented");
			// return 0;
		},
	};

	static part_type_destroy = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_destroy is not implemented");
			// return 0;
		},
	};

	static part_type_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_exists is not implemented");
			// return 0;
		},
	};

	static part_type_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_clear is not implemented");
			// return 0;
		},
	};

	static part_type_shape = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_shape is not implemented");
			// return 0;
		},
	};

	static part_type_sprite = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_sprite is not implemented");
			// return 0;
		},
	};

	static part_type_size = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_size is not implemented");
			// return 0;
		},
	};

	static part_type_scale = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_scale is not implemented");
			// return 0;
		},
	};

	static part_type_orientation = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_orientation is not implemented");
			// return 0;
		},
	};

	static part_type_color1 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_color1 is not implemented");
			// return 0;
		},
	};

	static part_type_color2 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_color2 is not implemented");
			// return 0;
		},
	};

	static part_type_color3 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_color3 is not implemented");
			// return 0;
		},
	};

	static part_type_color_mix = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_color_mix is not implemented");
			// return 0;
		},
	};

	static part_type_color_rgb = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_color_rgb is not implemented");
			// return 0;
		},
	};

	static part_type_color_hsv = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_color_hsv is not implemented");
			// return 0;
		},
	};

	static part_type_alpha1 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_alpha1 is not implemented");
			// return 0;
		},
	};

	static part_type_alpha2 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_alpha2 is not implemented");
			// return 0;
		},
	};

	static part_type_alpha3 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_alpha3 is not implemented");
			// return 0;
		},
	};

	static part_type_blend = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_blend is not implemented");
			// return 0;
		},
	};

	static part_type_life = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_life is not implemented");
			// return 0;
		},
	};

	static part_type_step = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_step is not implemented");
			// return 0;
		},
	};

	static part_type_death = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_death is not implemented");
			// return 0;
		},
	};

	static part_type_speed = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_speed is not implemented");
			// return 0;
		},
	};

	static part_type_direction = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_direction is not implemented");
			// return 0;
		},
	};

	static part_type_gravity = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_gravity is not implemented");
			// return 0;
		},
	};

	// ## Particle systems

	static part_system_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_system_create is not implemented");
			// return 0;
		},
	};

	static part_system_destroy = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_system_destroy is not implemented");
			// return 0;
		},
	};

	static part_system_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_system_exists is not implemented");
			// return 0;
		},
	};

	static part_system_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_system_clear is not implemented");
			// return 0;
		},
	};

	static part_system_draw_order = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_system_draw_order is not implemented");
			// return 0;
		},
	};

	static part_system_depth = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_system_depth is not implemented");
			// return 0;
		},
	};

	static part_system_position = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_system_position is not implemented");
			// return 0;
		},
	};

	static part_system_automatic_update = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_system_automatic_update is not implemented");
			// return 0;
		},
	};

	static part_system_automatic_draw = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_system_automatic_draw is not implemented");
			// return 0;
		},
	};

	static part_system_update = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_system_update is not implemented");
			// return 0;
		},
	};

	static part_system_drawit = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_system_drawit is not implemented");
			// return 0;
		},
	};

	static part_particles_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_particles_create is not implemented");
			// return 0;
		},
	};

	static part_particles_create_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_particles_create_color is not implemented");
			// return 0;
		},
	};

	static part_particles_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_particles_clear is not implemented");
			// return 0;
		},
	};

	static part_particles_count = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_particles_count is not implemented");
			// return 0;
		},
	};

	// ## Emitters

	static part_emitter_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_emitter_create is not implemented");
			// return 0;
		},
	};

	static part_emitter_destroy = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_emitter_destroy is not implemented");
			// return 0;
		},
	};

	static part_emitter_destroy_all = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_emitter_destroy_all is not implemented");
			// return 0;
		},
	};

	static part_emitter_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_emitter_exists is not implemented");
			// return 0;
		},
	};

	static part_emitter_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_emitter_clear is not implemented");
			// return 0;
		},
	};

	static part_emitter_region = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_emitter_region is not implemented");
			// return 0;
		},
	};

	static part_emitter_burst = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_emitter_burst is not implemented");
			// return 0;
		},
	};

	static part_emitter_stream = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_emitter_stream is not implemented");
			// return 0;
		},
	};

	// ## Attractors

	static part_attractor_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_attractor_create is not implemented");
			// return 0;
		},
	};

	static part_attractor_destroy = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_attractor_destroy is not implemented");
			// return 0;
		},
	};

	static part_attractor_destroy_all = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_attractor_destroy_all is not implemented");
			// return 0;
		},
	};

	static part_attractor_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_attractor_exists is not implemented");
			// return 0;
		},
	};

	static part_attractor_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_attractor_clear is not implemented");
			// return 0;
		},
	};

	static part_attractor_position = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_attractor_position is not implemented");
			// return 0;
		},
	};

	static part_attractor_force = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_attractor_force is not implemented");
			// return 0;
		},
	};

	// ## Destroyers

	static part_destroyer_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_destroyer_create is not implemented");
			// return 0;
		},
	};

	static part_destroyer_destroy = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_destroyer_destroy is not implemented");
			// return 0;
		},
	};

	static part_destroyer_destroy_all = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_destroyer_destroy_all is not implemented");
			// return 0;
		},
	};

	static part_destroyer_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_destroyer_exists is not implemented");
			// return 0;
		},
	};

	static part_destroyer_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_destroyer_clear is not implemented");
			// return 0;
		},
	};

	static part_destroyer_region = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_destroyer_region is not implemented");
			// return 0;
		},
	};

	// ## Deflectors

	static part_deflector_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_deflector_create is not implemented");
			// return 0;
		},
	};

	static part_deflector_destroy = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_deflector_destroy is not implemented");
			// return 0;
		},
	};

	static part_deflector_destroy_all = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_deflector_destroy_all is not implemented");
			// return 0;
		},
	};

	static part_deflector_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_deflector_exists is not implemented");
			// return 0;
		},
	};

	static part_deflector_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_deflector_clear is not implemented");
			// return 0;
		},
	};

	static part_deflector_region = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_deflector_region is not implemented");
			// return 0;
		},
	};

	static part_deflector_kind = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_deflector_kind is not implemented");
			// return 0;
		},
	};

	static part_deflector_friction = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_deflector_friction is not implemented");
			// return 0;
		},
	};

	// ## Changers

	static part_changer_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_changer_create is not implemented");
			// return 0;
		},
	};

	static part_changer_destroy = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_changer_destroy is not implemented");
			// return 0;
		},
	};

	static part_changer_destroy_all = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_changer_destroy_all is not implemented");
			// return 0;
		},
	};

	static part_changer_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_changer_exists is not implemented");
			// return 0;
		},
	};

	static part_changer_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_changer_clear is not implemented");
			// return 0;
		},
	};

	static part_changer_region = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_changer_region is not implemented");
			// return 0;
		},
	};

	static part_changer_types = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_changer_types is not implemented");
			// return 0;
		},
	};

	static part_changer_kind = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_changer_kind is not implemented");
			// return 0;
		},
	};

	// ## Firework example  // no functions

	// # Multiplayer games

	// ## Setting up a connection

	static mplay_init_ipx = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_init_ipx is not implemented");
			// return 0;
		},
	};

	static mplay_init_tcpip = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_init_tcpip is not implemented");
			// return 0;
		},
	};

	static mplay_init_modem = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_init_modem is not implemented");
			// return 0;
		},
	};

	static mplay_init_serial = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_init_serial is not implemented");
			// return 0;
		},
	};

	static mplay_connect_status = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_connect_status is not implemented");
			// return 0;
		},
	};

	static mplay_end = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_end is not implemented");
			// return 0;
		},
	};

	static mplay_ipaddress = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_ipaddress is not implemented");
			// return 0;
		},
	};

	// ## Creating and joining sessions

	static mplay_session_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_session_create is not implemented");
			// return 0;
		},
	};

	static mplay_session_find = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_session_find is not implemented");
			// return 0;
		},
	};

	static mplay_session_name = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_session_name is not implemented");
			// return 0;
		},
	};

	static mplay_session_join = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_session_join is not implemented");
			// return 0;
		},
	};

	static mplay_session_mode = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_session_mode is not implemented");
			// return 0;
		},
	};

	static mplay_session_status = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_session_status is not implemented");
			// return 0;
		},
	};

	static mplay_session_end = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_session_end is not implemented");
			// return 0;
		},
	};

	// ## Players

	static mplay_player_find = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_player_find is not implemented");
			// return 0;
		},
	};

	static mplay_player_name = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_player_name is not implemented");
			// return 0;
		},
	};

	static mplay_player_id = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_player_id is not implemented");
			// return 0;
		},
	};

	// ## Shared data

	static mplay_data_write = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_data_write is not implemented");
			// return 0;
		},
	};

	static mplay_data_read = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_data_read is not implemented");
			// return 0;
		},
	};

	static mplay_data_mode = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_data_mode is not implemented");
			// return 0;
		},
	};

	// ## Messages

	static mplay_message_send = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_message_send is not implemented");
			// return 0;
		},
	};

	static mplay_message_send_guaranteed = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_message_send_guaranteed is not implemented");
			// return 0;
		},
	};

	static mplay_message_receive = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_message_receive is not implemented");
			// return 0;
		},
	};

	static mplay_message_id = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_message_id is not implemented");
			// return 0;
		},
	};

	static mplay_message_value = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_message_value is not implemented");
			// return 0;
		},
	};

	static mplay_message_player = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_message_player is not implemented");
			// return 0;
		},
	};

	static mplay_message_name = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_message_name is not implemented");
			// return 0;
		},
	};

	static mplay_message_count = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_message_count is not implemented");
			// return 0;
		},
	};

	static mplay_message_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function mplay_message_clear is not implemented");
			// return 0;
		},
	};

	// # Using DLL's

	static external_define = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_define is not implemented");
			// return 0;
		},
	};

	static external_call = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_call is not implemented");
			// return 0;
		},
	};

	static external_free = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_free is not implemented");
			// return 0;
		},
	};

	// static execute_string ([str]) {} // repeated
	// static execute_file ([_]) {} // repeated

	static window_handle = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function window_handle is not implemented");
			// return 0;
		},
	};

	// # 3D Graphics

	// ## Going to 3D mode

	static d3d_start = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_start is not implemented");
			// return 0;
		},
	};

	static d3d_end = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_end is not implemented");
			// return 0;
		},
	};

	static d3d_set_hidden = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_set_hidden is not implemented");
			// return 0;
		},
	};

	static d3d_set_perspective = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_set_perspective is not implemented");
			// return 0;
		},
	};

	// ## Easy drawing

	static d3d_set_depth = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_set_depth is not implemented");
			// return 0;
		},
	};

	// ## Drawing polygons in 3D

	static d3d_primitive_begin = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_primitive_begin is not implemented");
			// return 0;
		},
	};

	static d3d_vertex = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_vertex is not implemented");
			// return 0;
		},
	};

	static d3d_vertex_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_vertex_color is not implemented");
			// return 0;
		},
	};

	static d3d_primitive_end = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_primitive_end is not implemented");
			// return 0;
		},
	};

	static d3d_primitive_begin_texture = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_primitive_begin_texture is not implemented");
			// return 0;
		},
	};

	static d3d_vertex_texture = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_vertex_texture is not implemented");
			// return 0;
		},
	};

	static d3d_vertex_texture_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_vertex_texture_color is not implemented");
			// return 0;
		},
	};

	// static d3d_primitive_end ([_]) {} // repeated

	static d3d_set_culling = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_set_culling is not implemented");
			// return 0;
		},
	};

	// ## Drawing basic shapes

	static d3d_draw_block = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_draw_block is not implemented");
			// return 0;
		},
	};

	static d3d_draw_cylinder = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_draw_cylinder is not implemented");
			// return 0;
		},
	};

	static d3d_draw_cone = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_draw_cone is not implemented");
			// return 0;
		},
	};

	static d3d_draw_ellipsoid = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_draw_ellipsoid is not implemented");
			// return 0;
		},
	};

	static d3d_draw_wall = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_draw_wall is not implemented");
			// return 0;
		},
	};

	static d3d_draw_floor = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_draw_floor is not implemented");
			// return 0;
		},
	};

	// ## Viewing the world

	static d3d_set_projection = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_set_projection is not implemented");
			// return 0;
		},
	};

	static d3d_set_projection_ext = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_set_projection_ext is not implemented");
			// return 0;
		},
	};

	static d3d_set_projection_ortho = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_set_projection_ortho is not implemented");
			// return 0;
		},
	};

	static d3d_set_projection_perspective = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_set_projection_perspective is not implemented");
			// return 0;
		},
	};

	// ## Transformations

	static d3d_transform_set_identity = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_set_identity is not implemented");
			// return 0;
		},
	};

	static d3d_transform_set_translation = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_set_translation is not implemented");
			// return 0;
		},
	};

	static d3d_transform_set_scaling = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_set_scaling is not implemented");
			// return 0;
		},
	};

	static d3d_transform_set_rotation_x = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_set_rotation_x is not implemented");
			// return 0;
		},
	};

	static d3d_transform_set_rotation_y = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_set_rotation_y is not implemented");
			// return 0;
		},
	};

	static d3d_transform_set_rotation_z = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_set_rotation_z is not implemented");
			// return 0;
		},
	};

	static d3d_transform_set_rotation_axis = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_set_rotation_axis is not implemented");
			// return 0;
		},
	};

	static d3d_transform_add_translation = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_add_translation is not implemented");
			// return 0;
		},
	};

	static d3d_transform_add_scaling = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_add_scaling is not implemented");
			// return 0;
		},
	};

	static d3d_transform_add_rotation_x = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_add_rotation_x is not implemented");
			// return 0;
		},
	};

	static d3d_transform_add_rotation_y = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_add_rotation_y is not implemented");
			// return 0;
		},
	};

	static d3d_transform_add_rotation_z = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_add_rotation_z is not implemented");
			// return 0;
		},
	};

	static d3d_transform_add_rotation_axis = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_add_rotation_axis is not implemented");
			// return 0;
		},
	};

	static d3d_transform_stack_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_stack_clear is not implemented");
			// return 0;
		},
	};

	static d3d_transform_stack_empty = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_stack_empty is not implemented");
			// return 0;
		},
	};

	static d3d_transform_stack_push = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_stack_push is not implemented");
			// return 0;
		},
	};

	static d3d_transform_stack_pop = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_stack_pop is not implemented");
			// return 0;
		},
	};

	static d3d_transform_stack_top = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_stack_top is not implemented");
			// return 0;
		},
	};

	static d3d_transform_stack_discard = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_transform_stack_discard is not implemented");
			// return 0;
		},
	};

	// ## Fog

	static d3d_set_fog = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_set_fog is not implemented");
			// return 0;
		},
	};

	// ## Lighting

	static d3d_set_lighting = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_set_lighting is not implemented");
			// return 0;
		},
	};

	static d3d_set_shading = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_set_shading is not implemented");
			// return 0;
		},
	};

	static d3d_light_define_direction = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_light_define_direction is not implemented");
			// return 0;
		},
	};

	static d3d_light_define_point = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_light_define_point is not implemented");
			// return 0;
		},
	};

	static d3d_light_enable = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_light_enable is not implemented");
			// return 0;
		},
	};

	static d3d_vertex_normal = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_vertex_normal is not implemented");
			// return 0;
		},
	};

	static d3d_vertex_normal_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_vertex_normal_color is not implemented");
			// return 0;
		},
	};

	static d3d_vertex_normal_texture = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_vertex_normal_texture is not implemented");
			// return 0;
		},
	};

	static d3d_vertex_normal_texture_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_vertex_normal_texture_color is not implemented");
			// return 0;
		},
	};

	// ## Creating models

	static d3d_model_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_create is not implemented");
			// return 0;
		},
	};

	static d3d_model_destroy = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_destroy is not implemented");
			// return 0;
		},
	};

	static d3d_model_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_clear is not implemented");
			// return 0;
		},
	};

	static d3d_model_save = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_save is not implemented");
			// return 0;
		},
	};

	static d3d_model_load = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_load is not implemented");
			// return 0;
		},
	};

	static d3d_model_draw = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_draw is not implemented");
			// return 0;
		},
	};

	static d3d_model_primitive_begin = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_primitive_begin is not implemented");
			// return 0;
		},
	};

	static d3d_model_vertex = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_vertex is not implemented");
			// return 0;
		},
	};

	static d3d_model_vertex_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_vertex_color is not implemented");
			// return 0;
		},
	};

	static d3d_model_vertex_texture = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_vertex_texture is not implemented");
			// return 0;
		},
	};

	static d3d_model_vertex_texture_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_vertex_texture_color is not implemented");
			// return 0;
		},
	};

	static d3d_model_vertex_normal = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_vertex_normal is not implemented");
			// return 0;
		},
	};

	static d3d_model_vertex_normal_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_vertex_normal_color is not implemented");
			// return 0;
		},
	};

	static d3d_model_vertex_normal_texture = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_vertex_normal_texture is not implemented");
			// return 0;
		},
	};

	static d3d_model_vertex_normal_texture_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_vertex_normal_texture_color is not implemented");
			// return 0;
		},
	};

	static d3d_model_primitive_end = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_primitive_end is not implemented");
			// return 0;
		},
	};

	static d3d_model_block = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_block is not implemented");
			// return 0;
		},
	};

	static d3d_model_cylinder = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_cylinder is not implemented");
			// return 0;
		},
	};

	static d3d_model_cone = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_cone is not implemented");
			// return 0;
		},
	};

	static d3d_model_ellipsoid = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_ellipsoid is not implemented");
			// return 0;
		},
	};

	static d3d_model_wall = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_wall is not implemented");
			// return 0;
		},
	};

	static d3d_model_floor = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function d3d_model_floor is not implemented");
			// return 0;
		},
	};

	// ## Final words  // no functions

	// # Action functions

	// (arguments, relative)

	// ## move

	// ### Move

	static action_move = {
		args: null,
		func: function([directions, speed], relative) {
			const values = parseArrowString(directions);

			const angles = [
				225, 270, 315,
				180, null, 0,
				135, 90, 45,
			];

			const possibleAngles = [];

			for (let i = 0; i < 9; ++i) {
				if (values[i]) {
					possibleAngles.push(angles[i]);
				}
			}

			const chosenAngle = possibleAngles[Math.floor( this.game.rng() * possibleAngles.length )];

			if (chosenAngle != null) {
				speed = (!relative ? speed : this.currentInstance.speed + speed);
				this.currentInstance.setDirectionAndSpeed(chosenAngle, speed);
			} else {
				this.currentInstance.setDirectionAndSpeed(this.currentInstance.direction, 0);
			}

			return 0;
		},
	};

	static action_set_motion = {
		args: null,
		func: function([direction, speed], relative) {
			if (!relative) {
				BuiltInFunctions.motion_set.func.call(this, [direction, speed]);
			} else {
				BuiltInFunctions.motion_add.func.call(this, [direction, speed]);
			}
			return 0;
		},
	};

	static action_move_point = {
		args: null,
		func: function([x, y, speed], relative) {
		// If not relative: x - instance.x (you subtract to make instance the center)
		// If relative: x - instance.x + instance.x == x
			if (!relative) {
				x -= this.currentInstance.x;
				y -= this.currentInstance.y;
			}

			this.currentInstance.setDirectionAndSpeed(Math.atan2(-y, x) * (180 / Math.PI), speed);
			return 0;
		},
	};

	static action_set_hspeed = {
		args: null,
		func: function([horSpeed], relative) {
			horSpeed = (!relative ? horSpeed : this.currentInstance.hSpeed + horSpeed);
			this.currentInstance.setHspeedAndVspeed(horSpeed, this.currentInstance.vSpeed);
			return 0;
		},
	};

	static action_set_vspeed = {
		args: null,
		func: function([vertSpeed], relative) {
			vertSpeed = (!relative ? vertSpeed : this.currentInstance.vSpeed + vertSpeed);
			this.currentInstance.setHspeedAndVspeed(this.currentInstance.hSpeed, vertSpeed);
			return 0;
		},
	};

	static action_set_gravity = {
		args: null,
		func: function([direction, gravity], relative) {
			direction = (!relative ? direction : this.currentInstance.gravityDirection + direction);
			this.currentInstance.gravityDirection = direction;
			gravity = (!relative ? gravity : this.currentInstance.gravity + gravity);
			this.currentInstance.gravity = gravity;
			return 0;
		},
	};

	static action_reverse_xdir = {
		args: null,
		func: function([]) {
			this.currentInstance.setHspeedAndVspeed(-this.currentInstance.hSpeed, this.currentInstance.vSpeed);
			return 0;
		},
	};

	static action_reverse_ydir = {
		args: null,
		func: function([]) {
			this.currentInstance.setHspeedAndVspeed(this.currentInstance.hSpeed, -this.currentInstance.vSpeed);
			return 0;
		},
	};

	static action_set_friction = {
		args: null,
		func: function([friction], relative) {
			friction = (!relative ? friction : this.currentInstance.friction + friction);
			this.currentInstance.friction = friction;
			return 0;
		},
	};

	// ### Jump

	static action_move_to = {
		args: null,
		func: function([x, y], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);
			this.currentInstance.x = x;
			this.currentInstance.y = y;
			return 0;
		},
	};

	static action_move_start = {
		args: null,
		func: function([]) {
			this.currentInstance.x = this.currentInstance.xStart;
			this.currentInstance.y = this.currentInstance.yStart;
			return 0;
		},
	};

	static action_move_random = {
		args: null,
		func: function([snapHor, snapVert]) {
			BuiltInFunctions.move_random.func.call(this, [snapHor, snapVert]);
			return 0;
		},
	};

	static action_snap = {
		args: null,
		func: function([snapHor, snapVert]) {
			BuiltInFunctions.move_snap.func.call(this, [snapHor, snapVert]);
			return 0;
		},
	};

	static action_wrap = {
		args: null,
		func: function([direction]) {
			const horizontal = (direction == 0 || direction == 2);
			const vertical = (direction == 1 || direction == 2);

			const image = this.currentInstance.getMaskImage();
			const spriteW = image?.width ?? 0;
			const spriteH = image?.height ?? 0;

			if (horizontal) {
				const x = this.currentInstance.x;
				if (x >= this.game.room.width && this.currentInstance.hSpeed > 0) {
					this.currentInstance.x = x - this.game.room.width - spriteW;
				} else
				if (x < 0 && this.currentInstance.hSpeed < 0) {
					this.currentInstance.x = this.game.room.width + x + spriteW;
				}
			}

			if (vertical) {
				const y = this.currentInstance.y;
				if (y >= this.game.room.height && this.currentInstance.vSpeed > 0) {
					this.currentInstance.y = y - this.game.room.height - spriteH;
				} else
				if (y < 0 && this.currentInstance.vSpeed < 0) {
					this.currentInstance.y = this.game.room.height + y + spriteH;
				}
			}

			return 0;
		},
	};

	static action_move_contact = {
		args: null,
		func: function([direction, maximum, against]) {
			if (against == 0) {
				BuiltInFunctions.move_contact_solid.func.call(this, [direction, maximum]);
			} else if (against == 1) {
				BuiltInFunctions.move_contact_all.func.call(this, [direction, maximum]);
			}
			return 0;
		},
	};

	static action_bounce = {
		args: null,
		func: function([precise, against]) {
			if (against == 0) {
				BuiltInFunctions.move_bounce_solid.func.call(this, [precise]);
			} else if (against == 1) {
				BuiltInFunctions.move_bounce_all.func.call(this, [precise]);
			}
			return 0;
		},
	};

	// ### Paths

	static action_path = {
		args: null,
		func: function([path, speed, atEnd, relative]) {
			BuiltInFunctions.path_start.func.call(this, [path, speed, atEnd, relative==1]);
			return 0;
		},
	};

	static action_path_end = {
		args: null,
		func: function([]) {
			BuiltInFunctions.path_end.func.call(this, []);
			return 0;
		},
	};

	static action_path_position = {
		args: null,
		func: function([position], relative) {
			if (!relative) {
				this.currentInstance.pathPosition = position;
			} else {
				this.currentInstance.pathPosition += position;
			}
			return 0;
		},
	};

	static action_path_speed = {
		args: null,
		func: function([speed], relative) {
			if (!relative) {
				this.currentInstance.pathSpeed = speed;
			} else {
				this.currentInstance.pathSpeed += speed;
			}
			return 0;
		},
	};

	// ### Steps

	static action_linear_step = {
		args: null,
		func: function([x, y, speed, stopAt], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);
			BuiltInFunctions.mp_linear_step.func.call(this, [x, y, speed, stopAt == 0]);
			return 0;
		},
	};

	static action_potential_step = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_potential_step is not implemented");
			// return 0;
		},
	};

	// ## main1

	// ### Objects

	static action_create_object = {
		args: null,
		func: async function([object, x, y], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);

			await BuiltInFunctions.instance_create.func.call(this, [x, y, object]);

			return 0;
		},
	};

	static action_create_object_motion = {
		args: null,
		func: async function([object, x, y, speed, direction], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);

			const objectResource = this.game.project.getResourceById("ProjectObject", object);
			if (objectResource == null) {
				throw this.game.makeError({text: `Creating instance for non-existing object: ${object}`});
			}

			const instance = this.game.instanceCreateNoEvents(null, x, y, object);
			instance.setDirectionAndSpeed(direction, speed);

			await this.game.events.runEventOfInstance("create", null, instance);

			return 0;
		},
	};

	static action_create_object_random = {
		args: null,
		func: async function([object1, object2, object3, object4, x, y], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);

			const objects = [object1, object2, object3, object4].filter(x => x >= 0);

			if (objects.length > 0) {
				const object = objects[Math.floor(this.game.rng() * objects.length)];
				await BuiltInFunctions.instance_create.func.call(this, [x, y, object]);
			}

			return 0;
		},
	};

	static action_change_object = {
		args: null,
		func: async function([changeInto, performEvents]) {
			await BuiltInFunctions.instance_change.func.call(this, [changeInto, performEvents == 1]);
			return 0;
		},
	};

	static action_kill_object = {
		args: null,
		func: async function([]) {
			await BuiltInFunctions.instance_destroy.func.call(this, []);
			return 0;
		},
	};

	static action_kill_position = {
		args: null,
		func: async function([x, y], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);

			await BuiltInFunctions.position_destroy.func.call(this, [x, y]);
			return 0;
		},
	};

	/// ### Sprite

	static action_sprite_set = {
		args: null,
		func: function([sprite, subimage, speed]) {
			this.currentInstance.spriteIndex = sprite;
			this.currentInstance.sprite = this.game.project.getResourceById("ProjectSprite", sprite);
			if (subimage != -1) {
				this.currentInstance.imageIndex = subimage;
			}
			this.currentInstance.imageSpeed = speed;
			return 0;
		},
	};

	static action_sprite_transform = {
		args: null,
		func: function([xscale, yscale, angle, mirror]) {
			const mirrorX = (mirror == 1 || mirror == 3);
			const mirrorY = (mirror == 2 || mirror == 3);
			if (mirrorX) xscale = -xscale;
			if (mirrorY) yscale = -yscale;

			this.currentInstance.imageXScale = xscale;
			this.currentInstance.imageYScale = yscale;
			this.currentInstance.imageAngle = angle;

			return 0;
		},
	};

	static action_sprite_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_sprite_color is not implemented");
			// return 0;
		},
	};

	/// ### Sounds

	static action_sound = {
		args: null,
		func: function([sound, loop]) {
			if (loop == 0) {
				BuiltInFunctions.sound_play.func.call(this, [sound]);
			} else if (loop == 1) {
				BuiltInFunctions.sound_loop.func.call(this, [sound]);
			}
			return 0;
		},
	};

	static action_end_sound = {
		args: null,
		func: function([sound]) {
			BuiltInFunctions.sound_stop.func.call(this, [sound]);
			return 0;
		},
	};

	static action_if_sound = {
		args: null,
		func: function([sound]) {
			return BuiltInFunctions.sound_isplaying.func.call(this, [sound]);
		},
	};

	/// ### Rooms

	static action_previous_room = {
		args: null,
		func: function([transition]) { // eslint-disable-line no-unused-vars
		// TODO transition
			BuiltInFunctions.room_goto_previous.func.call(this, []);
			return 0;
		},
	};

	static action_next_room = {
		args: null,
		func: function([transition]) { // eslint-disable-line no-unused-vars
		// TODO transition
			BuiltInFunctions.room_goto_next.func.call(this, []);
			return 0;
		},
	};

	static action_current_room = {
		args: null,
		func: function([transition]) { // eslint-disable-line no-unused-vars
		// TODO transition
			BuiltInFunctions.room_restart.func.call(this, []);
			return 0;
		},
	};

	static action_another_room = {
		args: null,
		func: function([newRoom, transition]) { // eslint-disable-line no-unused-vars
			// TODO transition
			this.game.loadRoomAtStepStop(newRoom);
			return 0;
		},
	};

	static action_if_previous_room = {
		args: null,
		func: function([]) {
			return (BuiltInFunctions.room_previous.func.call(this, [this.game.room.resource.id]) != -1) ? 1 : 0;
		},
	};

	static action_if_next_room = {
		args: null,
		func: function([]) {
			return (BuiltInFunctions.room_next.func.call(this, [this.game.room.resource.id]) != -1) ? 1 : 0;
		},
	};

	// ## main2

	// ### Timing

	static action_set_alarm = {
		args: null,
		func: function([numberOfSteps, inAlarmNo], relative) {
			numberOfSteps = forceInteger(numberOfSteps);
			numberOfSteps = (!relative ? numberOfSteps : this.currentInstance.alarms[inAlarmNo] + numberOfSteps);
			this.currentInstance.alarms[inAlarmNo] = numberOfSteps;
			return 0;
		},
	};

	static action_sleep = {
		args: null,
		func: async function([milliseconds, redraw]) {
		// TODO read with redraw
			if (redraw) {
			//
			}
			await BuiltInFunctions.sleep.func.call(this, [milliseconds]);
			return 0;
		},
	};

	static action_set_timeline = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_set_timeline is not implemented");
			// return 0;
		},
	};

	static action_timeline_set = {
		args: null,
		func: function([timeline, position, start, loop]) {
			this.currentInstance.timelineIndex = timeline;
			this.currentInstance.timeline = this.game.project.getResourceById("ProjectTimeline", timeline);

			this.currentInstance.timelinePosition = position;

			this.currentInstance.timelineRunning = (start == 0);
			this.currentInstance.timelineLoop = (loop == 1);
			return 0;
		},
	};

	static action_set_timeline_position = {
		args: null,
		func: function([position], relative) {
			if (!relative) {
				this.currentInstance.timelinePosition = position;
			} else {
				this.currentInstance.timelinePosition += position;
			}
			return 0;
		},
	};

	static action_set_timeline_speed = {
		args: null,
		func: function([speed], relative) {
			if (!relative) {
				this.currentInstance.timelineSpeed = speed;
			} else {
				this.currentInstance.timelineSpeed += speed;
			}
			return 0;
		},
	};

	static action_timeline_start = {
		args: null,
		func: function([]) {
			this.currentInstance.timelineRunning = true;
			return 0;
		},
	};

	static action_timeline_pause = {
		args: null,
		func: function([]) {
			this.currentInstance.timelineRunning = false;
			return 0;
		},
	};

	static action_timeline_stop = {
		args: null,
		func: function([]) {
			this.currentInstance.timelineRunning = false;
			this.currentInstance.timelinePosition = 0;
			return 0;
		},
	};

	// ### Info

	static action_message = {
		args: null,
		func: function([message]) {
			BuiltInFunctions.show_message.func.call(this, [message]);
			return 0;
		},
	};

	static action_show_info = {
		args: null,
		func: async function([]) {
			await BuiltInFunctions.show_info.func.call(this, []);
			return 0;
		},
	};

	static action_show_video = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_show_video is not implemented");
			// return 0;
		},
	};

	static action_splash_text = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_splash_text is not implemented");
			// return 0;
		},
	};

	static action_splash_image = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_splash_image is not implemented");
			// return 0;
		},
	};

	static action_splash_web = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_splash_web is not implemented");
			// return 0;
		},
	};

	static action_splash_video = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_splash_video is not implemented");
			// return 0;
		},
	};

	static action_splash_settings = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_splash_settings is not implemented");
			// return 0;
		},
	};

	// ### Game

	static action_restart_game = {
		args: null,
		func: function([]) {
			BuiltInFunctions.game_restart.func.call(this, []);
			return 0;
		},
	};

	static action_end_game = {
		args: null,
		func: function([]) {
			BuiltInFunctions.game_end.func.call(this, []);
			return 0;
		},
	};

	static action_save_game = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_save_game is not implemented");
			// return 0;
		},
	};

	static action_load_game = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_load_game is not implemented");
			// return 0;
		},
	};

	// ### Resources

	static action_replace_sprite = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_replace_sprite is not implemented");
			// return 0;
		},
	};

	static action_replace_sound = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_replace_sound is not implemented");
			// return 0;
		},
	};

	static action_replace_background = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_replace_background is not implemented");
			// return 0;
		},
	};

	// ## control

	// ### Questions

	static action_if_empty = {
		args: null,
		func: function([x, y, objects], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);
			if (objects == 0) { // Only solid
				return BuiltInFunctions.place_free.func.call(this, [x, y]);
			} else if (objects == 1) { // All
				return BuiltInFunctions.place_empty.func.call(this, [x, y]);
			}
			return 0;
		},
	};

	static action_if_collision = {
		args: null,
		func: function([x, y, objects], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);
			if (objects == 0) { // Only solid
				return !(BuiltInFunctions.place_free.func.call(this, [x, y]));
			} else if (objects == 1) { // All
				return !(BuiltInFunctions.place_empty.func.call(this, [x, y]));
			}
			return 0;
		},
	};

	static action_if_object = {
		args: null,
		func: function([object, x, y], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);
			return BuiltInFunctions.place_meeting.func.call(this, [x, y, object]);
		},
	};

	static action_if_number = {
		args: null,
		func: function([object, number, operation]) {
			const result = BuiltInFunctions.instance_number.func.call(this, [object]);
			if (operation == 0) { // Equal to
				return (result === number) ? 1 : 0;
			} else if (operation == 1) { // Smaller than
				return (result < number) ? 1 : 0;
			} else if (operation == 2) { // Larger than
				return (result > number) ? 1 : 0;
			}
			return 0;
		},
	};

	static action_if_dice = {
		args: null,
		func: function([sides]) {
			return ((this.game.rng() * sides) < 1) ? 1 : 0;
		},
	};

	static action_if_question = {
		args: null,
		func: function([question]) {
			return BuiltInFunctions.show_question.func.call(this, [question]);
		},
	};

	static action_if = {
		args: null,
		func: function([expression]) {
			return expression;
		},
	};

	static action_if_mouse = {
		args: null,
		func: function([button]) {
			return BuiltInFunctions.mouse_check_button.func.call(this, [button]);
		},
	};

	static action_if_aligned = {
		args: null,
		func: function([snapHor, snapVert]) {
			return BuiltInFunctions.place_snapped.func.call(this, [snapHor, snapVert]);
		},
	};

	// ### Other

	static action_inherited = {
		args: null,
		func: function([]) {
			return BuiltInFunctions.event_inherited.func.call(this, []);
		},
	};

	// ### Code

	static action_execute_script = {
		args: null,
		func: function([script, argument0, argument1, argument2, argument3, argument4]) {
			const scriptResource = this.game.project.getResourceById("ProjectScript", script);

			if (scriptResource) {
				return this.execute(this.game.loadedProject.gmlCache.get(scriptResource), this.currentInstance, this.currentOther,
					[argument0, argument1, argument2, argument3, argument4]);
			}
			return 0;
		},
	};

	// ### Variables

	static action_if_variable = {
		args: null,
		func: function([variable, value, operation]) {
			if (typeof variable !== typeof value) {
				throw this.game.makeError({text: `Cannot compare arguments. (${variable} has a different type than ${value})`});
			}

			switch (operation) {
			case 0: // equal to
				return (variable == value) ? 1 : 0;
			case 1: // smaller than
				return (variable < value) ? 1 : 0;
			case 2: // larger than
				return (variable > value) ? 1 : 0;
			}

			return 0;
		},
	};

	static action_draw_variable = {
		args: null,
		func: function([variable, x, y], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);
			BuiltInFunctions.draw_text.func.call(this, [x, y, variable]);
			return 0;
		},
	};

	// ## score

	// ### Score

	static action_set_score = {
		args: null,
		func: function([newScore], relative) {
			this.game.score = (!relative ? newScore : this.game.score + newScore);
			return 0;
		},
	};

	static action_if_score = {
		args: null,
		func: function([value, operation]) {
			const score = this.game.score;
			switch (operation) {
			case 0: // equal to
				return (score === value) ? 1 : 0;
			case 1: // smaller than
				return (score < value) ? 1 : 0;
			case 2: // larger than
				return (score > value) ? 1 : 0;
			}
			return 0;
		},
	};

	static action_draw_score = {
		args: null,
		func: function([x, y, caption], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);
			BuiltInFunctions.draw_text.func.call(this, [x, y, `${caption}${this.game.score}`]);
			return 0;
		},
	};

	static action_highscore_show = {
		args: null,
		func: async function([background, border, newColor, otherColor, font]) {
			this.game.windows.highscoreBackground = this.game.project.getResourceById("ProjectBackground", background);
			this.game.windows.highscoreBorder = (border == 1);
			this.game.windows.highscoreNewColor = decimalToHex(newColor);
			this.game.windows.highscoreOtherColor = decimalToHex(otherColor);

			const f = this.game.windows.highscoreFont;
			[f.name, f.size, , f.bold, f.italic, f.underline, f.strike] = font.split(",");

			await BuiltInFunctions.highscore_show.func.call(this, [this.game.score]);

			return 0;
		},
	};

	static action_highscore_clear = {
		args: null,
		func: function([]) {
			BuiltInFunctions.highscore_clear.func.call(this, []);
			return 0;
		},
	};

	// ### Lives

	static action_set_life = {
		args: null,
		func: async function([newLives], relative) {
			await this.game.setLives(!relative ? newLives : this.game.lives + newLives);
			return 0;
		},
	};

	static action_if_life = {
		args: null,
		func: function([value, operation]) {
			const lives = this.game.lives;
			switch (operation) {
			case 0: // equal to
				return (lives === value) ? 1 : 0;
			case 1: // smaller than
				return (lives < value) ? 1 : 0;
			case 2: // larger than
				return (lives > value) ? 1 : 0;
			}
			return 0;
		},
	};

	static action_draw_life = {
		args: null,
		func: function([x, y, caption], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);
			BuiltInFunctions.draw_text.func.call(this, [x, y, `${caption}${this.game.lives}`]);
			return 0;
		},
	};

	static action_draw_life_images = {
		args: null,
		func: function([x, y, image], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);

			const spriteImage = this.game.project.getResourceById("ProjectSprite", image)?.images[0];
			if (!spriteImage) return 0;

			for (let i=0; i<this.game.lives; ++i) {
				this.game.render.drawImageExt(spriteImage.image, x + (i * spriteImage.width), y);
			}

			return 0;
		},
	};

	// ### Health

	static action_set_health = {
		args: null,
		func: async function([value], relative) {
			await this.game.setHealth(!relative ? value : this.game.health + value);
			return 0;
		},
	};

	static action_if_health = {
		args: null,
		func: function([value, operation]) {
			const health = this.game.health;
			switch (operation) {
			case 0: // equal to
				return (health === value) ? 1 : 0;
			case 1: // smaller than
				return (health < value) ? 1 : 0;
			case 2: // larger than
				return (health > value) ? 1 : 0;
			}
			return 0;
		},
	};

	static action_draw_health = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_draw_health is not implemented");
			// return 0;
		},
	};

	static action_set_caption = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_set_caption is not implemented");
			// return 0;
		},
	};

	// ## extra

	// ### Particles

	static action_partsyst_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_partsyst_create is not implemented");
			// return 0;
		},
	};

	static action_partsyst_destroy = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_partsyst_destroy is not implemented");
			// return 0;
		},
	};

	static action_partsyst_clear = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_partsyst_clear is not implemented");
			// return 0;
		},
	};

	static action_parttype_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_parttype_create is not implemented");
			// return 0;
		},
	};

	static action_parttype_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_parttype_color is not implemented");
			// return 0;
		},
	};

	static action_parttype_life = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_parttype_life is not implemented");
			// return 0;
		},
	};

	static action_parttype_speed = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_parttype_speed is not implemented");
			// return 0;
		},
	};

	static action_parttype_gravity = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_parttype_gravity is not implemented");
			// return 0;
		},
	};

	static action_parttype_secondary = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_parttype_secondary is not implemented");
			// return 0;
		},
	};

	static action_partemit_create = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_partemit_create is not implemented");
			// return 0;
		},
	};

	static action_partemit_destroy = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_partemit_destroy is not implemented");
			// return 0;
		},
	};

	static action_partemit_burst = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_partemit_burst is not implemented");
			// return 0;
		},
	};

	static action_partemit_stream = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_partemit_stream is not implemented");
			// return 0;
		},
	};

	// ### CD

	static action_cd_play = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_cd_play is not implemented");
			// return 0;
		},
	};

	static action_cd_stop = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_cd_stop is not implemented");
			// return 0;
		},
	};

	static action_cd_pause = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_cd_pause is not implemented");
			// return 0;
		},
	};

	static action_cd_resume = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_cd_resume is not implemented");
			// return 0;
		},
	};

	static action_cd_present = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_cd_present is not implemented");
			// return 0;
		},
	};

	static action_cd_playing = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_cd_playing is not implemented");
			// return 0;
		},
	};

	// ### Other

	static action_set_cursor = {
		args: null,
		func: function([sprite, cursor]) {
			this.game.render.cursorSprite = this.game.project.getResourceById("ProjectSprite", sprite);

			if (cursor == 0) {
				this.game.render.canvas.classList.add("no-cursor");
			} else if (cursor == 1) {
				this.game.render.canvas.classList.remove("no-cursor");
			}
			return 0;
		},
	};

	static action_webpage = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_webpage is not implemented");
			// return 0;
		},
	};

	// ## draw

	// ### Drawing

	static action_draw_sprite = {
		args: null,
		func: function([sprite, x, y, subimage], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);
			subimage = (subimage != -1) ? subimage : this.currentInstance.imageIndex;
			BuiltInFunctions.draw_sprite.func.call(this, [sprite, subimage, x, y]);
			return 0;
		},
	};

	static action_draw_background = {
		args: null,
		func: function([background, x, y, tiled], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);
			if (tiled == 1) {
				BuiltInFunctions.draw_background_tiled.func.call(this, [background, x, y]);
			} else {
				BuiltInFunctions.draw_background.func.call(this, [background, x, y]);
			}
			return 0;
		},
	};

	static action_draw_text = {
		args: null,
		func: function([text, x, y], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);
			BuiltInFunctions.draw_text.func.call(this, [x, y, text]);
			return 0;
		},
	};

	static action_draw_text_transformed = {
		args: null,
		func: function([text, x, y, xscale, yscale, angle], relative) {
			x = (!relative ? x : this.currentInstance.x + x);
			y = (!relative ? y : this.currentInstance.y + y);
			BuiltInFunctions.draw_text_transformed.func.call(this, [x, y, text, xscale, yscale, angle]);
			return 0;
		},
	};

	static action_draw_rectangle = {
		args: null,
		func: function([x1, y1, x2, y2, filled], relative) {
			x1 = (!relative ? x1 : this.currentInstance.x + x1);
			y1 = (!relative ? y1 : this.currentInstance.y + y1);
			x2 = (!relative ? x2 : this.currentInstance.x + x2);
			y2 = (!relative ? y2 : this.currentInstance.y + y2);
			BuiltInFunctions.draw_rectangle.func.call(this, [x1, y1, x2, y2, filled]); // 0=filled, 1=outline
			return 0;
		},
	};

	static action_draw_gradient_hor = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_draw_gradient_hor is not implemented");
			// return 0;
		},
	};

	static action_draw_gradient_vert = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_draw_gradient_vert is not implemented");
			// return 0;
		},
	};

	static action_draw_ellipse = {
		args: null,
		func: function([x1, y1, x2, y2, filled], relative) {
			x1 = (!relative ? x1 : this.currentInstance.x + x1);
			y1 = (!relative ? y1 : this.currentInstance.y + y1);
			x2 = (!relative ? x2 : this.currentInstance.x + x2);
			y2 = (!relative ? y2 : this.currentInstance.y + y2);
			BuiltInFunctions.draw_ellipse.func.call(this, [x1, y1, x2, y2, filled]); // 0=filled, 1=outline
			return 0;
		},
	};

	static action_draw_ellipse_gradient = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_draw_ellipse_gradient is not implemented");
			// return 0;
		},
	};

	static action_draw_line = {
		args: null,
		func: function([x1, y1, x2, y2], relative) {
			x1 = (!relative ? x1 : this.currentInstance.x + x1);
			y1 = (!relative ? y1 : this.currentInstance.y + y1);
			x2 = (!relative ? x2 : this.currentInstance.x + x2);
			y2 = (!relative ? y2 : this.currentInstance.y + y2);
			BuiltInFunctions.draw_line.func.call(this, [x1, y1, x2, y2]);
			return 0;
		},
	};

	static action_draw_arrow = {
		args: null,
		func: function([x1, y1, x2, y2, tipSize], relative) {
			x1 = (!relative ? x1 : this.currentInstance.x + x1);
			y1 = (!relative ? y1 : this.currentInstance.y + y1);
			x2 = (!relative ? x2 : this.currentInstance.x + x2);
			y2 = (!relative ? y2 : this.currentInstance.y + y2);
			BuiltInFunctions.draw_line.func.call(this, [x1, y1, x2, y2, tipSize]);
			return 0;
		},
	};

	// ### Settings

	static action_color = {
		args: null,
		func: function([color]) {
			BuiltInFunctions.draw_set_color.func.call(this, [color]);
			return 0;
		},
	};

	static action_font = {
		args: null,
		func: function([font, align]) {
			BuiltInFunctions.draw_set_font.func.call(this, [font]);
			BuiltInFunctions.draw_set_halign.func.call(this, [align]); // 0=left, 1=center, 2=right
			return 0;
		},
	};

	static action_fullscreen = {
		args: null,
		func: async function([action]) {
			if (action == 0) { // switch
				await this.game.render.setFullscreen(!this.game.render.getFullscreen());
			} else if (action == 1) { // window
				await this.game.render.setFullscreen(false);
			} else if (action == 2) { // fullscreen
				await this.game.render.setFullscreen(true);
			}
			return 0;
		},
	};

	// ### Other

	static action_snapshot = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_snapshot is not implemented");
			// return 0;
		},
	};

	static action_effect = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function action_effect is not implemented");
			// return 0;
		},
	};

	// # Undocumented functions

	static background_name = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function background_name is not implemented");
			// return 0;
		},
	};

	static external_call0 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_call0 is not implemented");
			// return 0;
		},
	};

	static external_call1 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_call1 is not implemented");
			// return 0;
		},
	};

	static external_call2 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_call2 is not implemented");
			// return 0;
		},
	};

	static external_call3 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_call3 is not implemented");
			// return 0;
		},
	};

	static external_call4 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_call4 is not implemented");
			// return 0;
		},
	};

	static external_call5 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_call5 is not implemented");
			// return 0;
		},
	};

	static external_call6 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_call6 is not implemented");
			// return 0;
		},
	};

	static external_call7 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_call7 is not implemented");
			// return 0;
		},
	};

	static external_call8 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_call8 is not implemented");
			// return 0;
		},
	};

	static external_define0 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_define0 is not implemented");
			// return 0;
		},
	};

	static external_define1 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_define1 is not implemented");
			// return 0;
		},
	};

	static external_define2 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_define2 is not implemented");
			// return 0;
		},
	};

	static external_define3 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_define3 is not implemented");
			// return 0;
		},
	};

	static external_define4 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_define4 is not implemented");
			// return 0;
		},
	};

	static external_define5 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_define5 is not implemented");
			// return 0;
		},
	};

	static external_define6 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_define6 is not implemented");
			// return 0;
		},
	};

	static external_define7 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_define7 is not implemented");
			// return 0;
		},
	};

	static external_define8 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function external_define8 is not implemented");
			// return 0;
		},
	};

	static file_close = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_close is not implemented");
			// return 0;
		},
	};

	static file_eof = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_eof is not implemented");
			// return 0;
		},
	};

	static file_eoln = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_eoln is not implemented");
			// return 0;
		},
	};

	static file_open_append = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_open_append is not implemented");
			// return 0;
		},
	};

	static file_open_read = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_open_read is not implemented");
			// return 0;
		},
	};

	static file_open_write = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_open_write is not implemented");
			// return 0;
		},
	};

	static file_read_real = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_read_real is not implemented");
			// return 0;
		},
	};

	static file_read_string = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_read_string is not implemented");
			// return 0;
		},
	};

	static file_readln = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_readln is not implemented");
			// return 0;
		},
	};

	static file_write_real = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_write_real is not implemented");
			// return 0;
		},
	};

	static file_write_string = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_write_string is not implemented");
			// return 0;
		},
	};

	static file_writeln = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function file_writeln is not implemented");
			// return 0;
		},
	};

	static font_get_size = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function font_get_size is not implemented");
			// return 0;
		},
	};

	static font_name = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function font_name is not implemented");
			// return 0;
		},
	};

	static instance_sprite = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function instance_sprite is not implemented");
			// return 0;
		},
	};

	static make_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function make_color is not implemented");
			// return 0;
		},
	};

	static max3 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function max3 is not implemented");
			// return 0;
		},
	};

	static min3 = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function min3 is not implemented");
			// return 0;
		},
	};

	static move_bounce = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function move_bounce is not implemented");
			// return 0;
		},
	};

	static move_contact = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function move_contact is not implemented");
			// return 0;
		},
	};

	static object_name = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function object_name is not implemented");
			// return 0;
		},
	};

	static part_type_alpha = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_alpha is not implemented");
			// return 0;
		},
	};

	static part_type_color = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function part_type_color is not implemented");
			// return 0;
		},
	};

	static path_name = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function path_name is not implemented");
			// return 0;
		},
	};

	static room_name = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function room_name is not implemented");
			// return 0;
		},
	};

	static script_name = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function script_name is not implemented");
			// return 0;
		},
	};

	static show_image = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function show_image is not implemented");
			// return 0;
		},
	};

	static show_text = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function show_text is not implemented");
			// return 0;
		},
	};

	static show_video = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function show_video is not implemented");
			// return 0;
		},
	};

	static sound_name = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sound_name is not implemented");
			// return 0;
		},
	};

	static sprite_name = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function sprite_name is not implemented");
			// return 0;
		},
	};

	static texture_exists = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function texture_exists is not implemented");
			// return 0;
		},
	};

	static tile_delete_at = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_delete_at is not implemented");
			// return 0;
		},
	};

	static tile_find = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function tile_find is not implemented");
			// return 0;
		},
	};

	static timeline_name = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function timeline_name is not implemented");
			// return 0;
		},
	};

	/*
	static _ = {
		args: null,
		func: function([_]) {
			throw new EngineException("Function _ is not implemented");
			// return 0;
		},
	};
	*/

	static __WEBGM_debugger = {
		args: [],
		func: function([]) {
			debugger; // eslint-disable-line no-debugger
			return 0;
		},
	};

	static __WEBGM_javascript = {
		args: [{type: "string"}, {type: "any", infinite: true}],
		func: async function([f, ...args]) {
			const AsyncFunction = async function() {}.constructor; // eslint-disable-line func-names
			const result = await (new AsyncFunction(f).call(this, ...args));
			if (typeof result == "number" || typeof result == "string") {
				return result;
			}
			return 0;
		},
	};
}