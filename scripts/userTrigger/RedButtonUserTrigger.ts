/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="./UserTrigger.ts" />
/// <reference path="./UserTriggerState.ts" />
/// <reference path="../core/Timer.ts" />
/// <reference path="../core/MessageBus.ts" />
/// <reference path="../core/MessageBusChannel.ts" />
/// <reference path="../core/MessageBusAction.ts" />

declare var $: any; // Use of JQuery

/**
 * Represents "RedButton" UserTrigger  of The6thScreen Client.
 *
 * @class RedButtonUserTrigger
 * @extends UserTrigger
 */
class RedButtonUserTrigger extends UserTrigger {

	/**
	 * RedButtonUserTrigger's timer.
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

	/**
	 * Set the UserTrigger's RelativeTimeline.
	 *
	 * @method setRelativeTimeline
	 * @param {RelativeTimelineItf} relativeTimeline - The RelativeTimeline to set.
	 */
	setRelativeTimeline(relativeTimeline : RelativeTimelineItf) {
		super.setRelativeTimeline(relativeTimeline);

		var self = this;


		$(document).keypress(function (event) {
			if (event.keyCode == 65 && event.shiftKey) {
				self.redButtonPressed(event);
			}
		});
	}

	/**
	 * Manage User action.
	 *
	 * @param {JQuery event} event - The event produce by user.
	 */
	private redButtonPressed(event : any) {
		var self = this;

		if(this._timer == null) {
			var data = {
				action : MessageBusAction.TRIGGER
			};
			MessageBus.publish(MessageBusChannel.USERTRIGGER, data);

			this._timer = new Timer(function () {
				self._timer = null;
			}, 500);
		}
	}
}