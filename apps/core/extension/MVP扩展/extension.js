game.import("extension", function (lib, game, ui, get, ai, _status) {
	return {
		name: "MVP扩展",
		editable: false,
		content: function (config, pack) {},
		precontent: function (config) {
			"use strict;"
			lib.onover.push(resultbool=>{
				game.broadcastAll(function(){
					var 手杀MVP=function (){
						if(_status.showShoushaMvp) return false;
						_status.showShoushaMvp=true;
						setTimeout(item=>{
							var dialog=Array.from(ui.arena.querySelectorAll(".dialog"));
							dialog.forEach(value => value.hide());
							game.playAudio('..', 'extension', 'MVP扩展','images/asqx.mp3');
							var players=game.players.slice(0);
							game.players=game.players.concat(game.dead);
							if(!_status.showShouSha局势){
								game.players.forEach(value=>{
									if(game.dead.includes(value)){
										value.局势分数-=20;
									}
									value.getEnemies().forEach(current=>{
										if(game.dead.includes(current)||current.isDead()){
											value.局势分数+=2;
										}
									})
									value.getFriends().forEach(current=>{
										if(current.isDead()||game.dead.includes(current))
										value.局势分数-=2;
									})
								})
							}
							_status.showShouSha局势=true;
							game.players=players;
							/**
							* 冒泡排序
							* @param arr
							* @param len
							*/
							var sort=function (arr){
								var temp, len=arr.length;
								var i, j;
								for (i=0; i<len-1; i++) /* 外循环为排序趟数，len个数进行len-1趟 */
								for (j=0; j<len-1-i; j++) { /* 内循环为每趟比较的次数，第i趟比较len-i次 */
									if (arr[j].mvpCount > arr[j+1].mvpCount) { /* 相邻元素比较，若逆序则交换（升序为左大于右，降序反之） */
										temp = arr[j];
										arr[j] = arr[j+1];
										arr[j+1] = temp;
									}
								}
								return arr;
							}
							var sorts=sort(game.players.concat(game.dead)).reverse();
							var player=sorts[0];
							var popuperContainer=ui.create.div('.popup-container',{background:"rgb(0,0,0,.7)"},ui.window);
							popuperContainer.addEventListener('click',event=>{
								event.stopPropagation();
								popuperContainer.delete(200);
								dialog.forEach(value=>value.show());
								_status.showShoushaMvp=false;
							});
							var skills = player.skills.filter(value => lib.skill[value].audio);
							skills.length&&game.trySkillAudio(skills.randomGet(),player,true);
							var qycontainer=ui.create.div('.qy-mvp-container',popuperContainer);

							var backgroundRight=ui.create.div('.qy-mvp-piaodai-right',qycontainer);
							var container=ui.create.div('.qy-center-container',qycontainer);
							var backgroundLeft=ui.create.div('.qy-mvp-piaodai-left',qycontainer);

							var avatarbox=ui.create.div('.qy-mvp-avatarbox',container);
							if(navigator.userAgent.match(/(Android|iPhone|SymbianOS|Windows Phone|iPad|iPod)/i)!==null){
								avatarbox.css({
									height: '120%',
									top: '-4%',
								});
							}
							var avatarborder=ui.create.div('.qy-mvp-avatarborder',avatarbox);
							avatarborder.dataset.name=get.translation(player.name);
							avatarborder.setBackgroundImage(`extension/MVP扩展/images/border_${player.group}.png`);
							var image=new Image();
							image.src=`${lib.assetURL}extension/MVP扩展/images/border_${player.group}.png`;
							image.onerror=function (){
								avatarborder.setBackgroundImage(`extension/MVP扩展/images/border_qun.png`);
							}
							var avatar=ui.create.div('.qy-mvp-avatar',avatarbox);
							avatar.style.backgroundImage=player.node.avatar.style.backgroundImage;
							var qyInfo=ui.create.div('.qy-mvp-qyInfo',container);
							ui.create.div('.qy-mvp-title',qyInfo);
							var qycenter=ui.create.div('.qy-mvp-center',qyInfo);
							var qyIcon=ui.create.div('.qy-mvp-icon',qycenter);
							var qyPlayerInfo=ui.create.div('.qy-player-info',qycenter);
							ui.create.div(qyPlayerInfo,'.qy-mvp-name-title','玩家昵称');
							var nickname=ui.create.div('.qy-mvp-player-nickname',qyPlayerInfo,player===game.me?lib.config.connect_nickname:get.translation(player.name));
							if(game.me===player) ui.create.node('img',nickname).src=lib.assetURL+'extension/MVP扩展/images/mvp_me_tag.png';
							ui.create.div(qyPlayerInfo,'.qy-mvp-name-title',`技术分：${player.mvpCount||0}`);
							var qyScoreInfo=ui.create.div('.qy-mvp-scoreInfo',qyInfo);
							var table=ui.create.node('table',qyScoreInfo,{width:"100%"});
							var list=['攻击分数','治疗分数','辅助分数','局势分数','惩罚扣分'];
							list.forEach(value => {
								var tr=ui.create.node('tr',table);
								tr.style.colo='rgb(234, 138, 76)';
								var td=ui.create.node('td',tr,value);
								var num=(player[value]||0);
								var num2=(sorts[1][value]);
								td=ui.create.node('td',tr).innerHTML=num+(num-num2>=30?'(遥遥领先)':'');
							})
						})
					}
					ui.create.control("手杀MVP",手杀MVP);
					手杀MVP();
				});
			});
			['攻击分数','治疗分数','辅助分数','惩罚扣分'].forEach(value=>{
				HTMLDivElement.prototype[value]=0;
			});
			HTMLDivElement.prototype.局势分数=100;
			Object.defineProperty(HTMLDivElement.prototype,'mvpCount',{
				get:function(){
					return this.攻击分数+this.治疗分数+this.辅助分数+this.局势分数-this.惩罚扣分;
				},
				set:function(){},
			});
			lib.skill['_qy-mvp-effect1']={
				trigger:{
					player:'useCard',
					source:'damageSource',
				},
				direct: true,
				forced: true,
				firstDo: true,
				silent: true,
				popup: false,
				filter:function (event,player,name){
					if (name==='useCard') {
						if (!event.card) return false;
						if (get.tag({name: event.card.name}, 'damage')) return true;
						if (event.card.name==='wuxie') return true;
						if (get.info(event.card).toself||get.type(event.card)!=='trick') return false;
						if (get.info(event.card).selectTarget===-1||get.info(event.card).selectTarget>1) return true;
						return false;
					}
					if(event.player==event.source) return false;
					if(event.source.identity == 'nei') return true;
					return get.attitude(event.source, event.player) < 0;
				},
				content:function (){
					game.broadcastAll(function(event, trigger, player){
						if (event.triggername==='damageSource') {
							if (get.attitude(trigger.source,trigger.player)<0||trigger.source.identity == 'nei') trigger.num>5?trigger.source.攻击分数+=15:trigger.source.攻击分数+=3*trigger.num;
						}else if(trigger.card){
							if (get.tag({name: trigger.card.name}, 'damage'))
							player.攻击分数+=2
							if(trigger.card.name==='wuxie')
							player.辅助分数+=2;
							if((get.info(trigger.card).selectTarget===-1||get.info(trigger.card).selectTarget>1)&&(!get.info(trigger.card).toself&&get.type(trigger.card)==='trick'))
							player.辅助分数+=1;
						}
					}, event, trigger, player);
				}
			}
			lib.skill['_qy-mvp-effect2']={
				trigger:{player:['gainEnd','discardEnd']},
				direct: true,
				forced: true,
				firstDo: true,
				silent: true,
				popup: false,
				filter:function(event,player,name){
					if(name==='gainEnd'){
						if(!event.source||event.source==player||!event.source.isIn()) return false;
						if(!event.cards||event.cards.length==0) return false;
						if(event.source.identity=='nei') return true;
						return event.player.getEnemies().includes(event.source);
					}
					if(name==='discardEnd'){
						if(!event.source||event.source==player||!event.source.isIn()) return false;
						if(!event.cards||event.cards.length==0) return false;
						if(event.source.identity=='nei') return true;
						return event.player.getEnemies().includes(event.source);
					}
				},
				content:function(){
					game.broadcastAll(function(event, trigger){
						if(event.triggername=='gainEnd') trigger.player.辅助分数+=1*trigger.cards.length;
						if(event.triggername=='discardEnd') trigger.source.辅助分数+=1*trigger.cards.length;
					}, event, trigger);
				},
			}
			lib.skill['_qy-mvp-effect3']={
				trigger:{player:'recoverEnd'},
				direct: true,
				forced: true,
				firstDo: true,
				silent: true,
				popup: false,
				filter:function(event,player){
					if(!event.source||!event.source.isIn()) return false;
					if(event.source.identity == 'nei') return true;
					return event.player.getFriends().includes(event.source)||event.player==event.source;
				},
				content:function(){
					game.broadcastAll(function(trigger){
						trigger.num>5?trigger.source.治疗分数+=10:trigger.source.治疗分数+=2*trigger.num;
					}, trigger);
				},
			}
			lib.skill['_qy-mvp-effect4']={
				trigger:{source:'dieBegin'},
				direct: true,
				forced: true,
				firstDo: true,
				silent: true,
				popup: false,
				filter:function(event,player){
					return (event.source&&event.source.isIn());
				},
				content:function(){
					game.broadcastAll(function(trigger){
						if(trigger.player.getFriends().includes(trigger.source)){
							trigger.source.惩罚扣分+=5;
							if(trigger.source.identity == 'nei'&&trigger.player.identity!='zhu'){
								trigger.source.惩罚扣分-=5;
								trigger.source.攻击分数+=3;
							}
						}
						if(trigger.player.getEnemies().includes(trigger.source)){
							trigger.source.攻击分数+=3;
						}
					}, trigger);
				},
			}
			lib.init.css(lib.assetURL+'extension/MVP扩展','extension');
		},
		help: {},
		config: {},
		package: {
			intro: "开启后，游戏结算后可展示手杀MVP界面。",
			author: "",
			diskURL: "",
			forumURL: "",
			version: "0.1",
		},
		files: {
			"character": [],
			"card": [],
			"skill": []
		}
	}
})
