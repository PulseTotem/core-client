/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./SystemTrigger.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/priorities/InfoPriority.ts" />
/// <reference path="../core/InfoRenderer.ts" />
/// <reference path="../renderer/Renderer.ts" />
/// <reference path="../core/Timer.ts" />

/**
 * Represents "Default" SystemTrigger of The6thScreen Client.
 * This SystemTrigger displays directly info with high priority.
 *
 * @class DefaultSystemTrigger
 * @extends SystemTrigger
 */
class DefaultSystemTrigger extends SystemTrigger {

	/**
	 * DefaultSystemTrigger's timer.
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
	 * Start.
	 *
	 * @method start
	 */
	start() {
		//Nothing to do. Start is done by trigger method.
	}

	/**
	 * Pause.
	 *
	 * @method pause
	 */
	pause() {
		if(this._timer != null) {
			this._timer.pause();
		}
	}

	/**
	 * Resume.
	 *
	 * @method resume
	 */
	resume() {
		if(this._timer != null) {
			this._timer.resume();
		}
	}


	/**
	 * Stop.
	 *
	 * @method stop
	 */
	stop() {
		if(this._timer != null) {
			this._timer.stop();
			this._timer = null;
		}
	}

	/**
	 * Display last Info of Previous Event.
	 *
	 * @method displayLastInfoOfPreviousEvent
	 */
	displayLastInfoOfPreviousEvent() {
		Logger.error("DefaultSystemTrigger - displayLastInfoOfPreviousEvent : Method need to be implemented.");
	}

	/**
	 * Display first Info of Next Event.
	 *
	 * @method displayFirstInfoOfNextEvent
	 */
	displayFirstInfoOfNextEvent() {
		Logger.error("DefaultSystemTrigger - displayFirstInfoOfNextEvent : Method need to be implemented.");
	}

	/**
	 * Update current timer from list of current displayed Infos
	 *
	 * @method updateCurrentTimer
	 */
	updateCurrentTimer() {
		Logger.error("DefaultSystemTrigger - updateCurrentTimer : Method need to be implemented.");
	}

	/**
	 * Trigger.
	 *
	 * @method trigger
	 * @param {Array<Info>} listInfos - New received Info list.
	 * @param {RelativeEventItf} event - event associated to Infos in listInfos
	 */
	trigger(listInfos : Array<Info>, event : RelativeEventItf) {

		if(listInfos.length > 0) {
			this._refreshCurrentView(listInfos, event);

			this._managePriority(listInfos, event);
		}
	}

	/**
	 * Refresh Info if it's currently display.
	 *
	 * @method _refreshCurrentView
	 * @private
	 * @param {Array<Info>} listInfos - New received Info list.
	 * @param {RelativeEventItf} event - event associated to Infos in listInfos
	 */
	private _refreshCurrentView(listInfos : Array<Info>, event : RelativeEventItf) {
		var self = this;

		listInfos.forEach(function(info : Info) {
			self.relativeTimeline.updateInfo(info);
		});
	}

	/**
	 * Manage Info Priority and display immediatly Info with High priority.
	 *
	 * @method _managePriority
	 * @private
	 * @param {Array<Info>} listInfos - New received Info list.
	 * @param {RelativeEventItf} event - event associated to Infos in listInfos
	 */
	private _managePriority(listInfos : Array<Info>, event : RelativeEventItf) {
		var self = this;

		if(this._timer != null) {

		} else {
			var renderer : Renderer<any> = event.getCall().getCallType().getRenderer();

			var listInfoRenderers:Array<InfoRenderer<any>> = new Array<InfoRenderer<any>>();

			var totalTime : number = 0;

			listInfos.forEach(function(info : Info) {
				if(info.getPriority() == InfoPriority.HIGH) {
					listInfoRenderers.push(new InfoRenderer(info, renderer));
					totalTime += info.getDurationToDisplay();
				}
			});

			if(listInfoRenderers.length > 0) {
				if(this.relativeTimeline.pauseAndDisplay(listInfoRenderers)) {
					this._timer = new Timer(function () {
						self._timer = null;
						self.relativeTimeline.restoreAndResume();
					}, totalTime * 1000);
				}
			}
		}





		var renderer : Renderer<any> = event.getCall().getCallType().getRenderer();

		var listInfoRenderers:Array<InfoRenderer<any>> = new Array<InfoRenderer<any>>();

		var totalTime : number = 0;

		listInfos.forEach(function(info : Info) {
			if(info.getPriority() == InfoPriority.HIGH) {
				listInfoRenderers.push(new InfoRenderer(info, renderer));
				totalTime += info.getDurationToDisplay();
			}
		});

		if(listInfoRenderers.length > 0) {
			if(this._timer != null) {
				this.relativeTimeline.addToCurrentDisplay(listInfoRenderers);
				this._timer.addToDelay(totalTime * 1000);
			} else {
				if(this.relativeTimeline.pauseAndDisplay(listInfoRenderers)) {
					this._timer = new Timer(function () {
						self._timer = null;
						self.relativeTimeline.restoreAndResume();
					}, totalTime * 1000);
				}
			}
		}
	}
}