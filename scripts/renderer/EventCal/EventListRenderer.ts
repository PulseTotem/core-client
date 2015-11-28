/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/EventCal.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/EventList.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class EventListRenderer implements Renderer<EventList> {
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
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : EventList, domElem : any, endCallback : Function) {
		var wrapperHTML = $("<div>");
		wrapperHTML.addClass("EventListRenderer_wrapper");

		var maxPercent = Math.floor((100 - info.getEvents().length + 1) / info.getEvents().length);

		info.getEvents().forEach(function(eventCal : EventCal) {
			var eventStart = moment(eventCal.getStart());
			eventStart.locale("fr");
			var eventEnd = moment(eventCal.getEnd());
			eventEnd.locale("fr");

			var eventDiv = $("<div>");
			eventDiv.addClass("EventListRenderer_eventContainer");
			//eventDiv.css("height", maxPercent + "%");

			var eventNameDiv = $("<div>");
			eventNameDiv.addClass("EventListRenderer_eventName");
			var eventNameSpan = $("<span>");
			eventNameSpan.html(eventCal.getName());
			eventNameDiv.append(eventNameSpan);
			eventDiv.append(eventNameDiv);

			var eventTimeContainer = $("<div>");
			eventTimeContainer.addClass("EventListRenderer_eventTimeContainer");

			var calendarLogoContainer = $("<div>");
			calendarLogoContainer.addClass("EventListRenderer_eventTimeLogo");
			calendarLogoContainer.addClass("pull-left");

			var calendarLogo = $('<span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>');
			calendarLogoContainer.append(calendarLogo)

			eventTimeContainer.append(calendarLogoContainer);

			var eventTime = $("<div>");
			eventTime.addClass("EventListRenderer_eventTime");
			eventTime.addClass("pull-left");
			eventTime.html(eventStart.format("HH:mm") + " - " + eventEnd.format("HH:mm"));
			eventTimeContainer.append(eventTime);

			var eventTimeHumanEnd = $("<div>");
			eventTimeHumanEnd.addClass("EventListRenderer_eventTimeHumanEnd");
			eventTimeHumanEnd.addClass("pull-left");
			eventTimeHumanEnd.html("Fin " + eventEnd.fromNow());
			eventTimeContainer.append(eventTimeHumanEnd);

			var clearFixDiv = $("<div>");
			clearFixDiv.addClass("clearfix");
			eventTimeContainer.append(clearFixDiv);

			eventDiv.append(eventTimeContainer);

			wrapperHTML.append(eventDiv);
		});

		$(domElem).append(wrapperHTML);

		$(domElem).find(".EventListRenderer_eventName").each(function(index, elem) {
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
	 * @param {Function} endCallback - Callback function called at the end of updateRender method.
	 */
	updateRender(info : EventList, domElem : any, endCallback : Function) {
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
	animate(info : EventList, domElem : any, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}