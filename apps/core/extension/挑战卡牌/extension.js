import { lib, game, ui, get, ai, _status } from "noname";

const extensionInfo = await lib.init.promises.json(`${lib.assetURL}extension/挑战卡牌/info.json`);
let extensionPackage = {
	name: "挑战卡牌",
	config: {},
	content: function () {},
	help: {},
	package: {},
	precontent: function() {
		if(get.mode()!='boss'&&get.mode()!='guozhan'){
			var boss_mode_card_pack = {
				name:'boss_mode_card_pile',
				connect:true,
				card:{
					sw_juechenjinge: {
						image: "image/mode/boss/card/juechenjinge.png",
						type: "equip",
						subtype: "equip3",
						bingzhu: ["曹操"],
						fullskin: true,
						distance: {
							globalTo: 1,
						},
						skills: ["sw_juechenjinge"],
						ai: {
							equipValue(card, player) {
								if (player.hp != player.maxHp) return 5;
								if (player.hasSkill("guixin")) return 9;
								return 0;
							},
							basic: {
								equipValue: 0,
							},
						},
					},
					huyi: {
						image: "ext:挑战卡牌/image/card/huyi.png",
						fullskin: true,
						type: "equip",
						subtype: "equip1",
						bingzhu: ["徐荣"],
						distance: {
							attackFrom: -2,
						},
						skills: ["huyi_skill"],
						ai: {
							equipValue: 5,
						},
					},
					huyi_skill: {
						equipSkill: true,
						trigger: {
							source: "damageBegin2",
						},
						filter(event) {
							return event.card && event.card.name == "sha" && event.hasNature("linked");
						},
						direct: true,
						content() {
							"step 0";
							player
							.chooseTarget(get.prompt2("huyi"), [1, 2], (card, player, target) => {
								return !target.isLinked();
							})
							.set("ai", target => {
								var att = get.attitude(_status.event.player, target);
								if (att > 0) att /= 1.2;
								return Math.abs(att);
							});
							"step 1";
							if (result.bool) {
								var targets = result.targets.sortBySeat();
								targets.forEach(i => i.link(true));
							}
						},
					},
				},
				skill:{
					sw_juechenjinge: {
						trigger: { player: "damageBegin" },
						forced: true,
						filter(event, player) {
							return event.num % 2 == 1;
						},
						async content(event, trigger, player) {
							await player.recover();
							trigger.num++;
						},
						_priority: 0,
					},
					huyi_skill: {
						equipSkill: true,
						trigger: {
							source: "damageBegin2",
						},
						filter(event) {
							return event.card && event.card.name == "sha" && event.hasNature("linked");
						},
						direct: true,
						content() {
							"step 0";
							player
							.chooseTarget(get.prompt2("huyi"), [1, 2], (card, player, target) => {
								return !target.isLinked();
							})
							.set("ai", target => {
								var att = get.attitude(_status.event.player, target);
								if (att > 0) att /= 1.2;
								return Math.abs(att);
							});
							"step 1";
							if (result.bool) {
								var targets = result.targets.sortBySeat();
								targets.forEach(i => i.link(true));
							}
						},
					},
				},
				translate:{
					sw_juechenjinge: "绝尘金戈",
					sw_juechenjinge_info: "锁定技，①其他角色计算与你的距离时+1；②当你受到伤害时，若伤害值为奇数，你回复一点体力，然后此伤害+1。",
					huyi: "虎翼",
					huyi_skill: "虎翼",
					huyi_info: "你使用【杀】对目标造成属性伤害时，你可以横置至多两名角色。",
				},
				list:[],
			}
			boss_mode_card_pack.list=[
				["spade",5,"guilongzhanyuedao"],
				[get.rand(1,2)==1?"club":"spade",2,"qimenbagua"],//黑桃2或梅花2
				["diamond",1,"chiyanzhenhunqin"],
				["spade",5,"sw_juechenjinge"],
				["spade",6,"chixueqingfeng"],
				["diamond",12,"xiuluolianyuji"],
				["club",4,"xuwangzhimian"],//梅花4
				["spade",2,"longfenghemingjian"],
				["spade",9,"guofengyupao"],//黑桃9
				["heart",13,"qicaishenlu"],//紅心K
				["heart",5,"jinwuluorigong"],
				["diamond",5,"xingtianpojunfu"],
				["club",12,"lingsheji"],
				["spade",13,"shanrangzhaoshu"],

				["diamond",1,"shufazijinguan"],//方塊A
				["diamond",12,"wushuangfangtianji"],
				["spade",2,"linglongshimandai"],
				["club",2,"linglongshimandai"],
				["club",1,"hongmianbaihuapao"],
				["diamond",12,"boss_sanshou"],

				["club",5,"gubuzifeng"],
				["diamond",7,"gubuzifeng"],
				["club",12,"yihuajiemu"],
				["club",13,"yihuajiemu"],
				["heart",7,"sadouchengbing"],
				["heart",8,"sadouchengbing"],
				["heart",9,"sadouchengbing"],
				["heart",11,"sadouchengbing"],

				["spade", 11, "huyi"],
			];
			game.loadModeAsync("boss", function (mode) {
				let boss_mode_javascript_content=mode;
				for(var i=0;i<boss_mode_card_pack.list.length;i++){
					for(var j in boss_mode_javascript_content.card){
						if(j==boss_mode_card_pack.list[i][2]&&boss_mode_card_pack.card[j]==undefined){
							boss_mode_card_pack.card[j]=boss_mode_javascript_content.card[j];
							for(var k in boss_mode_javascript_content.skill){
								if(boss_mode_javascript_content.card[j].skills){
									for(var m=0;m<boss_mode_javascript_content.card[j].skills.length;m++){
										if((k.includes(boss_mode_card_pack.list[i][2])||k.includes(boss_mode_javascript_content.card[j].skills[m]))&&boss_mode_card_pack.skill[k]==undefined){
											boss_mode_card_pack.skill[k]=boss_mode_javascript_content.skill[k];
										}
									}
								} else {
									if(k.includes(boss_mode_card_pack.list[i][2])&&boss_mode_card_pack.skill[k]==undefined){
										boss_mode_card_pack.skill[k]=boss_mode_javascript_content.skill[k];
									}
								}
							}
							for(var k in boss_mode_javascript_content.translate){
								if(boss_mode_javascript_content.card[j].skills){
									for(var m=0;m<boss_mode_javascript_content.card[j].skills.length;m++){
										if((k.includes(boss_mode_card_pack.list[i][2])||k.includes(boss_mode_javascript_content.card[j].skills[m]))&&boss_mode_card_pack.translate[k]==undefined){
											boss_mode_card_pack.translate[k]=boss_mode_javascript_content.translate[k];
										}
									}
								} else {
									if(k.includes(boss_mode_card_pack.list[i][2])&&boss_mode_card_pack.translate[k]==undefined){
										boss_mode_card_pack.translate[k]=boss_mode_javascript_content.translate[k];
									}
								}
							}
						}
					}
				}
				game.import('card',function(lib,game,ui,get,ai,_status){
					return boss_mode_card_pack;
				});
				lib.translate['boss_mode_card_pile_card_config']='挑战卡牌';
				lib.config.all.cards.push('boss_mode_card_pile');
				if(!lib.config.cards.includes('boss_mode_card_pile')) lib.config.cards.push('boss_mode_card_pile');
			});
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