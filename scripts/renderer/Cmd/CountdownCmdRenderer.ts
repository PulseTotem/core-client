/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../core/Logger.ts" />
/// <reference path="../../core/Timer.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/CmdList.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery

class CountdownCmdRenderer implements Renderer<Cmd> {

	/**
	 * Timer.
	 *
	 * @property _timer
	 * @type Timer
	 */
	private _timer : Timer;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		this._timer = null;
	}

	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : CmdList) : Array<Cmd> {
		var newListInfos : Array<CmdList> = new Array<CmdList>();
		try {
			var newInfo = CmdList.fromJSONObject(info);
			newListInfos.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		var result = new Array<Cmd>();

		newListInfos.forEach(function(cmdList : CmdList) {
			var cmds : Array<Cmd> = cmdList.getCmds();

			cmds.forEach(function (cmd : Cmd) {
				result.push(cmd);
			});
		});

		return result;
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
		switch(info.getCmd()) {
			case "init" :
				$(domElem).empty();
				var countdownDesc = info.getArgs()[0];
				this._renderEmpty(domElem, rendererTheme, countdownDesc);
				if(this._timer != null) {
					this._timer.stop();
					this._timer = null;
				}
				break;
			case "wait" :
				$(domElem).empty();
				var countdownArg : any = info.getArgs()[0];
				this._renderWait(domElem, rendererTheme, countdownArg);
				if(this._timer != null) {
					this._timer.stop();
					this._timer = null;
				}
				break;
			case "ready" :
				$(domElem).empty();
				var countdownArg : any = info.getArgs()[0];
				this._renderReady(domElem, rendererTheme, countdownArg);
				if(this._timer != null) {
					this._timer.stop();
					this._timer = null;
				}
				break;
			case "run" :
				if(this._timer != null) {
					this._timer.resume();
				} else {
					$(domElem).empty();
					var countdownArg : any = info.getArgs()[0];
					this._renderRun(domElem, rendererTheme, countdownArg);
				}
				break;
			case "pause" :
				if(this._timer != null) {
					this._timer.pause();
				}
				break;
			default :
			// Nothing to do ?
		}

		endCallback();
	}

	/**
	 * Render "Init" command in specified DOM Element.
	 *
	 * @method _renderEmpty
	 * @private
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {JSON Object} countdownDesc - The Countdown description.
	 */
	private _renderEmpty(domElem : any, rendererTheme : string, countdownDesc : any) {
		var wrapperDiv = $('<div>');
		wrapperDiv.addClass("CountdownCmdRenderer_wrapper");
		wrapperDiv.addClass(rendererTheme);

		var headerDiv = $('<div>');
		headerDiv.addClass("CountdownCmdRenderer_header");

		wrapperDiv.append(headerDiv);

		if(countdownDesc.logo != "") {
			var logoDiv = $('<div>');
			logoDiv.addClass("CountdownCmdRenderer_logo");

			logoDiv.css('background-image', "url(" + countdownDesc.logo + ")");

			headerDiv.append(logoDiv);
		}

		if(countdownDesc.title != "") {
			var titleDiv = $('<div>');
			titleDiv.addClass("CountdownCmdRenderer_title");

			var titleSpan = $('<span>');
			titleSpan.html(countdownDesc.title);

			titleDiv.append(titleSpan);

			headerDiv.append(titleDiv);
		}

		var contentContainerDiv = $('<div>');
		contentContainerDiv.addClass("CountdownCmdRenderer_content_container");

		wrapperDiv.append(contentContainerDiv);

		if(countdownDesc.content != "") {
			var contentDiv = $('<div>');
			contentDiv.addClass("CountdownCmdRenderer_content");

			var contentSpan = $('<span>');
			contentSpan.html(countdownDesc.content);

			contentDiv.append(contentSpan);

			contentContainerDiv.append(contentDiv);
		}

		$(domElem).append(wrapperDiv);

		if(countdownDesc.title != "") {
			titleDiv.textfill({
				maxFontPixels: 500,
				success: function() {
					var fontSize = titleDiv.find("span").first().css("font-size");
					var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
					var newFontSize = fontSizeInt - 4;
					titleDiv.find("span").first().css("font-size", newFontSize.toString() + "px");
				}
			});
		}

		if(countdownDesc.content != "") {
			contentDiv.textfill({
				maxFontPixels: 500,
				success: function() {
					var fontSize = contentDiv.find("span").first().css("font-size");
					var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
					var newFontSize = fontSizeInt - 4;
					contentDiv.find("span").first().css("font-size", newFontSize.toString() + "px");
				}
			});
		}
	}

	/**
	 * Render "Wait" command in specified DOM Element.
	 *
	 * @method _renderWait
	 * @private
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {JSON Object} countdownArg - The Countdown description.
	 */
	private _renderWait(domElem : any, rendererTheme : string, countdownArg : any) {
		var countdownDesc = countdownArg.countdown;

		var wrapperDiv = $('<div>');
		wrapperDiv.addClass("CountdownCmdRenderer_wrapper");
		wrapperDiv.addClass(rendererTheme);

		var headerDiv = $('<div>');
		headerDiv.addClass("CountdownCmdRenderer_header");

		wrapperDiv.append(headerDiv);

		if(countdownDesc.logo != "") {
			var logoDiv = $('<div>');
			logoDiv.addClass("CountdownCmdRenderer_logo");

			logoDiv.css('background-image', "url(" + countdownDesc.logo + ")");

			headerDiv.append(logoDiv);
		}

		if(countdownDesc.title != "") {
			var titleDiv = $('<div>');
			titleDiv.addClass("CountdownCmdRenderer_title");

			var titleSpan = $('<span>');
			titleSpan.html(countdownDesc.title);

			titleDiv.append(titleSpan);

			headerDiv.append(titleDiv);
		}

		var contentContainerDiv = $('<div>');
		contentContainerDiv.addClass("CountdownCmdRenderer_content_container");

		wrapperDiv.append(contentContainerDiv);

		if(countdownDesc.content != "") {
			var contentDiv = $('<div>');
			contentDiv.addClass("CountdownCmdRenderer_content");

			var contentSpan = $('<span>');
			contentSpan.html(countdownDesc.content);

			contentDiv.append(contentSpan);

			contentContainerDiv.append(contentDiv);
		}

		$(domElem).append(wrapperDiv);

		if(countdownDesc.title != "") {
			titleDiv.textfill({
				maxFontPixels: 500,
				success: function() {
					var fontSize = titleDiv.find("span").first().css("font-size");
					var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
					var newFontSize = fontSizeInt - 4;
					titleDiv.find("span").first().css("font-size", newFontSize.toString() + "px");
				}
			});
		}

		if(countdownDesc.content != "") {
			contentDiv.textfill({
				maxFontPixels: 500,
				success: function() {
					var fontSize = contentDiv.find("span").first().css("font-size");
					var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
					var newFontSize = fontSizeInt - 4;
					contentDiv.find("span").first().css("font-size", newFontSize.toString() + "px");
				}
			});
		}
	}

	/**
	 * Render "Ready" command in specified DOM Element.
	 *
	 * @method _renderReady
	 * @private
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {JSON Object} countdownArg - The Countdown description.
	 */
	private _renderReady(domElem : any, rendererTheme : string, countdownArg : any) {
		var countdownDesc = countdownArg.countdown;

		var wrapperDiv = $('<div>');
		wrapperDiv.addClass("CountdownCmdRenderer_wrapper");
		wrapperDiv.addClass(rendererTheme);

		var headerDiv = $('<div>');
		headerDiv.addClass("CountdownCmdRenderer_header");

		wrapperDiv.append(headerDiv);

		if(countdownDesc.logo != "") {
			var logoDiv = $('<div>');
			logoDiv.addClass("CountdownCmdRenderer_logo");

			logoDiv.css('background-image', "url(" + countdownDesc.logo + ")");

			headerDiv.append(logoDiv);
		}

		if(countdownDesc.title != "") {
			var titleDiv = $('<div>');
			titleDiv.addClass("CountdownCmdRenderer_title");

			var titleSpan = $('<span>');
			titleSpan.html(countdownDesc.title);

			titleDiv.append(titleSpan);

			headerDiv.append(titleDiv);
		}

		var contentContainerDiv = $('<div>');
		contentContainerDiv.addClass("CountdownCmdRenderer_content_container");

		wrapperDiv.append(contentContainerDiv);

		var timerDiv = $('<div>');
		timerDiv.addClass("CountdownCmdRenderer_timer");

		var timerString = "";

		if(countdownDesc.timer.hours > 0) {
			timerString += countdownDesc.timer.hours.toString() + " : ";
		}

		if(countdownDesc.timer.hours > 0 || countdownDesc.timer.minutes > 0) {
			if (countdownDesc.timer.minutes < 10) {
				timerString += "0";
			}
			timerString += countdownDesc.timer.minutes.toString() + " : ";
		}

		if(countdownDesc.timer.seconds < 10) {
			timerString += "0";
		}
		timerString += countdownDesc.timer.seconds.toString();

		var timerSpan = $('<span>');
		timerSpan.html(timerString);
		timerDiv.append(timerSpan);

		contentContainerDiv.append(timerDiv);

		if(countdownDesc.content != "") {
			var contentDiv = $('<div>');
			contentDiv.addClass("CountdownCmdRenderer_ready");

			var contentSpan = $('<span>');
			contentSpan.html(countdownDesc.content);

			contentDiv.append(contentSpan);

			contentContainerDiv.append(contentDiv);
		}

		$(domElem).append(wrapperDiv);

		if(countdownDesc.title != "") {
			titleDiv.textfill({
				maxFontPixels: 500,
				success: function() {
					var fontSize = titleDiv.find("span").first().css("font-size");
					var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
					var newFontSize = fontSizeInt - 4;
					titleDiv.find("span").first().css("font-size", newFontSize.toString() + "px");
				}
			});
		}

		timerDiv.textfill({
			maxFontPixels: 500,
			success: function() {
				var fontSize = timerDiv.find("span").first().css("font-size");
				var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
				var newFontSize = fontSizeInt - 4;
				timerDiv.find("span").first().css("font-size", newFontSize.toString() + "px");
			}
		});

		if(countdownDesc.content != "") {
			contentDiv.textfill({
				maxFontPixels: 500,
				success: function() {
					var fontSize = contentDiv.find("span").first().css("font-size");
					var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
					var newFontSize = fontSizeInt - 4;
					contentDiv.find("span").first().css("font-size", newFontSize.toString() + "px");
				}
			});
		}
	}

	/**
	 * Render "Run" command in specified DOM Element.
	 *
	 * @method _renderRun
	 * @private
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {JSON Object} countdownArg - The Countdown description.
	 */
	private _renderRun(domElem : any, rendererTheme : string, countdownArg : any) {
		var countdownDesc = countdownArg.countdown;

		var self = this;

		var wrapperDiv = $('<div>');
		wrapperDiv.addClass("CountdownCmdRenderer_wrapper");
		wrapperDiv.addClass(rendererTheme);

		var headerDiv = $('<div>');
		headerDiv.addClass("CountdownCmdRenderer_header");

		wrapperDiv.append(headerDiv);

		if(countdownDesc.logo != "") {
			var logoDiv = $('<div>');
			logoDiv.addClass("CountdownCmdRenderer_logo");

			logoDiv.css('background-image', "url(" + countdownDesc.logo + ")");

			headerDiv.append(logoDiv);
		}

		if(countdownDesc.title != "") {
			var titleDiv = $('<div>');
			titleDiv.addClass("CountdownCmdRenderer_title");

			var titleSpan = $('<span>');
			titleSpan.html(countdownDesc.title);

			titleDiv.append(titleSpan);

			headerDiv.append(titleDiv);
		}

		var contentContainerDiv = $('<div>');
		contentContainerDiv.addClass("CountdownCmdRenderer_content_container");

		wrapperDiv.append(contentContainerDiv);

		var timerDiv = $('<div>');
		timerDiv.addClass("CountdownCmdRenderer_timer");

		var timerSpan = $('<span>');

		timerDiv.append(timerSpan);

		contentContainerDiv.append(timerDiv);

		var contentDiv = $('<div>');
		contentDiv.addClass("CountdownCmdRenderer_ready");

		var contentSpan = $('<span>');

		contentDiv.append(contentSpan);

		contentContainerDiv.append(contentDiv);

		$(domElem).append(wrapperDiv);

		if(countdownDesc.title != "") {
			titleDiv.textfill({
				maxFontPixels: 500,
				success: function() {
					var fontSize = titleDiv.find("span").first().css("font-size");
					var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
					var newFontSize = fontSizeInt - 4;
					titleDiv.find("span").first().css("font-size", newFontSize.toString() + "px");
				}
			});
		}

		var timerDuration = parseInt(countdownDesc.timer.hours) * 3600 + parseInt(countdownDesc.timer.minutes) * 60 + parseInt(countdownDesc.timer.seconds);

		var displayTimerDuration = function() {
			self._timer = null;

			var timerString = "";

			if (timerDuration == 0) {

				timerString = "TIME's UP !"

				if(countdownDesc.endmessage) {
					contentSpan.html(countdownDesc.endmessage);

					contentDiv.textfill({
						maxFontPixels: 500,
						success: function() {
							var fontSize = contentDiv.find("span").first().css("font-size");
							var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
							var newFontSize = fontSizeInt - 4;
							contentDiv.find("span").first().css("font-size", newFontSize.toString() + "px");
						}
					});
				}
			} else {
				var remainingHours = Math.floor(timerDuration / 3600);
				var remainingMinutes = Math.floor(timerDuration / 60) - (remainingHours * 60);
				var remainingSeconds = timerDuration - remainingHours * 3600 - remainingMinutes * 60;

				if (remainingHours > 0) {
					timerString += remainingHours.toString() + " : ";
				}

				if (remainingHours > 0 || remainingMinutes > 0) {
					if (remainingMinutes < 10) {
						timerString += "0";
					}
					timerString += remainingMinutes.toString() + " : ";
				}

				if (remainingSeconds < 10) {
					timerString += "0";
				}
				timerString += remainingSeconds.toString();
			}

			timerSpan.html(timerString);

			timerDiv.textfill({
				maxFontPixels: 500,
				success: function() {
					var fontSize = timerDiv.find("span").first().css("font-size");
					var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
					var newFontSize = fontSizeInt - 4;
					timerDiv.find("span").first().css("font-size", newFontSize.toString() + "px");
				}
			});

			if(timerDuration > 0) {
				timerDuration -= 1;
				self._timer = new Timer(displayTimerDuration, 1000);
			}
		};

		displayTimerDuration();
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
		this.render(info, domElem, rendererTheme, endCallback);
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
		//Nothing to do.

		endCallback();
	}
}