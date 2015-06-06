/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../timeline/RelativeTimelineItf.ts" />

/**
 * Represents a UserTrigger of The6thScreen Client.
 *
 * @class UserTrigger
 */
class UserTrigger {

	/**
	 * RelativeTimeline controlled by UserTrigger.
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
	 * Set the UserTrigger's RelativeTimeline.
	 *
	 * @method setRelativeTimeline
	 * @param {RelativeTimelineItf} relativeTimeline - The RelativeTimeline to set.
	 */
	setRelativeTimeline(relativeTimeline : RelativeTimelineItf) {
		this.relativeTimeline = relativeTimeline;
	}
}