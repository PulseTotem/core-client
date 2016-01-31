/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="./DefaultRunner.ts" />
/// <reference path="../core/MessageBus.ts" />
/// <reference path="../core/Timer.ts" />

/**
 * Represents "Default" Runner in Slave mode of PulseTotem Client.
 *
 * @class SlaveDefaultRunner
 * @extends DefaultRunner
 */
class SlaveDefaultRunner extends DefaultRunner {

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Start.
	 *
	 * @method start
	 */
	start() {
		super.start();
		MessageBus.subscribe("global", this.fromMessageBus)
	}

	/**
	 * Action when new message on MessageBus.
	 *
	 * @method fromMessageBus
	 * @param {any} data - The received message.
	 */
	fromMessageBus(data : any) {
		var self = this;
		if(typeof(data.action) != "undefined" && data.action == "relativeTimeline.display") {
			self.stop();
			self._timer = new Timer(function() {
				self._nextEvent();
			}, 1000);
		}
	}
}