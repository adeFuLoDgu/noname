import { lib, game, ui, get, ai, _status } from "noname";
import characters from "../character/character.js";

export function content(config, pack) {
	if (lib.rank) {
		const rank = {
			bp: ["wdb_hanlong", "wdb_liuzan", "wdb_yangyi"],
			b: ["wdb_feishi", "wdb_liufu", "wdb_liuyan", "wdb_tianyu", "wdb_zaozhirenjun"],
			bm: ["wdb_xizhenxihong"],
		};
		for (let i in rank) {
			lib.rank[i].addArray(rank[i]);
		}
		if (lib.rank.rarity) {
			const rarity = {
				rare: ["wdb_feishi", "wdb_hanlong", "wdb_liufu", "wdb_liuyan", "wdb_liuzan", "wdb_tianyu", "wdb_xizhenxihong", "wdb_yangyi", "wdb_zaozhirenjun"],
			};
			for (let i in rarity) {
				lib.rank.rarity[i].addArray(rarity[i]);
			}
		}
	}
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
	}
}
