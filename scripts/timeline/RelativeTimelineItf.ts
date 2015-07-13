/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./RelativeEventItf.ts" />
/// <reference path="../core/InfoRenderer.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Info.ts" />

/**
 * Represents RelativeTimeline Interface of The6thScreen Client.
 *
 * @interface RelativeTimelineItf
 */
interface RelativeTimelineItf {

	/**
	 * Get the RelativeTimeline's behaviour.
	 *
	 * @method getBehaviour
	 * @return {Behaviour} behaviour - The RelativeTimeline's behaviour.
	 */
	getBehaviour() : Behaviour;

	/**
	 * Return RelativeTimeline's relativeEvents.
	 *
	 * @method getRelativeEvents
	 * @return {Array<RelativeEventItf>} relativeEvents - The RelativeTimeline's relativeEvents.
	 */
	getRelativeEvents() : Array<RelativeEventItf>;

	/**
	 * Return current list of displayed InfoRenderers.
	 *
	 * @method getCurrentListInfoRenderers
	 * @returns {Array<InfoRenderer<any>>} current list of displayed InfoRenderers.
	 */
	getCurrentListInfoRenderers() : Array<InfoRenderer<any>>;

///// BEGIN: MANAGE RELATIVE TIMELINE STATES /////

	/**
	 * Switch to RUNNER State if it's possible.
	 *
	 * @method switchToRunnerState
	 * @return {boolean} 'true' if it's done, 'false' otherwise
	 */
	switchToRunnerState() : boolean;

	/**
	 * Switch to SYSTEMTRIGGER State if it's possible.
	 *
	 * @method switchToSystemTriggerState
	 * @return {boolean} 'true' if it's done, 'false' otherwise
	 */
	switchToSystemTriggerState() : boolean;

	/**
	 * Lock to USERTRIGGER State and backup previous state.
	 *
	 * @method lockInUserTriggerState
	 */
	lockInUserTriggerState();

	/**
	 * Unlock from USERTRIGGER State and come back to previous state.
	 *
	 * @method unlockFromUserTriggerState
	 */
	unlockFromUserTriggerState();

///// END: MANAGE RELATIVE TIMELINE STATES /////

	/**
	 * Pause timeline.
	 *
	 * @method pause
	 */
	pause();

	/**
	 * Display given InfoRenderer list.
	 *
	 * @method display
	 * @param {Array<InfoRenderer<any>>>} listInfoRenderers - InfoRenderer list to display.
	 */
	display(listInfoRenderers : Array<InfoRenderer<any>>);

	/**
	 * Add some InfoRenderer to current InfoRenderer list.
	 *
	 * @method addToCurrentDisplay
	 * @param {Array<InfoRenderer<any>>>} listInfoRenderers - InfoRenderer list to add.
	 */
	addToCurrentDisplay(listInfoRenderers : Array<InfoRenderer<any>>);

	/**
	 * Resume.
	 *
	 * @method resume
	 */
	resume();

	/**
	 * Restore.
	 *
	 * @method restore
	 */
	restore();

	/**
	 * Display previous Info.
	 *
	 * @method displayPreviousInfo
	 */
	displayPreviousInfo();

	/**
	 * Display next Info.
	 *
	 * @method displayNextInfo
	 */
	displayNextInfo();

	/**
	 * Display last Info.
	 *
	 * @method displayLastInfo
	 */
	displayLastInfo();

	/**
	 * Display first Info.
	 *
	 * @method displayFirstInfo
	 */
	displayFirstInfo();

	/**
	 * Update Info
	 *
	 * @method updateInfo
	 * @param {Info} info - Info to update.
	 */
	updateInfo(info : Info);

}