/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/EventCal.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/EventList.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class JM2LEventRenderer implements Renderer<EventCal> {
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
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : EventCal, domElem : any, endCallback : Function) {
		var eventStart = moment(info.getStart());
		eventStart.locale("fr");
		var eventEnd = moment(info.getEnd());
		eventEnd.locale("fr");


		var wrapperHTML = $("<div>");
		wrapperHTML.addClass("JM2LEventRenderer_wrapper");

		var headerContainer = $("<div>");
		headerContainer.addClass("JM2LEventRenderer_headerContainer");

		var titleContainer = $("<div>");
		titleContainer.addClass("JM2LEventRenderer_titleContainer");
		titleContainer.addClass("pull-left");
		var titleContainerSpan = $("<span>");
		titleContainerSpan.html(info.getName());
		titleContainer.append(titleContainerSpan);

		headerContainer.append(titleContainer);

		var eventTimeContainer = $("<div>");
		eventTimeContainer.addClass("JM2LEventRenderer_eventTimeContainer");
		eventTimeContainer.addClass("pull-right");
		var calendarLogo = $('<span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>');
		calendarLogo.addClass("JM2LEventRenderer_eventTimeLogo");
		eventTimeContainer.append(calendarLogo);

		var eventTime = $("<span>");
		eventTime.addClass("JM2LEventRenderer_eventTime");
		eventTime.html(eventStart.format("HH:mm") + " - " + eventEnd.format("HH:mm"));
		eventTimeContainer.append(eventTime);

		headerContainer.append(eventTimeContainer);

		var clearFixDiv = $("<div>");
		clearFixDiv.addClass("clearfix");
		headerContainer.append(clearFixDiv);

		var headerContainerArrow = $("<div>");
		headerContainerArrow.addClass("JM2LEventRenderer_headerContainerArrow");
		headerContainer.append(headerContainerArrow);

		wrapperHTML.append(headerContainer);

		var videoContainer = $("<div>");
		videoContainer.addClass("JM2LEventRenderer_videoContainer");

		var eventVideo = $("<video>");
		eventVideo.addClass("JM2LEventRenderer_video");
		eventVideo.attr("autoplay", "autoplay");
		eventVideo.attr("loop", "loop");

		var eventVideoSource = $("<source>");
		eventVideoSource.attr("src", info.getDescription());

		eventVideo.append(eventVideoSource);

		videoContainer.append(eventVideo);

		wrapperHTML.append(videoContainer);

		var locationContainer = $("<div>");
		locationContainer.addClass("JM2LEventRenderer_locationContainer");
		locationContainer.css("background-image", "url('" + info.getLocation() + "')")

		/*var locationImage = $("<img>");
		locationImage.addClass("JM2LEventRenderer_locationImg");
		locationImage.attr("src", info.getLocation());
		locationContainer.append(locationImage);*/

		wrapperHTML.append(locationContainer);

		var footerContainer = $("<div>");
		footerContainer.addClass("JM2LEventRenderer_footerContainer");

		var eventTimeHumanEnd = $("<div>");
		eventTimeHumanEnd.addClass("JM2LEventRenderer_eventTimeHumanEnd");
		eventTimeHumanEnd.addClass("pull-right");
		eventTimeHumanEnd.html('<span class="glyphicon glyphicon-time" aria-hidden="true"></span> Termine ' + eventEnd.fromNow());

		footerContainer.append(eventTimeHumanEnd);

		wrapperHTML.append(footerContainer);

		$(domElem).append(wrapperHTML);

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
	 * @param {Function} endCallback - Callback function called at the end of updateRender method.
	 */
	updateRender(info : EventCal, domElem : any, endCallback : Function) {
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