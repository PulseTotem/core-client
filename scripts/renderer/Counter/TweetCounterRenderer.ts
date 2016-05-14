/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/CounterList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Counter.ts" />
/// <reference path="../Renderer.ts" />
/// <reference path="../../core/Timer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class TweetCounterRenderer implements Renderer<Counter> {
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
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : Counter, domElem : any, rendererTheme : string, endCallback : Function) {

		var counterHTMLWrapper = $("<div>");
		counterHTMLWrapper.addClass("TweetCounterRenderer_wrapper");

		var hashtagDiv = $("<div>");
		hashtagDiv.addClass("TweetCounterRenderer_hashtag");

		var spanPresentQuery = $("<span>");
		spanPresentQuery.addClass("TweetCounterRenderer_presentquery");
		spanPresentQuery.html("Tweets à propos de : ");
        hashtagDiv.append(spanPresentQuery);

		var hashtagSpan = $("<span>");
        hashtagSpan.addClass("TweetCounterRenderer_query");
        var query = decodeURIComponent(info.getQuery());
		hashtagSpan.html(query);
		hashtagDiv.append(hashtagSpan);

		counterHTMLWrapper.append(hashtagDiv);

		var counterMainzone = $("<div>");
		counterMainzone.addClass("TweetCounterRenderer_mainzone");

		counterHTMLWrapper.append(counterMainzone);

		var counterDiv = $("<div>");
		counterDiv.addClass("TweetCounterRenderer_counter");

		counterMainzone.append(counterDiv);

		for(var i = 0; i < 5; i++) {
			if(i!=0) {
				var digitListInter = $("<ul>");
				digitListInter.addClass("TweetCounterRenderer_digitList_inter");

				counterDiv.append(digitListInter);
			}

			var digitList = $("<ul>");
			digitList.addClass("TweetCounterRenderer_digitList");
			digitList.addClass("TweetCounterRenderer_digitList" + i.toString());

			counterDiv.append(digitList);
		}

		var clearDigitList = $("<div>");
		clearDigitList.addClass("clearfix");

		counterDiv.append(clearDigitList);

		var twitterLogo = $("<div>");
		twitterLogo.addClass("TweetCounterRenderer_twitter_logo");

		counterMainzone.append(twitterLogo);


		var nbTweetsTxtDiv = $("<div>");
		nbTweetsTxtDiv.addClass("TweetCounterRenderer_nbtweets");

		var nbTweetsTxtSpan = $("<span>");
		var dateSince = moment(info.getSince());
		nbTweetsTxtSpan.html("Depuis "+dateSince.calendar());

		nbTweetsTxtDiv.append(nbTweetsTxtSpan);

		counterHTMLWrapper.append(nbTweetsTxtDiv);

		$(domElem).append(counterHTMLWrapper);

		for(var i = 0; i < 5; i++) {
			var digitList = $(domElem).find(".TweetCounterRenderer_digitList" + i.toString()).first();
			digitList.css("height", digitList.css( "height" ));

			for(var j = 0; j < 11; j++) {
				var digitElem = $("<li>");
				digitElem.addClass("TweetCounterRenderer_digit" + j.toString());
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
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {Function} endCallback - Callback function called at the end of updateRender method.
	 */
	updateRender(info : Counter, domElem : any, rendererTheme : string, endCallback : Function) {
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
	animate(info : Counter, domElem : any, rendererTheme : string, endCallback : Function) {
		$(".TweetCounterRenderer_hashtag").textfill({
			maxFontPixels: 500
		});

		$(".TweetCounterRenderer_nbtweets").textfill({
			maxFontPixels: 500
		});

		var nbDigit = info.getValue().toString().length;
		var infoValue = info.getValue();

		if(nbDigit < 5) {
			for(var i = 5; i > nbDigit; i--) {
				var digitElemNumber = 5 - i;

				$(domElem).find(".TweetCounterRenderer_digitList" + digitElemNumber.toString()).first().transition({ y: '0px' }, 2000);
			}
		}

		for(var k = nbDigit; k > 0; k--) {
			var digitElemNumber = 5 - k;
			var digitElemValue = (infoValue-(infoValue%Math.pow(10, k-1)))/Math.pow(10, k-1);
			infoValue = infoValue - (digitElemValue*Math.pow(10, k-1));

			var digitList = $(domElem).find(".TweetCounterRenderer_digitList" + digitElemNumber.toString()).first();
			digitList.transition({ y: '' + (-digitList.height()*digitElemValue) + 'px' }, 2000);
		}

		new Timer(function() {
			endCallback();
		}, 2000);
	}
}