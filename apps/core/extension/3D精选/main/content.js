import { lib, game, ui, get, ai, _status } from "noname";
import characters from "../character/character.js";

export function content(config, pack) {
	if (lib.characterReplace) {
		for (let i in characters) {
			const name = i.slice(4);
			if (!lib.character[name]) {
				continue;
			}
			if (!lib.characterReplace[name]) {
				lib.characterReplace[name] = [name, i];
			} else {
				lib.characterReplace[name].push(i);
			}
		}
		if (!lib.characterReplace.tw_jianshuo) {
			lib.characterReplace.tw_jianshuo = ["tw_jianshuo", "ddd_jianshuo"];
		} else {
			lib.characterReplace.tw_jianshuo.push("ddd_jianshuo");
		}
	}
}
