/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/CityEvent.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/EventList.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Info.ts" />
/// <reference path="../policy/RenderPolicy.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery

class EventListRenderer implements Renderer<CityEvent> {
    transformForBehaviour(listInfos : Array<EventList>, renderPolicy : RenderPolicy<EventList>) : Array<CityEvent> {
		var newListInfos : Array<EventList> = new Array<EventList>();
		try {
			newListInfos = Info.fromJSONArray(listInfos, EventList);
		} catch(e) {
			Logger.error(e.message);
		}

        //var listPictureAlbums : Array<PictureAlbum> = renderPolicy.process(listInfos);

        var result = new Array<CityEvent>();

		newListInfos.forEach(function(eventList : EventList) {
            var events : Array<CityEvent> = eventList.getEvents();

			events.forEach(function (event : CityEvent) {
                result.push(event);
            });
        });

        return result;
    }

    render(info : CityEvent, domElem : any) {

		var eventHTML = $("<div>");

	    eventHTML.append(info.name());
        $(domElem).empty();
        $(domElem).append(eventHTML);

        info.setCastingDate(new Date());
    }
}