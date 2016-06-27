/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/EventCal.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/EventList.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class EventVerticalTimelineRenderer implements Renderer<EventList> {
	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : EventList) : Array<EventList> {
		var newListInfos : Array<EventList> = new Array<EventList>();
		try {
			var newInfo = EventList.fromJSONObject(info);
			newListInfos.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		return newListInfos;
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
	render(info : EventList, domElem : any, rendererTheme : string, endCallback : Function) {
		var wrapperHTML = $("<div>");
		wrapperHTML.addClass("EventVerticalTimelineRenderer_wrapper");
		wrapperHTML.addClass(rendererTheme);

		//var maxPercent = Math.floor((100 - info.getEvents().length + 1) / info.getEvents().length);
		var maxPercent = Math.floor(100 / info.getEvents().length);

		var nowMoment = moment();
		nowMoment.locale("fr");

		info.getEvents().forEach(function(eventCal : EventCal) {
			var eventStart = moment(eventCal.getStart());
			eventStart.locale("fr");
			var eventEnd = moment(eventCal.getEnd());
			eventEnd.locale("fr");

			var eventDiv = $("<div>");
			eventDiv.addClass("EventVerticalTimelineRenderer_eventContainer");
			eventDiv.css("height", maxPercent + "%");

			if(nowMoment.diff(eventStart) >= 0 && eventEnd.diff(nowMoment) > 0) {
				eventDiv.addClass("EventVerticalTimelineRenderer_eventContainer_current");
			} else {
				eventDiv.addClass("EventVerticalTimelineRenderer_eventContainer_not_current");
			}

			var eventTimeContainer = $("<div>");
			eventTimeContainer.addClass("EventVerticalTimelineRenderer_eventTimeContainer");
			eventTimeContainer.addClass("pull-left");

			var eventBeginDay = $("<div>");
			eventBeginDay.addClass("EventVerticalTimelineRenderer_eventBeginDay");
			//eventBeginDay.html(eventStart.format("dddd DD MMMM YYYY"));
			eventBeginDay.html(eventStart.format("dddd DD"));
			eventTimeContainer.append(eventBeginDay);

			var eventBeginTime = $("<div>");
			eventBeginTime.addClass("EventVerticalTimelineRenderer_eventBeginTime");

			if(nowMoment.diff(eventStart) >= 0 && eventEnd.diff(nowMoment) > 0) {
				// Arrow
				var nowArrow = $("<div>");
				nowArrow.addClass("EventVerticalTimelineRenderer_eventBeginTime_arrow");
				nowArrow.html("&#9658;");
				eventBeginTime.append(nowArrow);
			}

			var eventBeginTimeSpan = $("<span>");
			eventBeginTimeSpan.html(eventStart.format("HH:mm"));
			eventBeginTime.append(eventBeginTimeSpan);
			eventTimeContainer.append(eventBeginTime);

			var eventEndTime = $("<div>");
			eventEndTime.addClass("EventVerticalTimelineRenderer_eventEndTime");
			eventEndTime.html(eventEnd.format("HH:mm"));
			eventTimeContainer.append(eventEndTime);

			eventDiv.append(eventTimeContainer);

			var eventNameDivContainer = $("<div>");
			eventNameDivContainer.addClass("EventVerticalTimelineRenderer_eventNameContainer");
			eventNameDivContainer.addClass("pull-left");

			var eventPoint = $("<div>");
			eventPoint.addClass("EventVerticalTimelineRenderer_eventPoint");
			eventNameDivContainer.append(eventPoint);

			var eventNameDiv = $("<div>");
			eventNameDiv.addClass("EventVerticalTimelineRenderer_eventName");
			eventNameDiv.html(eventCal.getName());
			eventNameDivContainer.append(eventNameDiv);

			eventDiv.append(eventNameDivContainer);

			var clearFixEventDiv = $("<div>");
			clearFixEventDiv.addClass("clearfix");
			eventDiv.append(clearFixEventDiv);

			wrapperHTML.append(eventDiv);
		});

		$(domElem).append(wrapperHTML);

		$(domElem).find(".EventVerticalTimelineRenderer_eventBeginTime").each(function(index, elem) {
			$(elem).textfill({
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
	updateRender(info : EventList, domElem : any, rendererTheme : string, endCallback : Function) {
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
	animate(info : EventList, domElem : any, rendererTheme : string, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}