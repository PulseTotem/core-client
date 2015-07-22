/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/EventCal.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/EventList.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

moment.locale("fr");

class EventRenderer implements Renderer<EventCal> {
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
				event.setName(eventList.getName()+" : "+event.getName());
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

		var now = moment();
		var start = moment(info.getStart());
		var end = moment(info.getEnd());

		var eventHTML = $("<div>");
		eventHTML.addClass("eventRenderer_mainDiv");

		var title = $("<h2>");
		title.addClass("eventRenderer_title");
		title.text(info.getName());

		eventHTML.append(title);

		if (info.getDescription()) {
			var description = $("<div>");
			description.addClass("eventRenderer_description");
			description.text(info.getDescription());
			eventHTML.append(description);
		}

		var debutDiv = $("<div>");
		debutDiv.addClass("eventRenderer_debutDiv");

		var debutText = $("<div>");
		debutText.addClass("eventRenderer_debutText");

		var debutHour = $("<div>");
		debutHour.addClass("eventRenderer_debutHour");

		if (start.isBefore(now)) {
			debutText.addClass("eventRenderer_started");
			debutHour.addClass("eventRenderer_started");
		}

		var representStart;

		if (start.isSame(now, "day")) {
			representStart = start.format("LTS");
		} else {
			representStart = start.format("L LTS");
		}
		debutText.text("Begin: "+start.from(now));
		debutHour.text(representStart);

		debutDiv.append(debutText);
		debutDiv.append(debutHour);

		eventHTML.append(debutDiv);



		var finDiv = $("<div>");
		finDiv.addClass("eventRenderer_finDiv");

		var finText = $("<div>");
		finText.addClass("eventRenderer_finText");

		var finHour = $("<div>");
		finHour.addClass("eventRenderer_finHour");

		var representEnd;

		if (end.isSame(now, "day")) {
			representEnd = end.format("LTS");
		} else {
			representEnd = end.format("L LTS");
		}

		finText.text("End: "+end.from(now));
		finHour.text(representEnd);

		finDiv.append(finText);
		finDiv.append(finHour);

		eventHTML.append(finDiv);

		var maintenant = $("<div>");
		maintenant.addClass("eventRenderer_maintenant");
		maintenant.text(now.format("ll LTS"));

		if (info.getLocation()) {
			var locationDiv = $("<div>");
			locationDiv.addClass("eventRenderer_locationDiv");

			var locationText = $("<span>");
			locationText.addClass("eventRenderer_locationText");
			locationText.text("Location: "+info.getLocation());

			var locationIcon = $("<span>");
			locationIcon.addClass("glyphicon glyphicon-pushpin");

			locationDiv.append(locationIcon);
			locationDiv.append(locationText);
			eventHTML.append(locationDiv);
		}

	    $(domElem).append(eventHTML);

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