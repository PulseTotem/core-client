/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/Info.ts" />
/// <reference path="../timeline/RelativeTimelineItf.ts" />
/// <reference path="../timeline/RelativeEventItf.ts" />

/**
 * Represents a SystemTrigger of The6thScreen Client.
 *
 * @class SystemTrigger
 */
class SystemTrigger {

	/**
	 * RelativeTimeline controlled by SystemTrigger.
	 *
	 * @property relativeTimeline
	 * @type RelativeTimelineItf
	 */
	relativeTimeline : RelativeTimelineItf;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		this.relativeTimeline = null;
	}

	/**
	 * Set the SystemTrigger's RelativeTimeline.
	 *
	 * @method setRelativeTimeline
	 * @param {RelativeTimelineItf} relativeTimeline - The RelativeTimeline to set.
	 */
	setRelativeTimeline(relativeTimeline : RelativeTimelineItf) {
		this.relativeTimeline = relativeTimeline;
	}

	/**
	 * Trigger.
	 *
	 * @method trigger
	 * @param {Array<Info>} listInfos - New received Info list.
	 * @param {RelativeEventItf} event - event associated to Infos in listInfos
	 */
	trigger(listInfos : Array<Info>, event : RelativeEventItf) {
		Logger.error("SystemTrigger - trigger : Method need to be implemented.");
	}
}