/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/CityEvent.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/EventList.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery

class EventListRenderer implements Renderer<CityEvent> {
	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : EventList) : Array<CityEvent> {
		var newListInfos : Array<EventList> = new Array<EventList>();
		try {
			var newInfo = EventList.fromJSONObject(info);
			newListInfos.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

        var result = new Array<CityEvent>();

		newListInfos.forEach(function(eventList : EventList) {
            var events : Array<CityEvent> = eventList.getEvents();

			events.forEach(function (event : CityEvent) {
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
	 */
	render(info : CityEvent, domElem : any) {

		var eventHTML = $("<div>");

	    eventHTML.append(info.name());

        $(domElem).append(eventHTML);
    }
}