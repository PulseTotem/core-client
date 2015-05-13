/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./RelativeEventItf.ts" />
/// <reference path="../core/InfoRenderer.ts" />

/**
 * Represents RelativeTimeline Interface of The6thScreen Client.
 *
 * @interface RelativeTimelineItf
 */
interface RelativeTimelineItf {

	/**
	 * Return RelativeTimeline's relativeEvents.
	 *
	 * @method getRelativeEvents
	 * @return {Array<RelativeEventItf>} relativeEvents - The RelativeTimeline's relativeEvents.
	 */
	getRelativeEvents() : Array<RelativeEventItf>;

	/**
	 * Display given InfoRenderer list.
	 *
	 * @method display
	 * @param {Array<InfoRenderer<any>>>} listInfoRenderers - InfoRenderer list to display.
	 */
	display(listInfoRenderers : Array<InfoRenderer<any>>);
}