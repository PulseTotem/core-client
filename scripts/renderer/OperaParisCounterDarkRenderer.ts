/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/CounterList.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Counter.ts" />
/// <reference path="./Renderer.ts" />

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
	 */
	render(info : Counter, domElem : any) {

		var counterHTMLWrapper = $("<div>");
		counterHTMLWrapper.addClass("OperaParisCounterDarkRenderer_wrapper");

		var counterDiv = $("<div>");
		counterDiv.addClass("OperaParisCounterDarkRenderer_counter");

		counterHTMLWrapper.append(counterDiv);

		for(var i = 0; i < 5; i++) {
			if(i!=0) {
				var digitListInter = $("<ul>");
				digitListInter.addClass("OperaParisCounterDarkRenderer_digitList_inter");

				counterDiv.append(digitListInter);
			}

			var digitList = $("<ul>");
			digitList.addClass("OperaParisCounterDarkRenderer_digitList");
			digitList.addClass("OperaParisCounterDarkRenderer_digitList" + i.toString());

			for(var j = 0; j < 11; j++) {
				var digitElem = $("<li>");
				digitElem.addClass("OperaParisCounterDarkRenderer_digit" + j.toString());
				digitElem.html((j%10).toString());

				digitList.append(digitElem);
			}

			counterDiv.append(digitList);
		}

		var clearDigitList = $("<div>");
		clearDigitList.addClass("clearfix");

		counterDiv.append(clearDigitList);

		$(domElem).append(counterHTMLWrapper);

		var nbDigit = info.getValue().toString().length;
		var infoValue = info.getValue();

		for(var k = nbDigit; k > 0; k--) {
			var digitElemNumber = 5 - k;
			var digitElemValue = (infoValue-(infoValue%Math.pow(10, k-1)))/Math.pow(10, k-1);
			infoValue = infoValue - (digitElemValue*Math.pow(10, k-1));

			$(domElem).find(".OperaParisCounterDarkRenderer_digitList" + digitElemNumber.toString()).first().transition({ y: '' + (-200*digitElemValue) + 'px' }, 2000);
		}

	}
}