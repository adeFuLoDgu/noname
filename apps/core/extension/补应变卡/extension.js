import { lib, game, ui, get, ai, _status } from "noname";

const extensionInfo = await lib.init.promises.json(`${lib.assetURL}extension/补应变卡/info.json`);
let extensionPackage = {
	name: "补应变卡",
	config: {},
	content: function () {},
	help: {},
	package: {},
	precontent: function() {
		let load_cards = false;
		if (lib.config.cards.includes("yingbian")) {
			load_cards = true;
			lib.config.cards.remove("standard");
			lib.config.cards.remove("extra");
			game.saveConfig("cards", lib.config.cards);
		}
		if (!lib.config.connect_cards.includes("yingbian")) {
			load_cards = true;
			lib.config.connect_cards.add("standard");
			lib.config.connect_cards.add("extra");
			game.saveConfig("connect_cards", lib.config.connect_cards);
		}
		if (load_cards) {
			let add_deleted_yinbian_card_pile = {
				name:'add_deleted_yinbian_card_pile',
				connect:true,
				card:{
				},
				skill:{
				},
				translate:{
				},
				list:[],
			}
			add_deleted_yinbian_card_pile.list=[
				["heart", 2, "huogong"],
				["heart", 3, "huogong"],
				["diamond", 12, "huogong"],
				["diamond", 1, "zhuque"],
				["club", 1, "baiyin"],
				["diamond", 12, "fangtian"],
				["heart", 7, "wuzhong"],
				["heart", 8, "wuzhong"],
				["heart", 9, "wuzhong"],
				["heart", 11, "wuzhong"],
				["club", 12, "jiedao"],
				["club", 13, "jiedao"],
				["spade", 2, "hanbing"],
			];
			game.import('card',function(lib,game,ui,get,ai,_status){
				return add_deleted_yinbian_card_pile;
			});
			lib.translate['add_deleted_yinbian_card_pile_card_config']='补应变卡';
			lib.config.all.cards.push('add_deleted_yinbian_card_pile');
			if(!lib.config.cards.includes('add_deleted_yinbian_card_pile')) lib.config.cards.push('add_deleted_yinbian_card_pile');
		}
	},
	files: { character: [], card: [], skill: [], audio: [] },
	editable:false,
};

Object.keys(extensionInfo)
	.filter(key => key !== "name")
	.forEach(key => {
		extensionPackage.package[key] = extensionInfo[key];
	});

game.import("extension", function(lib, game, ui, get, ai, _status) {
	return extensionPackage;
});