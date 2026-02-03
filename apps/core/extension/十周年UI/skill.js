'use strict';
decadeModule.import((lib, game, ui, get, ai, _status) => {
	const skillMap = {
		guanxing:{
			content: function() {
				'step 0'
				if (player.isUnderControl()) {
					game.modeSwapPlayer(player);
				}
				
				var num = Math.min(5, game.countPlayer());
				if (player.hasSkill('yizhi') && player.hasSkill('guanxing')) {
					num = 5;
				}
				var player = event.player;
				if(player.isUnderControl()) game.modeSwapPlayer(player);
				
				var cards = get.cards(num);
				var guanXing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				game.broadcast(function(player, cards){
					if (!window.decadeUI) return;
					decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				}, player, cards);
				
				event.switchToAuto = function(){
					var cards = guanXing.cards[0].concat();
					var cheats = [];
					var judges = player.node.judges.childNodes;

					if (judges.length) {
						cheats = decadeUI.get.cheatJudgeCards(cards, judges, true);
					}
					
					if (cards.length && cheats.length == judges.length) {
						for (var i = 0; i >= 0 && i < cards.length; i++) {
							if (get.value(cards[i], player) >= 5) {
								cheats.push(cards[i]);
								cards.splice(i, 1)
							}
						}
					}
					
					var time = 500;
					for (var i = 0; i < cheats.length; i++) {
						setTimeout(function(card, index, finished){
							guanXing.move(card, index, 0);
							if (finished) guanXing.finishTime(1000);
						}, time, cheats[i], i, (i >= cheats.length - 1) && cards.length == 0);
						time += 500;
					}
					
					for (var i = 0; i < cards.length; i++) {
						setTimeout(function(card, index, finished){
							guanXing.move(card, index, 1);
							if (finished) guanXing.finishTime(1000);
						}, time, cards[i], i, (i >= cards.length - 1));
						time += 500;
					}
				};
				
				if (event.isOnline()) {
					event.player.send(function(){
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);
					
					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				'step 1'
				player.popup(get.cnNumber(event.num1) + '上' + get.cnNumber(event.num2) + '下');
				game.log(player, '将' + get.cnNumber(event.num1) + '张牌置于牌堆顶，' + get.cnNumber(event.num2) +'张牌置于牌堆底');
				game.updateRoundNumber()
			},
		},
		reguanxing:{
			content:function(){
				'step 0'
				var player = event.player;
				if(player.isUnderControl()) game.modeSwapPlayer(player);
				
				var cards = get.cards(game.countPlayer() < 4 ? 3 : 5);
				var guanXing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				game.broadcast(function(player, cards){
					if (!window.decadeUI) return;
					decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				}, player, cards);
				
				event.switchToAuto = function(){
					var cheats = [];
					var cards = guanXing.cards[0].concat();
					var judges;
					
					var next = player.getNext();
					var friend = player;
					if (event.triggername == 'phaseJieshuBegin') {
						friend = next;
						judges = friend.node.judges.childNodes;
						if (get.attitude(player, friend) < 0) friend = null;
					} else {
						judges = player.node.judges.childNodes;
					}
					
					if (judges.length) {
						cheats = decadeUI.get.cheatJudgeCards(cards, judges, friend != null);
					}
						
					if (cards.length && cheats.length == judges.length) {
						for (var i = 0; i >= 0 && i < cards.length; i++) {
							if (friend) {
								if (get.value(cards[i], friend) >= 5) {
									cheats.push(cards[i]);
									cards.splice(i, 1)
								}
							} else {
								if (get.value(cards[i], next) < 4) {
									cheats.push(cards[i]);
									cards.splice(i, 1)
								}
							}
						}
					}
					
					var time = 500;
					for (var i = 0; i < cheats.length; i++) {
						setTimeout(function(card, index, finished){
							guanXing.move(card, index, 0);
							if (finished) guanXing.finishTime(1000);
						}, time, cheats[i], i, (i >= cheats.length - 1) && cards.length == 0);
						time += 500;
					}
					
					for (var i = 0; i < cards.length; i++) {
						setTimeout(function(card, index, finished){
							guanXing.move(card, index, 1);
							if (finished) guanXing.finishTime(1000);
						}, time, cards[i], i, (i >= cards.length - 1));
						time += 500;
					}
				};
				
				if (event.isOnline()) {
					// 判断其他玩家是否有十周年UI，否则直接给他结束，不知道有没有效果
					event.player.send(function(){
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);
					
					// 等待其他玩家操作
					event.player.wait();
					// 暂停主机端游戏
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
					/*
					注释说明
					var guanXing = decadeUI.content.chooseGuanXing(
						控制观星的玩家,            	  	// 必选
						[顶部初始化的牌],            	// 必选，可为null，但底部不能为null
						顶部允许控制的牌数范围,        	// 可选，不填根据初始化的牌数量
						[底部初始化的牌],            	// 必选，可为null，但顶部不能为null
						底部允许控制的牌数范围,        	// 可选，不填根据初始化的牌数量
						第一个参数的玩家是否可见);      	// 可选，不设置则根据控制观星的玩家来显示
					
					// undefined 均为可设置，其他为只读或调用
					var properties = {
						caption: undefined,        	// 设置标题
						header1: undefined,			// 牌堆顶的文字
						header2: undefined,			// 牌堆底的文字
						cards: [[],[]],            	// 获取当前观星的牌，不要瞎改
						callback: undefined,    	// 回调函数，返回 true 表示可以点击【确认】按钮，例：guanXing.callback = function(){ return guanXing.cards[1].length == 1; }
													// 注意：此值一旦设置，观星finish后不会自己置顶牌堆顶和牌堆底，需要自行实现
						infohide: undefined,    	// 设置上面第1个参数的玩家是否可见观星的牌
						confirmed: undefined,		// 是否按下确认按钮
						doubleSwitch: undefined,	// 双击切换牌
						finishTime:function(time),	// 指定的毫秒数后完成观星
						finish:function(),        	// 观星完成，在下一个step 中，可以通过 event.cards1 与 event.cards2 访问观星后的牌
						swap:function(s, t),    	// 交换观星中的两个牌
						switch:function(card),   	// 将观星中的牌切换到另一方
						move:function(card, index, moveDown)	// 移动观星的牌到指定的一方位置
					}
					*/
				}
				'step 1'
				if(event.triggername == 'phaseZhunbeiBegin' && event.num1 == 0) player.addTempSkill('reguanxing_on');
				player.popup(get.cnNumber(event.num1) + '上' + get.cnNumber(event.num2) + '下');
				game.log(player, '将' + get.cnNumber(event.num1) + '张牌置于牌堆顶，' + get.cnNumber(event.num2) +'张牌置于牌堆底');
				game.updateRoundNumber();
			},
		},
		xinfu_zuilun: {
			content:function() {
				'step 0'
				event.num = 0;
				event.cards = get.cards(3);
				if (player.getHistory('lose', function(evt){
					return evt.type == 'discard';
				}).length) event.num++;
				if (!player.isMinHandcard()) event.num++;
				if (!player.getStat('damage')) event.num++;
				'step 1';
				if (event.num == 0) {
					player.gain(event.cards, 'draw');
					event.finish();
					return;
				} 

				var cards = event.cards;
				var gains = cards.length - event.num;
				
				var zuiLun = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, gains);
				zuiLun.caption = '【罪论】';
				zuiLun.header2 = '获得的牌';
				zuiLun.tip = '可获得' + gains + '张牌<br>' + zuiLun.tip;
				zuiLun.callback = function(){
					return this.cards[1].length == gains; 
				};
				
				game.broadcast(function(player, cards, gains, callback){
					if (!window.decadeUI) return;
					var zuiLun = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, gains);
					zuiLun.caption = '【罪论】';
					zuiLun.header2 = '获得的牌';
					zuiLun.tip = '可获得' + gains + '张牌<br>' + zuiLun.tip;
					zuiLun.callback = callback;
				}, player, cards, gains, zuiLun.callback);
				
				var player = event.player;
				event.switchToAuto = function(){
					var cheats = [];
					var cards = zuiLun.cards[0].concat();
					var stopped = false;
					
					var next = player.getNext();
					var hasFriend = get.attitude(player, next) > 0;
					
					// 判断下家是不是队友，令其生效或者失效
					var judges = next.node.judges.childNodes;
					if (judges.length > 0) cheats = decadeUI.get.cheatJudgeCards(cards, judges, hasFriend);
						
					// 如果有【父荫】优先把好牌给队友
					if (hasFriend && player.hasSkill('xinfu_fuyin')) {
						cards = decadeUI.get.bestValueCards(cards, next);
					} else {
						cards.sort(function(a, b){
							return get.value(a, player) - get.value(b, player);
						});
					}
					
					cards = cheats.concat(cards);
					var time = 500;
					var gainNum = gains;
					for (var i = cards.length - 1; i >= 0; i--) {
						setTimeout(function(card, index, finished, moveDown){
							zuiLun.move(card, index, moveDown ? 1 : 0);
							if (finished) zuiLun.finishTime(1000);
						}, time, cards[i], i, i == 0, gainNum > 0);
						time += 500;
						gainNum--;
					}
				};
				
				if (event.isOnline()) {
					event.player.send(function(){
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);
					
					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				'step 2';
				event.cards = event.cards2;
				if (event.result && event.result.bool) {
					var cards = event.cards1;
					var first = ui.cardPile.firstChild;
					for (var i = 0; i < cards.length; i++) {
						ui.cardPile.insertBefore(cards[i], first);
					}
				}
				'step 3';
				game.updateRoundNumber();
				if (event.cards.length) {
					player.gain(event.cards, 'draw');
					event.finish();
				} else {
					player.chooseTarget('请选择一名角色，与其一同失去1点体力', true, function(card, player, target) {
						return target != player;
					}).ai = function(target) {
						return - get.attitude(_status.event.player, target);
					};
				}
				'step 4';
				player.line(result.targets[0], 'fire');
				player.loseHp();
				result.targets[0].loseHp();
			},
		},
		xunxun: {
			content:function(){
				'step 0';
				var cards = get.cards(4);
				var player = event.player;
				var xunxun = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, 2);
				xunxun.caption = '【恂恂】';
				xunxun.header1 = '牌堆底';
				xunxun.header2 = '牌堆顶';
				xunxun.callback = function(){
					return this.cards[0].length == 2 && this.cards[1].length == 2;
				};
				
				game.broadcast(function(player, cards, callback){
					if (!window.decadeUI) return;
					var xunxun = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, 2);
					xunxun.caption = '【恂恂】';
					xunxun.header1 = '牌堆底';
					xunxun.header2 = '牌堆顶';
					xunxun.callback = callback;
				}, player, cards, xunxun.callback);

				event.switchToAuto = function(){
					var cards = decadeUI.get.bestValueCards(xunxun.cards[0].concat(), player);
					var time = 500;
					for (var i = 0; i < 2; i++) {
						setTimeout(function(card, index, finished){
							xunxun.move(card, index, 1);
							if (finished) xunxun.finishTime(1000);
						}, time, cards[i], i, i >= 1);
						time += 500;
					}
				}
				
				if (event.isOnline()) {
					event.player.send(function(){
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);
					
					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				
				'step 1';
				var first = ui.cardPile.firstChild;
				var cards = event.cards2;
				for (var i = 0; i < cards.length; i++) {
					ui.cardPile.insertBefore(cards[i], first);
				}
				
				cards = event.cards1;
				for (var i = 0; i < cards.length; i++) {
					ui.cardPile.appendChild(cards[i]);
				}
			},

		},
		xinfu_dianhua: {
			content:function(){
				'step 0';
				var player = event.player;
				if(player.isUnderControl()) game.modeSwapPlayer(player);
				var num = 0;
				for (var i = 0; i < lib.suit.length; i++) {
					if (player.hasMark('xinfu_falu_' + lib.suit[i])) num++;
				}
				
				var cards = get.cards(num);
				var dianhua = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				dianhua.caption = '【点化】';
				game.broadcast(function(player, cards){
					if (!window.decadeUI) return;
					var dianhua = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
					dianhua.caption = '【点化】';
				}, player, cards);
				
				event.switchToAuto = function(){
					var cards = dianhua.cards[0].concat();
					var cheats = [];
					var judges;
					
					var next = player.getNext();
					var friend = player;
					if (event.triggername == 'phaseJieshuBegin') {
						friend = next;
						judges = friend.node.judges.childNodes;
						if (get.attitude(player, friend) < 0) friend = null;
					} else {
						judges = player.node.judges.childNodes;
					}
					
					if (judges.length) {
						cheats = decadeUI.get.cheatJudgeCards(cards, judges, friend != null);
					}
						
					if (cards.length && cheats.length == judges.length) {
						for (var i = 0; i >= 0 && i < cards.length; i++) {
							if (friend) {
								if (get.value(cards[i], friend) >= 5) {
									cheats.push(cards[i]);
									cards.splice(i, 1);
								}
							} else {
								if (get.value(cards[i], next) < 4) {
									cheats.push(cards[i]);
									cards.splice(i, 1);
								}
							}
						}
					}
					
					var time = 500;
					for (var i = 0; i < cheats.length; i++) {
						setTimeout(function(card, index, finished){
							dianhua.move(card, index, 0);
							if (finished) dianhua.finishTime(1000);
						}, time, cheats[i], i, (i >= cheats.length - 1) && cards.length == 0);
						time += 500;
					}
					
					for (var i = 0; i < cards.length; i++) {
						setTimeout(function(card, index, finished){
							dianhua.move(card, index, 1);
							if (finished) dianhua.finishTime(1000);
						}, time, cards[i], i, (i >= cards.length - 1));
						time += 500;
					}
				};
				
				if (event.isOnline()) {
					event.player.send(function(){
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);
					
					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				'step 1';
				player.popup(get.cnNumber(event.num1) + '上' + get.cnNumber(event.num2) + '下');
				game.log(player, '将' + get.cnNumber(event.num1) + '张牌置于牌堆顶，' + get.cnNumber(event.num2) +'张牌置于牌堆底');
				game.updateRoundNumber();
			},
		},
		zongxuan: {
			content:function() {
				'step 0'
				var cards = [];
				for (var i = 0; i < trigger.cards2.length; i++) {
					var card = trigger.cards2[i];
					if (get.position(card, true) == 'd') {
						cards.push(card);
						clearTimeout(card.timeout);
						card.classList.remove('removing');
						// 防止因为限制结算速度，而导致牌提前进入弃牌堆
					}
				}
				
				if (!cards.length) return;
				var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				dialog.caption = '【纵玄】';
				dialog.header1 = '弃牌堆';
				dialog.header2 = '牌堆顶';
				dialog.lockCardsOrder(0);
				dialog.callback = function(){ return this.cards[1].length > 0; };
				game.broadcast(function(player, cards, callback){
					if (!window.decadeUI) return;
					var zongxuan = decadeUI.content.chooseGuanXing(player, cards, cards.length);
					dialog.caption = '【纵玄】';
					dialog.header1 = '弃牌堆';
					dialog.header2 = '牌堆顶';
					dialog.lockCardsOrder(0);
					dialog.callback = callback;
				}, player, cards, dialog.callback);
				
				event.switchToAuto = function(){
					var parent = event.parent;
					while (parent != null && parent.name != 'phaseDiscard') parent = parent.parent;
					
					var cards = dialog.cards[0].concat();
					var cheats = [];
					var next = player.getNext();
					var hasFriend = get.attitude(player, next) > 0;
					
					if (parent) {
						var hasZhiYan = player.hasSkill('zhiyan');	//如果有【直言】，AI 1000%肯定会用这个技能
						var judges = next.node.judges.childNodes;
						if (judges > 0 && hasZhiYan && cards.length > 1) {
							cheats = decadeUI.get.cheatJudgeCards(cards, judges, hasFriend);
						}
					}
					
					if (cards.length > 0) {
						cards.sort(function(a, b){
							return get.value(b, player) - get.value(a, player);
						});
						cheats.splice(0, 0, cards.shift());
						
						var cost;
						for (var i = 0; i < cards.length; i++) {
							if (hasFriend) {
								if (get.value(cards[i], next) >= 5) cheats.push(cards[i]);
							} else {
								if (get.value(cards[i], next) < 5) cheats.push(cards[i]);
							}
						}
					}
					
					var time = 500;
					for (var i = 0; i < cheats.length; i++) {
						setTimeout(function(card, index, finished){
							dialog.move(card, index, 1);
							if (finished) dialog.finishTime(1000);
						}, time, cheats[i], i, (i >= cheats.length - 1));
						time += 500;
					}
				}
				
				if (event.isOnline()) {
					event.player.send(function(){
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);
					
					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				
				'step 1';
				var first = ui.cardPile.firstChild;
				var cards = event.cards2;
				for (var i = 0; i < cards.length; i++) {
					ui.cardPile.insertBefore(cards[i], first);
				}
				
				cards = event.cards1;
				for (var i = 0; i < cards.length; i++) {
					ui.discardPile.appendChild(cards[i]);
				}
				
				game.log(player, '将' + get.cnNumber(event.num2) + '张牌置于牌堆顶');
			},
		},
		identity_junshi: {
			content:function(){
				"step 0"
				if (player.isUnderControl()) {
					game.modeSwapPlayer(player);
				}
				var num = 3;
				var cards = get.cards(num);
				var guanxing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				guanxing.caption = '【军师】';
				game.broadcast(function(player, cards, callback){
					if (!window.decadeUI) return;
					var guanxing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
					guanxing.caption = '【军师】';
					guanxing.callback = callback;
				}, player, cards, guanxing.callback);
				
				event.switchToAuto = function(){
					var cards = guanxing.cards[0].concat();
					var cheats = [];
					var judges = player.node.judges.childNodes;

					if (judges.length) cheats = decadeUI.get.cheatJudgeCards(cards, judges, true);
					if (cards.length) {
						for (var i = 0; i >= 0 && i < cards.length; i++) {
							if (get.value(cards[i], player) >= 5) {
								cheats.push(cards[i]);
								cards.splice(i, 1);
							}
						}
					}
					
					var time = 500;
					for (var i = 0; i < cheats.length; i++) {
						setTimeout(function(card, index, finished){
							guanxing.move(card, index, 0);
							if (finished) guanxing.finishTime(1000);
						}, time, cheats[i], i, (i >= cheats.length - 1) && cards.length == 0);
						time += 500;
					}
					
					for (var i = 0; i < cards.length; i++) {
						setTimeout(function(card, index, finished){
							guanxing.move(card, index, 1);
							if (finished) guanxing.finishTime(1000);
						}, time, cards[i], i, (i >= cards.length - 1));
						time += 500;
					}
				};
				
				if (event.isOnline()) {
					event.player.send(function(){
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);
					
					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				"step 1";
				player.popup(get.cnNumber(event.num1) + '上' + get.cnNumber(event.num2) + '下');
				game.log(player, '将' + get.cnNumber(event.num1) + '张牌置于牌堆顶，' + get.cnNumber(event.num2) +'张牌置于牌堆底');
				game.updateRoundNumber();
			},
		},
		wuxin:{
			content:function(){
				var num = get.population('qun');
				if (player.hasSkill('huangjintianbingfu')) {
					num += player.getExpansions('huangjintianbingfu').length;
				}
				
				var cards = get.cards(num);
				var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length);
				dialog.caption = '【悟心】';
				game.broadcast(function(player, cards, callback){
					if (!window.decadeUI) return;
					var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length);
					dialog.caption = '【悟心】';
					dialog.callback = callback;
				}, player, cards, dialog.callback);
				
				event.switchToAuto = function(){
					var cards = dialog.cards[0].concat();
					var cheats = [];
					
					var next = player.getNext();
					var friend = player;
					var judges = friend.node.judges.childNodes;
					if (judges.length > 0) cheats = decadeUI.get.cheatJudgeCards(cards, judges, friend != null);
					
					if (friend) {
						cards = decadeUI.get.bestValueCards(cards, friend);
					} else {
						cards.sort(function(a, b){
							return get.value(a, next) - get.value(b, next);
						});
					}

					cards = cheats.concat(cards);
					var time = 500;
					for (var i = 0; i < cards.length; i++) {
						setTimeout(function(card, index, finished){
							dialog.move(card, index, 0);
							if (finished) dialog.finishTime(cards.length <= 1 ? 250 : 1000);
						}, time, cards[i], i, i >= cards.length - 1);
						time += 500;
					}
				};
				
				if (event.isOnline()) {
					event.player.send(function(){
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);
					
					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
			},
		},
		luoying_discard: {
			content: function() {
				"step 0";
				if (trigger.delay == false) game.delay();
				"step 1";
				var cards = [];
				for (var i = 0; i < trigger.cards2.length; i++) {
					var card = trigger.cards2[i];
					if (get.suit(card, trigger.player) == 'club' && get.position(card, true) == 'd') {
						cards.push(card);
						clearTimeout(card.timeout);
						card.classList.remove('removing');
						// 防止因为限制结算速度，而导致牌提前进入弃牌堆
					}
				}
				
				var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length, false);
				dialog.caption = '【落英】';
				dialog.header1 = '弃牌堆';
				dialog.header2 = '获得牌';
				dialog.tip = '请选择要获得的牌';
				dialog.lockCardsOrder(0);
				dialog.callback = function(){ return true; };
				game.broadcast(function(player, cards, callback){
					if (!window.decadeUI) return;
					var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length, false);
					dialog.caption = '【落英】';
					dialog.header1 = '弃牌堆';
					dialog.header2 = '获得牌';
					dialog.tip = '请选择要获得的牌';
					dialog.lockCardsOrder(0);
					dialog.callback = callback;
				}, player, cards, dialog.callback);
				
				event.switchToAuto = function(){
					var cards = dialog.cards[0].concat();
					var time = 500;
					for (var i = 0; i < cards.length; i++) {
						setTimeout(function(card, index, finished){
							dialog.move(card, index, get.value(card, player)<0?0:1);
							if (finished) dialog.finishTime(1000);
						}, time, cards[i], i, i >= cards.length - 1);
						time += 500;
					}
				};
				
				if (event.isOnline()) {
					event.player.send(function(){
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);
					
					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				"step 2";
				game.cardsDiscard(event.cards1);
				if (event.cards2) {
					player.gain(event.cards2, 'gain2', 'log');
				}
			},
		},
		luoying_judge: {
			content: function() {
				"step 0";
				var cards = trigger.cards;
				
				var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length, false);
				dialog.caption = '【落英】';
				dialog.header1 = '弃牌堆';
				dialog.header2 = '获得牌';
				dialog.tip = '请选择要获得的牌';
				dialog.lockCardsOrder(0);
				dialog.callback = function(){ return true; };
				game.broadcast(function(player, cards, callback){
					if (!window.decadeUI) return;
					var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length, false);
					dialog.caption = '【落英】';
					dialog.header1 = '弃牌堆';
					dialog.header2 = '获得牌';
					dialog.tip = '请选择要获得的牌';
					dialog.lockCardsOrder(0);
					dialog.callback = callback;
				}, player, cards, dialog.callback);
				
				event.switchToAuto = function(){
					var cards = dialog.cards[0].concat();
					var time = 500;
					for (var i = 0; i < cards.length; i++) {
						setTimeout(function(card, index, finished){
							dialog.move(card, index, get.value(card, player)<0?0:1);
							if (finished) dialog.finishTime(1000);
						}, time, cards[i], i, i >= cards.length - 1);
						time += 500;
					}
				};
				
				if (event.isOnline()) {
					event.player.send(function(){
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);
					
					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				"step 1";
				game.cardsDiscard(event.cards1);
				if (event.cards2) {
					player.gain(event.cards2, 'gain2', 'log');
				}
			}
		},
	};
	
	const inheritSkillMap = {
		xz_xunxun: {
			content: skillMap.xunxun.content
		},
		reluoying_discard: {
			content: skillMap.luoying_discard.content
		},
		reluoying_judge: {
			content: skillMap.luoying_judge.content
		},
		nk_shekong: {
			content:function(){
				'step 0';
				event.cardsx = cards.slice(0);
				var num = get.cnNumber(cards.length);
				var trans = get.translation(player);
				var prompt = ('弃置' + num + '张牌，然后' + trans + '摸一张牌');
				if (cards.length > 1) prompt += ('；或弃置一张牌，然后' + trans + '摸' + num + '张牌');
				var next = target.chooseToDiscard(prompt, 'he', true);
				next.numx = cards.length;
				next.selectCard = function() {
					if (ui.selected.cards.length > 1) return _status.event.numx;
					return [1, _status.event.numx];
				};
				next.complexCard = true;
				next.ai = function(card) {
					if (ui.selected.cards.length == 0 || (_status.event.player.countCards('he',
					function(cardxq) {
						return get.value(cardxq) < 7;
					}) >= _status.event.numx)) return 7 - get.value(card);
					return - 1;
				};
				'step 1';
				if (result.bool) {
					if (result.cards.length == cards.length) player.draw();
					else player.draw(cards.length);
					event.cardsx.addArray(result.cards);
					for (var i = 0; i < event.cardsx.length; i++) {
						if (get.position(event.cardsx[i]) != 'd') event.cardsx.splice(i--, 1);
					}
				} else event.finish();
				'step 2';
				if (event.cardsx.length) {
					var cards = event.cardsx;
					var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length);
					dialog.caption = '【设控】';
					game.broadcast(function(player, cards, callback){
						if (!window.decadeUI) return;
						var dialog = decadeUI.content.chooseGuanXing(player, cards, cards.length);
						dialog.caption = '【设控】';
						dialog.callback = callback;
					}, player, cards, dialog.callback);
					
					event.switchToAuto = function(){
						var cards = dialog.cards[0].concat();
						var cheats = [];
						var judges;
						
						var next = player.getNext();
						var friend = (get.attitude(player, next) < 0) ? null : next;
						judges = next.node.judges.childNodes;
						
						if (judges.length > 0) cheats = decadeUI.get.cheatJudgeCards(cards, judges, friend != null);
						
						if (friend) {
							cards = decadeUI.get.bestValueCards(cards, friend);
						} else {
							cards.sort(function(a, b){
								return get.value(a, next) - get.value(b, next);
							});
						}

						cards = cheats.concat(cards);
						var time = 500;
						for (var i = 0; i < cards.length; i++) {
							setTimeout(function(card, index, finished){
								dialog.move(card, index, 0);
								if (finished) dialog.finishTime(cards.length <= 1 ? 250 : 1000);
							}, time, cards[i], i, i >= cards.length - 1);
							time += 500;
						}
					};
					
					if (event.isOnline()) {
						event.player.send(function(){
							if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
						}, event.player);
						
						event.player.wait();
						decadeUI.game.wait();
					} else if (!event.isMine()) {
						event.switchToAuto();
					}
				} else event.finish();
			},
		},
		kamome_huanmeng:{
			content:function(){
				"step 0";
				if (player.isUnderControl()) {
					game.modeSwapPlayer(player);
				}
				var num = 1 + player.countCards('e');
				var cards = get.cards(num);
				var guanxing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
				guanxing.caption = '【幻梦】';
				game.broadcast(function(player, cards, callback){
					if (!window.decadeUI) return;
					var guanxing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
					guanxing.caption = '【幻梦】';
					guanxing.callback = callback;
				}, player, cards, guanxing.callback);
				
				event.switchToAuto = function(){
					var cards = guanxing.cards[0].concat();
					var cheats = [];
					var judges = player.node.judges.childNodes;

					if (judges.length) cheats = decadeUI.get.cheatJudgeCards(cards, judges, true);
					if (cards.length) {
						for (var i = 0; i >= 0 && i < cards.length; i++) {
							if (get.value(cards[i], player) >= 5) {
								cheats.push(cards[i]);
								cards.splice(i, 1);
							}
						}
					}
					
					var time = 500;
					for (var i = 0; i < cheats.length; i++) {
						setTimeout(function(card, index, finished){
							guanxing.move(card, index, 0);
							if (finished) guanxing.finishTime(1000);
						}, time, cheats[i], i, (i >= cheats.length - 1) && cards.length == 0);
						time += 500;
					}
					
					for (var i = 0; i < cards.length; i++) {
						setTimeout(function(card, index, finished){
							guanxing.move(card, index, 1);
							if (finished) guanxing.finishTime(1000);
						}, time, cards[i], i, (i >= cards.length - 1));
						time += 500;
					}
				};
				
				if (event.isOnline()) {
					event.player.send(function(){
						if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
					}, event.player);
					
					event.player.wait();
					decadeUI.game.wait();
				} else if (!event.isMine()) {
					event.switchToAuto();
				}
				"step 1";
				player.popup(get.cnNumber(event.num1) + '上' + get.cnNumber(event.num2) + '下');
				game.log(player, '将' + get.cnNumber(event.num1) + '张牌置于牌堆顶，' + get.cnNumber(event.num2) +'张牌置于牌堆底');
				game.updateRoundNumber()
			},
		},
	}
	
	if (!_status.connectMode) {
		Object.keys(skillMap).forEach(key => {
			const skill = lib.skill[key];
			if (!skill) return;
			const decadeUISkill = skillMap[key];
			Object.keys(decadeUISkill).forEach(subKey => skill[subKey] = decadeUISkill[subKey]);
		});
		Object.keys(inheritSkillMap).forEach(key => {
			const skill = lib.skill[key];
			if (!skill) return;
			const decadeUIInheritSkill = inheritSkillMap[key];
			Object.keys(decadeUIInheritSkill).forEach(subKey => skill[subKey] = decadeUIInheritSkill[subKey]);
		});
	}
});

