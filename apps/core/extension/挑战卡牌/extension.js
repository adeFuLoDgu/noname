game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"挑战卡牌",content:function(config,pack){
	
},precontent:function(){
	if(get.mode()!='boss'&&get.mode()!='guozhan'){
		var boss_mode_card_pack = {
			name:'boss_mode_card_pile',
			connect:true,
			card:{
			},
			skill:{
			},
			translate:{
			},
			list:[],
		}
		boss_mode_card_pack.list=[
			["spade",5,"guilongzhanyuedao"],
			[get.rand(1,2)==1?"club":"spade",2,"qimenbagua"],//黑桃2或梅花2
			["diamond",1,"chiyanzhenhunqin"],
			//["spade",5,"juechenjinge"], //因為隊友問題排除此裝備
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
			
			["club",5,"gubuzifeng"],
			["diamond",7,"gubuzifeng"],
			["club",12,"yihuajiemu"],
			["club",13,"yihuajiemu"],
			["heart",7,"sadouchengbing"],
			["heart",8,"sadouchengbing"],
			["heart",9,"sadouchengbing"],
			["heart",11,"sadouchengbing"],
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
},help:{},config:{},package:{
	character:{
		character:{
		},
		translate:{
		},
	},
	card:{
		card:{
		},
		translate:{
		},
		list:[],
	},
	skill:{
		skill:{
		},
		translate:{
		},
	},
	intro:"神武再世和虎牢关模式卡牌的在其他模式可用（除挑战模式和国战模式）",
	author:"",
	diskURL:"",
	forumURL:"",
	version:"0.2",
},files:{"character":[],"card":[],"skill":[]},editable:false}})