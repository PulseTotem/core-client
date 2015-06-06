/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./UserTrigger.ts" />
/// <reference path="../core/Timer.ts" />

/**
 * Represents "Default" Runner of The6thScreen Client.
 *
 * @class DefaultUserTrigger
 * @extends UserTrigger
 */
class DefaultUserTrigger extends UserTrigger {

	/**
	 * DefaultUserTrigger's timer.
	 *
	 * @property _timer
	 * @type Timer
	 */
	private _timer : Timer;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		super();
		this._timer = null;
	}
}