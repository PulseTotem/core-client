/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../timeline/RelativeTimelineItf.ts" />

/**
 * Represents a TimelineRunner of The6thScreen Client.
 *
 * @class TimelineRunner
 */
class TimelineRunner {

	/**
	 * RelativeTimeline controlled by TimelineRunner.
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
	 * Set the TimelineRunner's RelativeTimeline.
	 *
	 * @method setRelativeTimeline
	 * @param {RelativeTimelineItf} relativeTimeline - The RelativeTimeline to set.
	 */
	setRelativeTimeline(relativeTimeline : RelativeTimelineItf) {
		this.relativeTimeline = relativeTimeline;
	}

	/**
	 * Start.
	 *
	 * @method start
	 */
	start() {
		Logger.error("TimelineRunner - start : Method need to be implemented.");
	}

	/**
	 * Pause.
	 *
	 * @method pause
	 */
	pause() {
		Logger.error("TimelineRunner - pause : Method need to be implemented.");
	}

	/**
	 * Resume.
	 *
	 * @method resume
	 */
	resume() {
		Logger.error("TimelineRunner - resume : Method need to be implemented.");
	}

	/**
	 * Stop.
	 *
	 * @method stop
	 */
	stop() {
		Logger.error("TimelineRunner - stop : Method need to be implemented.");
	}

	/**
	 * Display last Info of Previous Event.
	 *
	 * @method displayLastInfoOfPreviousEvent
	 */
	displayLastInfoOfPreviousEvent() {
		Logger.error("TimelineRunner - displayLastInfoOfPreviousEvent : Method need to be implemented.");
	}

	/**
	 * Display first Info of Next Event.
	 *
	 * @method displayFirstInfoOfNextEvent
	 */
	displayFirstInfoOfNextEvent() {
		Logger.error("TimelineRunner - displayFirstInfoOfNextEvent : Method need to be implemented.");
	}
}