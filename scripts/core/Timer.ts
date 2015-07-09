/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/**
 * Represents a Timer.
 *
 * @class Timer
 */
class Timer {

	/**
	 * Timer's callback.
	 *
	 * @property _callback
	 * @type Function
	 */
	private _callback : Function;

	/**
	 * Timer's delay.
	 *
	 * @property _delay
	 * @type number (milliseconds)
	 */
	private _delay : number;

	/**
	 * Timer's start date.
	 *
	 * @property _startDate
	 * @type Date
	 */
	private _startDate : any;

	/**
	 * Timer's remaining delay.
	 *
	 * @property _remaining
	 * @type number (milliseconds)
	 */
	private _remaining : number;

	/**
	 * Timer's timeout.
	 *
	 * @property _timeout
	 * @type number (id of timeout)
	 */
	private _timeout : any;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {Function} callback - Callback to run at end of Timer
	 * @param {number} delay - Delay in milliseconds to wait before to run callback.
	 * @param {boolean} autoStart - Define if Timer automatically start after creation or not.
	 */
	constructor(callback : Function, delay : number, autoStart : boolean = true) {
		this._timeout = null;
		this._callback = callback;
		this._delay = delay;
		this._startDate = null;
		this._remaining = delay;
		if(autoStart) {
			this.start();
		}
	}

	/**
	 * Return Timer's delay.
	 *
	 * @method getDelay
	 * @returns {number} Timer's delay.
	 */
	getDelay() : number {
		return this._delay;
	}

	/**
	 * Return Timer's remaining delay.
	 *
	 * @method getRemaining
	 * @returns {number} Timer's remaining delay.
	 */
	getRemaining() : number {
		this.pause();
		var remaining = this._remaining;
		this.resume();

		return remaining;
	}

	/**
	 * Start.
	 *
	 * @method start
	 */
	start() {
		var self = this;
		if(this._timeout == null) {
			this._remaining = this._delay;
			this._startDate = new Date();
			this._timeout = setTimeout(function() {
				self.stop();
				self._callback();
			}, this._remaining);
		}
	}

	/**
	 * Pause.
	 *
	 * @method pause
	 */
	pause() {
		if(this._timeout != null) {
			clearTimeout(this._timeout);
			this._timeout = null;

			var now : any = new Date();
			var elapsedTime = now - this._startDate;
			this._remaining = this._remaining - elapsedTime;
		}
	}

	/**
	 * Resume.
	 *
	 * @method resume
	 */
	resume() {
		var self = this;
		if(this._timeout == null && this._remaining != this._delay) {
			this._startDate = new Date();
			this._timeout = setTimeout(function() {
				self.stop();
				self._callback();
			}, this._remaining);
		}
	}

	/**
	 * Stop.
	 *
	 * @method stop
	 */
	stop() {
		if(this._timeout != null) {
			clearTimeout(this._timeout);
			this._timeout = null;
		}
		this._remaining = this._delay;
	}

	/**
	 * Add some time to delay.
	 *
	 * @method addToDelay
	 * @param {number} time - Time to add to delay (in milliseconds)
	 */
	addToDelay(time : number) {
		this.pause();
		this._delay += time;
		this._remaining += time;
		this.resume();
	}

	/**
	 * Remove some time to delay.
	 *
	 * @method removeToDelay
	 * @param {number} time - Time to add to delay (in milliseconds)
	 */
	removeToDelay(time : number) {
		this.pause();
		this._delay -= time;
		this._remaining -= time;

		if(this._remaining > 0) {
			this.resume();
		} else {
			this.stop();
		}
	}
}