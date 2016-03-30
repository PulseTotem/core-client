/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/EventCal.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/EventList.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class NextEventRenderer implements Renderer<EventCal> {
	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : EventList) : Array<EventCal> {
		var newListInfos : Array<EventList> = new Array<EventList>();
		try {
			var newInfo = EventList.fromJSONObject(info);
			newListInfos.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		var result = new Array<EventCal>();

		newListInfos.forEach(function(eventList : EventList) {
			var events : Array<EventCal> = eventList.getEvents();

			events.forEach(function (event : EventCal) {
				result.push(event);
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
	render(info : EventCal, domElem : any, rendererTheme : string, endCallback : Function) {
		var eventStart = moment(info.getStart());
		eventStart.locale("fr");
		var eventEnd = moment(info.getEnd());
		eventEnd.locale("fr");

		var wrapperHTML = $("<div>");
		wrapperHTML.addClass("NextEventRenderer_wrapper");

		var headerContainer = $("<div>");
		headerContainer.addClass("NextEventRenderer_headerContainer");

		var nextTitleContainer = $("<div>");
		nextTitleContainer.addClass("NextEventRenderer_nextTitle");
		nextTitleContainer.addClass("pull-left");
		var nextTitle = $("<span>");
		nextTitle.html("A venir");
		nextTitleContainer.append(nextTitle);

		headerContainer.append(nextTitleContainer);

		var eventTimeContainer = $("<div>");
		eventTimeContainer.addClass("NextEventRenderer_eventTimeContainer");
		eventTimeContainer.addClass("pull-right");
		var calendarLogo = $('<span class="NextEventRenderer_eventTimeLogo glyphicon glyphicon-calendar" aria-hidden="true"></span>');
		eventTimeContainer.append(calendarLogo);

		var eventTime = $("<span>");
		eventTime.addClass("NextEventRenderer_eventTime");
		eventTime.html(eventStart.format("HH:mm") + " - " + eventEnd.format("HH:mm"));
		eventTimeContainer.append(eventTime);

		headerContainer.append(eventTimeContainer);

		var clearFixDiv = $("<div>");
		clearFixDiv.addClass("clearfix");
		headerContainer.append(clearFixDiv);

		var headerContainerArrow = $("<div>");
		headerContainerArrow.addClass("NextEventRenderer_headerContainerArrow");
		headerContainer.append(headerContainerArrow);

		wrapperHTML.append(headerContainer);

		var titleContainer = $("<div>");
		titleContainer.addClass("NextEventRenderer_titleContainer");
		var titleContainerSpan = $("<span>");
		titleContainerSpan.html(info.getName());
		titleContainer.append(titleContainerSpan);

		wrapperHTML.append(titleContainer);

		$(domElem).append(wrapperHTML);

		nextTitleContainer.textfill({
			maxFontPixels: 500
		});

		titleContainer.textfill({
			maxFontPixels: 500
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
	updateRender(info : EventCal, domElem : any, rendererTheme : string, endCallback : Function) {
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
	animate(info : EventCal, domElem : any, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}