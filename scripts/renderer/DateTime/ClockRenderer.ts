/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/DateTime.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class ClockRenderer implements Renderer<DateTime> {
	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : DateTimeList) : Array<DateTime> {
		var dateTimeLists : Array<DateTimeList> = new Array<DateTimeList>();
		try {
			var newInfo = DateTimeList.fromJSONObject(info);
			dateTimeLists.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		var dateTimes : Array<DateTime> = new Array<DateTime>();

		for(var iDTL in dateTimeLists) {
			var dtl : DateTimeList = dateTimeLists[iDTL];
			var dtlDateTimes : Array<DateTime> = dtl.getDateTimes();
			for(var iTL in dtlDateTimes) {
				var dt : DateTime = dtlDateTimes[iTL];
				dateTimes.push(dt);
			}
		}

		return dateTimes;
	}

	/**
	 * Render the Info in specified DOM Element.
	 *
	 * @method render
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : DateTime, domElem : any, endCallback : Function) {
		$(domElem).empty();
		var dateTimeWrapper = $("<div>");
		dateTimeWrapper.addClass("ClockRenderer_wrapper");

		var dateTime = $("<span>");
		dateTime.addClass("ClockRenderer_time");

		dateTimeWrapper.append(dateTime);

		var formatDate = new moment(info.getDate());
		dateTime.html(formatDate.format("HH:mm:ss"));

		$(domElem).append(dateTimeWrapper);

		dateTimeWrapper.bigtext();

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
	updateRender(info : DateTime, domElem : any, endCallback : Function) {
		var dateTime = $(domElem).find(".ClockRenderer_time").first();

		var formatDate = new moment(info.getDate());
		dateTime.html(formatDate.format("HH:mm:ss"));

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
	animate(info : DateTime, domElem : any, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}