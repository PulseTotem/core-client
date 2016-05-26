/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/CmdList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Cmd.ts" />
/// <reference path="../Renderer.ts" />
/// <reference path="../../core/Timer.ts" />

declare var $: any; // Use of JQuery

class OneArmedBanditRenderer implements Renderer<Cmd> {

	/**
	 * Number of Rolls.
	 *
	 * @property _nbRolls
	 * @type number
	 */
	private _nbRolls : number;

	/**
	 * Number of Cells.
	 *
	 * @property _nbCells
	 * @type number
	 */
	private _nbCells : number;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		this._nbRolls = 3;
		this._nbCells = 5;
	}

	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : CmdList) : Array<Cmd> {
		var cmdLists : Array<CmdList> = new Array<CmdList>();
		try {
			var newInfo = CmdList.fromJSONObject(info);
			cmdLists.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		var cmds : Array<Cmd> = new Array<Cmd>();

		for(var iCL in cmdLists) {
			var cl : CmdList = cmdLists[iCL];
			var clCmds : Array<Cmd> = cl.getCmds();
			for(var iC in clCmds) {
				var c : Cmd = clCmds[iC];
				cmds.push(c);
			}
		}

		return cmds;
	}

	/**
	 * Render the Info in specified DOM Element.
	 *
	 * @method render
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : Cmd, domElem : any, rendererTheme : string, endCallback : Function) {
		var self = this;

		var winImageURL = null;
		var loseImageURL = null;

		if(info.getCmd() == "Start") {
			winImageURL = info.getArgs()[0];
			loseImageURL = info.getArgs()[1];
		}

		var oneArmedBanditHTMLWrapper = $("<div>");
		oneArmedBanditHTMLWrapper.addClass("OneArmedBanditRenderer_wrapper");
		oneArmedBanditHTMLWrapper.addClass(rendererTheme);

		var oneArmedBanditMainzone = $("<div>");
		oneArmedBanditMainzone.addClass("OneArmedBanditRenderer_mainzone");

		oneArmedBanditHTMLWrapper.append(oneArmedBanditMainzone);

		var oneArmedBanditDiv = $("<div>");
		oneArmedBanditDiv.addClass("OneArmedBanditRenderer_oneArmedBandit");

		oneArmedBanditMainzone.append(oneArmedBanditDiv);

		for(var i = 0; i < self._nbRolls; i++) {
			var roll = $("<div>");
			roll.addClass("OneArmedBanditRenderer_roll");
			roll.addClass("OneArmedBanditRenderer_roll" + i.toString());
			roll.css("left", ( (100 / self._nbRolls) * i ) + "%");
			roll.css("animation-play-state", "paused");

			for(var j = 0; j < self._nbCells+1; j++) {
				var digitElem = $("<div>");
				digitElem.addClass("OneArmedBanditRenderer_roll_item");
				digitElem.addClass("OneArmedBanditRenderer_roll_item" + j.toString());

				if(j == 2) {
					if(winImageURL != null) {
						digitElem.css("background-image", "url('" + winImageURL + "')");
					}
				} else {
					if(loseImageURL != null) {
						digitElem.css("background-image", "url('" + loseImageURL + "')");
					}
				}

				roll.append(digitElem);
			}

			oneArmedBanditDiv.append(roll);
		}

		$(domElem).append(oneArmedBanditHTMLWrapper);

		if(info.getCmd() == "Start") {
			for (var i = 0; i < self._nbRolls; i++) {
				(function (index) {

					new Timer(function () {
						var roll = $(domElem).find(".OneArmedBanditRenderer_roll" + index.toString()).first();
						roll.css("animation-play-state", "running");
					}, 500 * (index + 1));
				})(i);
			}
		}
	}

	/**
	 * Update rendering Info in specified DOM Element.
	 *
	 * @method updateRender
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {Function} endCallback - Callback function called at the end of updateRender method.
	 */
	updateRender(info : Cmd, domElem : any, rendererTheme : string, endCallback : Function) {
		endCallback();
	}

	/**
	 * Animate rendering Info in specified DOM Element.
	 *
	 * @method animate
	 * @param {RenderInfo} info - The Info to animate.
	 * @param {DOM Element} domElem - The DOM Element where animate the info.
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {Function} endCallback - Callback function called at the end of animation.
	 */
	animate(info : Cmd, domElem : any, rendererTheme : string, endCallback : Function) {
		var self = this;

		if(info.getCmd() == "Stop") {
			var resultDisplayDuration = parseInt(info.getArgs()[0]);
			var result = (info.getArgs()[1] == "true");

			if(result) {
				for (var i = 0; i < self._nbRolls; i++) {
					(function (index) {
						new Timer(function () {
							var roll = $(domElem).find(".OneArmedBanditRenderer_roll" + index.toString()).first();
							roll.css("animation", "1s OneArmedBanditWin linear forwards");
							new Timer(function() {
								roll.css("animation", "2s OneArmedBanditRolling infinite linear");
								if(index == (self._nbRolls - 1)) {
									endCallback();
								}
							}, resultDisplayDuration * 1000);
						}, 500 * (index + 1));
					})(i);
				}
			} else {
				var winRollNumber = Math.floor(Math.random() * (self._nbRolls + 1));

				for (var i = 0; i < self._nbRolls; i++) {
					(function (index) {
						new Timer(function () {
							var roll = $(domElem).find(".OneArmedBanditRenderer_roll" + index.toString()).first();
							if(index == winRollNumber) {
								roll.css("animation", "1s OneArmedBanditWin linear forwards");
							} else {
								roll.css("animation", "1s OneArmedBanditLose linear forwards");
							}
							new Timer(function() {
								roll.css("animation", "2s OneArmedBanditRolling infinite linear");
								if(index == (self._nbRolls - 1)) {
									endCallback();
								}
							}, resultDisplayDuration * 1000);
						}, 500 * (index + 1));
					})(i);
				}
			}
		} else {
			for (var i = 0; i < self._nbRolls; i++) {
				(function(index) {

					new Timer(function () {
						var roll = $(domElem).find(".OneArmedBanditRenderer_roll" + index.toString()).first();
						roll.css("animation-play-state", "running");
						if(index == (self._nbRolls - 1)) {
							endCallback();
						}
					}, 500 * (index + 1));
				})(i);
			}
		}
	}
}