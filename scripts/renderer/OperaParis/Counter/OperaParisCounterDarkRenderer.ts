/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../../t6s-core/core/scripts/infotype/CounterList.ts" />
/// <reference path="../../../../t6s-core/core/scripts/infotype/Counter.ts" />
/// <reference path="../../Renderer.ts" />
/// <reference path="../../../core/Timer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class OperaParisCounterDarkRenderer implements Renderer<Counter> {
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

		var counterHTMLWrapper = $("<div>");
		counterHTMLWrapper.addClass("OperaParisCounterDarkRenderer_wrapper");

		var hashtagDiv = $("<div>");
		hashtagDiv.addClass("OperaParisCounterDarkRenderer_hashtag");
		var hashtagSpan = $("<span>");
		hashtagSpan.html("#OperaDeParis");
		hashtagDiv.append(hashtagSpan);

		counterHTMLWrapper.append(hashtagDiv);

		var counterMainzone = $("<div>");
		counterMainzone.addClass("OperaParisCounterDarkRenderer_mainzone");

		counterHTMLWrapper.append(counterMainzone);

		var counterDiv = $("<div>");
		counterDiv.addClass("OperaParisCounterDarkRenderer_counter");

		counterMainzone.append(counterDiv);

		for(var i = 0; i < 5; i++) {
			if(i!=0) {
				var digitListInter = $("<ul>");
				digitListInter.addClass("OperaParisCounterDarkRenderer_digitList_inter");

				counterDiv.append(digitListInter);
			}

			var digitList = $("<ul>");
			digitList.addClass("OperaParisCounterDarkRenderer_digitList");
			digitList.addClass("OperaParisCounterDarkRenderer_digitList" + i.toString());

			counterDiv.append(digitList);
		}

		var clearDigitList = $("<div>");
		clearDigitList.addClass("clearfix");

		counterDiv.append(clearDigitList);

		var twitterLogo = $("<div>");
		twitterLogo.addClass("OperaParisCounterDarkRenderer_twitter_logo");

		counterMainzone.append(twitterLogo);


		var nbTweetsTxtDiv = $("<div>");
		nbTweetsTxtDiv.addClass("OperaParisCounterDarkRenderer_nbtweets");

		var nbTweetsTxtSpan = $("<span>");
		nbTweetsTxtSpan.html("Nombre de Tweets aujourd'hui");

		nbTweetsTxtDiv.append(nbTweetsTxtSpan);

		counterHTMLWrapper.append(nbTweetsTxtDiv);

		$(domElem).append(counterHTMLWrapper);

		for(var i = 0; i < 5; i++) {
			var digitList = $(domElem).find(".OperaParisCounterDarkRenderer_digitList" + i.toString()).first();
			digitList.css("height", digitList.css( "height" ));

			for(var j = 0; j < 11; j++) {
				var digitElem = $("<li>");
				digitElem.addClass("OperaParisCounterDarkRenderer_digit" + j.toString());
				digitElem.css("line-height", digitList.css( "height" ));
				var digitElemSpan = $("<span>");
				digitElemSpan.html((j%10).toString());
				digitElem.append(digitElemSpan);

				digitList.append(digitElem);
				digitElem.textfill({
					maxFontPixels: 500
				});
			}
		}

		hashtagDiv.textfill({
			maxFontPixels: 500
		});

		nbTweetsTxtDiv.textfill({
			maxFontPixels: 500
		});

		$(window).resize(function() {
			hashtagDiv.textfill({
				maxFontPixels: 500
			});
		});

		endCallback();
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
	animate(info : Counter, domElem : any, endCallback : Function) {
		$(".OperaParisCounterDarkRenderer_hashtag").textfill({
			maxFontPixels: 500
		});

		$(".OperaParisCounterDarkRenderer_nbtweets").textfill({
			maxFontPixels: 500
		});

		var nbDigit = info.getValue().toString().length;
		var infoValue = info.getValue();

		if(nbDigit < 5) {
			for(var i = 5; i > nbDigit; i--) {
				var digitElemNumber = 5 - i;

				$(domElem).find(".OperaParisCounterDarkRenderer_digitList" + digitElemNumber.toString()).first().transition({ y: '0px' }, 2000);
			}
		}

		for(var k = nbDigit; k > 0; k--) {
			var digitElemNumber = 5 - k;
			var digitElemValue = (infoValue-(infoValue%Math.pow(10, k-1)))/Math.pow(10, k-1);
			infoValue = infoValue - (digitElemValue*Math.pow(10, k-1));

			var digitList = $(domElem).find(".OperaParisCounterDarkRenderer_digitList" + digitElemNumber.toString()).first();
			digitList.transition({ y: '' + (-digitList.height()*digitElemValue) + 'px' }, 2000);
		}

		new Timer(function() {
			endCallback();
		}, 2000);
	}
}