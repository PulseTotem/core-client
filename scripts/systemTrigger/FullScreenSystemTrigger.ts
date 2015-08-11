/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./DefaultSystemTrigger.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/priorities/InfoPriority.ts" />
/// <reference path="../core/InfoRenderer.ts" />
/// <reference path="../renderer/Renderer.ts" />
/// <reference path="../core/Timer.ts" />

/**
 * Represents "FullScreen" SystemTrigger of The6thScreen Client.
 * This SystemTrigger displays directly info with high priority and expose zone in full screen.
 *
 * @class FullScreenSystemTrigger
 * @extends DefaultSystemTrigger
 */
class FullScreenSystemTrigger extends DefaultSystemTrigger {

	/**
	 * FullScreenSystemTrigger's enabled status.
	 *
	 * @property _enabled
	 * @private
	 * @type boolean
	 */
	private _enabled : boolean;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		super();
		this._enabled = false;
	}

	/**
	 * Stop.
	 *
	 * @method stop
	 */
	stop() {
		super.stop();
		this.manageFullScreenZone();
	}

	/**
	 * Update current timer from list of current displayed Infos
	 *
	 * @method updateCurrentTimer
	 */
	updateCurrentTimer() {
		super.updateCurrentTimer();
		this.manageFullScreenZone();
	}

	/**
	 * Manage Info Priority and display immediatly Info with High priority.
	 *
	 * @method managePriority
	 * @param {Array<Info>} listInfos - New received Info list.
	 * @param {RelativeEventItf} event - event associated to Infos in listInfos
	 */
	managePriority(listInfos : Array<Info>, event : RelativeEventItf) {
		super.managePriority(listInfos, event);
		this.manageFullScreenZone();
	}

	/**
	 * Manage FullScreen Zone.
	 *
	 * @method manageFullScreenZone
	 */
	manageFullScreenZone() {
		var self = this;

		if(this.timer != null) {
			if(! this._enabled) {
				this.relativeTimeline.enableFullscreenZone();
				this._enabled = true;

				var callback = this.timer.getCallback();

				var newCallback = function() {
					self.relativeTimeline.disableFullscreenZone();
					callback();
					self._enabled = false;
				};

				this.timer.setCallback(newCallback);
			}
		} else {
			if(this._enabled) {
				this._enabled = false;
			}
		}
	}
}