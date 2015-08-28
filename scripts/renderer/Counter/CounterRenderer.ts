/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/CounterList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Counter.ts" />
/// <reference path="../Renderer.ts" />
/// <reference path="../../core/Timer.ts" />

declare var $: any; // Use of JQuery

class CounterRenderer implements Renderer<Counter> {

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
	transformInfo(info : CounterList) : Array<Counter> {
		var counterLists : Array<CounterList> = new Array<CounterList>();
		try {
			var newInfo = CounterList.fromJSONObject(info);
			counterLists.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		var counters : Array<Counter> = new Array<Counter>();

		for(var iCL in counterLists) {
			var cl : CounterList = counterLists[iCL];
			var clCounters : Array<Counter> = cl.getCounters();
			for(var iC in clCounters) {
				var c : Counter = clCounters[iC];
				counters.push(c);
			}
		}

		return counters;
	}

	/**
	 * Render the Info in specified DOM Element.
	 *
	 * @method render
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : Counter, domElem : any, endCallback : Function) {
		var self = this;

		var counterHTMLWrapper = $("<div>");
		counterHTMLWrapper.addClass("CounterRenderer_wrapper");

		var counterMainzone = $("<div>");
		counterMainzone.addClass("CounterRenderer_mainzone");

		counterHTMLWrapper.append(counterMainzone);

		var counterDiv = $("<div>");
		counterDiv.addClass("CounterRenderer_counter");

		counterMainzone.append(counterDiv);

		for(var i = 0; i < 6; i++) {
			if(i!=0) {
				var digitListInter = $("<ul>");
				digitListInter.addClass("CounterRenderer_digitList_inter");

				var digitListInterContent = $("<li>");
				digitListInterContent.addClass("CounterRenderer_digiList_inter_content");

				digitListInter.append(digitListInterContent);

				counterDiv.append(digitListInter);
			}

			var digitList = $("<ul>");
			digitList.addClass("CounterRenderer_digitList");
			digitList.addClass("CounterRenderer_digitList" + i.toString());

			for(var j = 0; j < 11; j++) {
				var digitElem = $("<li>");
				digitElem.addClass("CounterRenderer_digit");
				digitElem.addClass("CounterRenderer_digit" + j.toString());
				var digitElemSpan = $("<span>");
				digitElemSpan.html((j%10).toString());
				digitElem.append(digitElemSpan);

				digitList.append(digitElem);
			}

			counterDiv.append(digitList);
		}

		var clearDigitList = $("<div>");
		clearDigitList.addClass("clearfix");

		counterDiv.append(clearDigitList);

		$(domElem).append(counterHTMLWrapper);

		var responsiveResize = function(doneCallback) {
			var textHeight = "";

			var finishResponsiveResize = function() {
				$(domElem).find(".CounterRenderer_digitList").css("height", textHeight);
				$(domElem).find(".CounterRenderer_digit").css("line-height", textHeight);
				$(domElem).find(".CounterRenderer_digit span").css("font-size", textHeight);

				var fullHeight = $(domElem).find(".CounterRenderer_mainzone").first().height();

				$(domElem).find(".CounterRenderer_counter").css("height", textHeight);
				$(domElem).find(".CounterRenderer_counter").css("margin-top", ((fullHeight - parseFloat(textHeight.slice(0, -2))) / 2) + "px");

				var interHeight = $(domElem).find(".CounterRenderer_digitList_inter").first().height();
				$(domElem).find(".CounterRenderer_digitList_inter").css("margin-top", ( (parseFloat(textHeight.slice(0, -2)) - interHeight ) / 2) + "px");

				if(typeof(doneCallback) != "undefined" && doneCallback != null) {
					doneCallback();
				}
			};

			var digitList0 = $(domElem).find(".CounterRenderer_digitList0").first();
			digitList0.css("height", digitList0.css("height"));
			var digitElem0 = digitList0.find(".CounterRenderer_digit0");
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
					self.updateRender(info, domElem, function () {
						self.animate(info, domElem, function () {
						});
					});
				}, 500);

				self._resizeEvents[info.getId()] = resizeTimer;
			});
		}

		responsiveResize(function() {
			endCallback();
		});
	}

	/**
	 * Update rendering Info in specified DOM Element.
	 *
	 * @method updateRender
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {Function} endCallback - Callback function called at the end of updateRender method.
	 */
	updateRender(info : Counter, domElem : any, endCallback : Function) {
		$(domElem).empty();
		this.render(info, domElem, endCallback);
	}

	/**
	 * Animate rendering Info in specified DOM Element.
	 *
	 * @method animate
	 * @param {RenderInfo} info - The Info to animate.
	 * @param {DOM Element} domElem - The DOM Element where animate the info.
	 * @param {Function} endCallback - Callback function called at the end of animation.
	 */
	animate(info : Counter, domElem : any, endCallback : Function) {$
		var self = this;

		if (self._resizeEvents[info.getId()] == null) {
			var nbDigit = info.getValue().toString().length;
			var infoValue = info.getValue();

			if (nbDigit < 6) {
				for (var i = 6; i > nbDigit; i--) {
					var digitElemNumber = 6 - i;

					$(domElem).find(".CounterRenderer_digitList" + digitElemNumber.toString()).first().transition({y: '0px'}, 2000);
				}
			}

			for (var k = nbDigit; k > 0; k--) {
				var digitElemNumber = 6 - k;
				var digitElemValue = (infoValue - (infoValue % Math.pow(10, k - 1))) / Math.pow(10, k - 1);
				infoValue = infoValue - (digitElemValue * Math.pow(10, k - 1));

				var digitList = $(domElem).find(".CounterRenderer_digitList" + digitElemNumber.toString()).first();
				digitList.transition({y: '' + (-digitList.height() * digitElemValue) + 'px'}, 2000);
			}

			new Timer(function () {
				endCallback();
			}, 2000);
		}
	}
}