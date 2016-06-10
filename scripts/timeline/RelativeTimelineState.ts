/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/**
 * Represents State of RelativeTimeline :
 * this state defines who manipulate the RelativeTimeline - TimelineRunner ? SystemTrigger ? or UserTrigger ?
 *
 * @enum RelativeTimelineState
 */
enum RelativeTimelineState {
	RUNNER,
	SYSTEMTRIGGER,
	USERTRIGGER
}