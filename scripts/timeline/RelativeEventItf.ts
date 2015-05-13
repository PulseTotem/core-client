/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./CallItf.ts" />

/**
 * Represents RelativeEvent Interface of The6thScreen Client.
 *
 * @interface RelativeEventItf
 */
interface RelativeEventItf {

	/**
	 * Return RelativeEvent's call.
	 *
	 * @method getCall
	 * @return {CallItf} call - The RelativeEvent's call.
	 */
	getCall() : CallItf;

	/**
	 * Returns RelativeEvent's Duration.
	 *
	 * @method getDuration
	 * @return {number} The RelativeEvent's Duration.
	 */
	getDuration() : number;
}