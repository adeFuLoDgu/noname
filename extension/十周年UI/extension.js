/*jshint esversion: 6 */
'use strict';
import {nonameInitialized} from '../../noname/util/index.js';
game.import('extension', async function(lib, game, ui, get, ai, _status){
	const decadeUIName = '十周年UI', decadeUIResolvePath=`${nonameInitialized}extension/${decadeUIName}/`, decadeUIPath = window.decadeUIPath = `${lib.assetURL}extension/${decadeUIName}/`, Mixin = window.Mixin = {
		/**
		 * @overload
		 * @param {string} method
		 * @param {...[string | RegExp | Function][]} args
		 */
		replace(method) {
			method = method.split(/\s*\|\s*/).find(currentMethod => {
				try {
					return eval(`typeof ${currentMethod}`) != 'undefined';
				} catch (error) {
					return false;
				}
			});
			if (!method) return;
			/**
			 * @type {(string | RegExp)[]}
			 */
			const ats = [];
			/**
			 * @type {(string | Function?)[]}
			 */
			const callbacks = [];
			Array.from(arguments).forEach((argument, index) => {
				if (!index) return;
				if (index % 2) ats.push(argument);
				else callbacks.push(argument);
			});
			/**
			 * @type {string}
			 */
			const redirectingMethod = eval(`${method}.toString();`);
			let redirectedMethod = redirectingMethod;
			ats.forEach((at, index) => {
				if (typeof at == 'string' ? !redirectedMethod.includes(at) : !redirectedMethod.match(at)) return;
				const callback = callbacks[index];
				redirectedMethod = redirectedMethod.replace(at, callback ? `\n${callback.toString().replace(/^\W*(function[^{]+\{([\s\S]*)\}|[^=]+=>[^{]*\{([\s\S]*)\}|[^=]+=>\s*([\s\S]*))/i, '$2$3$4').trim()}` : '');
			});
			if (redirectedMethod == redirectingMethod) return;
			const regExpMatchArray = redirectedMethod.match(/^\S+(?=\s*\([\s\S]*?\))/);
			if (regExpMatchArray && regExpMatchArray[0] != 'function') redirectedMethod = redirectedMethod.replace(/^\S+(?=\s*\([\s\S]*?\))/, 'function');
			eval(`${method} = ${redirectedMethod}`);
		}
	};
	const version = '1.2.0.220114.34';
	return {
		name: "十周年UI",
		content:config=>{
			const extension = lib.extensionMenu[`extension_${decadeUIName}`];

			if (!(extension && extension.enable && extension.enable.init)) return;

			lib.arenaReady.push(() => {
				if (ui.roundmenu) ui.roundmenu.style.zIndex = 8;
			});

			switch(lib.config.layout){
				case 'long2':
				case 'nova':
				case 'mobile':break;
				default:
				alert('十周年UI提醒您，请使用<默认>、<手杀>、<新版>布局以获得良好体验（在选项-外观-布局中调整）。');
				break;
			}

			console.time(decadeUIName);
			window.duicfg = config;
			window.dui = window.decadeUI = {
				init:function(){
					this.extensionName = decadeUIName;

					var sensor = decadeUI.element.create('sensor', document.body);
					sensor.id = 'decadeUI-body-sensor';
					this.bodySensor = new decadeUI.ResizeSensor(sensor);

					var SVG_NS = 'http://www.w3.org/2000/svg';
					var svg = document.body.appendChild(document.createElementNS(SVG_NS, 'svg'));
					var defs = svg.appendChild(document.createElementNS(SVG_NS, 'defs'));
					var solo = defs.appendChild(document.createElementNS(SVG_NS, 'clipPath'));
					var duol = defs.appendChild(document.createElementNS(SVG_NS, 'clipPath'));
					var duor = defs.appendChild(document.createElementNS(SVG_NS, 'clipPath'));
					var dskin = defs.appendChild(document.createElementNS(SVG_NS, 'clipPath'));

					solo.id = 'solo-clip';
					duol.id = 'duol-clip';
					duor.id = 'duor-clip';
					dskin.id = 'dskin-clip';

					solo.setAttribute('clipPathUnits', 'objectBoundingBox');
					duol.setAttribute('clipPathUnits', 'objectBoundingBox');
					duor.setAttribute('clipPathUnits', 'objectBoundingBox');
					dskin.setAttribute('clipPathUnits', 'objectBoundingBox');

					var soloPath = solo.appendChild(document.createElementNS(SVG_NS, 'path'));
					var duoLPath = duol.appendChild(document.createElementNS(SVG_NS, 'path'));
					var duoRPath = duor.appendChild(document.createElementNS(SVG_NS, 'path'));

					var dskinPath = dskin.appendChild(document.createElementNS(SVG_NS, 'path'));
					soloPath.setAttribute('d', 'M0 0 H1 Q1 0.05 0.9 0.06 Q1 0.06 1 0.11 V1 H0 V0.11 Q0 0.06 0.1 0.06 Q0 0.05 0 0 Z');
					duoLPath.setAttribute('d', 'M1 0 H0 Q0 0.06 0.15 0.06 Q0 0.06 0 0.11 V1 H1 Z');
					duoRPath.setAttribute('d', 'M0 0 H1 Q1 0.06 0.85 0.06 Q1 0.06 1 0.11 V1 H0 Z');
					dskinPath.setAttribute('d', 'M0 0 H1 Q1 0.1 0.94 0.1 Q0.985 0.1 1 0.13 V1 H0 V0.14 Q0 0.11 0.06 0.1 Q0 0.1 0 0 Z');

					document.addEventListener('click', function(e){ dui.set.activeElement(e.target); }, true);
					this.initOverride();
					return this;
				},
				initOverride:function(){
					function override (dest, src) {
						var ok = true;
						var key;
						for (key in src) {
							if (dest[key]) {
								ok = override(dest[key], src[key]);
								if (ok) {
									dest[key] = src[key];
								}
							} else {
								dest[key] = src[key];
							}
							ok = false;
						}

						return ok;
					};

					function overrides (dest, src) {
						if (!dest._super) dest._super = {};
						for (var key in src) {
							if (dest[key])
							dest._super[key] = dest[key];
							dest[key] = src[key];
						}
					};
					var base = {
						ui:{
							create:{
								cards: ui.create.cards,
								confirm: ui.create.confirm,
								volume: ui.create.volume,
								chat: ui.create.chat,
								menu: ui.create.menu,
								player: ui.create.player,
								selectlist: ui.create.selectlist,
							},

							update: ui.update,
							updatec: ui.updatec,
						},
						get:{
							infoHp: get.infoHp,
							infoMaxHp: get.infoMaxHp,
							objtype: get.objtype,
							skillState: get.skillState,
						},
						game:{
							check: game.check,
							expandSkills: game.expandSkills,
							uncheck: game.uncheck,
							loop: game.loop,
							over: game.over,
							phaseLoop: game.phaseLoop,
							bossPhaseLoop: game.bossPhaseLoop,
							gameDraw: game.gameDraw,
							swapSeat:game.swapSeat,
						},
						lib:{
							element:{
								content:{
									chooseButton: lib.element.content.chooseButton,
									turnOver: lib.element.content.turnOver,
								},

								control:{
									add: lib.element.control.add,
									open: lib.element.control.open,
									close: lib.element.control.close,
								},
							},
						},
					};

					var Game = (function(Game){
						Game.swapSeat = function(player1,player2,prompt,behind,noanimate){
							base.game.swapSeat.apply(this,arguments);
							player1.seat = player1.getSeatNum();
							if(player1.node.seat)player1.node.seat.innerHTML = get.cnNumber(player1.seat, true);
							player2.seat = player2.getSeatNum();
							if(player2.node.seat)player2.node.seat.innerHTML = get.cnNumber(player2.seat, true);
						};
						return Game;
					})({});

					overrides(game, Game);

					var ride = {};
					ride.lib = {
						element:{
							card:{
								updateTransform:function(bool, delay){
									if (delay) {
										var that = this;
										setTimeout(function() {
											that.updateTransform(that.classList.contains('selected'));
										}, delay);
									} else {
										if (_status.event.player != game.me) return;
										if (this._transform && this.parentNode && this.parentNode.parentNode &&
										this.parentNode.parentNode.parentNode == ui.me && (!_status.mousedown || _status.mouseleft)) {
											if (bool) {
												this.style.transform = this._transform + ' translateY(-' + (decadeUI.isMobile() ? 10: 12) + 'px)';
											} else {
												this.style.transform = this._transform || '';
											}
										}
									}
								},
							},

							control:{
								add:function(item){
									var node = document.createElement('div');
									node.link = item;
									node.innerHTML = get.translation(item);
									node.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.control);
									this.appendChild(node);
									this.updateLayout();
								},

								open:function(){
									ui.control.insertBefore(this, _status.createControl || ui.confirm);
									ui.controls.unshift(this);
									return this;
								},

								close:function(){
									this.remove();
									ui.controls.remove(this);
									if(ui.confirm == this) ui.confirm = null;
									if(ui.skills == this)  ui.skills  = null;
									if(ui.skills2 == this) ui.skills2 = null;
									if(ui.skills3 == this) ui.skills3 = null;
								},

								replace:function(){
									var items;
									var index = 0;
									var nodes = this.childNodes;

									if (Array.isArray(arguments[0])) {
										items = arguments[0];
									} else {
										items = arguments;
									}

									this.custom = undefined;

									for (var i = 0; i < items.length; i++){
										if (typeof items[i] == 'function') {
											this.custom = items[i];
										} else {
											if (index < nodes.length) {
												nodes[i].link = items[i];
												nodes[i].innerHTML = get.translation(items[i]);
											} else {
												this.add(items[i]);
											}

											index++;
										}
									}

									while (index < nodes.length) {
										nodes[index].remove();
									}

									this.updateLayout();
									ui.updatec();
									return this;
								},

								updateLayout:function(){
									var nodes = this.childNodes;
									if (nodes.length >= 2) {
										this.classList.add('combo-control');
										for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('control');
									} else {
										this.classList.remove('combo-control');
										if (nodes.length == 1) nodes[0].classList.remove('control');
									}
								},
							},

							player:{
								mark:function(item, info, skill){
									if (get.itemtype(item) == 'cards') {
										var marks = new Array(item.length);
										for (var i = 0; i < item.length; i++) marks.push(this.mark(item[i], info));
										return marks;
									}

									var mark;
									if (get.itemtype(item) == 'card') {
										mark = item.copy('mark');
										mark.suit = item.suit;
										mark.number = item.number;
										if (item.classList.contains('fullborder')) {
											mark.classList.add('fakejudge');
											mark.classList.add('fakemark');
											if (!mark.node.mark) mark.node.mark = mark.querySelector('.mark-text') || decadeUI.element.create('mark-text', mark);
											mark.node.mark.innerHTML = lib.translate[name.name + '_bg'] || get.translation(name.name)[0];
										}
										item = item.name;
									} else {
										mark = ui.create.div('.card.mark');
										var markText = lib.translate[item + '_bg'];
										if (!markText) {
											markText = get.translation(item).substr(0, 2);
											if (decadeUI.config.playerMarkStyle != 'decade') {
												markText = markText[0];
											}
										}
										mark.text = decadeUI.element.create('mark-text', mark);
										if (lib.skill[item] && lib.skill[item].markimage) {
											markText = '　';
											mark.text.style.animation = 'none';
											mark.text.setBackgroundImage(lib.skill[item].markimage);
											mark.text.style['box-shadow'] = 'none';
											mark.text.style.backgroundPosition = 'center';
											mark.text.style.backgroundSize = 'contain';
											mark.text.style.backgroundRepeat = 'no-repeat';
											mark.text.classList.add('before-hidden');
										} else {
											if (markText.length == 2) mark.text.classList.add('small-text');
										}
										if (lib.skill[item] && lib.skill[item].zhuanhuanji) {
											mark.text.style.animation = 'none';
											mark.text.classList.add('before-hidden');
										}
										mark.text.innerHTML = markText;
									}

									mark.name = item;
									mark.skill = skill || item;
									if (typeof info == 'object') {
										mark.info = info;
									} else if (typeof info == 'string') {
										mark.markidentifer = info;
									}

									mark.addEventListener(lib.config.touchscreen ? 'touchend': 'click', ui.click.card);
									if (!lib.config.touchscreen) {
										if (lib.config.hover_all) {
											lib.setHover(mark, ui.click.hoverplayer);
										}
										if (lib.config.right_info) {
											mark.oncontextmenu = ui.click.rightplayer;
										}
									}

									this.node.marks.appendChild(mark);
									this.updateMarks();
									ui.updatem(this);
									return mark;
								},

								markCharacter:function(name, info, learn, learn2){
									if (typeof name == 'object') name = name.name;

									var nodeMark = ui.create.div('.card.mark');
									var nodeMarkText = ui.create.div('.mark-text', nodeMark);

									if (!info) info = {};
									if (!info.name) info.name = get.translation(name);
									if (!info.content) info.content = get.skillintro(name, learn, learn2);

									if (name.startsWith('unknown')) {
										nodeMarkText.innerHTML = get.translation(name)[0];
									} else {
										if (!lib.character[name]) return console.error(name);
										var text = info.name.substr(0, 2);
										if (text.length == 2) nodeMarkText.classList.add('small-text');
										nodeMarkText.innerHTML = text;
									}

									nodeMark.name = name + '_charactermark';
									nodeMark.info = info;
									nodeMark.addEventListener(lib.config.touchscreen ? 'touchend': 'click', ui.click.card);
									if (!lib.config.touchscreen) {
										if (lib.config.hover_all) {
											lib.setHover(nodeMark, ui.click.hoverplayer);
										}
										if (lib.config.right_info) {
											nodeMark.oncontextmenu = ui.click.rightplayer;
										}
									}

									this.node.marks.appendChild(nodeMark);
									ui.updatem(this);
									return nodeMark;
								},

								playDynamic:function(animation, deputy){
									deputy = deputy === true;
									if (animation == undefined) return console.error('playDynamic: 参数1不能为空');
									var dynamic = this.dynamic;
									if (!dynamic) {
										dynamic = new duilib.DynamicPlayer('assets/dynamic/');
										dynamic.dprAdaptive = true;
										this.dynamic = dynamic;
										this.$dynamicWrap.appendChild(dynamic.canvas);
									} else {
										if (deputy && dynamic.deputy) {
											dynamic.stop(dynamic.deputy);
											dynamic.deputy = null;
										} else if (!deputy&&dynamic.primary) {
											dynamic.stop(dynamic.primary);
											dynamic.primary = null;
										}
									}

									if (typeof animation == 'string') animation = { name: animation };
									if (this.doubleAvatar) {
										if (Array.isArray(animation.x)) {
											animation.x = animation.x.concat();
											animation.x[1] += deputy ? 0.25 : -0.25;
										} else {
											if (animation.x == undefined) {
												animation.x = [0, deputy ? 0.75 : 0.25];
											} else {
												animation.x = [animation.x, deputy ? 0.25 : -0.25];
											}
										}
										animation.clip = {
											x: [0, deputy ? 0.5 : 0],
											y: 0,
											width: [0, 0.5],
											height:[0, 1],
											clipParent: true
										};
									}
									if (this.$dynamicWrap.parentNode != this) this.appendChild(this.$dynamicWrap);
									dynamic.outcropMask = duicfg.dynamicSkinOutcrop;
									var avatar = dynamic.play(animation);
									if (deputy === true) {
										dynamic.deputy = avatar;
									} else {
										dynamic.primary = avatar;
									}
									this.classList.add(deputy ? 'd-skin2' : 'd-skin');
								},

								stopDynamic:function(primary, deputy){
									var dynamic = this.dynamic;
									if (!dynamic) return;
									primary = primary === true;
									deputy  = deputy  === true;
									if (primary && dynamic.primary) {
										dynamic.stop(dynamic.primary);
										dynamic.primary = null;
									} else if (deputy && dynamic.deputy) {
										dynamic.stop(dynamic.deputy);
										dynamic.deputy = null;
									} else if (!primary && !deputy) {
										dynamic.stopAll();
										dynamic.primary = null;
										dynamic.deputy = null;
									}
									if (!dynamic.primary && !dynamic.deputy) {
										this.classList.remove('d-skin');
										this.classList.remove('d-skin2');
										this.$dynamicWrap.remove();
									}
								},

								say:function(str){
									str = str.replace(/##assetURL##/g, lib.assetURL);

									if (!this.$chatBubble) {
										this.$chatBubble = decadeUI.element.create('chat-bubble');
									}

									var bubble = this.$chatBubble;
									bubble.innerHTML = str;
									if (this != bubble.parentNode) this.appendChild(bubble);
									bubble.classList.remove('removing');
									bubble.style.animation = 'fade-in 0.3s';

									if (bubble.timeout) clearTimeout(bubble.timeout)
									bubble.timeout = setTimeout(function(bubble) {
										bubble.timeout = undefined;
										bubble.delete();
									}, 2000, bubble);

									var name = get.translation(this.name);
									var info = [name ? (name + '[' + this.nickname + ']') : this.nickname, str];
									lib.chatHistory.push(info);
									if (_status.addChatEntry) {
										if (_status.addChatEntry._origin.parentNode) {
											_status.addChatEntry(info, false);
										} else {
											_status.addChatEntry = undefined;
										}
									}
									if (lib.config.background_speak && lib.quickVoice.indexOf(str) != -1) {
										game.playAudio('voice', (this.sex == 'female' ? 'female': 'male'), lib.quickVoice.indexOf(str));
									}
								},

								updateMark:function(name, storage){
									if (!this.marks[name]) {
										if (lib.skill[name] && lib.skill[name].intro && (this.storage[name] || lib.skill[name].intro.markcount)) {
											this.markSkill(name);
											if (!this.marks[name]) return this;
										} else {
											return this;
										}
									}

									var mark = this.marks[name];
									if (storage && this.storage[name]) this.syncStorage(name);
									if (name == 'ghujia' || (lib.skill[name] && lib.skill[name].intro && !lib.skill[name].intro.nocount && (this.storage[name] || lib.skill[name].intro.markcount))) {
										var num = 0;
										if (typeof lib.skill[name].intro.markcount == 'function') {
											num = lib.skill[name].intro.markcount(this.storage[name], this);
										} else if (lib.skill[name].intro.markcount == 'expansion') {
											num = this.countCards('x', (card) => card.hasGaintag(name));
										} else if (typeof this.storage[name + '_markcount'] == 'number') {
											num = this.storage[name + '_markcount'];
										} else if (name == 'ghujia') {
											num = this.hujia;
										} else if (typeof this.storage[name] == 'number') {
											num = this.storage[name];
										} else if (Array.isArray(this.storage[name])) {
											num = this.storage[name].length;
										}

										if (num) {
											if (!mark.markcount) mark.markcount = decadeUI.element.create('mark-count', mark);
											mark.markcount.textContent = num;
										} else if (mark.markcount) {
											mark.markcount.delete();
											mark.markcount = undefined;
										}
									} else {
										if (mark.markcount) {
											mark.markcount.delete();
											mark.markcount = undefined;
										}

										if (lib.skill[name].mark == 'auto') {
											this.unmarkSkill(name);
										}
									}

									return this;
								},
							},
						}
					};

					ride.ui = {
						updatec:function(){
							var controls = ui.control.childNodes;
							var stayleft;
							var offsetLeft;
							for (var i = 0; i < controls.length; i++) {
								if (!stayleft && controls[i].stayleft) {
									stayleft = controls[i];
								} else if (!offsetLeft) {
									offsetLeft = controls[i].offsetLeft;
								}

								if (stayleft && offsetLeft) break;
							}

							if (stayleft) {
								if (ui.$stayleft != stayleft) {
									stayleft._width = stayleft.offsetWidth;
									ui.$stayleft = stayleft;
								}

								if (offsetLeft < stayleft._width) {
									stayleft.style.position = 'static';
								} else {
									stayleft.style.position = 'absolute';
								}
							}
						},

						updatehl:function(){
							dui.queueNextFrameTick(dui.layoutHand, dui);
						},
						updatej:function(player){
							if (!player) return;

							var judges = player.node.judges.childNodes;
							for (var i = 0; i < judges.length; i++){
								if (judges[i].classList.contains('removing')) continue;

								judges[i].classList.remove('drawinghidden');

								if (judges[i].viewAs){
									judges[i].node.judgeMark.node.judge.innerHTML = get.translation(judges[i].viewAs)[0];
								} else {
									const bgMark = lib.translate[judges[i].name + "_bg"] || get.translation(judges[i].name)[0];
									judges[i].node.judgeMark.node.judge.innerHTML = bgMark;
								}
							}
						},

						updatez:function(){
							window.documentZoom = game.documentZoom;
							document.body.style.zoom = game.documentZoom;
							document.body.style.width = '100%';
							document.body.style.height = '100%';
							document.body.style.transform = '';

						},

						update:function(){
							for (var i = 0; i < ui.updates.length; i++) ui.updates[i]();
							if (ui.dialog == undefined || ui.dialog.classList.contains('noupdate')) return;
							if (game.chess) return base.ui.update();

							if ((!ui.dialog.buttons || !ui.dialog.buttons.length) && !ui.dialog.forcebutton && ui.dialog.classList.contains('fullheight') == false && get.mode() != 'stone') {
								ui.dialog.classList.add('prompt');
							} else {
								ui.dialog.classList.remove('prompt');
								var height = ui.dialog.content.offsetHeight;
								if (decadeUI.isMobile())
								height = decadeUI.get.bodySize().height * 0.75 - 80;
								else
								height = decadeUI.get.bodySize().height * 0.45;
								ui.dialog.style.height = Math.min(height, ui.dialog.content.offsetHeight) + 'px';
							}

							if (!ui.dialog.forcebutton && !ui.dialog._scrollset) {
								ui.dialog.classList.remove('scroll1');
								ui.dialog.classList.remove('scroll2');
							} else {
								ui.dialog.classList.add('scroll1');
								ui.dialog.classList.add('scroll2');
							}
						},

						create:{
							rarity:function(button){
								var rarity = game.getRarity(button.link);
								var intro = button.node.intro;
								intro.classList.add('showintro');

								intro.classList.add('rarity');
								if (intro.innerText)
								intro.innerText = '';

								intro.style.backgroundImage = 'url("' + decadeUIPath + 'assets/image/rarity_' + rarity + '.png")';
							},

							buttonPresets: {
								character: (item, type, position, noclick, node) => {
									if (node) {
										node.classList.add('button');
										node.classList.add('character');
										node.classList.add('decadeUI');
										node.style.display = '';
									} else {
										node = ui.create.div('.button.character.decadeUI', position);
									}
									node._link = item;
									if (_status.noReplaceCharacter && type == 'characterx') type = 'character';
									if (type == 'characterx') {
										if (lib.characterReplace[item] && lib.characterReplace[item].length) item = lib.characterReplace[item].randomGet();
									}
									node.link = item;

									var double = get.is.double(node._link, true);
									var character = dui.element.create('character', node);
									if (double) node._changeGroup = true;
									if (type == 'characterx' && lib.characterReplace[node._link] && lib.characterReplace[node._link].length > 1) node._replaceButton = true;
									var func = function (node, item, intersection) {
										if (intersection) {
											node.awaitItem = item;
											intersection.observe(node);
										} else {
											node.setBackground(item, 'character');
										}
										if (node.node) {
											node.node.name.remove();
											node.node.hp.remove();
											node.node.group.remove();
											node.node.intro.remove();
											if (node.node.replaceButton) node.node.replaceButton.remove();
										}
										node.node = {
											name: decadeUI.element.create('name', node),
											hp: decadeUI.element.create('hp', node),
											group: decadeUI.element.create('identity', node),
											intro: decadeUI.element.create('intro', node),
										};
										var infoitem = lib.character[item];
										if (!infoitem) {
											for (var itemx in lib.characterPack) {
												if (lib.characterPack[itemx][item]) {
													infoitem = lib.characterPack[itemx][item]; break;
												}
											}
										}
										node.node.name.innerHTML = get.slimName(item);
										if (lib.config.buttoncharacter_style == 'default' || lib.config.buttoncharacter_style == 'simple') {
											if (lib.config.buttoncharacter_style == 'simple') {
												node.node.group.style.display = 'none';
											}
											node.classList.add('newstyle');
											node.node.name.dataset.nature = get.groupnature(get.bordergroup(infoitem));
											node.node.group.dataset.nature = get.groupnature(get.bordergroup(infoitem), 'raw');
											ui.create.div(node.node.hp);
											var hp = get.infoHp(infoitem[2]), maxHp = get.infoMaxHp(infoitem[2]), hujia = get.infoHujia(infoitem[2]);
											var str = get.numStr(hp);
											if (hp != maxHp) {
												str += '/';
												str += get.numStr(maxHp);
											}
											var textnode = ui.create.div('.text', str, node.node.hp);
											if (infoitem[2] == 0) {
												node.node.hp.hide();
											} else if (get.infoHp(infoitem[2]) <= 3) {
												node.node.hp.dataset.condition = 'mid';
											} else {
												node.node.hp.dataset.condition = 'high';
											}
											if (hujia > 0) {
												ui.create.div(node.node.hp, '.shield');
												ui.create.div('.text', get.numStr(hujia), node.node.hp);
											}
										} else {
											var hp = get.infoHp(infoitem[2]);
											var maxHp = get.infoMaxHp(infoitem[2]);
											var shield = get.infoHujia(infoitem[2]);
											if (maxHp > 14) {
												if (typeof infoitem[2] == 'string') node.node.hp.innerHTML = infoitem[2];
												else node.node.hp.innerHTML = get.numStr(infoitem[2]);
												node.node.hp.classList.add('text');
											} else {
												for (var i = 0; i < maxHp; i++) {
													var next = ui.create.div('', node.node.hp);
													if (i >= hp) next.classList.add('exclude');
												}
												for (var i = 0; i < shield; i++) {
													ui.create.div(node.node.hp, '.shield');
												}
											}
										}
										if (node.node.hp.childNodes.length == 0) {
											node.node.name.style.top = '8px';
										}
										if (node.node.name.querySelectorAll('br').length >= 4) {
											node.node.name.classList.add('long');
											if (lib.config.buttoncharacter_style == 'old') {
												node.addEventListener('mouseenter', ui.click.buttonnameenter);
												node.addEventListener('mouseleave', ui.click.buttonnameleave);
											}
										}
										node.node.intro.innerHTML = lib.config.intro;
										if (!noclick) {
											lib.setIntro(node);
										}
										if (infoitem[1]) {
											if (double) {
												node.node.group.innerHTML = double.reduce((previousValue, currentValue) => `${previousValue}<div data-nature="${get.groupnature(currentValue)}">${get.translation(currentValue)}</div>`, '');
												if (double.length > 4) if (new Set([5, 6, 9]).has(double.length)) node.node.group.style.height = '48px';
												else node.node.group.style.height = '64px';
											} else node.node.group.innerHTML = `<div>${get.translation(infoitem[1])}</div>`;
											node.node.group.style.backgroundColor = get.translation(`${get.bordergroup(infoitem)}Color`);
										} else {
											node.node.group.style.display = 'none';
										}
										if (node._replaceButton) {
											var intro = ui.create.div('.button.replaceButton', node);
											node.node.replaceButton = intro;
											intro.innerHTML = '切换';
											intro._node = node;
											intro.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
												_status.tempNoButton = true;
												var node = this._node;
												var list = lib.characterReplace[node._link];
												var link = node.link;
												var index = list.indexOf(link);
												if (index == list.length - 1) index = 0;
												else index++;
												link = list[index];
												node.link = link;
												node.refresh(node, link);
												setTimeout(function () {
													delete _status.tempNoButton;
												}, 200);
											});
										}
									};
									node.refresh = func;
									node.refresh(node, item, position ? position.intersection : undefined);

									return node;
								}
							},

							confirm:function(str, func){
								if (ui.confirm && ui.confirm.str == str) return;

								switch (str) {
									case 'o':
									if (ui.confirm) {
										ui.confirm.replace('ok');
									} else {
										ui.confirm = ui.create.control('ok');
									}
									break;

									case 'oc':
									case 'co':
									if (ui.confirm) {
										ui.confirm.replace('ok', 'cancel');
									} else {
										ui.confirm = ui.create.control('ok', 'cancel');
									}
									break;

									case 'c':
									if (ui.confirm) {
										ui.confirm.replace('cancel');
									} else {
										ui.confirm = ui.create.control('cancel');
									}
									break;

									default:
									if (ui.confirm) {
										ui.confirm.close();
										ui.confirm = undefined;
									}
									break;
								}

								if (ui.confirm) {
									ui.confirm.str = str;
									if (func) {
										ui.confirm.custom = func;
									} else {
										ui.confirm.custom = undefined;
									}
								}
							},

							selectlist:function(list, init, position, onchange){
								var select = document.createElement('select');
								for (var i = 0; i < list.length; i++) {
									var option = document.createElement('option');
									if (Array.isArray(list[i])) {
										option.value = list[i][0];
										option.innerText = list[i][1];
									} else {
										option.value = list[i];
										option.innerText = list[i];
									}
									if (init == option.value) option.selected = 'selected';
									select.appendChild(option);
								}
								if (position) position.appendChild(select);
								if (onchange) select.onchange = onchange;
								return select;
							},
						},

						click:{
							card:function(e){
								delete this._waitingfordrag;
								if (_status.dragged) return;
								if (_status.clicked) return;
								if (ui.intro) return;
								_status.clicked = true;
								if (this.parentNode && (this.parentNode.classList.contains('judges') || this.parentNode.classList.contains('dui-marks'))) {
									if (!(e && e instanceof MouseEvent)) {
										var rect = this.getBoundingClientRect();
										e = {
											clientX: (rect.left + 10) * game.documentZoom,
											clientY: (rect.top+ 10) * game.documentZoom,
										};
									}

									ui.click.touchpop();
									ui.click.intro.call(this, e);
									_status.clicked = false;
									return;
								}
								var custom = _status.event.custom;
								if (custom.replace.card) {
									custom.replace.card(this);
									return;
								}
								if (this.classList.contains('selectable') == false) return;
								if (this.classList.contains('selected')) {
									ui.selected.cards.remove(this);
									if (_status.multitarget || _status.event.complexSelect) {
										game.uncheck();
										game.check();
									} else {
										this.classList.remove('selected');
										this.updateTransform();
									}
								} else {
									ui.selected.cards.add(this);
									this.classList.add('selected');
									this.updateTransform(true);
								}
								if (game.chess && get.config('show_range') && !_status.event.skill && this.classList.contains('selected') && (typeof _status.event.isMine == 'function') && _status.event.isMine() && _status.event.name == 'chooseToUse') {
									var player = _status.event.player;
									var range = get.info(this).range;
									if (range) {
										if (typeof range.attack === 'number') {
											player.createRangeShadow(Math.min(8, player.getAttackRange(true) + range.attack - 1));
										} else if (typeof range.global === 'number') {
											player.createRangeShadow(Math.min(8, player.getGlobalFrom() + range.global));
										}
									}
								}
								if (custom.add.card) {
									custom.add.card();
								}
								game.check();

								if (lib.config.popequip && get.is.phoneLayout() && arguments[0] != 'popequip' && ui.arena && ui.arena.classList.contains('selecting') && this.parentNode.classList.contains('popequip')) {
									var rect = this.getBoundingClientRect();
									ui.click.touchpop();
									ui.click.intro.call(this.parentNode, {
										clientX: rect.left + 18,
										clientY: rect.top + 12
									});
								}
							},
						},


					};

					ride.game = {
						addOverDialog:function(dialog, result){
							var sprite = decadeUI.backgroundAnimation.current;
							if (!(sprite && sprite.name == 'skin_xiaosha_default')) return;
							decadeUI.backgroundAnimation.canvas.style.zIndex = 7;
							switch (result) {
								case '战斗胜利':
								sprite.scaleTo(1.8, 600);
								sprite.setAction('shengli');
								break;
								case '平局':
								case '战斗失败':
								if (!duicfg.rightLayout) sprite.flipX = true;
								sprite.moveTo([0, 0.5], [0, 0.25], 600);
								sprite.scaleTo(2.5, 600);
								sprite.setAction('gongji');
								break;
							}
						},

						gameDraw:function(){
							decadeUI.delay(100);
							return base.game.gameDraw.apply(game, arguments);
						},
					};

					override(lib, ride.lib);
					override(ui, ride.ui);
					override(game, ride.game);

					decadeUI.get.extend(decadeUI, duilib);
					if (decadeModule.modules)
					for (var i = 0; i < decadeModule.modules.length; i++)
					decadeModule.modules[i](lib, game, ui, get, ai, _status);

					var getNodeIntro = get.nodeintro;
					var gameUncheckFunction = game.uncheck;
					var swapControlFunction = game.swapControl;
					var swapPlayerFunction = game.swapPlayer;
					var baseChooseCharacter = game.chooseCharacter;
					var createArenaFunction = ui.create.arena;
					var createPauseFunction = ui.create.pause;
					var createMenuFunction = ui.create.menu;
					var initCssstylesFunction = lib.init.cssstyles;

					ui.updatejm = function (player, nodes, start, inv) {
						if (typeof start != 'number') start = 0;

						for (var i = 0; i < nodes.childElementCount; i++) {
							var node = nodes.childNodes[i];
							if (i < start) {
								node.style.transform = '';
							} else if (node.classList.contains('removing')) {
								start++;
							} else {
								node.classList.remove('drawinghidden');
							}
						}
					};

					ui.updatexr = duilib.throttle(ui.updatex, 100, ui);

					document.body.onresize = ui.updatexr;

					get.infoHp = function(hp){
						if (typeof hp == 'number') {
							return hp;
						} else if (typeof hp == 'string') {
							var index = hp.indexOf('/');
							if (index >= 0) hp = hp.slice(0, hp.indexOf('/'));
							if (hp == 'Infinity' || hp == '∞') {
								return Infinity;
							} else {
								return parseInt(hp);
							}

						}

						return 0;
					};

					get.infoMaxHp = function(hp){
						if (typeof hp == 'number') {
							return hp;
						} else if (typeof hp == 'string') {
							var index = hp.indexOf('/');
							if (index >= 0) hp = hp.slice(hp.indexOf('/') + 1);
							if (hp == 'Infinity' || hp == '∞') {
								return Infinity;
							} else {
								return parseInt(hp);
							}

						}

						return 0;
					};

					get.skillState = function(player){
						var skills = base.get.skillState.apply(this, arguments);
						if (game.me != player) {
							var global = skills.global = skills.global.concat();
							for (var i = global.length - 1; i >= 0; i--) {
								if (global[i].indexOf('decadeUI') >= 0) global.splice(i, 1);
							}
						}

						return skills;
					};

					game.swapPlayer = function(player, player2){
						var result = swapPlayerFunction.call(this, player, player2);
						if (game.me && game.me != ui.equipSolts.me) {
							ui.equipSolts.me.appendChild(ui.equipSolts.equips);
							ui.equipSolts.me = game.me;
							ui.equipSolts.equips = game.me.node.equips;
							ui.equipSolts.appendChild(game.me.node.equips);
						}

						return result;
					};

					game.swapControl = function(player){
						var result = swapControlFunction.call(this, player);
						if (game.me && game.me != ui.equipSolts.me) {
							ui.equipSolts.me.appendChild(ui.equipSolts.equips);
							ui.equipSolts.me = game.me;
							ui.equipSolts.equips = game.me.node.equips;
							ui.equipSolts.appendChild(game.me.node.equips);
						}
						return result;
					};

					ui.click.intro = function(e){
						if (this.classList.contains('infohidden') || _status.dragged) return;
						_status.clicked = true;
						if (this.classList.contains('player') && !this.name) return;
						if (this.parentNode == ui.historybar){
							if (ui.historybar.style.zIndex == '22'){
								if (_status.removePop){
									if (_status.removePop(this) == false) return;
								} else {
									return;
								}
							}
							ui.historybar.style.zIndex = 22;
						}

						var uiintro = uiintro || get.nodeintro(this, false, e);
						if (!uiintro) return;
						uiintro.classList.add('popped');
						uiintro.classList.add('static');
						ui.window.appendChild(uiintro);
						var layer = ui.create.div('.poplayer', ui.window);
						var clicklayer = function(e){
							if (_status.touchpopping) return;
							delete _status.removePop;
							uiintro.delete();
							this.remove();
							ui.historybar.style.zIndex = '';
							delete _status.currentlogv;
							if (!ui.arena.classList.contains('menupaused') && !uiintro.noresume) game.resume2();
							if (e && e.stopPropagation) e.stopPropagation();
							if (uiintro._onclose){
								uiintro._onclose();
							}
							return false;
						};

						layer.addEventListener(lib.config.touchscreen ? 'touchend': 'click', clicklayer);
						if (!lib.config.touchscreen) layer.oncontextmenu = clicklayer;
						if (this.parentNode == ui.historybar && lib.config.touchscreen){
							var rect = this.getBoundingClientRect();
							e = {
								clientX: 0,
								clientY: rect.top + 30
							};
						}

						lib.placePoppedDialog(uiintro, e, this);
						if (this.parentNode == ui.historybar){
							if (lib.config.show_history == 'right'){
								uiintro.style.left = (ui.historybar.offsetLeft - 230) + 'px';
							} else {
								uiintro.style.left = (ui.historybar.offsetLeft + 60) + 'px';
							}
						}

						uiintro.style.zIndex = 21;
						var clickintro = function(){
							if (_status.touchpopping) return;
							delete _status.removePop;
							layer.remove();
							this.delete();
							ui.historybar.style.zIndex = '';
							delete _status.currentlogv;
							if (!ui.arena.classList.contains('menupaused') && !uiintro.noresume) game.resume2();
							if (uiintro._onclose){
								uiintro._onclose();
							}
						};
						var currentpop = this;
						_status.removePop = function(node){
							if (node == currentpop) return false;
							layer.remove();
							uiintro.delete();
							_status.removePop = null;
							return true;
						};
						if (uiintro.clickintro){
							uiintro.listen(function(){
								_status.clicked = true;
							});
							uiintro._clickintro = clicklayer;
						} else if (!lib.config.touchscreen){
							uiintro.addEventListener('mouseleave', clickintro);
							uiintro.addEventListener('click', clickintro);
						} else if (uiintro.touchclose){
							uiintro.listen(clickintro);
						}
						uiintro._close = clicklayer;

						game.pause2();
						return uiintro;
					};

					ui.click.identity = function(e){
						if (_status.dragged || !game.getIdentityList || _status.video || this.parentNode.forceShown) return;
						_status.clicked = true;
						var identityList = game.getIdentityList(this.parentNode);
						if (!identityList) return;

						if (lib.config.mark_identity_style == 'click') {
							var getNext = false;
							var theNext;
							var key;
							var current = this.firstChild.innerText;

							for (key in identityList) {
								if (theNext == null || getNext) {
									theNext = key;
									if (getNext) break;
								}

								if (current == identityList[key]) getNext = true;
							}

							this.parentNode.setIdentity(theNext);

						} else {
							if (get.mode() == 'guozhan') {
								identityList = {
									wei: '魏',
									shu: '蜀',
									wu: '吴',
									qun: '群',
									jin: '晋',
									ye: '野',
								};
								if (_status.forceKey) identityList.key = '键';
							}

							if (!dui.$identityMarkBox) {
								dui.$identityMarkBox = decadeUI.element.create('identity-mark-box');
								dui.$identityMarkBox.ondeactive = function(){
									dui.$identityMarkBox.remove();
									_status.clicked = false;
									if (!ui.arena.classList.contains('menupaused')) game.resume2();
								}
							}

							var index = 0;
							var node;
							var nodes = dui.$identityMarkBox.childNodes;
							for (key in identityList) {
								node = nodes[index];
								if (!node) {
									node = decadeUI.element.create('identity-mark-item', dui.$identityMarkBox);
									node.addEventListener(lib.config.touchscreen ? 'touchend': 'click', function(){
										this.player.setIdentity(this.link);
										dui.$identityMarkBox.remove();
										_status.clicked = false;
									});
								} else {
									node.style.display = '';
								}

								node.link = key;
								node.player = this.parentNode;
								node.innerText = identityList[key];
								index++;
							}

							while (index < nodes.length) {
								nodes[index].style.display = 'none';
								index++;
							}

							game.pause2();
							setTimeout(function(player){
								player.appendChild(dui.$identityMarkBox);
								dui.set.activeElement(dui.$identityMarkBox);
							}, 0, this.parentNode);
						}


					};

					ui.click.volumn = function(){
						var setting = ui.create.dialog('hidden');
						setting.listen(function(e) {
							e.stopPropagation();
						});

						var backVolume = decadeUI.component.slider(0, 8, parseInt(lib.config.volumn_background));
						var gameVolume = decadeUI.component.slider(0, 8, parseInt(lib.config.volumn_audio));

						backVolume.onchange = function(){
							game.saveConfig('volumn_background', backVolume.value);
							ui.backgroundMusic.volume = backVolume.value / 8;
						};

						gameVolume.onchange = function(){
							game.saveConfig('volumn_audio', gameVolume.value);
						};

						setting.add('背景音量');
						setting.content.appendChild(backVolume);
						setting.add('游戏音量');
						setting.content.appendChild(gameVolume);
						setting.add(ui.create.div('.placeholder'));
						return setting;
					};

					ui.create.pause = function(){
						var dialog = createPauseFunction.call(this);
						dialog.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
						return dialog;
					};

					ui.clear = function(){
						game.addVideo('uiClear');
						var nodes = document.getElementsByClassName('thrown');
						for(var i = nodes.length - 1; i >= 0; i--){
							if (nodes[i].fixed)
							continue;

							if (nodes[i].classList.contains('card')){
								decadeUI.layout.clearout(nodes[i]);
							}else{
								nodes[i].delete();
							}
						}
					};

					ui.create.arena = function(){
						ui.updatez();
						var result = createArenaFunction.apply(this, arguments);
						ui.arena.classList.remove('slim_player');
						ui.arena.classList.remove('uslim_player');
						ui.arena.classList.remove('mslim_player');
						ui.arena.classList.remove('lslim_player');
						ui.arena.classList.remove('oldlayout');
						ui.arena.classList.remove('mobile');
						ui.arena.classList.add('decadeUI');
						ui.control.id = 'dui-controls';

						decadeUI.config.update();


						return result;
					};

					ui.create.me = function(hasme){
						ui.arena.dataset.layout = game.layout;

						ui.mebg = ui.create.div('#mebg', ui.arena);
						ui.me = ui.create.div('.hand-wrap', ui.arena);
						ui.handcards1Container = decadeUI.element.create('hand-cards', ui.me);
						ui.handcards2Container = ui.create.div('#handcards2');
						ui.arena.classList.remove('nome');
						
						if (lib.config.mousewheel && !lib.config.touchscreen) {
							ui.handcards1Container.onmousewheel = decadeUI.handler.handMousewheel;
							ui.handcards2Container.onmousewheel = ui.click.mousewheel;
						}

						var equipSolts  = ui.equipSolts = decadeUI.element.create('equips-wrap');
						equipSolts.back = decadeUI.element.create('equips-back', equipSolts);

						for (let repetition = 0; repetition < 5; repetition++) {
							decadeUI.element.create(null, equipSolts.back);
						}

						ui.arena.insertBefore(equipSolts, ui.me);
						decadeUI.bodySensor.addListener(decadeUI.layout.resize);
						decadeUI.layout.resize();

						ui.handcards1Container.ontouchstart = ui.click.touchStart;
						ui.handcards2Container.ontouchstart = ui.click.touchStart;
						ui.handcards1Container.ontouchmove = decadeUI.handler.touchScroll;
						ui.handcards2Container.ontouchmove = decadeUI.handler.touchScroll;
						ui.handcards1Container.style.webkitOverflowScrolling = 'touch';
						ui.handcards2Container.style.webkitOverflowScrolling = 'touch';

						if(hasme && game.me){
							ui.handcards1 = game.me.node.handcards1;
							ui.handcards2 = game.me.node.handcards2;
							ui.handcards1Container.appendChild(ui.handcards1);
							ui.handcards2Container.appendChild(ui.handcards2);
						} else if(game.players.length){
							game.me = game.players[0];
							ui.handcards1 = game.me.node.handcards1;
							ui.handcards2 = game.me.node.handcards2;
							ui.handcards1Container.appendChild(ui.handcards1);
							ui.handcards2Container.appendChild(ui.handcards2);
						}

						if (game.me){
							equipSolts.me = game.me;
							equipSolts.equips = game.me.node.equips;
							equipSolts.appendChild(game.me.node.equips);
						}
					};

					lib.init.cssstyles = function(){
						var temp = lib.config.glow_phase;
						lib.config.glow_phase = '';
						initCssstylesFunction.call(this);
						lib.config.glow_phase = temp;
						ui.css.styles.sheet.insertRule('.avatar-name, .avatar-name-default { font-family: "' + (lib.config.name_font || 'xinkai') + '", "xinwei" }', 0);
					};

					lib.init.layout = function(layout, nosave){
						if (!nosave) game.saveConfig('layout',layout);
						game.layout = layout;

						var relayout = function(){
							ui.arena.dataset.layout = game.layout;
							if(get.is.phoneLayout()){
								ui.css.phone.href = lib.assetURL + 'layout/default/phone.css';
								ui.arena.classList.add('phone');
							} else {
								ui.css.phone.href = '';
								ui.arena.classList.remove('phone');
							}

							for (var i = 0; i < game.players.length; i++) {
								if (get.is.linked2(game.players[i])) {
									if (game.players[i].classList.contains('linked')) {
										game.players[i].classList.remove('linked');
										game.players[i].classList.add('linked2');
									}
								} else {
									if (game.players[i].classList.contains('linked2')) {
										game.players[i].classList.remove('linked2');
										game.players[i].classList.add('linked');
									}
								}
							}

							ui.updatej();
							ui.updatem();
							setTimeout(function(){
								if (game.me) game.me.update();
								setTimeout(function(){
									ui.updatex();
								}, 500);

								setTimeout(function(){
									ui.updatec();
								}, 1000);
							}, 100);
						};

						setTimeout(relayout, 500);
					};

					lib.skill._decadeUI_dieKillEffect = {
						trigger:{ source:['dieBegin'] },
						forced: true,
						popup: false,
						priority: -100,
						lastDo: true,
						content:function(){
							if (!(trigger.source && trigger.player)) return;
							game.broadcastAll(function(source, player){
								if (!window.decadeUI) return;
								if (!decadeUI.config.playerKillEffect) return;
								decadeUI.effect.kill(source, player);
							}, trigger.source, trigger.player);

							game.broadcastAll(function(source){
								if (!window.decadeUI) return;
								if (!decadeUI.config.playerKillAndRecoverEffect) return;
								var kill_count = 0
								for(i=0;i<source.stat.length;i++){
									if(source.stat[i].kill!=undefined) kill_count+=source.stat[i].kill;
								}
								if (kill_count+1==1){
									source.$fullscreenpop('一血  卧龙出山','fire');
									game.playAudio('../extension', decadeUI.extensionName, 'audio/jstx_audio/jstx_jisha1.mp3');
								}
								if (kill_count+1==2){
									source.$fullscreenpop('双杀  一战成名','water');
									game.playAudio('../extension', decadeUI.extensionName, 'audio/jstx_audio/jstx_jisha2.mp3');
								}
								if (kill_count+1==3){
									source.$fullscreenpop('三杀  举世皆惊','thunder');
									game.playAudio('../extension', decadeUI.extensionName, 'audio/jstx_audio/jstx_jisha3.mp3');
								}
								if (kill_count+1==4){
									source.$fullscreenpop('四杀  天下无敌','fire');
									game.playAudio('../extension', decadeUI.extensionName, 'audio/jstx_audio/jstx_jisha4.mp3');
								}
								if (kill_count+1==5){
									source.$fullscreenpop('五杀  诛天灭地','thunder');
									game.playAudio('../extension', decadeUI.extensionName, 'audio/jstx_audio/jstx_jisha5.mp3');
								}
								if (kill_count+1==6){
									source.$fullscreenpop('六杀  癫狂杀戮','water');
									game.playAudio('../extension', decadeUI.extensionName, 'audio/jstx_audio/jstx_jisha6.mp3');
								}
								if (kill_count+1==7){
									source.$fullscreenpop('无双  万军取首','fire');
									game.playAudio('../extension', decadeUI.extensionName, 'audio/jstx_audio/jstx_jisha7.mp3');
								}
							}, trigger.source);
						}
					};

					lib.skill._jstx_recovertrigger={
						trigger:{global:'recoverEnd'},
						filter:function(event,player){
							if(_status.currentPhase!=player){
								return event.player!=event.source&&event.source==player;
							}
							return true;
						},
						direct:true,
						content:function(){
							if(_status.currentPhase!=player){
								if(player.storage.jstxyishugaochao==undefined){
									player.storage.jstxyishugaochao = trigger.num;
								} else {
									player.storage.jstxyishugaochao+=trigger.num;
								}
								if(player.storage.jstxyishugaochao==undefined||player.storage.jstxyishugaochao<3){
									game.broadcastAll(function(player){
										if (!window.decadeUI) return;
										if (!decadeUI.config.playerKillAndRecoverEffect) return;
										player.$fullscreenpop('妙手回春','water');
										game.playAudio('../extension', decadeUI.extensionName, 'audio/jstx_audio/jstxmiaoshouhuichun.mp3');
									}, player);
								} else {
									player.storage.jstxyishugaochao-=3;
									game.broadcastAll(function(player){
										if (!window.decadeUI) return;
										if (!decadeUI.config.playerKillAndRecoverEffect) return;
										player.$fullscreenpop('医术高超','water');
										game.playAudio('../extension', decadeUI.extensionName, 'audio/jstx_audio/jstxyishugaochao.mp3');
									}, player);
								}
							}
						},
						group:'_jstx_recovertrigger_Delete',
						subSkill:{
							Delete:{
								trigger:{player:'phaseEnd'},
								direct:true,
								content:function(){
									delete player.storage.jstxyishugaochao;
								},
							}
						}
					};

					if (!_status.connectMode) {
						lib.element.content.chooseToGuanxing = function(){
							"step 0"
							if (player.isUnderControl()) {
								game.modeSwapPlayer(player);
							}

							var cards = get.cards(num);
							var guanxing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
							if (this.getParent() && this.getParent().name && get.translation(this.getParent().name) != this.getParent().name) {
								guanxing.caption = '【' + get.translation(this.getParent().name) + '】';
							} else {
								guanxing.caption = "请按顺序排列牌。";
							}
							game.broadcast(function(player, cards, callback){
								if (!window.decadeUI) return;
								var guanxing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
								guanxing.caption = '【观星】';
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
											cards.splice(i, 1)
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
							}

							if (event.isOnline()) {
								event.player.send(function(){
									if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
								}, event.player);

								event.player.wait();
								decadeUI.game.wait();
							} else if (!(typeof event.isMine == 'function' && event.isMine())) {
								event.switchToAuto();
							}
							"step 1"
							player.popup(get.cnNumber(event.num1) + '上' + get.cnNumber(event.num2) + '下');
							game.log(player, '将' + get.cnNumber(event.num1) + '张牌置于牌堆顶，' + get.cnNumber(event.num2) +'张牌置于牌堆底');
							game.updateRoundNumber()
						};
					}

					Mixin.replace(
						'lib.element.content.respond',
						/(?=\s*var directDiscard=\[\];)/,
						(next, event) => {
							if (event.animate != false && event.throw !== false) {
								next.animate = true;
								next.blameEvent = event;
							}
						},
						/for\(var i=0;i<cards\.length;i\+\+\){\s*player\.\$throw\(cards\[i\]\);[\s\S]*},cards\);\s*}/,
						(player, cards) => player.$throw(cards)
					);
					lib.element.Player = class extends lib.element.Player {
						constructor(){
							let player = super(...arguments);
							Object.setPrototypeOf(player,lib.element.Player.prototype);
							return player;
						}
						get group() {
							return this._decadeGroup;
						}
						set group(group) {
							this._decadeGroup = group;
							this.node.campWrap.dataset.camp = get.bordergroup(this.name, true) || group;
							if (!group) return;
							if (!decadeUI.config.campIdentityImageMode) {
								this.node.campWrap.node.campName.innerHTML = group ? get.translation(group)[0] : '';
								return;
							}
							const image = new Image();
							const url = lib.decade_extGroupImage && lib.decade_extGroupImage[group] || `${decadeUIPath}image/decoration/name_${group}.png`;
							this._finalGroup = group;
							image.onerror = () => this.node.campWrap.node.campName.innerHTML = this._finalGroup ? get.translation(this._finalGroup)[0] : '';
							this.node.campWrap.node.campName.style.backgroundImage = `url("${url}")`;
							image.src = url;
						}
						buildNode() {
							super.buildNode();
							this.node.avatar.className = 'primary-avatar';
							this.node.avatar2.className = 'deputy-avatar';
							if(!duicfg.dynamicSkin) this.node.avatar2.hide();
							this.node.turnedover.className = 'turned-over';
							this.node.turnedover.textContent = '';
							this.node.count.show().className = 'card-count';
							this.node.marks.className = 'dui-marks';
							this.node.chain.textContent = '';
							const chainImg = new Image();
							chainImg.onerror = () => {
								const chainBack = ui.create.div('.chain-back', this.node.chain);
								for (let chainLink = 0; chainLink < 40; chainLink++) {
									ui.create.div('.cardbg', chainBack).style.transform = `translateX(${chainLink * 5 - 5}px)`;
								}
								delete chainImg.onerror;
							};
							chainImg.src = `${decadeUIPath}assets/image/tie_suo.png`;
							this.$cardCount = this.node.count;
							this.$dynamicWrap = ui.create.div('.dynamic-wrap');
							const realIdentity = ui.create.div(this.node.identity);
							realIdentity.player = this;
							Object.defineProperty(realIdentity, 'innerHTML', {
								configurable: true,
								get() {
									return this.innerText;
								},
								set(innerHTML) {
									if (get.mode() == 'guozhan' || _status.mode == 'jiange' || _status.mode == 'siguo') {
										this.style.display = 'none';
										this.innerText = innerHTML;
										this.parentNode.classList.add('guozhan-mode');
										return;
									}
									let filename;
									let checked;
									const identity = this.parentNode.dataset.color;
									const gameMode = get.mode();
									let isExt = false;
									if (lib.decade_extIdentity && (lib.decade_extIdentity[this.player.identity] || lib.decade_extIdentity[innerHTML]) && innerHTML != '猜') {
										if (lib.decade_extIdentity[innerHTML]) filename = lib.decade_extIdentity[innerHTML];
										else filename = lib.decade_extIdentity[this.player.identity];
										
										isExt = true;
									} else switch (innerHTML) {
											case '先':
												filename = 'xianshou';
												break;
											case '后':
												filename = 'houshou';
												break;
											case '猜':
												filename = 'cai';
												if (_status.mode == 'purple' && identity == 'cai') {
													filename += '_blue';
													checked = true;
												}
												break;
											case '友':
												filename = 'friend';
												break;
											case '敌':
												filename = 'enemy';
												break;
											case '反':
												filename = 'fan';
												if (get.mode() == 'doudizhu') {
													filename = 'nongmin';
													checked = true;
												}
												break;
											case '主':
												filename = 'zhu';
												if (get.mode() == 'versus' && get.translation(`${this.player.side}Color`) == 'wei') {
													filename += '_blue';
													this.player.classList.add('opposite-camp');
													checked = true;
												} else if (get.mode() == 'doudizhu') {
													filename = 'dizhu';
													checked = true;
												}
												break;
											case '忠':
												filename = 'zhong';
												if (gameMode == 'identity' && _status.mode == 'purple') {
													filename = 'qianfeng';
												} else if (get.mode() == 'versus' && get.translation(`${this.player.side}Color`) == 'wei') {
													filename += '_blue';
													this.player.classList.add('opposite-camp');
													checked = true;
												}
												break;
											case '内':
												if (_status.mode == 'purple') {
													filename = identity == 'rNei' ? 'xizuo' : 'xizuo_blue';
													checked = true;
												} else {
													filename = 'nei';
												}
												break;
											case '民':
												filename = 'commoner';
												break;
											case '野':
												filename = 'ye';
												break;
											case '首':
												filename = 'zeishou';
												break;
											case '帅':
												filename = 'zhushuai';
												break;
											case '将':
												filename = 'dajiang';
												if (_status.mode == 'three' || get.translation(this.player.side + 'Color') == 'wei') {
													filename = 'zhushuai_blue';
													checked = true;
												}
												break;
											case '兵':
											case '卒':
												filename = this.player.side === false ? 'qianfeng_blue' : 'qianfeng';
												checked = true;
												break;
											case '师':
												filename = 'junshi';
												break;
											case '盟':
												filename = 'mengjun';
												break;
											case '神':
												filename = 'boss';
												break;
											case '从':
												filename = 'suicong';
												break;
											default:
												this.innerText = innerHTML;
												this.style.visibility = '';
												this.parentNode.style.backgroundImage = '';
												return;
									}
									if (!checked && this.parentNode.dataset.color && !isExt) {
										if (this.parentNode.dataset.color[0] == 'b') {
											filename += '_blue';
											this.player.classList.add('opposite-camp');
										}
									}
									this.innerText = innerHTML;
									if (decadeUI.config.campIdentityImageMode) {
										this.style.visibility = 'hidden';
										const image = new Image();
										image.onerror = () => this.style.visibility = '';
										if (isExt) {
											image.src = filename;
										} else {
											image.src = `${decadeUIPath}image/decoration/identity_${filename}.png`;
										}
										this.parentNode.style.backgroundImage = `url("${image.src}")`;
									} else {
										this.style.visibility = '';
									}
								}
							});
							Object.defineProperty(this.node.count, 'innerHTML', {
								configurable: true,
								get() {
									return this.textContent;
								},
								set(innerHTML) {
									if (this.textContent == innerHTML) return;
									this.textContent = innerHTML;
									this.dataset.text = innerHTML;
								}
							});
							const campWrap = ui.create.div('.camp-wrap');
							const hpWrap = ui.create.div('.hp-wrap');
							this.insertBefore(campWrap, this.node.name);
							this.insertBefore(hpWrap, this.node.hp);
							this.node.campWrap = campWrap;
							this.node.hpWrap = hpWrap;
							hpWrap.appendChild(this.node.hp);
							campWrap.node = {
								back: ui.create.div('.camp-back', campWrap),
								border: ui.create.div('.camp-border', campWrap),
								campName: ui.create.div('.camp-name', campWrap),
								avatarName: this.node.name,
								avatarDefaultName: ui.create.div('.avatar-name-default', campWrap)
							};
							campWrap.appendChild(this.node.name);
							campWrap.node.avatarName.className = 'avatar-name';
							campWrap.node.avatarDefaultName.innerHTML = '主将';
							this.node.mask = this.insertBefore(ui.create.div('.mask'), this.node.identity);
							this.node.gainSkill = ui.create.div('.gain-skill', this);
							this.node.gainSkill.player = this;
							this.node.gainSkill.gain = function (skill) {
								if (!this.skills) this.skills = [];
								if (this.skills.includes(skill) || !lib.translate[skill]) return;
								const info = lib.skill[skill];
								if (!info || info.charlotte || info.sub || (info.mark && !info.limited) || (info.nopop || info.popup === false)) return;
								if (info.onremove && game.me != this.player.storage[skill]) return;
								this.skills.push(skill);
								this.innerHTML = this.skills.reduce((html, senderSkill) => `${html}[${lib.translate[senderSkill]}]`, '');
							};
							this.node.gainSkill.lose = function (skill) {
								const index = this.skills.indexOf(skill);
								if (index == -1) return;
								this.skills.splice(index, 1);
								this.innerHTML = this.skills.reduce((html, senderSkill) => `${html}[${get.translation(senderSkill)}]`, '');
							};
						}
						buildExtra() {
							void 0;
						}
						$syncExpand() {
							super.$syncExpand(...arguments);
							const back = ui.equipSolts.back;

							while (back.firstChild) {
								back.removeChild(back.lastChild);
							}

							const numberOfSlots = 5 + Object.values(this.expandedSlots).reduce((numberOfExpandedSlots, numberOfExpandedSubtypeSlots) => numberOfExpandedSlots + numberOfExpandedSubtypeSlots, 0);

							for (let repetition = 0; repetition < numberOfSlots; repetition++) {
								back.appendChild(document.createElement('div'));
							}
						}
						setSeatNum() {
							super.setSeatNum(...arguments);
							game.broadcastAll(function(firstAction){
								let cur;
								for (var i = 0; i < game.players.length; i++) {
									cur = game.players[i];
									if (!cur.node.seat)
									cur.node.seat = decadeUI.element.create('seat', cur);

									cur.seat = cur.getSeatNum();
									cur.node.seat.innerHTML = get.cnNumber(cur.seat, true);
								}
							}, this);
							this.seat = this.getSeatNum();
							this.node.seat.innerHTML = get.cnNumber(this.seat, true);
						}
						$init(character, character2) {
							super.$init(...arguments);
							this.doubleAvatar = (character2 && lib.character[character2]) != undefined;
							let currentDynamic = decadeUI.CUR_DYNAMIC;
							let maximumDynamic = decadeUI.MAX_DYNAMIC;

							if (typeof currentDynamic != 'number') decadeUI.CUR_DYNAMIC = currentDynamic = 0;

							if (typeof maximumDynamic != 'number') {
								maximumDynamic = decadeUI.isMobile() ? 2 : 10;

								if (window.OffscreenCanvas) maximumDynamic += 8;

								decadeUI.MAX_DYNAMIC = maximumDynamic;
							}

							if (this.dynamic) this.stopDynamic();

							const showDynamic = (this.dynamic || currentDynamic < maximumDynamic) && duicfg.dynamicSkin;

							if (showDynamic && _status.mode != null) {
								const dynamicSkins = decadeUI.dynamicSkin;
								const avatars = this.doubleAvatar ? [character, character2] : [character];
								let increased;
								avatars.forEach(avatar => {
									const skins = dynamicSkins[avatar];

									if (!skins) return;

									const keys = Object.keys(skins);

									if (keys.length == 0) {
										console.error(`player.init: ${avatar} 没有设置动皮参数`);
										return;
									}

									const skin = skins[Object.keys(skins)[0]];

									if (typeof skin.speed != 'number') skin.speed = 1;

									this.playDynamic({
										/**
										 * 骨骼文件名，一般是assets/dynamic 下的动皮文件，也可以使用.. 来寻找其他文件目录
										 * @type {string}
										 */
										name: skin.name,
										/**
										 * 播放动作 不填为默认
										 * @type {string}
										 */
										action: skin.action,
										/**
										 * 是否循环播放
										 * @type {boolean}
										 */
										loop: true,
										/**
										 * 循环次数，只有loop为true时生效
										 * @type {number}
										 */
										loopCount: -1,
										/**
										 * 播放速度
										 * @type {number}
										 */
										speed: skin.speed,
										/**
										 * 水平镜像
										 * @type {boolean}
										 */
										filpX: null,
										/**
										 * 垂直翻转
										 * @type {boolean}
										 */
										filpY: null,
										/**
										 * 0~1
										 * 
										 * 不透明度
										 * @type {number}
										 */
										opacity: null,
										/**
										 * 相对于父节点坐标x，不填为居中
										 * 
										 * (1) x: 10, 相当于 left: 10px；
										 * 
										 * (2) x: [10, 0.5], 相当于 left: calc(50% + 10px)；
										 * @type {number | [number, number]}
										 */
										x: skin.x,
										/**
										 * 相对于父节点坐标y，不填为居中
										 * 
										 * (1) y: 10，相当于 top: 10px；
										 * 
										 * (2) y: [10, 0.5]，相当于 top: calc(50% + 10px)；
										 * @type {number | [number, number]}
										 */
										y: skin.y,
										/**
										 * 缩放
										 * @type {number}
										 */
										scale: skin.scale,
										/**
										 * 角度
										 * @type {number}
										 */
										angle: skin.angle,
										/**
										 * 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
										 */
										hideSlots: skin.hideSlots,
										/**
										 * 剪掉超出头的部件，仅针对露头动皮，其他勿用
										 */
										clipSlots: skin.clipSlots,
									}, i == 1);
									this.$dynamicWrap.style.backgroundImage = `url("${decadeUIPath}assets/dynamic/${skin.background}")`;

									if (increased) return;

									increased = true;
									decadeUI.CUR_DYNAMIC++;
								});
							}

							let refreshPrefix;

							if (character && duicfg.showJieMark) {
								if (lib.characterPack.refresh) refreshPrefix = lib.characterPack.refresh[character];

								if (!refreshPrefix) refreshPrefix = character.substr(0, 3);

								if (refreshPrefix) {
									refreshPrefix = lib.translate[character] && lib.translate[character][0];

									if (refreshPrefix == '界') {
										if (!this.$jieMark) this.$jieMark = dui.element.create('jie-mark', this);
										else this.appendChild(this.$jieMark);
									}
								}
							}

							if (refreshPrefix == '界') {
								let text = this.node.name.innerText;

								if (text[1] == '\n') text = text.substr(2);
								else text = text.substr(1);

								this.node.name.innerText = text;
							}

							return this;
						}
						$uninit() {
							if (this.$jieMark) this.$jieMark.remove();

							this.stopDynamic();
							this.doubleAvatar = false;
							delete this.node.campWrap.dataset.camp;
							const campName = this.node.campWrap.node.campName;

							while (campName.firstChild) {
								campName.removeChild(campName.lastChild);
							}

							campName.style.removeProperty('background-image');
							super.$uninit(...arguments);
						}
						getState() {
							const state = super.getState(...arguments);
							state.seat = this.seat;
							return state;
						}
						$update() {
							const hpMax = this.maxHp;

							if (this.hp >= hpMax) this.hp = hpMax;

							const count = this.countCards('h');
							const hp = this.hp;

							if (!_status.video) {
								if (this.hujia) this.markSkill('ghujia');
								else this.unmarkSkill('ghujia');
							}

							const hpNode = this.node.hp;

							if (!this.storage.nohp) {
								if (hpMax > 5) {
									hpNode.innerHTML = `${isNaN(hp) ? '×' : hp == Infinity ? '∞' : hp}<br>/<br>${(isNaN(hpMax) ? '×' : hpMax == Infinity ? '∞' : hpMax)}<div></div>`;

									if (hp == 0) hpNode.lastChild.classList.add('lost');

									hpNode.classList.add('textstyle');
								} else {
									hpNode.innerHTML = '';
									hpNode.classList.remove('textstyle');

									while (hpMax > hpNode.childNodes.length) {
										ui.create.div(hpNode);
									}

									while (hpNode.childNodes.length && hpMax < hpNode.childNodes.length) {
										hpNode.lastChild.remove();
									}

									for (var i = 0; i < hpMax; i++) {
										if (i < hp) hpNode.childNodes[i].classList.remove('lost');
										else hpNode.childNodes[i].classList.add('lost');
									}
								}

								if (hpNode.classList.contains('room')) hpNode.dataset.condition = 'high';
								else if (hp == 0) hpNode.dataset.condition = '';
								else if (hp > Math.round(hpMax / 2) || hp === hpMax) hpNode.dataset.condition = 'high';
								else if (hp > Math.floor(hpMax / 3)) hpNode.dataset.condition = 'mid';
								else hpNode.dataset.condition = 'low';
							}

							this.node.count.innerHTML = count;

							if (count >= 10) this.node.count.dataset.condition = 'low';
							else if (count > 5) this.node.count.dataset.condition = 'higher';
							else if (count > 2) this.node.count.dataset.condition = 'high';
							else if (count > 0) this.node.count.dataset.condition = 'mid';
							else this.node.count.dataset.condition = 'none';

							this.dataset.maxHp = hpMax;

							if (this.updates) for (var i = 0; i < this.updates.length; i++) {
								this.updates[i](this);
							}

							if (!_status.video) game.addVideo('update', this, [this.countCards('h'), this.hp, this.maxHp, this.hujia]);

							this.updateMarks();
							return this;
						}
						line(target, config) {
							if (get.itemtype(target) == 'players') super.line(...arguments);
							else if (get.itemtype(target) == 'player') {
								if (target == this)
									return;

								var player = this;
								game.broadcast(function (player, target, config) {
									player.line(target, config);
								}, player, target, config);
								game.addVideo('line', player, [target.dataset.position, config]);

								player.checkBoundsCache(true);
								target.checkBoundsCache(true);
								var x1, y1;
								var x2, y2;
								var hand = dui.boundsCaches.hand;
								if (player == game.me) {
									hand.check();
									x1 = hand.x + hand.width / 2;
									y1 = hand.y;
								} else {
									x1 = player.cacheLeft + player.cacheWidth / 2;
									y1 = player.cacheTop + player.cacheHeight / 2;
								}

								if (target == game.me) {
									hand.check();
									x2 = hand.x + hand.width / 2;
									y2 = hand.y;
								} else {
									x2 = target.cacheLeft + target.cacheWidth / 2;
									y2 = target.cacheTop + target.cacheHeight / 2;
								}

								game.linexy([x1, y1, x2, y2], config, true);
							}
						}
						setIdentity(identity) {
							if (!identity) identity = this.identity;

							if (get.mode() == 'guozhan') {
								this.node.identity.dataset.color = identity;
								if (identity == 'ye' && get.is.jun(this)) this.identity = identity = lib.character[this.name1][1];
								this.group = identity;
								this.node.identity.firstChild.innerHTML = get.translation(identity);
								return this;
							}

							return super.setIdentity(identity);
						}
						useCard() {
							const useCard = super.useCard(...arguments);
							useCard.pushHandler((event, option) => {
								if (event.step == 0 && option.state == 'end') {
									const player = event.player;
									event.targets.forEach(current => {
										if (current != player) current.classList.add('target');
									});
								} else if (event.finished) event.targets.forEach(current => {
									const classList = current.classList;
									if (classList.contains('target')) classList.remove('target');
								});
							});
							return useCard;
						}
						directgain(cards) {
							super.directgain(...arguments);

							if (this == game.me) {
								if (cards && cards.length) dui.layoutHandDraws(cards.reverse());

								dui.queueNextFrameTick(dui.layoutHand, dui);
							}

							return this;
						}
						lose() {
							const event = get.event(), lose = super.lose(...arguments);

							if (event.name == 'useCard') {
								lose.animate = true;
								lose.blameEvent = event;
							}

							lose.pushHandler((event, option) => {
								const step = event.step;

								if (step == 0) {
									const state = option.state;

									if (state == 'begin') {
										const playerCards = event.player.getCards('hejsx');
										const cards = event.cards.filter(card => playerCards.includes(card));
										game.broadcastAll(cards => cards.duiMod = true, cards);
										cards.filter(card => playerCards.includes(card)).forEach(card => {
											const parentNode = card.parentNode;

											if (!parentNode) return;

											const classList = parentNode.classList;

											if (classList.contains('equips')) card.throwWith = 'e';
											else if (classList.contains('judges')) card.throwWith = 'j';
											else if (classList.contains('expansions')) card.throwWith = 'x';
											else if (!classList.contains('handcards')) return;

											if (card.classList.contains('glows')) card.throwWith = 's';
											else card.throwWith = 'h';
										});
									}
									else if (state == 'end') {
										const parent = event.getParent();

										if (!event.blameEvent && (parent.name != 'discard' || event.type != 'discard') && (parent.name != 'loseToDiscardpile' || event.type != 'loseToDiscardpile')) event.animate = false;
										else if (typeof event.animate != 'boolean') {
											const parentAnimate = parent.animate;

											if (typeof parentAnimate == 'boolean') event.animate = parentAnimate;
										}
									}
								} else if (step == 1 && option.state == 'end') {
									event.cards.forEach(card => {
										const style = card.style, transform = style.transform;

										if (transform.endsWith(' scale(0.2)')) style.transform = transform.slice(0, -11);
									});

									if (event.player == game.me) dui.queueNextFrameTick(dui.layoutHand, dui);
								}
							});
							return lose;
						}
						changeHp() {
							const changeHp = super.changeHp(...arguments);
							changeHp.pushHandler((event, option) => {
								if (event.finished) dui.delay(68);
							});
							return changeHp;
						}
						equip() {
							const equip = super.equip(...arguments);
							equip.pushHandler((event, option) => {
								if (event.step == 0 && option.state == 'end') {
									const lose = event.next[0];
									if (!lose || lose.name != 'lose') return;
									lose.animate = true;
									lose.blameEvent = event;
								}
							});
							return equip;
						}
						prompt() {
							super.prompt(...arguments);
							const prompt = this.node.prompt;
							prompt.dataset.text = prompt.innerText;
							prompt.style.animation = 'open-fade-in 0.6s';
						}
						addSkill() {
							const skill = super.addSkill(...arguments);

							if (!Array.isArray(skill)) {
								const character1 = lib.character[this.name];
								const character2 = lib.character[this.name2];

								if ((!character1 || !character1[3].includes(skill)) && (!character2 || !character2[3].includes(skill))) this.node.gainSkill.gain(skill);
							}

							return skill;
						}
						removeSkill() {
							const skill = super.removeSkill(...arguments);

							if (!Array.isArray(skill)) {
								const gainSkill = this.node.gainSkill;
								const skills = gainSkill.skills;

								if (skills && skills.includes(skill)) gainSkill.lose(skill);
							}

							return skill;
						}
						$draw(num, init, config) {
							if (game.chess)
								return super.$draw(...arguments);

							if (init !== false && init !== 'nobroadcast') {
								game.broadcast(function (player, num, init, config) {
									player.$draw(num, init, config);
								}, this, num, init, config);
							}

							var cards;
							var isDrawCard;
							if (get.itemtype(num) == 'cards') {
								cards = num.concat();
								isDrawCard = true;
							} else if (get.itemtype(num) == 'card') {
								cards = [num];
								isDrawCard = true;
							} else if (typeof num == 'number') {
								cards = new Array(num);
							} else {
								cards = new Array(1);
							}

							if (init !== false) {
								if (isDrawCard) {
									game.addVideo('drawCard', this, get.cardsInfo(cards));
								} else {
									game.addVideo('draw', this, num);
								}
							}

							if (game.me == this)
								return;

							var fragment = document.createDocumentFragment();
							var card;
							for (var i = 0; i < cards.length; i++) {
								card = cards[i];
								if (card == null)
									card = dui.element.create('card thrown drawingcard');
								else
									card = card.copy('thrown', 'drawingcard', false);

								card.fixed = true;
								cards[i] = card;
								fragment.appendChild(card);
							}

							var player = this;
							dui.layoutDrawCards(cards, player, true);
							ui.arena.appendChild(fragment);
							dui.queueNextFrameTick(function () {
								dui.layoutDrawCards(cards, player);
								dui.delayRemoveCards(cards, 460, 220);
							});
						}
						$compare(card1, target, card2) {
							game.broadcast(function (player, target, card1, card2) {
								player.$compare(card1, target, card2);
							}, this, target, card1, card2);
							game.addVideo('compare', this, [get.cardInfo(card1), target.dataset.position, get.cardInfo(card2)]);
							var player = this;
							target.$throwordered2(card2.copy(false));
							player.$throwordered2(card1.copy(false));
						}
						$compareMultiple = function(card1, targets, cards) {
							game.broadcast(function(player, card1, targets, cards) {
								player.$compareMultiple(card1, targets, cards);
							}, this, card1, targets, cards);
							game.addVideo("compareMultiple", this, [get.cardInfo(card1), get.targetsInfo(targets), get.cardsInfo(cards)]);
							var player = this;
							for (var i = targets.length - 1; i >= 0; i--) {
								targets[i].$throwordered2(cards[i].copy(false));
							}
							player.$throwordered2(card1.copy(false));
						};
						$throw(cards, time, record, nosource, tag_innerHTML) {
							for (var i = 0; i < cards.length; i++) tag_innerHTML = tag_innerHTML || dui.CardUseTaginnerHTML(cards[i], this, _status.event);

							if (record !== false) {
								if (record !== 'nobroadcast') {
									game.broadcast(function (player, cards, time, record, nosource, tag_innerHTML) {
										player.$throw(cards, time, record, nosource, tag_innerHTML);
									}, this, cards, 0, record, nosource, tag_innerHTML);
								}
								game.addVideo('throw', this, [get.cardsInfo(cards), 0, nosource]);
							}

							var itemtype;
							var duiMod = (cards.duiMod && game.me == this && !nosource);
							if (typeof cards == 'number') {
								itemtype = 'number';
								cards = new Array(cards);
							} else {
								itemtype = get.itemtype(cards);
								if (itemtype == 'cards') {
									cards = cards.concat();
								} else if (itemtype == 'card') {
									cards = [cards];
								} else {
									return;
								}
							}

							var card;
							var clone;
							var player = this;
							var hand = dui.boundsCaches.hand;
							hand.check();

							for (var i = 0; i < cards.length; i++) {
								card = cards[i];
								if (card) {
									clone = card.copy('thrown');
									if (duiMod && (card.throwWith == 'h' || card.throwWith == 's')) {
										clone.tx = Math.round(hand.x + card.tx);
										clone.ty = Math.round(hand.y + 30 + card.ty);
										clone.scaled = true;
										clone.throwordered = true;
										clone.style.transform = 'translate(' + clone.tx + 'px,' + clone.ty + 'px) scale(' + hand.cardScale + ')';
									}
									card = clone;
								} else {
									card = dui.element.create('card infohidden infoflip');
									card.moveTo = lib.element.Card.prototype.moveTo;
									card.moveDelete = lib.element.Card.prototype.moveDelete;
								}

								cards[i] = card;
							}

							if (duiMod && cards.length > 2) {
								cards.sort(function (a, b) {
									if (a.tx == undefined && b.tx == undefined)
										return 0;

									if (a.tx == undefined)
										return duicfg.rightLayout ? -1 : 1;

									if (b.tx == undefined)
										return duicfg.rightLayout ? 1 : -1;

									return b.tx - a.tx;
								});
							}

							for (var i = 0; i < cards.length; i++) player.$throwordered2(cards[i], nosource, tag_innerHTML);

							if (game.chess) this.chessFocus();

							return cards[cards.length - 1];
						}
						$throwordered2(card, nosource, tag_innerHTML) {
							if (_status.connectMode) ui.todiscard = [];

							if (card.throwordered == undefined) {
								var x, y;
								var bounds = dui.boundsCaches.arena;
								if (!bounds.updated)
									bounds.update();

								this.checkBoundsCache();
								if (nosource) {
									x = ((bounds.width - bounds.cardWidth) / 2 - bounds.width * 0.08);
									y = ((bounds.height - bounds.cardHeight) / 2);
								} else {
									x = ((this.cacheWidth - bounds.cardWidth) / 2 + this.cacheLeft);
									y = ((this.cacheHeight - bounds.cardHeight) / 2 + this.cacheTop);
								}

								x = Math.round(x);
								y = Math.round(y);

								card.tx = x;
								card.ty = y;
								card.scaled = true;
								card.classList.add('thrown');
								card.style.transform = 'translate(' + x + 'px, ' + y + 'px)' + 'scale(' + bounds.cardScale + ')';
							} else {
								card.throwordered = undefined;
							}

							if (card.fixed)
								return ui.arena.appendChild(card);

							var before;
							for (var i = 0; i < ui.thrown; i++) {
								if (ui.thrown[i].parentNode == ui.arena) {
									before = ui.thrown[i];
									break;
								}
							}

							var tagNode = card.querySelector('.used-info');
							if (tagNode == null) tagNode = card.appendChild(dui.element.create('used-info'));

							card.$usedtag = tagNode;
							ui.thrown.unshift(card);
							if (before)
								ui.arena.insertBefore(before, card);
							else
								ui.arena.appendChild(card);

							tag_innerHTML = tag_innerHTML || dui.CardUseTaginnerHTML(card, this, _status.event);
							dui.tryAddPlayerCardUseTag(card, tag_innerHTML);
							dui.PlaySpineAnimationOnCard(card, _status.event);
							dui.queueNextFrameTick(dui.layoutDiscard, dui);
							return card;
						}
						$give(cards, target, log, record) {
							var itemtype;
							var duiMod = (cards.duiMod && game.me == target);
							if (typeof cards == 'number') {
								itemtype = 'number';
								cards = new Array(cards);
							} else {
								itemtype = get.itemtype(cards);
								if (itemtype == 'cards') {
									cards = cards.concat();
								} else if (itemtype == 'card') {
									cards = [cards];
								} else {
									return;
								}
							}

							if (record !== false) {
								var cards2 = cards;
								if (itemtype == 'number') {
									cards2 = cards.length;
									game.addVideo('give', this, [cards2, target.dataset.position]);
								} else {
									game.addVideo('giveCard', this, [get.cardsInfo(cards2), target.dataset.position]);
								}

								game.broadcast(function (source, cards2, target, record) {
									source.$give(cards2, target, false, record);
								}, this, cards2, target, record);
							}

							if (log != false) {
								if (itemtype == 'number')
									game.log(target, '从', this, '获得了' + get.cnNumber(cards.length) + '张牌');
								else
									game.log(target, '从', this, '获得了', cards);
							}

							if (this.$givemod) {
								this.$givemod(cards, target);
								return;
							}

							if (duiMod)
								return;

							var card;
							var hand = dui.boundsCaches.hand;
							hand.check();

							var draws = [];
							var player = this;
							var fragment = document.createDocumentFragment();
							for (var i = 0; i < cards.length; i++) {
								card = cards[i];
								if (card) {
									var cp = card.copy('card', 'thrown', 'gainingcard', false);
									var hs = player == game.me;
									if (hs) {
										if (card.throwWith)
											hs = card.throwWith == 'h' || card.throwWith == 's';
										else
											hs = card.parentNode == player.node.handcards1;
									}

									if (hs) {
										cp.tx = Math.round(hand.x + card.tx);
										cp.ty = Math.round(hand.y + 30 + card.ty);
										cp.scaled = true;
										cp.style.transform = 'translate(' + cp.tx + 'px,' + cp.ty + 'px) scale(' + hand.cardScale + ')';
									} else {
										draws.push(cp);
									}
									card = cp;
								} else {
									card = dui.element.create('card thrown gainingcard');
									draws.push(card);
								}

								cards[i] = card;
								cards[i].fixed = true;
								fragment.appendChild(cards[i]);
							}

							if (draws.length)
								dui.layoutDrawCards(draws, player);

							ui.arena.appendChild(fragment);
							dui.queueNextFrameTick(function () {
								dui.layoutDrawCards(cards, target);
								dui.delayRemoveCards(cards, 460, 220);
							});
						}
						$gain2(cards, log) {
							var type = get.itemtype(cards);
							if (type != 'cards') {
								if (type != 'card')
									return;

								type = 'cards';
								cards = [cards];
							}

							if (log === true)
								game.log(this, '获得了', cards);

							game.broadcast(function (player, cards) {
								player.$gain2(cards);
							}, this, cards);

							var gains = [];
							var draws = [];

							var card;
							var clone;
							for (var i = 0; i < cards.length; i++) {
								clone = cards[i].clone;
								card = cards[i].copy('thrown', 'gainingcard');
								card.fixed = true;
								if (clone && clone.parentNode == ui.arena) {
									card.scaled = true;
									card.style.transform = clone.style.transform;
									gains.push(card);
								} else {
									draws.push(card);
								}
							}

							if (gains.length)
								game.addVideo('gain2', this, get.cardsInfo(gains));

							if (draws.length)
								game.addVideo('drawCard', this, get.cardsInfo(draws));

							if (cards.duiMod && this == game.me)
								return;

							cards = gains.concat(draws);
							dui.layoutDrawCards(draws, this, true);

							var player = this;
							var fragment = document.createDocumentFragment();
							for (var i = 0; i < cards.length; i++)
								fragment.appendChild(cards[i]);

							ui.arena.appendChild(fragment);
							dui.queueNextFrameTick(function () {
								dui.layoutDrawCards(cards, player);
								dui.delayRemoveCards(cards, 460, 220);
							});
						}
						$skill(name, type, color, avatar) {
							if (!decadeUI.config.gameAnimationEffect || !decadeUI.animation.gl) return super.$skill(...arguments);
							var _this = this;
							if (typeof type != 'string') type = 'legend';

							game.addVideo('skill', this, [name, type, color, avatar]);
							game.broadcastAll(function (player, type, name, color, avatar) {
								if (window.decadeUI == void 0) {
									game.delay(2.5);
									if (name) player.$fullscreenpop(name, color, avatar);
									return;
								}

								decadeUI.delay(2500);
								if (name) decadeUI.effect.skill(player, name, avatar);
							}, _this, type, name, color, avatar);
						}
						$damagepop(num, nature, font, nobroadcast) {
							if (typeof num == 'number' || typeof num == 'string') {
								game.addVideo('damagepop', this, [num, nature, font]);
								if (nobroadcast !== false) {
									game.broadcast(function (player, num, nature, font) {
										player.$damagepop(num, nature, font);
									}, this, num, nature, font);
								}

								var node;
								if (this.popupNodeCache && this.popupNodeCache.length) {
									node = this.popupNodeCache.shift();
								} else {
									node = decadeUI.element.create('damage');
								}

								if (font) {
									node.classList.add('normal-font');
								} else {
									node.classList.remove('normal-font');
								}

								if (typeof num == 'number') {
									node.popupNumber = num;
									if (num == Infinity) {
										num = '+∞'
									} else if (num == -Infinity) {
										num = '-∞';
									} else if (num > 0) {
										num = '+' + num;
									}

								} else {
									node.popupNumber = null;
								}

								node.innerHTML = num;
								node.dataset.text = node.innerText;
								node.nature = nature || 'soil';
								this.damagepopups.push(node);
							}

							if (this.damagepopups.length && !this.damagepopLocked) {
								var node = this.damagepopups.shift();
								this.damagepopLocked = true;
								if (this != node.parentNode) this.appendChild(node);

								var player = this;
								if (typeof node.popupNumber == 'number') {
									var popupNum = node.popupNumber;
									if (popupNum < 0) {
										switch (node.nature) {
											case 'thunder':
												if (popupNum <= -2) {
													decadeUI.animation.playSpine({ name: 'effect_shoujidonghua', action: 'play6' }, { scale: 0.8, parent: player });
												} else {
													decadeUI.animation.playSpine({ name: 'effect_shoujidonghua', action: 'play5' }, { scale: 0.8, parent: player });
												}
												break;
											case 'fire':
												if (popupNum <= -2) {
													decadeUI.animation.playSpine({ name: 'effect_shoujidonghua', action: 'play4' }, { scale: 0.8, parent: player });
												} else {
													decadeUI.animation.playSpine({ name: 'effect_shoujidonghua', action: 'play3' }, { scale: 0.8, parent: player });
												}
												break;
											case 'water':
												break;
											default:
												if (popupNum <= -2) {
													decadeUI.animation.playSpine({ name: 'effect_shoujidonghua', action: 'play2' }, { scale: 0.8, parent: player });
												} else {
													decadeUI.animation.playSpine({ name: 'effect_shoujidonghua', action: 'play1' }, { scale: 0.8, parent: player });
												}
												break;
										}
									} else {
										if (node.nature == 'wood') {
											decadeUI.animation.playSpine('effect_zhiliao', { scale: 0.7, parent: player });
										}
									}
								}

								node.style.animation = 'open-fade-in-out 1.2s';
								setTimeout(function (player, node) {
									if (!player.popupNodeCache) player.popupNodeCache = [];
									node.style.animation = '';
									player.popupNodeCache.push(node);
								}, 1210, player, node);

								setTimeout(function (player) {
									player.damagepopLocked = false;
									player.$damagepop();
								}, 500, player);
							}
						}
						$damage(source) {
							if (get.itemtype(source) == 'player') {
								game.addVideo('damage', this, source.dataset.position);
							} else {
								game.addVideo('damage', this);
							}
							game.broadcast(function (player, source) {
								player.$damage(source);
							}, this, source);

							this.queueCssAnimation('player-hurt 0.3s');
						}
						$dieflip() {
							if (!decadeUI.config.playerDieEffect) super.$dieflip(...arguments);
						}
						setModeState(info) {
							if (info && info.seat) {
								if (!this.node.seat) this.node.seat = ui.create.div('.seat', this);

								this.node.seat.innerHTML = get.cnNumber(info.seat, true);
							}

							return super.setModeState ? super.setModeState(...arguments) : this.init(info.name, info.name2);
						}
						checkBoundsCache(forceUpdate) {
							var update;
							var refer = dui.boundsCaches.arena;
							refer.check();

							if (this.cacheReferW != refer.width ||
								this.cacheReferH != refer.height ||
								this.cachePosition != this.dataset.position)
								update = true;

							this.cacheReferW = refer.width;
							this.cacheReferH = refer.height;
							this.cachePosition = this.dataset.position;
							if (this.cacheLeft == null)
								update = true;

							if (update || forceUpdate) {
								this.cacheLeft = this.offsetLeft;
								this.cacheTop = this.offsetTop;
								this.cacheWidth = this.offsetWidth;
								this.cacheHeight = this.offsetHeight;
							}
						}
						queueCssAnimation(animation) {
							var current = this.style.animation;
							var animations = this._cssanimations;
							if (animations == undefined) {
								animations = [];
								this._cssanimations = animations;
								this.addEventListener('animationend', function (e) {
									if (this.style.animationName != e.animationName)
										return;

									var current = this.style.animation;
									var animations = this._cssanimations;
									while (animations.length) {
										this.style.animation = animations.shift();
										if (this.style.animation != current)
											return;

										animations.current = this.style.animation;
									}

									animations.current = '';
									this.style.animation = '';
								});
							}

							if (animations.current || animations.length) {
								animations.push(animation);
								return;
							}

							animations.current = animation;
							this.style.animation = animation;
						}
					};
					lib.element.Card = class extends lib.element.Card {
						constructor(){
							let card = super(...arguments);
							Object.setPrototypeOf(card,lib.element.Card.prototype);
							return card;
						}
						buildNode() {
							super.buildNode();
							const node = this.node;
							this.removeChild(node.info);
							const suitNumber = this.$suitnum = node.suitnum = ui.create.div('.suit-num', this);
							this.$gaintag = node.gaintag = ui.create.div('.gaintag.info', this);
							const judgeMark = node.judgeMark = ui.create.div('.judge-mark', this);
							node.cardMask = ui.create.div('.card-mask', this);
							this.$name = ui.create.div('.top-name', this);
							this.$vertname = node.name;
							const equip = this.$equip = node.name2;
							this.$range = node.range;
							const numberNode = suitNumber.$num = decadeUI.element.create(null, suitNumber, 'span');
							numberNode.style.fontFamily = '"STHeiti","SimHei","Microsoft JhengHei","Microsoft YaHei","WenQuanYi Micro Hei",Helvetica,Arial,sans-serif';
							const suitNode = suitNumber.$suit = decadeUI.element.create('suit', suitNumber, 'span');
							suitNode.style.fontFamily = '"STHeiti","SimHei","Microsoft JhengHei","Microsoft YaHei","WenQuanYi Micro Hei",Helvetica,Arial,sans-serif';
							equip.$suitnum = decadeUI.element.create(null, equip, 'span');
							equip.$name = decadeUI.element.create(null, equip, 'span');
							judgeMark.node = {
								back: ui.create.div('.back', judgeMark),
								mark: ui.create.div('.mark', judgeMark),
								judge: ui.create.div('.judge', judgeMark)
							};
						}
						$init() {
							super.$init(...arguments);
							const verticalName = this.$vertname;
							this.$name.innerHTML = verticalName.innerHTML;
							let cardNumber = this.number || '';
							const parsedCardNumber = parseInt(cardNumber);

							if (parsedCardNumber == cardNumber) cardNumber = parsedCardNumber;

							switch (cardNumber) {
								case 1:
									this.$suitnum.$num.innerHTML = 'A';
									break;
								case 11:
									this.$suitnum.$num.innerHTML = 'J';
									break;
								case 12:
									this.$suitnum.$num.innerHTML = 'Q';
									break;
								case 13:
									this.$suitnum.$num.innerHTML = 'K';
									break;
								default: this.$suitnum.$num.innerHTML = cardNumber.toString();
							}

							this.$suitnum.$suit.innerHTML = get.translation(this.dataset.suit = this.suit);
							const equip = this.$equip;
							const innerHTML = equip.innerHTML;
							equip.$suitnum.innerHTML = innerHTML.slice(0, innerHTML.indexOf(' '));
							equip.$name.innerHTML = innerHTML.slice(innerHTML.indexOf(' '));
							const node = this.node;
							const background = node.background;
							node.judgeMark.node.judge.innerHTML = background.innerHTML;
							const classList = background.classList;

							if (classList.contains('tight')) classList.remove('tight');

							const cardStyle = this.style;

							if (cardStyle.color) cardStyle.removeProperty('color');

							if (cardStyle.textShadow) cardStyle.removeProperty('text-shadow');

							const info = node.info;
							const infoStyle = info.style;

							if (infoStyle.opacity) infoStyle.removeProperty('opacity');

							const verticalNameStyle = verticalName.style;

							if (verticalNameStyle.opacity) verticalNameStyle.removeProperty('opacity');

							if (info.childElementCount) while (info.firstChild) {
								info.removeChild(info.lastChild);
							}

							if (equip.childElementCount) while (equip.firstChild) {
								equip.removeChild(equip.lastChild);
							}

							if (decadeUI.config.cardPrettify) {
								const decadeExtCardImage = lib.decade_extCardImage || (lib.decade_extCardImage = {});
								const cardNature = this.nature;
								const cardName = this.name;
								const fileName = cardNature ? `${cardName}_${get.natureList(cardNature).sort(lib.sort.nature).join('_')}` : cardName;
								let decadeCardSource = decadeExtCardImage[fileName];
								let not_load_card_names = ['sha_kami'];
								if (!decadeCardSource && cardName != fileName && !not_load_card_names.includes(fileName)) decadeCardSource = decadeExtCardImage[cardName];

								if (decadeCardSource) {
									this.classList.add('decade-card');

									if (!this.classList.contains('infohidden')) this.style.backgroundImage = `url('${this.decadeCardSource = decadeCardSource}')`;

									const avatar = this.node.avatar;

									if (avatar) avatar.remove();

									const frameBackground = this.node.framebg;

									if (frameBackground) frameBackground.remove();

									new MutationObserver(mutationRecords => mutationRecords.forEach(mutationRecord => {
										const target = mutationRecord.target;
										const informationHidden = target.classList.contains('infohidden');

										if (informationHidden == mutationRecord.oldValue.split(' ').includes('infohidden')) return;

										if (informationHidden) target.style.removeProperty('background-image');
										else target.style.backgroundImage = `url('${target.decadeCardSource}')`;
									})).observe(this, {
										attributeFilter: ['class'],
										attributeOldValue: true
									});
								}
								if(!window.fs && typeof resolveLocalFileSystemURL != 'function'){
									const imgFormat = 'webp';
									if (!this.classList.contains('infohidden')) {
										const decadeCardImage = new Image(), decadeExtCardImage = lib.decade_extCardImage || {};
										new Promise((resolve, reject) => {
											decadeCardImage.onerror = reject;
											decadeCardImage.onload = resolve;
											if(!not_load_card_names.includes(fileName)){
												decadeCardImage.src = decadeExtCardImage[fileName] || `${lib.assetURL}extension/`+window.decadeUI.extensionName+`/image/card/${fileName}.${imgFormat}`;
											}
										}).catch(event => new Promise((resolve, reject) => {
											if (cardName == fileName) reject(event);
											decadeCardImage.onerror = reject;
											decadeCardImage.onload = resolve;
											decadeCardImage.src = decadeExtCardImage[cardName] || `${lib.assetURL}extension/`+window.decadeUI.extensionName+`/image/card/${cardName}.${imgFormat}`;
										})).then(event => {
											this.classList.add('decade-card');
											this.style.background = `url('${event.target.src}')`;
											if (this.node.avatar) this.node.avatar.remove();
											if (this.node.framebg) this.node.framebg.remove();
										}).catch(err => {
											//console.log('error: ', err);
										});
									}
								}
							}

							return this;
						}
						moveDelete(player) {
							this.fixed = true;
							this.moveTo(player);
							setTimeout(function (card) {
								card.delete();
							}, 460, this);
						}
						moveTo(player) {
							if (!player)
								return;

							var arena = dui.boundsCaches.arena;
							if (!arena.updated)
								arena.update();

							player.checkBoundsCache();
							this.fixed = true;
							var x = Math.round((player.cacheWidth - arena.cardWidth) / 2 + player.cacheLeft);
							var y = Math.round((player.cacheHeight - arena.cardHeight) / 2 + player.cacheTop);
							var scale = arena.cardScale;

							this.tx = x;
							this.ty = y;
							this.scaled = true;
							this.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ')';
							return this;
						}
						copy() {
							const node = super.copy(...arguments);
							node.decadeCardSource = this.decadeCardSource;

							if (this.clone && node.classList.contains('decade-card')) new MutationObserver(mutationRecords => mutationRecords.forEach(mutationRecord => {
								const target = mutationRecord.target, informationHidden = target.classList.contains('infohidden');

								if (informationHidden == mutationRecord.oldValue.split(' ').includes('infohidden')) return;

								if (informationHidden) target.style.removeProperty('background-image');
								else target.style.backgroundImage = `url('${target.decadeCardSource}')`;
							})).observe(node, {
								attributeFilter: ['class'],
								attributeOldValue: true
							});

							if (decadeUI.config.cardPrettify) {
								if(!window.fs && typeof resolveLocalFileSystemURL != 'function'){
									const decadeExtCardImage = lib.decade_extCardImage || (lib.decade_extCardImage = {});
									const cardNature = node.nature;
									const cardName = node.name;
									const fileName = cardNature ? `${cardName}_${get.natureList(cardNature).sort(lib.sort.nature).join('_')}` : cardName;
									let not_load_card_names = ['sha_kami'];
									const imgFormat = 'webp';
									if (!node.classList.contains('infohidden')) {
										const decadeCardImage = new Image(), decadeExtCardImage = lib.decade_extCardImage || {};
										new Promise((resolve, reject) => {
											decadeCardImage.onerror = reject;
											decadeCardImage.onload = resolve;
											if(!not_load_card_names.includes(fileName)){
												decadeCardImage.src = decadeExtCardImage[fileName] || `${lib.assetURL}extension/`+window.decadeUI.extensionName+`/image/card/${fileName}.${imgFormat}`;
											}
										}).catch(event => new Promise((resolve, reject) => {
											if (cardName == fileName) reject(event);
											decadeCardImage.onerror = reject;
											decadeCardImage.onload = resolve;
											decadeCardImage.src = decadeExtCardImage[cardName] || `${lib.assetURL}extension/`+window.decadeUI.extensionName+`/image/card/${cardName}.${imgFormat}`;
										})).then(event => {
											node.classList.add('decade-card');
											node.style.background = `url('${event.target.src}')`;
											if (node.node.avatar) node.node.avatar.remove();
											if (node.node.framebg) node.node.framebg.remove();
										}).catch(err => {
											//console.log('error: ', err);
										});
									}
								}
							}

							return node;
						}
					};
					lib.element.GameEvent = class extends lib.element.GameEvent {
						addMessageHook(message, callback) {
							if (this._messages == undefined)
								this._messages = {};

							message = message.toLowerCase();
							if (this._messages[message] == undefined)
								this._messages[message] = [];

							message = this._messages[message];
							message.push(callback);
						}
						triggerMessage(message) {
							if (this._messages == undefined)
								return;

							message = message.toLowerCase();
							if (this._messages[message] == undefined)
								return;

							message = this._messages[message];
							for (var i = 0; i < message.length; i++) {
								if (typeof message[i] == 'function')
									message[i].call(this);
							}

							this._messages[message] = [];
						}
					};
					lib.element.Dialog = class extends lib.element.Dialog {
						constructor() {
							const dialog = super(...arguments);
							dialog.bar1.remove();
							delete dialog.bar1;
							dialog.bar2.remove();
							delete dialog.bar2;
							Object.setPrototypeOf(dialog,lib.element.Dialog.prototype);
							return dialog;
						}
					};
					Mixin.replace(
						'lib.element.Dialog.prototype.add | lib.element.dialog.add',
						/(?=\s*this\s*\.\s*buttons\s*=\s*this\s*\.\s*buttons\s*\.\s*concat\s*\(\s*ui\s*\.\s*create\s*\.\s*buttons\s*\(\s*item\s*\[\s*0\s*\]\s*,\s*item\[\s*1\s*\]\s*,\s*buttons\s*,\s*noclick\s*\)\s*\)\s*;)/,
						function (item, buttons) {
							if (typeof item[1] == 'string' && item[1].includes('character')) {
								if (this.intersection == undefined && self.IntersectionObserver) this.intersection = new IntersectionObserver((intersectionObserverEntries, intersectionObserver) => intersectionObserverEntries.forEach(intersectionObserverEntry => {
									if (intersectionObserverEntry.intersectionRatio <= 0) return;
									const target = intersectionObserverEntry.target;
									target.setBackground(target.awaitItem, 'character');
									intersectionObserver.unobserve(target);
								}), {
									root: this,
									rootMargin: '0px',
									thresholds: 0.01,
								});
								buttons.intersection = this.intersection;
							}
						}
					);
					const uiCreateIdentityCard = ui.create.identityCard;
					ui.create.identityCard = function (identity) {
						const identityCard = uiCreateIdentityCard(...arguments);
						const decadeExtCardImage = lib.decade_extCardImage || (lib.decade_extCardImage = {});
						const decadeCardSource = decadeExtCardImage[`identity_${identity}`];

						if (decadeCardSource) {
							identityCard.classList.add('decade-card');

							if (!identityCard.classList.contains('infohidden')) identityCard.style.backgroundImage = `url('${identityCard.decadeCardSource = decadeCardSource}')`;

							const avatar = identityCard.node.avatar;

							if (avatar) avatar.remove();

							const frameBackground = identityCard.node.framebg;

							if (frameBackground) frameBackground.remove();

							new MutationObserver(mutationRecords => mutationRecords.forEach(mutationRecord => {
								const target = mutationRecord.target;
								const informationHidden = target.classList.contains('infohidden');

								if (informationHidden == mutationRecord.oldValue.split(' ').includes('infohidden')) return;

								if (informationHidden) target.style.removeProperty('background-image');
								else target.style.backgroundImage = `url('${target.decadeCardSource}')`;
							})).observe(identityCard, {
								attributeFilter: ['class'],
								attributeOldValue: true
							});
						}

						return identityCard;
					}
					ui.updateRoundNumber = (roundNumber, cardPileNumber) => {
						if (ui.cardPileNumber && window.decadeUI) ui.cardPileNumber.textContent = `牌堆${cardPileNumber} 第${roundNumber}轮`;
					};
				},
				dialog:{
					create:function(className, parentNode, tagName){
						var element = !tagName ? document.createElement('div') : document.createElement(tagName);
						for(var i in decadeUI.dialog){
							if (decadeUI.dialog[i]) element[i] = decadeUI.dialog[i];
						}

						element.listens = {};
						for(var i in decadeUI.dialog.listens){
							if (decadeUI.dialog.listens[i]) element.listens[i] = decadeUI.dialog.listens[i];
						}

						element.listens._dialog = element;
						element.listens._list = [];

						if (className) element.className = className;
						if (parentNode) parentNode.appendChild(element);

						return element;
					},
					open:function(){
						if (this == decadeUI.dialog) return console.error('undefined');
					},
					show:function(){
						if (this == decadeUI.dialog) return console.error('undefined');

						this.classList.remove('hidden');
					},
					hide:function(){
						if (this == decadeUI.dialog) return console.error('undefined');

						this.classList.add('hidden');
					},
					animate:function(property, duration, toArray, fromArrayOptional){
						if (this == decadeUI.dialog) return console.error('undefined');
						if (property == null || duration == null || toArray == null) return console.error('arguments');

						var propArray = property.replace(/\s*/g, '').split(',');
						if (!propArray || propArray.length == 0) return console.error('property');

						var realDuration = 0;
						if (duration.lastIndexOf('s') != -1){
							if (duration.lastIndexOf('ms') != -1){
								duration = duration.replace(/ms/, '');
								duration = parseInt(duration);
								if (isNaN(duration)) return console.error('duration');
								realDuration = duration;
							}else{
								duration = duration.replace(/s/, '');
								duration = parseFloat(duration);
								if (isNaN(duration)) return console.error('duration');
								realDuration = duration * 1000;
							}
						}else {
							duration = parseInt(duration);
							if (isNaN(duration)) return console.error('duration');
							realDuration = duration;
						}

						if (fromArrayOptional){
							for (var i = 0; i < propArray.length; i++){
								this.style.setProperty(propArray[i], fromArrayOptional[i]);
							}
						}

						var duraBefore = this.style.transitionDuration;
						var propBefore = this.style.transitionProperty;
						this.style.transitionDuration = realDuration + 'ms';
						this.style.transitionProperty = property;

						ui.refresh(this);
						for (var i = 0; i < propArray.length; i++){
							this.style.setProperty(propArray[i], toArray[i]);
						}

						var restore = this;
						setTimeout(function(){
							restore.style.transitionDuration = duraBefore;
							restore.style.transitionProperty = propBefore;
						}, realDuration);
					},
					close:function(delayTime, fadeOut){
						if (this == decadeUI.dialog) return console.error('undefined');
						this.listens.clear();

						if (!this.parentNode) return;

						if (fadeOut === true && delayTime) {
							this.animate('opacity', delayTime, 0);
						}

						if (delayTime) {
							var remove = this;
							delayTime = (typeof delayTime == 'number') ? delayTime : parseInt(delayTime);
							setTimeout(function(){
								if (remove.parentNode) remove.parentNode.removeChild(remove);
							}, delayTime);
							return;
						}

						this.parentNode.removeChild(this);
						return;
					},
					listens:{
						add:function(listenElement, event, func, useCapture){
							if (!this._dialog || !this._list) return console.error('undefined');
							if (!(listenElement instanceof HTMLElement) || !event || (typeof func !== 'function')) return console.error('arguments');

							this._list.push(new Array(listenElement, event, func));
							listenElement.addEventListener(event, func);
						},
						remove:function(listenElementOptional, eventOptional, funcOptional){
							if (!this._dialog || !this._list) return console.error('undefined');

							var list = this._list;
							if (listenElementOptional && eventOptional && funcOptional){
								var index = list.indexOf(new Array(listenElementOptional, eventOptional, funcOptional));
								if (index != -1){
									list[index][0].removeEventListener(list[index][1], list[index][2]);
									list.splice(index, 1);
									return;
								}
							}else if (listenElementOptional && eventOptional){
								for (var i = list.length - 1; i >= 0; i--){
									if (list[i][0] == listenElementOptional && list[i][1] == eventOptional){
										list[i][0].removeEventListener(list[i][1], list[i][2]);
										list.splice(i, 1);
									}
								}
							}else if (listenElementOptional && funcOptional){
								for (var i = list.length - 1; i >= 0; i--){
									if (list[i][0] == listenElementOptional && list[i][2] == funcOptional){
										list[i][0].removeEventListener(list[i][1], list[i][2]);
										list.splice(i, 1);
									}
								}
							}else if (eventOptional && funcOptional){
								for (var i = list.length - 1; i >= 0; i--){
									if (list[i][1] == eventOptional && list[i][2] == funcOptional){
										list[i][0].removeEventListener(list[i][1], list[i][2]);
										list.splice(i, 1);
									}
								}
							}else if (listenElementOptional){
								for (var i = list.length - 1; i >= 0; i--){
									if (list[i][0] == listenElementOptional){
										list[i][0].removeEventListener(list[i][1], list[i][2]);
										list.splice(i, 1);
									}
								}
							}else if (eventOptional){
								for (var i = list.length - 1; i >= 0; i--){
									if (list[i][1] == eventOptional){
										list[i][0].removeEventListener(list[i][1], list[i][2]);
										list.splice(i, 1);
									}
								}
							}else if (funcOptional){
								for (var i = list.length - 1; i >= 0; i--){
									if (list[i][2] == funcOptional){
										list[i][0].removeEventListener(list[i][1], list[i][2]);
										list.splice(i, 1);
									}
								}
							}
						},
						clear:function(){
							if (!this._dialog || !this._list) return console.error('undefined');

							var list = this._list;
							for (var i = list.length - 1; i >= 0; i--){
								list[i][0].removeEventListener(list[i][1], list[i][2]);
								list[i] = undefined;
							}
							list.length = 0;
						}
					}
				},
				animate:{
					check:function(){
						if (!ui.arena) return false;

						if (this.updates == undefined) this.updates = [];
						if (this.canvas == undefined) {
							this.canvas = ui.arena.appendChild(document.createElement('canvas'));
							this.canvas.id = 'decadeUI-canvas-arena';
						}

						return true;
					},
					add:function(frameFunc){
						if (typeof frameFunc != 'function') return;
						if (!this.check()) return;

						var obj = {
							inits: [],
							update: frameFunc,
							id: decadeUI.getRandom(0, 100),
						};

						if (arguments.length > 2) {
							obj.inits = new Array(arguments.length - 2);
							for (var i = 2; i < arguments.length; i++) {
								obj.inits[i - 2] = arguments[i];
							}
						}

						this.updates.push(obj);
						if (this.frameId == undefined) this.frameId = requestAnimationFrame(this.update.bind(this));




					},
					update:function(){
						var frameTime = performance.now();
						var delta = frameTime - (this.frameTime == undefined ? frameTime : this.frameTime);

						this.frameTime = frameTime;

						var e = {
							canvas: this.canvas,
							context: this.canvas.getContext('2d'),
							deltaTime: delta,
							save:function(){
								this.context.save();
								return this.context;
							},
							restore:function(){
								this.context.restore();
								return this.context;
							},
							drawLine:function(x1, y1, x2, y2, color, lineWidth){
								if (x1 == null || y1 == null) throw 'arguments';

								var context = this.context;
								context.beginPath();

								if (color) context.strokeStyle = color;
								if (lineWidth) context.lineWidth = lineWidth;

								if (x2 == null || y2 == null) {
									context.lineTo(x1, y1);
								} else {
									context.moveTo(x1, y1);
									context.lineTo(x2, y2);
								}

								context.stroke();
							},
							drawRect:function(x, y , width, height, color, lineWidth){
								if (x == null || y == null || width == null || height == null) throw 'arguments';

								var ctx = this.context;
								ctx.beginPath();

								if (color) ctx.strokeStyle = color;
								if (lineWidth) ctx.lineWidth = lineWidth;
								ctx.rect(x, y, width, height);
								ctx.stroke();
							},
							drawText:function(text, font, color, x, y, textAlign, textBaseline, stroke){
								if (!text) return;
								if (x == null || y == null) throw 'x or y';
								var context = this.context;

								if (font) context.font = font;
								if (textAlign) context.textAlign = textAlign;
								if (textBaseline) context.textBaseline = textBaseline;
								if (color) {
									if (!stroke) context.fillStyle = color;
									else context.strokeStyle = color;
								}

								if (!stroke) context.fillText(text, x, y);
								else context.strokeText(text, x, y);
							},
							drawStrokeText:function(text, font, color, x, y, textAlign, textBaseline){
								this.drawText(text, font, color, x, y, textAlign, textBaseline, true);
							},
							fillRect:function(x, y , width, height, color){
								if (color) this.context.fillStyle = color;
								this.context.fillRect(x, y , width, height);
							},
						};


						if (!decadeUI.dataset.animSizeUpdated) {
							decadeUI.dataset.animSizeUpdated = true;
							e.canvas.width = e.canvas.parentNode.offsetWidth;
							e.canvas.height = e.canvas.parentNode.offsetHeight;
						}

						e.canvas.height = e.canvas.height;
						var args;

						var task;
						for (var i = 0; i < this.updates.length; i++) {
							task = this.updates[i];
							args = Array.from(task.inits);
							args.push(e);
							e.save();
							if (task.update.apply(task, args)) {
								this.updates.remove(task);i--;
							}
							e.restore();
						}

						if (this.updates.length == 0) {
							this.frameId = undefined;
							this.frameTime = undefined;

							return;
						}

						this.frameId = requestAnimationFrame(this.update.bind(this));


					},
				},
				ResizeSensor:(function(){
					function ResizeSensor(element) {
						this.element = element;
						this.width = element.clientWidth || 1;
						this.height = element.clientHeight || 1;
						this.maximumWidth = 10000 * (this.width);
						this.maximumHeight = 10000 * (this.height);
						this.events = [];

						var expand = document.createElement('div');
						expand.style.cssText = 'position:absolute;top:0;bottom:0;left:0;right:0;z-index=-10000;overflow:hidden;visibility:hidden;transition:all 0s;';
						var shrink = expand.cloneNode(false);

						var expandChild = document.createElement('div');
						expandChild.style.cssText = 'transition: all 0s !important; animation: none !important;';
						var shrinkChild = expandChild.cloneNode(false);

						expandChild.style.width = this.maximumWidth + 'px';
						expandChild.style.height = this.maximumHeight + 'px';
						shrinkChild.style.width = '250%';
						shrinkChild.style.height = '250%';

						expand.appendChild(expandChild);
						shrink.appendChild(shrinkChild);
						element.appendChild(expand);
						element.appendChild(shrink);
						if (expand.offsetParent != element){
							element.style.position = 'relative';
						}

						expand.scrollTop = shrink.scrollTop = this.maximumHeight;
						expand.scrollLeft = shrink.scrollLeft = this.maximumWidth;

						var sensor = this;
						sensor.onscroll = function (e) {
							sensor.w = sensor.element.clientWidth || 1;
							sensor.h = sensor.element.clientHeight || 1;

							if (sensor.w != sensor.width || sensor.h != sensor.height){
								sensor.width = sensor.w;
								sensor.height = sensor.h;
								sensor.dispatchEvent();
							}

							expand.scrollTop = shrink.scrollTop = sensor.maximumHeight;
							expand.scrollLeft = shrink.scrollLeft = sensor.maximumWidth;
						};

						expand.addEventListener('scroll', sensor.onscroll);
						shrink.addEventListener('scroll', sensor.onscroll);
						sensor.expand = expand;
						sensor.shrink = shrink;
					}

					ResizeSensor.prototype.addListener = function (callback, capture) {
						if (this.events == undefined) this.events = [];
						this.events.push({
							callback: callback,
							capture: capture,
						});
					};

					ResizeSensor.prototype.dispatchEvent = function () {
						var capture = true;
						var evt;

						for (var i = 0; i < this.events.length; i++) {
							evt = this.events[i];
							if (evt.capture) {
								evt.callback();
							} else {
								capture = false;
							}
						}

						if (!capture) {
							requestAnimationFrame(this.dispatchFrameEvent.bind(this));
						}
					};

					ResizeSensor.prototype.dispatchFrameEvent = function () {
						var evt;
						for (var i = 0; i < this.events.length; i++) {
							evt = this.events[i];
							if (!evt.capture)
							evt.callback();
						}
					};

					ResizeSensor.prototype.close = function(){
						this.expand.removeEventListener('scroll', this.onscroll);
						this.shrink.removeEventListener('scroll', this.onscroll);

						if (!this.element){
							this.element.removeChild(this.expand);
							this.element.removeChild(this.shrink);
						}

						this.events = null;
					};

					return ResizeSensor;
				})(),
				sheet:{
					init:function(){
						if (!this.sheetList){
							this.sheetList = [];
							for (var i = 0; i < document.styleSheets.length; i++){
								if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf('extension/' + encodeURI(decadeUIName)) != -1){
									this.sheetList.push(document.styleSheets[i]);
								}
							}
						}

						if (this.sheetList) delete this.init;
					},
					getStyle:function(selector, cssName){
						if (!this.sheetList) this.init();
						if (!this.sheetList) throw 'sheet not loaded';
						if ((typeof selector != 'string') || !selector) throw 'parameter "selector" error';
						if (!this.cachedSheet) this.cachedSheet = {};
						if (this.cachedSheet[selector]) return this.cachedSheet[selector];


						var sheetList = this.sheetList;
						var sheet;
						var shouldBreak = false;

						for (var j = sheetList.length - 1; j >= 0; j--) {
							if (typeof cssName == 'string') {
								cssName = cssName.replace(/.css/, '') + '.css';
								for (var k = j; k >= 0; k--) {
									if (sheetList[k].href.indexOf(cssName) != -1) {
										sheet = sheetList[k];
									}
								}

								shouldBreak = true;
								if (!sheet) throw 'cssName not found';
							} else {
								sheet = sheetList[j];
							}

							for (var i = 0; i < sheet.cssRules.length; i++) {
								if (!(sheet.cssRules[i] instanceof CSSMediaRule)) {
									if (sheet.cssRules[i].selectorText == selector) {
										this.cachedSheet[selector] = sheet.cssRules[i].style;
										return sheet.cssRules[i].style;
									}
								} else {
									var rules = sheet.cssRules[i].cssRules;
									for (var j = 0; j < rules.length; j++) {
										if (rules[j].selectorText == selector) {
											return rules[j].style;
										}
									}
								}
							}


							if (shouldBreak) break;
						}

						return null;
					},
					insertRule:function(rule, index, cssName){
						if (!this.sheetList) this.init();
						if (!this.sheetList) throw 'sheet not loaded';
						if ((typeof rule != 'string') || !rule) throw 'parameter "rule" error';

						var sheet;
						if (typeof cssName == 'string') {
							for (var j = sheetList.length - 1; j >= 0; j--) {
								cssName = cssName.replace(/.css/, '') + '.css';
								if (sheetList[j].href.indexOf(cssName) != -1) {
									sheet = sheetList[k];
								}
							}

							if (!sheet) throw 'cssName not found';
						}

						if (!sheet) sheet = this.sheetList[this.sheetList.length - 1];
						var inserted = 0;
						if (typeof index == 'number'){
							inserted = sheet.insertRule(rule, index);
						} else {
							inserted = sheet.insertRule(rule, sheet.cssRules.length);
						}

						return sheet.cssRules[inserted].style;
					}
				},
				layout:{
					update:function(){
						this.updateHand();
						this.updateDiscard();

					},
					updateHand:function(){
						if (!game.me)
						return;

						var handNode = ui.handcards1;
						if (!handNode)
						return console.error('hand undefined');


						var card;
						var cards = [];
						var childs = handNode.childNodes;
						for (var i = 0; i < childs.length; i++) {
							card = childs[i];
							if (!card.classList.contains('removing')) {
								cards.push(card);
							} else {
								card.scaled = false;
							}
						}

						if (!cards.length)
						return;

						var bounds = dui.boundsCaches.hand;
						bounds.check();

						var pw = bounds.width;
						var ph = bounds.height;
						var cw = bounds.cardWidth;
						var ch = bounds.cardHeight;
						var cs = bounds.cardScale;

						var csw  = cw * cs;

						var x;
						var y = Math.round((ch * cs - ch) / 2);

						var xMargin = csw + 2;
						var xStart = (csw - cw) / 2;
						var totalW = cards.length * csw + (cards.length - 1) * 2;
						var limitW = pw;
						var expand;

						if (totalW > limitW) {
							xMargin = csw - Math.abs(limitW - csw * cards.length) / (cards.length - 1);
							if (lib.config.fold_card) {
								var min = 27 * cs;
								if (xMargin < min) {
									expand = true;
									xMargin = min;
								}
							}
						} else {
							xStart += (limitW - totalW) / 2;
						}

						var card;
						for (var i = 0; i < cards.length; i++) {
							x = Math.round(xStart + i * xMargin);
							card = cards[i];
							card.tx = x;
							card.ty = y;
							card.scaled = true;
							card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
							card._transform = card.style.transform;
						}

						if (expand) {




							ui.handcards1Container.style.overflowX = 'scroll';
							ui.handcards1Container.style.overflowY = 'hidden';
							handNode.style.width = Math.round(cards.length * xMargin + (csw - xMargin)) + 'px';
						} else {
							ui.handcards1Container.style.overflowX = '';
							ui.handcards1Container.style.overflowY = '';
							handNode.style.width = '100%';
						}

					},
					updateDiscard:function(){
						if (!ui.thrown)
						ui.thrown = [];
						for (var i = ui.thrown.length - 1; i >= 0; i--){
							if (ui.thrown[i].classList.contains('drawingcard') ||
							ui.thrown[i].classList.contains('removing') ||
							ui.thrown[i].parentNode != ui.arena || ui.thrown[i].fixed){
								ui.thrown.splice(i, 1);
							}else{
								ui.thrown[i].classList.remove('removing');
							}
						}

						if (!ui.thrown.length)
						return;

						var cards = ui.thrown;
						var bounds = dui.boundsCaches.arena;
						bounds.check();

						var pw = bounds.width;
						var ph = bounds.height;
						var cw = bounds.cardWidth;
						var ch = bounds.cardHeight;
						var cs = bounds.cardScale;
						var csw  = cw * cs;
						var x;
						var y = Math.round((ph - ch) / 2);
						var xMargin = csw + 2;
						var xStart = (csw - cw) / 2;
						var totalW = cards.length * csw + (cards.length - 1) * 2;
						var limitW = pw;
						if (totalW > limitW) {
							xMargin = csw - Math.abs(limitW - csw * cards.length) / (cards.length - 1);
						}else{
							xStart += (limitW - totalW) / 2;
						}
						var card;
						for (var i = 0; i < cards.length; i++){
							x = Math.round(xStart + i * xMargin);
							card = cards[i];
							card.tx = x;
							card.ty = y;
							card.scaled = true;
							card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
						}
					},
					clearout:function(card){
						if (!card)
						return;
						if (card.fixed || card.classList.contains('removing'))
						return;

						if (ui.thrown.indexOf(card) == -1){
							ui.thrown.splice(0, 0, card);
							dui.queueNextFrameTick(dui.layoutDiscard, dui);
						}

						card.classList.add('invalided');
						setTimeout(function(card){
							card.remove();
							dui.queueNextFrameTick(dui.layoutDiscard, dui);

						}, 2333, card);
					},
					delayClear:function(){
						var timestamp = 500;
						var nowTime = new Date().getTime();
						if (this._delayClearTimeout){
							clearTimeout(this._delayClearTimeout);
							timestamp = nowTime - this._delayClearTimeoutTime;
							if (timestamp > 1000){
								this._delayClearTimeout = null;
								this._delayClearTimeoutTime = null;
								ui.clear();
								return;
							}
						}else{
							this._delayClearTimeoutTime = nowTime;
						}

						this._delayClearTimeout = setTimeout(function(){
							decadeUI.layout._delayClearTimeout = null;
							decadeUI.layout._delayClearTimeoutTime = null;
							ui.clear();
						}, timestamp);
					},
					invalidate:function(){
						this.invalidateHand();
						this.invalidateDiscard();
					},
					invalidateHand:function(debugName){
						//和上下面的有点重复，有空合并
						var timestamp = 40;
						var nowTime = new Date().getTime();
						if (this._handcardTimeout){
							clearTimeout(this._handcardTimeout);
							timestamp = nowTime - this._handcardTimeoutTime;
							if (timestamp > 180){
								this._handcardTimeout = null;
								this._handcardTimeoutTime = null;
								this.updateHand();
								return;
							}
						}else{
							this._handcardTimeoutTime = nowTime;
						}

						this._handcardTimeout = setTimeout(function(){
							decadeUI.layout._handcardTimeout = null;
							decadeUI.layout._handcardTimeoutTime = null;
							decadeUI.layout.updateHand();
						}, timestamp);
					},
					invalidateDiscard:function(){
						var timestamp = (ui.thrown && ui.thrown.length > 15) ? 80 : 40;
						var nowTime = new Date().getTime();
						if (this._discardTimeout){
							clearTimeout(this._discardTimeout);
							timestamp = nowTime - this._discardTimeoutTime;
							if (timestamp > 180){
								this._discardTimeout = null;
								this._discardTimeoutTime = null;
								this.updateDiscard();
								return;
							}
						}else{
							this._discardTimeoutTime = nowTime;
						}

						this._discardTimeout = setTimeout(function(){
							decadeUI.layout._discardTimeout = null;
							decadeUI.layout._discardTimeoutTime = null;
							decadeUI.layout.updateDiscard();
						}, timestamp);
					},
					resize:function(){
						if (decadeUI.isMobile()) {
							ui.arena.classList.add('dui-mobile');
							ui.window.classList.add('dui-mobile');
						}
						else {
							ui.arena.classList.remove('dui-mobile');
							ui.window.classList.remove('dui-mobile');
						}

						var set = decadeUI.dataset;
						set.animSizeUpdated = false;
						set.bodySize.updated = false;

						var caches = decadeUI.boundsCaches;
						for (var key in caches)
						caches[key].updated = false;
						var buttonsWindow = decadeUI.sheet.getStyle('#window > .dialog.popped .buttons:not(.smallzoom)');
						if (!buttonsWindow) {
							buttonsWindow = decadeUI.sheet.insertRule('#window > .dialog.popped .buttons:not(.smallzoom) { zoom: 1; }');
						}

						var buttonsArena = decadeUI.sheet.getStyle('#arena:not(.choose-character) .buttons:not(.smallzoom)');
						if (!buttonsArena){
							buttonsArena = decadeUI.sheet.insertRule('#arena:not(.choose-character) .buttons:not(.smallzoom) { zoom: 1; }');
						}

						decadeUI.zooms.card = decadeUI.getCardBestScale();
						if (ui.me) {
							var height = Math.round(decadeUI.getHandCardSize().height * decadeUI.zooms.card + 30.4) + 'px';
							ui.me.style.height = height;
						}

						if (buttonsArena) {
							buttonsArena.zoom = decadeUI.zooms.card;
						}

						if (buttonsWindow) {
							buttonsWindow.zoom = decadeUI.zooms.card;
						}

						decadeUI.layout.invalidate();
					},

				},
				handler:{
					handMousewheel:function(e){
						if (!ui.handcards1Container) return console.error('ui.handcards1Container');

						var hand = ui.handcards1Container;
						if (hand.scrollNum == void 0) hand.scrollNum = 0;
						if (hand.lastFrameTime == void 0) hand.lastFrameTime = performance.now();

						function handScroll () {
							var now = performance.now();
							var delta = now - hand.lastFrameTime;
							var num = Math.round(delta / 16 * 16);
							hand.lastFrameTime = now;

							if (hand.scrollNum > 0) {
								num = Math.min(hand.scrollNum, num);
								hand.scrollNum -= num;
							} else {
								num = Math.min(-hand.scrollNum, num);
								hand.scrollNum += num;
								num = -num;
							}

							if (hand.scrollNum == 0) {
								hand.frameId = void 0;
								hand.lastFrameTime = void 0;
							} else {
								hand.frameId = requestAnimationFrame(handScroll);
								ui.handcards1Container.scrollLeft += num;
							}
						}

						if (e.wheelDelta > 0) {
							hand.scrollNum -= 84;
						} else {
							hand.scrollNum += 84;
						}

						if (hand.frameId == void 0) {
							hand.frameId = requestAnimationFrame(handScroll);
						}
					},
					touchScroll: function (e) {
						if (_status.mousedragging) return;
						if (_status.draggingtouchdialog) return;
						if (!_status.dragged) {
							if (Math.abs(e.touches[0].clientX / game.documentZoom - this.startX) > 10 ||
								Math.abs(e.touches[0].clientY / game.documentZoom - this.startY) > 10) {
								_status.dragged = true;
							}
						}
						if ((this == ui.handcards1Container || this == ui.handcards2Container) && !this.style.overflowX == 'scroll') {
							e.preventDefault();
						} else if (lib.device == 'ios' && this.scrollHeight <= this.offsetHeight + 5 && this.scrollWidth <= this.offsetWidth + 5) {
							e.preventDefault();
						} else {
							delete _status._swipeorigin;
							e.stopPropagation();
						}
					},
				},
				zooms:{
					body: 1,
					card: 1,
				},
				isMobile:function(){
					return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(navigator.userAgent));
				},
				delay:function(milliseconds){
					if (typeof milliseconds != 'number') throw 'milliseconds is not number';
					if(_status.paused) return;
					game.pause();
					_status.timeout = setTimeout(game.resume, milliseconds);
				},

				queueNextTick:function(callback, ctx){
					if (!dui._tickEntries)
					dui._tickEntries = [];

					dui._tickEntries.push({
						ctx: ctx,
						callback: callback
					});

					if (dui._queueTick)
					return;

					dui._queueTick = Promise.resolve().then(function(){
						dui._queueTick = null;
						var entries = dui._tickEntries;
						dui._tickEntries = [];
						for (var i = 0; i < entries.length; i++)
						entries[i].callback.call(entries[i].ctx);
					});
				},
				queueNextFrameTick:function(callback, ctx){
					if (!dui._frameTickEntries)
					dui._frameTickEntries = [];

					dui._frameTickEntries.push({
						ctx: ctx,
						callback: callback
					});

					if (dui._queueFrameTick)
					return;

					dui._queueFrameTick = requestAnimationFrame(function(){
						dui._queueFrameTick = null;
						setTimeout(function(entries){
							for (var i = 0; i < entries.length; i++)
							entries[i].callback.call(entries[i].ctx);

						}, 0, dui._frameTickEntries);
						dui._frameTickEntries = [];
					})
				},

				layoutHand:function(){
					dui.layout.updateHand();
				},

				layoutHandDraws:function(cards){
					var bounds = dui.boundsCaches.hand;
					bounds.check();

					var x, y;
					var pw = bounds.width;
					var ph = bounds.height;
					var cw = bounds.cardWidth;
					var ch = bounds.cardHeight;
					var cs = bounds.cardScale;
					var csw = cw * cs;
					var xStart, xMargin;

					var draws = [];
					var card;
					var clone;
					var source = cards.duiMod;
					if (source && source != game.me) {
						source.checkBoundsCache();
						xMargin = 27;
						xStart =  source.cacheLeft - bounds.x - csw / 2 - (cw - csw) / 2;
						var totalW = xMargin * cards.length + (csw - xMargin);
						var limitW = source.cacheWidth + csw;
						if (totalW > limitW) {
							xMargin = csw - Math.abs(limitW - csw * cards.length) / (cards.length - 1);
						} else {
							xStart += (limitW - totalW) / 2;
						}

						y = Math.round((source.cacheTop - bounds.y - 30 + (source.cacheHeight - ch) / 2));
						for (var i = 0; i < cards.length; i++) {
							x = Math.round(xStart + i * xMargin);
							card = cards[i];
							card.tx = x;
							card.ty = y;
							card.fixed = true;
							card.scaled = true;
							card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
						}
						return;
					} else {
						for (var i = 0; i < cards.length; i++) {
							card = cards[i];
							clone = card.clone;
							if (clone && !clone.fixed && clone.parentNode == ui.arena) {
								x = Math.round(clone.tx - bounds.x);
								y = Math.round(clone.ty - (bounds.y + 30));
								card.tx = x;
								card.ty = y;
								card.scaled = true;
								card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
							} else {
								draws.push(card);
							}
						}
					}

					y = Math.round(-ch * cs * 2);
					xMargin = csw * 0.5;
					xStart = (pw - xMargin * (draws.length + 1)) / 2 - (cw - csw) / 2;

					for (var i = 0; i < draws.length; i++) {
						x = Math.round(xStart + i * xMargin);
						card = draws[i];
						card.tx = x;
						card.ty = y;
						card.scaled = true;
						card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
					}
				},

				layoutDrawCards:function(cards, player, center){
					var bounds = dui.boundsCaches.arena;
					if (!bounds.updated)
					bounds.update();

					player.checkBoundsCache();
					var playerX = player.cacheLeft;
					var playerY = player.cacheTop;
					var playerW = player.cacheWidth;
					var playerH = player.cacheHeight;

					var pw = bounds.width;
					var ph = bounds.height;
					var cw = bounds.cardWidth;
					var ch = bounds.cardHeight;
					var cs = bounds.cardScale;
					var csw = cw * cs;

					var xMargin = 27;
					var xStart = (center ? (pw - playerW) / 2 : playerX) - csw / 2 - (cw - csw) / 2;
					var totalW = xMargin * cards.length + (csw - xMargin);
					var limitW = playerW + csw;

					if (totalW > limitW) {
						xMargin = csw - Math.abs(limitW - csw * cards.length) / (cards.length - 1);
					} else {
						xStart += (limitW - totalW) / 2;
					}

					var x;
					var y;
					if (center)
					y = Math.round((ph - ch) / 2);
					else
					y = Math.round(playerY + (playerH - ch) / 2);

					var card;
					for (var i = 0; i < cards.length; i++) {
						x = Math.round(xStart + i * xMargin);
						card = cards[i];
						card.tx = x;
						card.ty = y;
						card.scaled = true;
						card.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + cs + ')';
					}
				},

				layoutDiscard:function(){
					dui.layout.updateDiscard();
				},

				delayRemoveCards:function(cards, delay, delay2){
					if (!Array.isArray(cards))
					cards = [cards];

					setTimeout(function(cards, delay2){
						var remove = function (cards) {
							for (var i = 0; i < cards.length; i++)
							cards[i].remove();
						};

						if (delay2 == null) {
							remove(cards);
							return;
						}

						for (var i = 0; i < cards.length; i++)
						cards[i].classList.add('removing');

						setTimeout(remove, delay2, cards)
					}, delay, cards, delay2)
				},

				tryAddPlayerCardUseTag:function(card, tag_innerHTML){
					if (!card || !tag_innerHTML) return;
					var tagNode = card.querySelector('.used-info');
					if (tagNode == null) tagNode = card.appendChild(dui.element.create('used-info'));
					card.$usedtag = tagNode;
					tagNode.innerHTML = tag_innerHTML;

					game.broadcast(function (node, tag_innerHTML, id) {
						if (!window.decadeUI) return;
						if (!node.node) {
							node = [...ui.arena.childNodes].find(c => {
								if (c.classList.contains("thrown") && c.classList.contains("card")) {
									return c._cardid == id;
								}
							});
						}
						if (node == undefined || !node.node) return;
						var tagNode = node.querySelector('.used-info');
						if (tagNode == null) tagNode = node.appendChild(dui.element.create('used-info'));
						node.$usedtag = tagNode;
						tagNode.innerHTML = tag_innerHTML;
					}, card, tag_innerHTML, card._cardid);
				},

				CardUseTaginnerHTML:function(card, player, event){
					var noname;
					var tagText = '';
					if (event.blameEvent) event = event.blameEvent;
					switch (event.name.toLowerCase()) {
						case "choosetocomparemultiple":
							tagText = "拼点置入";
							break;
						case "choosetocompare":
							tagText = "拼点置入";
							break;
						case 'usecard':
							tagText = "使用";
							if (
								!event.player.hasSkillTag("ignoreLogAI", null, {
									card: event.card,
								}) &&
								!event.hideTargets &&
								event.targets.length == 1
							) {
								if (event.targets[0] == event.player) {
									tagText = "对自己";
								} else {
									const playername2 = get.slimName(event.targets[0]?.name);
									let border2 = get.groupnature(get.bordergroup(event.targets[0]?.name), "raw");
									tagText = "对" + `<span data-nature=${border2}>${playername2}</span>`;
								}
							} else {
								tagText = "使用";
							}
						case 'respond':
							if (tagText == "") tagText = "打出";
							break;
						case 'useskill':
							tagText = "发动" + '<span style="color:#FFD700">' + get.skillTranslation(event.skill, event.player) + "</span>";
							break;
						case 'die':
							tagText = "弃置";
							card.classList.add('invalided');
							dui.layout.delayClear();
							break;
						case "discardmultiple":
							var skillEvent = event.parent.parent.parent;
							if (skillEvent) {
								tagText = lib.translate[skillEvent.name != "useSkill" ? skillEvent.name : skillEvent.skill];
								if (!tagText) tagText = "";
								tagText = '<span style="color:#FFD700">' + tagText + "</span>";
								tagText += "弃置";
							} else tagText = "弃置";
							break;
						case "choosetoduiben":
							var skillEvent = event.parent;
							if (skillEvent) {
								tagText = lib.translate[skillEvent.name];
								if (!tagText) tagText = "";
								tagText = '<span style="color:#FFD700">' + tagText + "</span>";
							}
							tagText += (event.title || "对策") + "策略";
							break;
						case "loseasync":
							noname = true;
							var skillEvent = event.parent.parent.parent;
							tagText += get.translation(player);
							if (skillEvent && lib.translate[skillEvent.name != "useSkill" ? skillEvent.name : skillEvent.skill]) {
								tagText += '<span style="color:#FFD700">' + lib.translate[skillEvent.name != "useSkill" ? skillEvent.name : skillEvent.skill] + "</span>";
							}
							tagText += "弃置";
							break;
						case 'lose':
							if (event.parent && event.parent.name == 'discard') {
								if (event.parent.parent) {
									var skillEvent = event.parent.parent.parent;
									if (skillEvent) {
										tagText = lib.translate[skillEvent.name != 'useSkill' ? skillEvent.name : skillEvent.skill];
										if (!tagText) tagText = '';
										tagText = '<span style="color:#FFD700">' + tagText + "</span>";
										tagText += "弃置";
									} else tagText = "弃置";
								}
							}  else {
								if (event.parent.parent) {
									var skillEvent = event.parent.parent.parent;
									if (skillEvent) {
										tagText = lib.translate[skillEvent.name != "useSkill" ? skillEvent.name : skillEvent.skill];
										if (!tagText || tagText == "重铸") tagText = "";
										if (event.parent.parent.name != "recast") tagText += "置入弃牌堆";
										else tagText = '<span style="color:#FFD700">' + tagText + "</span>重铸";
									} else tagText = "置入弃牌堆";
								}
							}
							break;
						case "lose_muniu":
							tagText = "木牛流马流失";
							break;
						case "lose_jinhe":
							tagText = "锦盒掉落";
							break;
						case 'discard':
							tagText = "弃置";
							break;
						case 'phasejudge':
							tagText = '即将生效';
							break;
						case 'judge':
							noname = true;
							tagText = '<span style="color:#FFD700">' + event.judgestr + "</span>的判定牌";
							break;
						default:
							tagText = get.translation(event.name);
							if (tagText == event.name) tagText = '';
							else tagText = '<span style="color:#FFD700">' + tagText + "</span>效果";
							break;
					}

					const playername = get.slimName(player?.name);
					let border = get.groupnature(get.bordergroup(player?.name), "raw");
					return '<span style="font-weight:700">' + (noname ? '' : `<span data-nature=${border}>${playername}</span><br/>`) + tagText + "</span>";
				},

				PlaySpineAnimationOnCard:function(card, event){
					if (!card || !event || !window.decadeUI) return;

					let animation_playSpineTo_Client = function(card, animation, position) {
						game.broadcast(function (node, id, animation, position) {
							if (!window.decadeUI) return;
							if (!node.node) {
								node = [...ui.arena.childNodes].find(c => {
									if (c.classList.contains("thrown") && c.classList.contains("card")) {
										return c._cardid == id;
									}
								});
							}
							if (node == undefined || !node.node) return;
							decadeUI.animation.cap.playSpineTo(node, animation, position);
						}, card, card._cardid, animation, position);
					}

					if (event.blameEvent) event = event.blameEvent;

					switch (event.name.toLowerCase()) {
						case 'usecard':
						case 'respond':
							if (duicfg.cardUseEffect && event.card && (!event.card.cards || event.card.cards.length == 1)) {
								var name = event.card.name;
								var nature = event.card.nature;

								switch (name) {
									case 'effect_caochuanjiejian':
										decadeUI.animation.cap.playSpineTo(card, 'effect_caochuanjiejian');
										animation_playSpineTo_Client(card, 'effect_caochuanjiejian');
										break;
									case 'sha':
										switch (nature) {
											case 'thunder':
												decadeUI.animation.cap.playSpineTo(card, 'effect_leisha');
												animation_playSpineTo_Client(card, 'effect_leisha');
												break;
											case 'fire':
												decadeUI.animation.cap.playSpineTo(card, 'effect_huosha');
												animation_playSpineTo_Client(card, 'effect_huosha');
												break;
											default:
												if (get.color(card) == 'red') {
													decadeUI.animation.cap.playSpineTo(card, 'effect_hongsha');
													animation_playSpineTo_Client(card, 'effect_hongsha');
												} else {
													decadeUI.animation.cap.playSpineTo(card, 'effect_heisha');
													animation_playSpineTo_Client(card, 'effect_heisha');
												}
												break;
										}
										break;
									case 'shan':
										decadeUI.animation.cap.playSpineTo(card, 'effect_shan');
										animation_playSpineTo_Client(card, 'effect_shan');
										break;
									case 'tao':
										decadeUI.animation.cap.playSpineTo(card, 'effect_tao', { scale: 0.9 });
										animation_playSpineTo_Client(card, 'effect_tao', { scale: 0.9 });
										break;
									case 'tiesuo':
										decadeUI.animation.cap.playSpineTo(card, 'effect_tiesuolianhuan', { scale: 0.9 });
										animation_playSpineTo_Client(card, 'effect_tiesuolianhuan', { scale: 0.9 });
										break;
									case 'jiu':
										decadeUI.animation.cap.playSpineTo(card, 'effect_jiu', { y:[-30, 0.5] });
										animation_playSpineTo_Client(card, 'effect_jiu', { y:[-30, 0.5] });
										break;
									case 'kaihua':
										decadeUI.animation.cap.playSpineTo(card, 'effect_shushangkaihua');
										animation_playSpineTo_Client(card, 'effect_shushangkaihua');
										break;
									case 'wuzhong':
										decadeUI.animation.cap.playSpineTo(card, 'effect_wuzhongshengyou');
										animation_playSpineTo_Client(card, 'effect_wuzhongshengyou');
										break;
									case 'wuxie':
										decadeUI.animation.cap.playSpineTo(card, 'effect_wuxiekeji', { y:[10, 0.5], scale: 0.9 });
										animation_playSpineTo_Client(card, 'effect_wuxiekeji', { y:[10, 0.5], scale: 0.9 });
										break;
									//case 'nanman':
									//	decadeUI.animation.cap.playSpineTo(card, 'effect_nanmanruqin', { scale: 0.45 });
									//	animation_playSpineTo_Client(card, 'effect_nanmanruqin', { scale: 0.45 });
									//	break;
									case 'wanjian':
										decadeUI.animation.cap.playSpineTo(card, 'effect_wanjianqifa', { scale: 0.78 });
										animation_playSpineTo_Client(card, 'effect_wanjianqifa', { scale: 0.78 });
										break;
									case 'wugu':
										decadeUI.animation.cap.playSpineTo(card, 'effect_wugufengdeng', { y:[10, 0.5] });
										animation_playSpineTo_Client(card, 'effect_wugufengdeng', { y:[10, 0.5] });
										break;
									//case 'taoyuan':
									//	decadeUI.animation.cap.playSpineTo(card, 'effect_taoyuanjieyi', { y:[10, 0.5] });
									//	animation_playSpineTo_Client(card, 'effect_taoyuanjieyi', { y:[10, 0.5] });
									//	break;
									case 'shunshou':
										decadeUI.animation.cap.playSpineTo(card, 'effect_shunshouqianyang');
										animation_playSpineTo_Client(card, 'effect_shunshouqianyang');
										break;
									case 'huogong':
										decadeUI.animation.cap.playSpineTo(card, 'effect_huogong', { x:[8, 0.5], scale: 0.5 });
										animation_playSpineTo_Client(card, 'effect_huogong', { x:[8, 0.5], scale: 0.5 });
										break;
									case 'guohe':
										decadeUI.animation.cap.playSpineTo(card, 'effect_guohechaiqiao', { y:[10, 0.5] });
										animation_playSpineTo_Client(card, 'effect_guohechaiqiao', { y:[10, 0.5] });
										break;
									case 'yuanjiao':
										decadeUI.animation.cap.playSpineTo(card, 'effect_yuanjiaojingong');
										animation_playSpineTo_Client(card, 'effect_yuanjiaojingong');
										break;
									case 'zhibi':
										decadeUI.animation.cap.playSpineTo(card, 'effect_zhijizhibi');
										animation_playSpineTo_Client(card, 'effect_zhijizhibi');
										break;
									case 'zhulu_card':
										decadeUI.animation.cap.playSpineTo(card, 'effect_zhulutianxia');
										animation_playSpineTo_Client(card, 'effect_zhulutianxia');
										break;
								}
							}
							break;
						case 'judge':
							event.addMessageHook('judgeResult', function(){
								var event = this;
								var card = event.result.card.clone;
								var apcard = event.apcard;
	
								var tagText = '';
								var tagNode = card.querySelector('.used-info');
								if (tagNode == null) tagNode = card.appendChild(dui.element.create('used-info'));
	
								var action;
								var judgeValue;
								var getEffect = event.judge2;
								if (getEffect) {
									judgeValue = getEffect(event.result);
								} else {
									judgeValue = decadeUI.get.judgeEffect(event.judgestr, event.result.judge);
								}
	
								if ((typeof judgeValue == 'boolean')) {
									judgeValue = judgeValue ? 1 : -1;
								} else {
									judgeValue = event.result.judge;
								}
	
								if (judgeValue >= 0) {
									action = 'play4';
									tagText = '判定<span class="greentext">生效</span>';
								} else {
									action = 'play5';
									tagText = '判定<span class="firetext">失效</span>';
								}
	
								if (apcard && apcard._ap) {
									apcard._ap.stopSpineAll();

									game.broadcast(function (node, id) {
										if (!window.decadeUI) return;
										if (!node.node) {
											node = [...ui.arena.childNodes].find(c => {
												if (c.classList.contains("thrown") && c.classList.contains("card")) {
													return c._cardid == id;
												}
											});
										}
										if (node == undefined || !node.node) return;
										if (node && node._ap) node._ap.stopSpineAll();
									}, apcard, apcard._cardid);
								}
								if (apcard && apcard._ap && apcard == card) {
									apcard._ap.playSpine({
										name: 'effect_panding',
										action: action
									});
									game.broadcast(function (node, id, action) {
										if (!window.decadeUI) return;
										if (!node.node) {
											node = [...ui.arena.childNodes].find(c => {
												if (c.classList.contains("thrown") && c.classList.contains("card")) {
													return c._cardid == id;
												}
											});
										}
										if (node == undefined || !node.node) return;
										node._ap.playSpine({
											name: 'effect_panding',
											action: action
										});
									}, apcard, apcard._cardid, action);
								} else {
									decadeUI.animation.cap.playSpineTo(card, {
										name: 'effect_panding',
										action: action
									});
									game.broadcast(function (node, id, action) {
										if (!window.decadeUI) return;
										if (!node.node) {
											node = [...ui.arena.childNodes].find(c => {
												if (c.classList.contains("thrown") && c.classList.contains("card")) {
													return c._cardid == id;
												}
											});
										}
										if (node == undefined || !node.node) return;
										decadeUI.animation.cap.playSpineTo(node, {
											name: 'effect_panding',
											action: action
										});
									}, apcard, apcard._cardid, action);
								}
	
								event.apcard = undefined;
								let judge_innerHTML_str = '<span style="font-weight:700"><span style="color:#FFD700">' + get.translation(event.judgestr) + "</span>" + tagText + "</span>";
								tagNode.innerHTML = judge_innerHTML_str;
								game.broadcast(function (node, tag_innerHTML, id) {
									if (!window.decadeUI) return;
									if (!node.node) {
										node = [...ui.arena.childNodes].find(c => {
											if (c.classList.contains("thrown") && c.classList.contains("card")) {
												return c._cardid == id;
											}
										});
									}
									if (node == undefined || !node.node) return;
									var tagNode = node.querySelector('.used-info');
									if (tagNode == null) tagNode = node.appendChild(dui.element.create('used-info'));
									node.$usedtag = tagNode;
									tagNode.innerHTML = tag_innerHTML;
								}, card, judge_innerHTML_str, card._cardid);
							});
	
							if (duicfg.cardUseEffect) {
								decadeUI.animation.cap.playSpineTo(card, {
									name: 'effect_panding',
									action: 'play',
									loop: true
								});
								animation_playSpineTo_Client(card, {
									name: 'effect_panding',
									action: 'play',
									loop: true
								});
	
								event.apcard = card;
							}
							break;
					}
				},

				getRandom:function(min, max) {
					if (min == null) {
						min = -2147483648;
					}

					if (max == null) {
						max = 2147483648;
					}

					if (min > max) {
						min = min + max;
						max = min - max;
						min = min - max;
					}

					var diff = 0;
					if (min < 0) {
						diff = min;
						min = 0;
						max -= diff;
					}

					return Math.floor(Math.random() * (max + 1 - min)) + min + diff;
				},
				getCardBestScale:function(size){
					if (!(size && size.height)) size = decadeUI.getHandCardSize();

					var bodySize = decadeUI.get.bodySize();
					return Math.min(bodySize.height * (decadeUI.isMobile() ? 0.23 : 0.18) / size.height, 1);
				},
				getHandCardSize:function(canUseDefault){
					var style = decadeUI.sheet.getStyle('.media_defined > .card');
					if (style == null) style = decadeUI.sheet.getStyle('.hand-cards > .handcards > .card');
					if (style == null) return canUseDefault ? { width: 108, height: 150 } : { width: 0, height: 0 };
					var size = { width: parseFloat(style.width), height: parseFloat(style.height) };
					return size;
				},
				getMapElementPos:function(elementFrom, elementTo){
					if (!(elementFrom instanceof HTMLElement) || !(elementTo instanceof HTMLElement)) return console.error('arguments');
					var rectFrom = elementFrom.getBoundingClientRect();
					var rectTo = elementTo.getBoundingClientRect();
					var pos = { x: rectFrom.left - rectTo.left, y: rectFrom.top - rectTo.top };
					pos.left = pos.x;
					pos.top = pos.y;
					return pos;
				},
				getPlayerIdentity:function(player, identity, chinese, isMark){
					if (!(player instanceof HTMLElement && get.itemtype(player) == 'player')) throw 'player';
					if (!identity) identity = player.identity;


					var mode = get.mode();
					var translated = false;
					if (!chinese) {
						switch (mode) {
							case 'identity': case 'huanhuazhizhan':
							if (identity&&(!player.isAlive() || player.identityShown || player == game.me)) {
								identity = (player.special_identity ? player.special_identity : identity).replace(/identity_/, '');
							}

							break;

							case 'guozhan':
							if (identity == 'unknown') {
								identity = player.wontYe() ? lib.character[player.name1][1] : 'ye';
							}

							if (get.is.jun(player)) identity += 'jun';
							break;

							case 'versus':
							if (!game.me) break;
							switch (_status.mode) {
								case 'standard':
								switch (identity) {
									case 'trueZhu': return 'shuai';
									case 'trueZhong': return 'bing';
									case 'falseZhu': return 'jiang';
									case 'falseZhong': return 'zu';
								}
								break;
								case 'three':
								case 'four':
								case 'guandu':
								if (get.translation(player.side + 'Color') == 'wei') identity += '_blue';
								break;

								case 'two':
								var side = player.finalSide ? player.finalSide : player.side;
								identity = game.me.side == side ? 'friend' : 'enemy';
								break;
							}

							break;
							case 'doudizhu':
							identity = identity == 'zhu' ? 'dizhu' : 'nongmin';
							break;
							case 'boss':
							switch (identity) {
								case 'zhu': identity = 'boss'; break;
								case 'zhong': identity = 'cong'; break;
								case 'cai': identity = 'meng'; break;
							}
							break;
						}
					} else {
						switch(mode){
							case 'identity': case 'huanhuazhizhan':
							if (identity&&identity.indexOf('cai') < 0) {
								if (isMark) {
									if (player.special_identity) identity = player.special_identity + '_bg';
								} else {
									identity = player.special_identity ? player.special_identity : identity + '2';
								}
							}

							break;

							case 'guozhan':
							if (identity == 'unknown') {
								identity = player.wontYe() ? lib.character[player.name1][1] : 'ye';
							}

							if (get.is.jun(player)) {
								identity = isMark ? '君' : get.translation(identity) + '君';
							} else {
								identity = identity == 'ye' ? '野心家' : (identity == 'qun' ? '群雄' : get.translation(identity) + '将');
							}
							translated = true;
							break;

							case 'versus':
							translated = true;
							if (!game.me) break;
							switch (_status.mode) {
								case 'three':
								case 'standard':
								case 'four':
								case 'guandu':
								switch (identity) {
									case 'zhu': identity = '主公'; break;
									case 'zhong': identity = '忠臣'; break;
									case 'fan': identity = '反贼'; break;
									default: translated = false; break;
								}
								break;

								case 'two':
								var side = player.finalSide ? player.finalSide : player.side;
								identity = game.me.side == side ? '友方' : '敌方';
								break;

								case 'siguo':
								case 'jiange':
								identity = get.translation(identity) + '将';
								break;

								default:
								translated = false;
								break;
							}
							break;

							case 'doudizhu':
							identity += '2';
							break;
							case 'boss':
							translated = true;
							switch (identity) {
								case 'zhu': identity = 'BOSS'; break;
								case 'zhong': identity = '仆从'; break;
								case 'cai': identity = '盟军'; break;
								default: translated = false; break;
							}
							break;
						}

						if (!translated) identity = get.translation(identity);
						if (isMark) identity = identity[0];
					}

					return identity;
				},

				create:{
					skillDialog:function(){
						var dialog = document.createElement('div');
						dialog.className = 'skill-dialog';

						var extend = {
							caption: undefined,
							tip: undefined,

							open:function(customParent){
								if (!customParent) {
									var size = decadeUI.get.bodySize();
									this.style.minHeight = (parseInt(size.height * 0.42)) + 'px';
									if (this.parentNode != ui.arena) ui.arena.appendChild(this);
								}

								this.style.animation = 'open-dialog 0.4s';
								return this;
							},
							show:function(){
								this.style.animation = 'open-dialog 0.4s';;
							},
							hide:function(){
								this.style.animation = 'close-dialog 0.1s forwards';
							},
							close:function(){
								var func = function(e){
									if (e.animationName != 'close-dialog') return;
									this.remove();
									this.removeEventListener('animationend', func);
								};

								var animation = 'close-dialog';
								if (this.style.animationName == animation) {
									setTimeout(function(dialog){
										dialog.remove();
									}, 100, this);
								} else {
									this.style.animation = animation + ' 0.1s forwards';
									this.addEventListener('animationend', func);
								}
							},

							appendControl:function(text, clickFunc){
								var control = document.createElement('div');
								control.className = 'control-button';
								control.textContent = text;
								if (clickFunc) {
									control.addEventListener('click', clickFunc);
								}

								return this.$controls.appendChild(control);
							},

							$caption: decadeUI.element.create('caption', dialog),
							$content: decadeUI.element.create('content', dialog),
							$tip: decadeUI.element.create('tip', dialog),
							$controls: decadeUI.element.create('controls', dialog),
						}; decadeUI.get.extend(dialog, extend);

						Object.defineProperties(dialog, {
							caption: {
								configurable: true,
								get:function(){
									return this.$caption.innerHTML;
								},
								set:function(value){
									if (this.$caption.innerHTML == value) return;
									this.$caption.innerHTML = value;
								},
							},
							tip: {
								configurable: true,
								get:function(){
									return this.$tip.innerHTML;
								},
								set:function(value){
									if (this.$tip.innerHTML == value) return;
									this.$tip.innerHTML = value;
								},
							},
						});

						return dialog;
					},

					compareDialog:function(player, target){
						var dialog = decadeUI.create.skillDialog();
						dialog.classList.add('compare');
						dialog.$content.classList.add('buttons');

						var extend = {
							player: undefined,
							target: undefined,
							playerCard: undefined,
							targetCard: undefined,

							$player: decadeUI.element.create('player-character player1', dialog.$content),
							$target: decadeUI.element.create('player-character player2', dialog.$content),
							$playerCard: decadeUI.element.create('player-card', dialog.$content),
							$targetCard: decadeUI.element.create('target-card', dialog.$content),
							$vs: decadeUI.element.create('vs', dialog.$content),
						}; decadeUI.get.extend(dialog, extend);

						decadeUI.element.create('image', dialog.$player),
						decadeUI.element.create('image', dialog.$target),

						Object.defineProperties(dialog, {
							player: {
								configurable: true,
								get:function(){
									return this._player;
								},
								set:function(value){
									if (this._player == value) return;
									this._player = value;

									if (value == null || value.isUnseen()) {
										this.$player.firstChild.style.backgroundImage = '';
									} else {
										this.$player.firstChild.style.backgroundImage = (value.isUnseen(0) ? value.node.avatar2 : value.node.avatar).style.backgroundImage;
									}

									if (value) this.$playerCard.dataset.text = `${get.translation(value).replace(/<br>/g, '\n')}发起`;
								},
							},
							target: {
								configurable: true,
								get:function(){
									return this._target;
								},
								set:function(value){
									if (this._target == value) return;
									this._target = value;
									if (value == null || value.isUnseen()) {
										this.$target.firstChild.style.backgroundImage = '';
									} else {
										this.$target.firstChild.style.backgroundImage = (value.isUnseen(0) ? value.node.avatar2 : value.node.avatar).style.backgroundImage;
									}

									if (value) this.$targetCard.dataset.text = get.translation(value).replace(/<br>/g, '\n');
								},
							},
							playerCard: {
								configurable: true,
								get:function(){
									return this._playerCard;
								},
								set:function(value){
									if (this._playerCard == value) return;
									if (this._playerCard) this._playerCard.remove();
									this._playerCard = value;
									if (value) this.$playerCard.appendChild(value);
								},
							},
							targetCard: {
								configurable: true,
								get:function(){
									return this._targetCard;
								},
								set:function(value){
									if (this._targetCard == value) return;
									if (this._targetCard) this._targetCard.remove();
									this._targetCard = value;
									if (value) this.$targetCard.appendChild(value);
								},
							},
						});

						if (player) dialog.player = player;
						if (target) dialog.target = target;

						return dialog;
					},

				},

				get:{
					judgeEffect:function(name, value){
						switch (name) {
							case 'caomu':		case '草木皆兵':
							case 'fulei': 		case '浮雷':
							case 'shandian': 	case '闪电':
							case 'bingliang':	case '兵粮寸断':
							case 'lebu':		case '乐不思蜀':
							return value < 0 ? true : false;
						}

						return value;
					},

					isWebKit:function(){
						return document.body.style.WebkitBoxShadow !== undefined;
					},

					lerp:function(min, max, fraction){
						return (max - min) * fraction + min;
					},
					ease:function(fraction){
						if (!decadeUI.get._bezier3) decadeUI.get._bezier3 = new duilib.CubicBezierEase(0.25, 0.1, 0.25, 1);
						return decadeUI.get._bezier3.ease(fraction);
					},
					extend:function(target, source){
						if (source === null || typeof source !== 'object') return target;

						var keys = Object.keys(source);
						var i = keys.length;
						while (i--) {
							target[keys[i]] = source[keys[i]];
						}

						return target;
					},

					bodySize:function(){
						var size = decadeUI.dataset.bodySize;
						if (!size.updated) {
							var body = document.body;
							size.updated = true;
							size.height = body.clientHeight;
							size.width = body.clientWidth;
						}

						return size;
					},

					bestValueCards:function(cards, player){
						if (!player) player = _status.event.player;

						var matchs = [];
						var basics = [];
						var equips = [];
						var hasEquipSkill = player.hasSkill('xiaoji');
						cards.sort(function(a, b){
							return get.value(b, player) - get.value(a, player);
						});

						for (var i = 0; i >= 0 && i < cards.length; i++) {
							var limited = false;
							switch (get.type(cards[i])) {
								case 'basic':
								for (var j = 0; j < basics.length; j++) {
									if (!cards[i].toself && basics[j].name == cards[i].name) {
										limited = true;
										break;
									}
								}

								if (!limited) basics.push(cards[i]);
								break;

								case 'equip':
								if (hasEquipSkill) break;
								for (var j = 0; j < equips.length; j++) {
									if (get.subtype(equips[j]) == get.subtype(cards[i])) {
										limited = true;
										break;
									}
								}

								if (!limited) equips.push(cards[i]);
								break;
							}

							if (!limited) {
								matchs.push(cards[i]);
								cards.splice(i--, 1);
							}
						}

						cards.sort(function(a, b){
							return get.value(b, player) - get.value(a, player);
						});

						cards = matchs.concat(cards);
						return cards;
					},
					cheatJudgeCards:function(cards, judges, friendly){
						if (!cards || !judges) throw arguments;
						
						//修正廢除判定區的BUG
						if (judges.length==1&&get.judge(judges[0])==undefined) return [];

						var cheats = [];
						var judgeCost;
						for(var i = 0; i < judges.length; i++){
							var judge = get.judge(judges[i]);
							cards.sort(function(a, b) {
								return friendly ? judge(b) - judge(a) : judge(a) - judge(b);
							});

							judgeCost = judge(cards[0]);
							if ((friendly && judgeCost >= 0) || (!friendly && judgeCost < 0)) {
								cheats.push(cards.shift());
							} else {
								break;
							}
						}

						return cheats;
					},
					elementLeftFromWindow:function(element){
						var left = element.offsetLeft;
						var current = element.offsetParent;

						while (current != null) {
							left += current.offsetLeft;
							current = current.offsetParent;
						}

						return left;
					},
					elementTopFromWindow:function(element){
						var top = element.offsetTop;
						var current = element.offsetParent;

						while (current != null) {
							top += current.offsetTop;
							current = current.offsetParent;
						}

						return top;
					},
					handcardInitPos:function(){
						var hand = dui.boundsCaches.hand;
						if (!hand.updated)
						hand.update();
						var cardW = hand.cardWidth;
						var cardH = hand.cardHeight;
						var scale = hand.cardScale;
						var x = -Math.round((cardW - cardW * scale) / 2);
						var y = ((cardH * scale - cardH) / 2);
						return {
							x: x,
							y: y,
							scale: scale
						};
					},
				},

				set:(function(set){
					set.activeElement = function (element) {
						var deactive = dui.$activeElement;
						dui.$activeElement = element;
						if (deactive && deactive != element && (typeof deactive.ondeactive == 'function')) {
							deactive.ondeactive();
						}

						if (element && element != deactive && (typeof element.onactive == 'function')) {
							element.onactive();
						}
					};
					return set;
				})({}),
				statics:{
						handTips: [],
					},
					dataset:{
						animSizeUpdated: false,
						bodySizeUpdated: false,
						bodySize: {
							height: 1,
							width: 1,
							updated: false,
						},
					},
			};
			dui.showHandTip = function (text) {
				var tip;
				var tips = this.statics.handTips;
				for (var i = 0; i < tips.length; i++) {
					if (tip == undefined && tips[i].closed) {
						tip = tips[i];
						tip.closed = false;
					} else {
						tips[i].hide();
					}
				}
				if (tip == undefined) {
					tip = dui.element.create('hand-tip', ui.arena);
					tips.unshift(tip);
					tip.clear = function () {
						var nodes = this.childNodes;
						for (var i = 0; i < nodes.length; i++)
						nodes[i].textContent = '';
						this.dataset.text = '';
					};
					tip.setText = function (text, type) {
						this.clear();
						this.appendText(text, type);
					};
					tip.setInfomation = function (text) {
						if (this.$info == null)
						this.$info = dui.element.create('hand-tip-info', ui.arena);
						this.$info.innerHTML = text;
					};
					tip.appendText = function (text, type) {
						if (text == undefined || text === '')
							return;
						text = String(text).replace(/^###[\s\S]*###/, "");
						if (type == undefined)
						type = '';
						var nodes = this.childNodes;
						for (var i = 0; i < nodes.length; i++) {
							if (nodes[i].textContent == '') {
								nodes[i].textContent = text;
								nodes[i].dataset.type = type;
								return nodes[i];
							}
						}
						var span = document.createElement('span');
						span.textContent = text;
						span.dataset.type = type;
						return this.appendChild(span);
					};
					tip.strokeText = function () {
						this.dataset.text = this.innerText;
					};
					tip.show = function () {
						this.classList.remove('hidden');
						if (this.$info && this.$info.innerHTML)
						this.$info.show();
					};
					tip.hide = function () {
						this.classList.add('hidden');
						if (this.$info)
						this.$info.hide();
					};
					tip.close = function () {
						this.closed = true;
						this.hide();
						if (tip.$info)
						tip.$info.innerHTML = '';
						var tips = dui.statics.handTips;
						for (var i = 0; i < tips.length; i++) {
							if (tips[i].closed)
							continue;
							tips[i].show();
							return;
						}
					};
					tip.isEmpty = function () {
						var nodes = this.childNodes;
						for (var i = 0; i < nodes.length; i++) {
							if (nodes[i].textContent != '')
							return false;
						}

						return true;
					};
				}
				tip.setText(text);
				tip.show();
				return tip;
			};
			decadeUI.BoundsCache = (function(){
				function BoundsCache (element, updateBefore) {
					this.element = element;
					this.updateBefore = updateBefore;
					this.updated = false;
					Object.defineProperties(this, {
						x:{
							configurable: true,
							get:function(){
								if (!this.updated) this.update();
								return this._x;
							},
							set:function(value){
								this._x == value;
							}
						},
						y:{
							configurable: true,
							get:function(){
								if (!this.updated) this.update();
								return this._y;
							},
							set:function(value){
								this._y == value;
							}
						},
						width:{
							configurable: true,
							get:function(){
								if (!this.updated) this.update();
								return this._width;
							},
							set:function(value){
								this._width == value;
							}
						},
						height:{
							configurable: true,
							get:function(){
								if (!this.updated) this.update();
								return this._height;
							},
							set:function(value){
								this._height == value;
							}
						},
					});
				};

				BoundsCache.prototype.check = function () {
					if (!this.updated)
					this.update();
				};
				BoundsCache.prototype.update = function () {
					if (this.updateBefore)
					this.updateBefore();
					var element = this.element;
					this.updated = true;
					if (element == undefined) return;
					this._x = element.offsetLeft;
					this._y = element.offsetTop;
					this._width = element.offsetWidth;
					this._height = element.offsetHeight;
				};

				return BoundsCache;
			})();
			decadeUI.boundsCaches = (function(boundsCaches){
				boundsCaches.window = new decadeUI.BoundsCache(null, function(){
					this.element = ui.window;
				});
				boundsCaches.arena = new decadeUI.BoundsCache(null, function(){
					this.element = ui.arena;
					if (ui.arena == null)
					return;
					this.cardScale = dui.getCardBestScale();
					if (this.cardWidth != null)
					return;
					var childs = ui.arena.childNodes;
					for (var i = 0; i < childs.length; i++) {
						if (childs[i].classList.contains('card')) {
							this.cardWidth = childs[i].offsetWidth;
							this.cardHeight = childs[i].offsetHeight;
							return;
						}
					}
					var card = dui.element.create('card');
					card.style.opacity = 0;
					ui.arena.appendChild(card);
					this.cardWidth = card.offsetWidth;
					this.cardHeight = card.offsetHeight;
					card.remove();
				});
				boundsCaches.hand = new decadeUI.BoundsCache(null, function(){
					this.element = ui.me;
					if (ui.handcards1 == null)
					return;
					this.cardScale = dui.getCardBestScale();
					if (this.cardWidth != null)
					return;
					var childs = ui.handcards1.childNodes;
					for (var i = 0; i < childs.length; i++) {
						if (childs[i].classList.contains('card')) {
							this.cardWidth = childs[i].offsetWidth;
							this.cardHeight = childs[i].offsetHeight;
							return;
						}
					}
					var card = dui.element.create('card');
					card.style.opacity = 0;
					ui.handcards1.appendChild(card);
					this.cardWidth = card.offsetWidth;
					this.cardHeight = card.offsetHeight;
					card.remove();
				});
				return boundsCaches;
			})({});
			decadeUI.element = {
				base:{
					removeSelf:function(milliseconds){
						var remove = this;
						if (milliseconds) {
							milliseconds = (typeof milliseconds == 'number') ? milliseconds : parseInt(milliseconds);
							setTimeout(function(){
								if (remove.parentNode) remove.parentNode.removeChild(remove);
							}, milliseconds);
							return;
						}

						if (remove.parentNode) remove.parentNode.removeChild(remove);
						return;
					}
				},
				create:function(className, parentNode, tagName){
					var tag = tagName == void 0 ? 'div' : tagName;
					var element = document.createElement(tag);
					element.view = {};

					for(var key in this.base){
						element[key] = this.base[key];
					}

					if (className)
					element.className = className;

					if (parentNode)
					parentNode.appendChild(element);

					return element;
				},
				clone:function(element){

				},
			};

			decadeUI.game = {
				wait:function(){
					game.pause();
				},

				resume:function(){
					if (!game.loopLocked) {
						var ok = false;
						try {
							if (decadeUI.eventDialog && !decadeUI.eventDialog.finished && !decadeUI.eventDialog.finishing) {
								decadeUI.eventDialog.finish();
								decadeUI.eventDialog = undefined;
								ok = true;
							}
						} finally {
							if (!ok) game.resume();
						}
					} else {
						_status.paused = false;
					}
				},
			};


			decadeUI.config = config;
			duicfg.update = () => Object.values(lib.extensionMenu[`extension_${decadeUIName}`]).forEach(value => {
				if (value && typeof value == 'object' && typeof value.update == 'function') value.update();
			});

			decadeUI.init();
			console.timeEnd(decadeUIName);
		},
		precontent:async function(){
			if (lib.config.extension_十周年UI_outcropSkin) {
				lib.characterDefaultPicturePath = 'extension/十周年UI/image/decoration/default_silhouette_';
			}
			if (lib.config[`extension_${decadeUIName}_eruda`]) {
				const script = document.createElement('script');
				script.src = decadeUIPath + 'eruda.js';
				document.body.appendChild(script);
				script.onload = () => eruda.init();
			}

			const extension = lib.extensionMenu[`extension_${decadeUIName}`];
			if (!(extension && extension.enable && extension.enable.init)) return;

			if (window.require && !window.fs) window.fs = require('fs');

			lib.configMenu.appearence.config.layout.visualMenu = (node, link) => {
			node.className = `button character themebutton ${lib.config.theme}`;
			node.classList.add(link);
			if (node.created) return;
			node.created = true;
			node.style.overflow = 'scroll';
			
			const list = ['re_caocao', 're_liubei', 'sp_zhangjiao', 'sunquan'];
				while (list.length) {
					ui.create.div('.avatar', ui.create.div('.seat-player.fakeplayer', node)).setBackground(list.randomRemove(), 'character');
				}
			};

			window.decadeModule = function (decadeModule) {
				if (ui.css.layout && (!ui.css.layout.href || ui.css.layout.href.indexOf('long2') < 0)) ui.css.layout.href = `${lib.assetURL}layout/long2/layout.css`;
				
				decadeModule.init = function () {
					this.css(`${decadeUIPath}decadeLayout.css`);
					this.css(`${decadeUIPath}layout.css`);
					this.css(`${decadeUIPath}player.css`);

					const decadeExtCardImage = lib.decade_extCardImage || (lib.decade_extCardImage = {});
					if (window.fs) new Promise((resolve, reject) => fs.readdir(`${__dirname}/${decadeUIPath}image/card/`, (errnoException, files) => {
						if (errnoException) reject(errnoException);
						else resolve(files);
					})).then(files => files.forEach(file => {
						const fileName = lib.path.parse(file).name;
						if (!decadeExtCardImage[fileName]) decadeExtCardImage[fileName] = `${decadeUIPath}image/card/${file}`;
					}));
					else if (typeof resolveLocalFileSystemURL == 'function') new Promise((resolve, reject) => {
						resolveLocalFileSystemURL(`${decadeUIResolvePath}image/card/`, resolve, reject);
					}).then(directoryEntry => new Promise((resolve, reject) => {
						directoryEntry.createReader().readEntries(resolve, reject);
					})).then(entries => entries.forEach(entry => {
						const entryName = entry.name, fileName = lib.path.parse(entryName).name;
						if (!decadeExtCardImage[fileName]) decadeExtCardImage[fileName] = `${decadeUIPath}image/card/${entryName}`;
					}));
					return this;
				};
				decadeModule.init2 = function(){
					return Promise.all([
					this.asyncJs(`${decadeUIPath}animation.js`),
					this.asyncJs(`${decadeUIPath}component.js`),
					this.asyncJs(`${decadeUIPath}content.js`),
					this.asyncJs(`${decadeUIPath}dynamicSkin.js`),
					this.asyncJs(`${decadeUIPath}dynamicSkinTemplate.js`),
					this.asyncJs(`${decadeUIPath}effect.js`),
					this.asyncJs(`${decadeUIPath}menu.js`),
					this.asyncJs(`${decadeUIPath}skill.js`),
					this.asyncJs(`${decadeUIPath}spine.js`)
					]);
				};
				decadeModule.asyncJs = async function(path){
					return new Promise((resolve,reject)=>{
						decadeModule.js(path,ret=>{
							resolve();
						});
					});
				};
				decadeModule.asyncCss = async function(path){
					return new Promise((resolve,reject)=>{
						decadeModule.css(path,ret=>{
							resolve();
						});
					});
				};
				decadeModule.js = function (path,callback) {
					if (!path) {
						//alert(path+"加载失败！");
						if(callback)callback(false);
						return console.error('path');
					}

					const script = document.createElement('script');
					script.onload = function () {
						this.remove();
						if(callback)callback(true);
					};
					script.onerror = function () {
						this.remove();
						//alert(path+"加载失败！");
						console.error(`${this.src}not found`);
						if(callback)callback(false);
					};
					script.src = `${path}?v=${version}`;
					document.head.appendChild(script);
					return script;
				};
				decadeModule.css = function (path,callback) {
					if (!path){
						if(callback){
							callback(false);
						}
						return console.error('path');
					}
					const link = document.createElement('link');
					link.rel = 'stylesheet';
					link.href = `${path}?v=${version}`;
					document.head.appendChild(link);
					link.onload = function(){
						if(callback)callback(true);
					};
					link.onerror = function(){
						if(callback)callback(false);
					}
					return link;
				};
				decadeModule.import = function (module) {
					if (!this.modules) this.modules = [];
					if (typeof module != 'function') return console.error('import failed');
					this.modules.push(module);
				};
				return decadeModule.init();
			}({});
			await window.decadeModule.init2();

			Object.defineProperties(_status, {
				connectMode: {
					configurable: true,
					get:function(){
						return this._connectMode;
					},
					set:function(value){
						this._connectMode = value;
						if (!value || !lib.extensions) return;
						const decadeExtension = lib.extensions.find(value => value[0] == decadeUIName);
						if (!decadeExtension) return;

						const startBeforeFunction = lib.init.startBefore;
						lib.init.startBefore = function(){
							try {
								_status.extension = decadeExtension[0];
								_status.evaluatingExtension = decadeExtension[3];
								decadeExtension[1](decadeExtension[2], decadeExtension[4]);
								delete _status.extension;
								delete _status.evaluatingExtension;
								console.log(`%c${decadeUIName}: 联机成功`, 'color:blue');
							} catch(e) {
								console.log(e);
							}

							if (startBeforeFunction) startBeforeFunction.apply(this, arguments);
						};
					}
				},
				_connectMode: {
					value: false,
					writable: true
				}
			});
			
		},
		config:{
			eruda:{
				name: '调试助手(开发用)',
				init: false,
			},
			rightLayout:{
				name: '右手布局',
				init: false,
				update: () => {
					if (window.decadeUI) ui.arena.dataset.rightLayout = lib.config.extension_十周年UI_rightLayout ? 'on' : 'off';
				}
			},
			cardPrettify:{
				name: '卡牌美化(需重启)',
				init: true,
			},
			dynamicBackground:{
				name: '动态背景',
				init: 'off',
				item:{
					off: '关闭',
					skin_xiaosha_default: 				'小杀',
					skin_baosanniang_漫花剑俏: 			'鲍三娘-漫花剑俏',
					skin_baosanniang_舞剑铸缘: 			'鲍三娘-舞剑铸缘',
					skin_caiwenji_才颜双绝: 			'蔡文姬-才颜双绝',
					skin_caojie_凤历迎春: 				'曹　节-凤历迎春',
					skin_caojie_战场绝版: 				'曹　节-战场绝版',
					skin_caoying_巾帼花舞: 				'曹　婴-巾帼花舞',
					skin_daqiao_清萧清丽: 				'大　乔-清萧清丽',
					skin_daqiao_衣垂绿川:				'大　乔-衣垂绿川',
					skin_daqiao_战场绝版: 				'大　乔-战场绝版',
					skin_daqiaoxiaoqiao_战场绝版: 		'大乔小乔-战场绝版',
					skin_diaochan_玉婵仙子: 			'貂　蝉-玉婵仙子',
					skin_diaochan_战场绝版: 			'貂　蝉-战场绝版',
					skin_dongbai_娇俏伶俐: 				'董　白-娇俏伶俐',
					skin_fuhuanghou_万福千灯: 			'伏皇后-万福千灯',
					skin_fanyufeng_斟酒入情: 			'樊玉凤-斟酒入情',
					skin_guozhao_雍容尊雅: 				'郭　照-雍容尊雅',
					skin_huaman_花俏蛮娇: 				'花　鬘-花俏蛮娇',
					skin_huaman_经典形象: 				'花　鬘-经典形象',
					skin_hetaihou_鸩毒除患: 			'何太后-鸩毒除患',
					skin_hetaihou_蛇蝎为心: 			'何太后-蛇蝎为心',
					skin_hetaihou_耀紫迷幻: 			'何太后-耀紫迷幻',
					skin_lukang_毁堰破晋: 				'陆　抗-毁堰破晋',
					skin_luxun_谋定天下: 				'陆　逊-谋定天下',
					skin_luxunlvmeng_清雨踏春: 			'陆逊吕蒙-清雨踏春',
					skin_mayunlu_战场绝版: 				'马云騄-战场绝版',
					skin_simashi_桀骜睥睨:				'司马师-桀骜睥睨',
					skin_sundengzhoufei_鹊星夕情: 		'孙登周妃-鹊星夕情',
					skin_sunluban_宵靥谜君: 			'孙鲁班-宵靥谜君',
					skin_sunluyu_娇俏伶俐: 				'孙鲁育-娇俏伶俐',
					skin_shuxiangxiang_花好月圆: 		'蜀香香-花好月圆',
					skin_shuxiangxiang_花曳心牵:		'蜀香香-花曳心牵',
					skin_wangrong_云裳花容: 			'王　荣-云裳花容',
					skin_wangyi_绝色异彩: 				'王　异-绝色异彩',
					skin_wangyi_战场绝版: 				'王　异-战场绝版',
					skin_wolongzhuge_隆中陇亩: 			'卧龙诸葛-隆中陇亩',
					skin_wuxian_锦运福绵: 				'吴　苋-锦运福绵',
					skin_wuxian_金玉满堂: 				'吴　苋-金玉满堂',
					skin_xiahoushi_端华夏莲: 			'夏侯氏-端华夏莲',
					skin_xiahoushi_战场绝版: 			'夏侯氏-战场绝版',
					skin_xiaoqiao_花好月圆: 			'小　乔-花好月圆',
					skin_xiaoqiao_采莲江南: 			'小　乔-采莲江南',
					skin_xinxianying_英装素果: 			'辛宪英-英装素果',
					skin_xushi_拈花思君: 				'徐　氏-拈花思君',
					skin_xushi_为夫弑敌: 				'徐　氏-为夫弑敌',
					skin_zhangchangpu_钟桂香蒲: 		'张昌蒲-钟桂香蒲',
					skin_zhangchunhua_花好月圆: 		'张春华-花好月圆',
					skin_zhangchunhua_战场绝版: 		'张春华-战场绝版',
					skin_zhoufei_晴空暖鸢: 				'周　妃-晴空暖鸢',
					skin_zhangqiying_逐鹿天下: 			'张琪瑛-逐鹿天下',
					skin_zhangqiying_岁稔年丰: 			'张琪瑛-岁稔年丰',
					skin_zhenji_才颜双绝: 				'甄　姬-才颜双绝',
					skin_zhenji_洛神御水: 				'甄　姬-洛神御水',
					skin_zhugeguo_兰荷艾莲: 			'诸葛果-兰荷艾莲',
					skin_zhugeguo_仙池起舞: 			'诸葛果-仙池起舞',
					skin_zhugeguo_英装素果: 			'诸葛果-英装素果',
					skin_zhugeliang_空城退敌: 			'诸葛亮-空城退敌',
					skin_zhouyi_剑舞浏漓: 				'周　夷-剑舞浏漓',
					skin_zhangxingcai_凯旋星花: 		'张星彩-凯旋星花',
				},
				update: () => {
					if (!window.decadeUI) return;

					const item = lib.config.extension_十周年UI_dynamicBackground;
					if (!item || item == 'off') return decadeUI.backgroundAnimation.stopSpineAll();
					const name = item.split('_'), skin = name.splice(name.length - 1, 1)[0];
					decadeUI.backgroundAnimation.play(name.join('_'), skin);
				}
			},
			dynamicSkin:{
				name: '动态皮肤',
				init: false,
			},
			dynamicSkinOutcrop:{
				name: '动皮露头',
				init: true,
				update: () => {
					if (!window.decadeUI) return;
					const enable = lib.config.extension_十周年UI_dynamicSkinOutcrop;
					ui.arena.dataset.dynamicSkinOutcrop = enable ? 'on' : 'off';
					const players = game.players;
					if (!players) return;
					players.forEach(value => {
						if (!value.dynamic) return;
						value.dynamic.outcropMask = enable;
						value.dynamic.update(false);
					});
				}
			},
			showJieMark:{
				name: '界标记显示',
				init: true,
			},
			cardAlternateNameVisible:{
				name: '牌名辅助显示',
				init: false,
				update: () => {
					if (window.decadeUI) ui.window.dataset.cardAlternateNameVisible = lib.config.extension_十周年UI_cardAlternateNameVisible ? 'on' : 'off';
				}
			},
			campIdentityImageMode:{
				name: '势力身份美化',
				init: true,
			},
			playerKillEffect:{
				name: '玩家击杀特效',
				init: true,
				onclick: value => {
					game.saveConfig('extension_十周年UI_playerKillEffect', value);
					if (window.decadeUI) decadeUI.config.playerKillEffect = value;
				},
			},
			gameAnimationEffect:{
				name: '游戏动画特效',
				init: true,
			},
			playerKillAndRecoverEffect:{
				name: '玩家击杀及回血音效',
				init: true,
				onclick: value => {
					game.saveConfig('extension_十周年UI_playerKillAndRecoverEffect', value);
					if (window.decadeUI) decadeUI.config.playerKillAndRecoverEffect = value;
				},
			},
			playerDieEffect:{
				name: '玩家阵亡特效',
				init: true,
				onclick: value => {
					game.saveConfig('extension_十周年UI_playerDieEffect', value);
					if (window.decadeUI) decadeUI.config.playerDieEffect = value;
				},
			},
			cardUseEffect:{
				name: '卡牌使用特效',
				init: true,
				onclick: value => {
					game.saveConfig('extension_十周年UI_cardUseEffect', value);
					if (window.decadeUI) decadeUI.config.cardUseEffect = value;
				},
			},
			outcropSkin:{
				name: '露头皮肤(需对应素材)',
				init: false,
				update: () => {
					if (window.decadeUI) ui.arena.dataset.outcropSkin = lib.config.extension_十周年UI_outcropSkin ? 'on' : 'off';
				}
			},
			borderLevel:{
				name: '玩家边框等阶',
				init: 'five',
				item:{
					one:'一阶',
					two:'二阶',
					three:'三阶',
					four:'四阶',
					five:'五阶',
				},
				update: () => {
					if (window.decadeUI) ui.arena.dataset.borderLevel = lib.config.extension_十周年UI_borderLevel;
				}
			},
			gainSkillsVisible:{
				name: '获得技能显示',
				init: 'on',
				item:{
					on: '显示',
					off: '不显示',
					othersOn : '显示他人',
				},
				update: () => {
					if (window.decadeUI) ui.arena.dataset.gainSkillsVisible = lib.config.extension_十周年UI_gainSkillsVisible;
				}
			},
			playerMarkStyle:{
				name: '人物标记样式',
				init: 'yellow',
				item:{
					red:'红色',
					yellow:'黄色',
					decade:'十周年',
					normal:'原版',
				},
				update: () => {
					if (window.decadeUI) ui.arena.dataset.playerMarkStyle = lib.config.extension_十周年UI_playerMarkStyle;
				}
			},
		},
		package:{
			intro:(function(){
				var log = [
				'有bug先检查其他扩展，不行再关闭UI重试，最后再联系作者。',
				'当前版本：1.2.0.220114',
				'更新日期：2022-01-14',
				'- 新增动皮及背景：[曹节-凤历迎春]、[曹婴-巾帼花舞]、[貂蝉-战场绝版]、[何太后-耀紫迷幻]、[王荣-云裳花容]、[吴苋-金玉满堂]、[周夷-剑舞浏漓]；',
				'- 新增动皮oncomplete支持(函数内部只能调用this.xxx代码)；',
				'- 优化了主玩家攻击指示线的位置显示；',
				'- 优化了主玩家出牌摸牌相关呈现动画；',
				'- 优化折叠手牌，开关跟随系统的设置；',
				'- 优化部分代码，提升游戏整体流畅度；',
				'- 修复关闭界包后因界标记弹窗的问题；',
				'- 修复挑战模式下界武将名丢失的问题；',
				'- 修复挑战模式下动皮异常拉伸的问题；',
				'- 修复了加载其他目录的特效文件问题；',
				'- 修复低版本窗口改动后动皮模糊问题；'
				];

				return '<p style="color:rgb(210,210,000); font-size:12px; line-height:14px; text-shadow: 0 0 2px black;">' + log.join('<br>') + '</p>';
			})(),
			author:"短歌 QQ464598631",
			diskURL:"",
			forumURL:"",
			version: version,
		},
		editable: false
	};
});