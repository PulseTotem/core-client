/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/CounterList.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Counter.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class OperaParisCounterWhiteRenderer implements Renderer<Counter> {
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
		counterHTMLWrapper.addClass("OperaParisCounterWhiteRenderer_wrapper");

		var hashtagDiv = $("<div>");
		hashtagDiv.addClass("OperaParisCounterWhiteRenderer_hashtag");
		hashtagDiv.html("#OperaDeParis");

		counterHTMLWrapper.append(hashtagDiv);

		var counterMainzone = $("<div>");
		counterMainzone.addClass("OperaParisCounterWhiteRenderer_mainzone");

		counterHTMLWrapper.append(counterMainzone);

		var counterDiv = $("<div>");
		counterDiv.addClass("OperaParisCounterWhiteRenderer_counter");

		counterMainzone.append(counterDiv);

		for(var i = 0; i < 5; i++) {
			if(i!=0) {
				var digitListInter = $("<ul>");
				digitListInter.addClass("OperaParisCounterWhiteRenderer_digitList_inter");

				counterDiv.append(digitListInter);
			}

			var digitList = $("<ul>");
			digitList.addClass("OperaParisCounterWhiteRenderer_digitList");
			digitList.addClass("OperaParisCounterWhiteRenderer_digitList" + i.toString());

			for(var j = 0; j < 11; j++) {
				var digitElem = $("<li>");
				digitElem.addClass("OperaParisCounterWhiteRenderer_digit" + j.toString());
				digitElem.html((j%10).toString());

				digitList.append(digitElem);
			}

			counterDiv.append(digitList);
		}

		var clearDigitList = $("<div>");
		clearDigitList.addClass("clearfix");

		counterDiv.append(clearDigitList);

		var nbTweetsTxtDiv = $("<div>");
		nbTweetsTxtDiv.addClass("OperaParisCounterWhiteRenderer_nbtweets");

		nbTweetsTxtDiv.html("Nombre de Tweets aujourd'hui");

		counterMainzone.append(nbTweetsTxtDiv);

		var twitterLogo = $("<div>");
		twitterLogo.addClass("OperaParisCounterWhiteRenderer_twitter_logo");

		counterHTMLWrapper.append(twitterLogo);

		$(domElem).append(counterHTMLWrapper);

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
		//Nothing to do. All is in animation.

		endCallback();
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
		var nbDigit = info.getValue().toString().length;
		var infoValue = info.getValue();

		if(nbDigit < 5) {
			for(var i = 5; i > nbDigit; i--) {
				var digitElemNumber = 5 - i;

				$(domElem).find(".OperaParisCounterWhiteRenderer_digitList" + digitElemNumber.toString()).first().transition({ y: '0px' }, 2000);
			}
		}

		for(var k = nbDigit; k > 0; k--) {
			var digitElemNumber = 5 - k;
			var digitElemValue = (infoValue-(infoValue%Math.pow(10, k-1)))/Math.pow(10, k-1);
			infoValue = infoValue - (digitElemValue*Math.pow(10, k-1));

			$(domElem).find(".OperaParisCounterWhiteRenderer_digitList" + digitElemNumber.toString()).first().transition({ y: '' + (-200*digitElemValue) + 'px' }, 2000);
		}

		setTimeout(function() {
			endCallback();
		}, 2000);
	}
}