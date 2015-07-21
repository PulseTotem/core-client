/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/Event.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/EventList.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery

class EventRenderer implements Renderer<CityEvent> {
	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : EventList) : Array<Event> {
		var newListInfos : Array<EventList> = new Array<EventList>();
		try {
			var newInfo = EventList.fromJSONObject(info);
			newListInfos.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

        var result = new Array<Event>();

		newListInfos.forEach(function(eventList : EventList) {
            var events : Array<Event> = eventList.getEvents();

			events.forEach(function (event : Event) {
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
	render(info : Event, domElem : any, endCallback : Function) {

		var eventHTML = $("<div>");

	    eventHTML.append(info.getName());

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
	updateRender(info : Event, domElem : any, endCallback : Function) {
		$(domElem).empty();

		var eventHTML = $("<div>");

		eventHTML.append(info.getName());

		$(domElem).append(eventHTML);

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
	animate(info : Event, domElem : any, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}