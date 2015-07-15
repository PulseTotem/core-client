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
		var listInfoRenderers:Array<InfoRenderer<any>> = this.relativeTimeline.getCurrentListInfoRenderers();

		var totalTime : number = 0;

		listInfoRenderers.forEach(function(infoRenderer : InfoRenderer<any>) {
			var info : Info = infoRenderer.getInfo();

			totalTime += info.getDurationToDisplay();
		});

		if(this._timer != null) {

			this._timer.pause();

			var prevTime = this._timer.getDelay();

			var diffDelay = (totalTime * 1000) - prevTime;

			if (diffDelay >= 0) {
				this._timer.addToDelay(diffDelay);
				this._timer.resume();
			} else {
				diffDelay = diffDelay * (-1); //because diffDelay is negative before this operation

				var remainingTime = this._timer.getRemaining();

				var diffRemaining = remainingTime - diffDelay;

				if (diffRemaining > 0) {
					this._timer.removeToDelay(diffDelay);
					this._timer.resume();
				} else {
					this._timer.stop();
					this.relativeTimeline.restore();
					this.relativeTimeline.switchToRunnerState();
					this.relativeTimeline.resume();
				}
			}
		} // else // Nothing to do !!!???
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

		var listCurrentInfos:Array<Info> = new Array<Info>();

		if(this._timer != null) {
			this.relativeTimeline.getCurrentListInfoRenderers().forEach(function (infoRenderer:InfoRenderer<any>) {
				listCurrentInfos.push(infoRenderer.getInfo());
			});
		}

		var renderer : Renderer<any> = event.getCall().getCallType().getRenderer();

		var listInfoRenderersToAdd:Array<InfoRenderer<any>> = new Array<InfoRenderer<any>>();
		var listInfosToRemove:Array<Info> = new Array<Info>();

		var totalTime : number = 0;

		listInfos.forEach(function(info : Info) {
			var alreadyDisplayed = false;
			if(self._timer != null) {
				listCurrentInfos.forEach(function(currentInfo : Info) {
					if(info.getId() == currentInfo.getId()) {
						alreadyDisplayed = true;
					}
				})
			}

			if(alreadyDisplayed) {
				if (info.getPriority() != InfoPriority.HIGH) {
					listInfosToRemove.push(info);
				}
			} else {
				if (info.getPriority() == InfoPriority.HIGH) {
					listInfoRenderersToAdd.push(new InfoRenderer(info, renderer));
					totalTime += info.getDurationToDisplay();
				}
			}
		});

		if(this._timer != null && listInfosToRemove.length > 0) {
			listInfosToRemove.forEach(function(info : Info) {
				if(this._timer != null) {
					info.setDurationToDisplay(0);
					self.relativeTimeline.updateInfo(info);
				}
			});
		}

		if(listInfoRenderersToAdd.length > 0) {
			if(this._timer != null) {
				this.relativeTimeline.addToCurrentDisplay(listInfoRenderersToAdd);
				this._timer.addToDelay(totalTime * 1000);
			} else {
				this.relativeTimeline.pause();
				if(this.relativeTimeline.switchToSystemTriggerState()) {
					this.relativeTimeline.display(listInfoRenderersToAdd);
					this._timer = new Timer(function () {
						self._timer = null;
						self.relativeTimeline.restore();
						self.relativeTimeline.switchToRunnerState();
						self.relativeTimeline.resume();
					}, totalTime * 1000);
				}
			}
		}
	}
}