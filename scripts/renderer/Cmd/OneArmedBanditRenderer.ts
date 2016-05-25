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
	 * Resize event memory.
	 *
	 * @property _resizeEvents
	 * @type Array
	 */
	private _resizeEvents : any;

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

		var cmdHTMLWrapper = $("<div>");
		cmdHTMLWrapper.addClass("OneArmedBanditRenderer_wrapper");
		cmdHTMLWrapper.addClass(rendererTheme);

		/*var cmdMainzone = $("<div>");
		cmdMainzone.addClass("OneArmedBanditRenderer_mainzone");

		cmdHTMLWrapper.append(cmdMainzone);

		var cmdDiv = $("<div>");
		cmdDiv.addClass("OneArmedBanditRenderer_cmd");

		cmdMainzone.append(cmdDiv);

		for(var i = 0; i < 4; i++) {
			if(i!=0) {
				var digitListInter = $("<ul>");
				digitListInter.addClass("OneArmedBanditRenderer_digitList_inter");

				var digitListInterContent = $("<li>");
				digitListInterContent.addClass("OneArmedBanditRenderer_digiList_inter_content");

				digitListInter.append(digitListInterContent);

				cmdDiv.append(digitListInter);
			}

			var digitList = $("<ul>");
			digitList.addClass("OneArmedBanditRenderer_digitList");
			digitList.addClass("OneArmedBanditRenderer_digitList" + i.toString());

			for(var j = 0; j < 11; j++) {
				var digitElem = $("<li>");
				digitElem.addClass("OneArmedBanditRenderer_digit");
				digitElem.addClass("OneArmedBanditRenderer_digit" + j.toString());
				var digitElemSpan = $("<span>");
				digitElemSpan.html((j%10).toString());
				digitElem.append(digitElemSpan);

				digitList.append(digitElem);
			}

			cmdDiv.append(digitList);
		}

		var clearDigitList = $("<div>");
		clearDigitList.addClass("clearfix");

		cmdDiv.append(clearDigitList);

		var cmdSinceZone = $("<div>");
		cmdSinceZone.addClass("OneArmedBanditRenderer_sincezone");

		if(typeof(info.getSince()) != "undefined" && info.getSince() != null) {
			var cmdSinceZoneSpan = $("<span>");
			var sinceDate = moment(info.getSince());
			sinceDate.locale("fr");
			cmdSinceZoneSpan.html("Depuis le : " + sinceDate.format("LLL"));
			cmdSinceZone.append(cmdSinceZoneSpan);
		}

		cmdHTMLWrapper.append(cmdSinceZone);

		$(domElem).append(cmdHTMLWrapper);

		var responsiveResize = function(doneCallback) {
			var textHeight = "";

			var finishResponsiveResize = function() {
				$(domElem).find(".OneArmedBanditRenderer_digitList").css("height", textHeight);
				$(domElem).find(".OneArmedBanditRenderer_digit").css("line-height", textHeight);
				$(domElem).find(".OneArmedBanditRenderer_digit span").css("font-size", textHeight);

				var fullHeight = $(domElem).find(".OneArmedBanditRenderer_mainzone").first().height();

				$(domElem).find(".OneArmedBanditRenderer_cmd").css("height", textHeight);
				$(domElem).find(".OneArmedBanditRenderer_cmd").css("margin-top", ((fullHeight - parseFloat(textHeight.slice(0, -2))) / 2) + "px");

				var interHeight = $(domElem).find(".OneArmedBanditRenderer_digitList_inter").first().height();
				$(domElem).find(".OneArmedBanditRenderer_digitList_inter").css("margin-top", ( (parseFloat(textHeight.slice(0, -2)) - interHeight ) / 2) + "px");

				if(typeof(doneCallback) != "undefined" && doneCallback != null) {
					doneCallback();
				}
			};

			var digitList0 = $(domElem).find(".OneArmedBanditRenderer_digitList0").first();
			digitList0.css("height", digitList0.css("height"));
			var digitElem0 = digitList0.find(".OneArmedBanditRenderer_digit0");
			digitElem0.css("line-height", digitList0.css("height"));

			digitElem0.textfill({
				maxFontPixels: 500,
				success: function () {
					textHeight = digitElem0.find("span").first().css("font-size");

					finishResponsiveResize();
				}
			});
		};

		if(typeof(self._resizeEvents) == "undefined") {
			self._resizeEvents = [];
		}

		if(typeof(self._resizeEvents[info.getId()]) == "undefined") {
			self._resizeEvents[info.getId()] = null;

			$(window).resize(function () {
				if (self._resizeEvents[info.getId()] != null) {
					self._resizeEvents[info.getId()].stop();
					self._resizeEvents[info.getId()] = null;
				}

				var resizeTimer = new Timer(function () {
					self._resizeEvents[info.getId()] = null;
					self.updateRender(info, domElem, rendererTheme, function () {
						self.animate(info, domElem, rendererTheme, function () {
						});
					});
				}, 500);

				self._resizeEvents[info.getId()] = resizeTimer;
			});
		}

		responsiveResize(function() {
			endCallback();
		});*/
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
		$(domElem).empty();
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
		var self = this;

		/*if (self._resizeEvents[info.getId()] == null) {
			var nbDigit = info.getValue().toString().length;
			var infoValue = info.getValue();

			if (nbDigit < 4) {
				for (var i = 4; i > nbDigit; i--) {
					var digitElemNumber = 4 - i;

					$(domElem).find(".OneArmedBanditRenderer_digitList" + digitElemNumber.toString()).first().transition({y: '0px'}, 2000);
				}
			}

			for (var k = nbDigit; k > 0; k--) {
				var digitElemNumber = 4 - k;
				var digitElemValue = (infoValue - (infoValue % Math.pow(10, k - 1))) / Math.pow(10, k - 1);
				infoValue = infoValue - (digitElemValue * Math.pow(10, k - 1));

				var digitList = $(domElem).find(".OneArmedBanditRenderer_digitList" + digitElemNumber.toString()).first();
				digitList.transition({y: '' + (-digitList.height() * digitElemValue) + 'px'}, 2000);
			}

			new Timer(function () {
				endCallback();
			}, 2000);
		}*/
	}
}