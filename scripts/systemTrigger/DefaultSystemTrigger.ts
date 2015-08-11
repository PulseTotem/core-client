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
	 * @property timer
	 * @type Timer
	 */
	timer : Timer;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		super();
		this.timer = null;
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
		if(this.timer != null) {
			this.timer.pause();
		}
	}

	/**
	 * Resume.
	 *
	 * @method resume
	 */
	resume() {
		if(this.timer != null) {
			this.timer.resume();
		}
	}


	/**
	 * Stop.
	 *
	 * @method stop
	 */
	stop() {
		if(this.timer != null) {
			this.timer.stop();
			this.timer = null;
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

		if(this.timer != null) {

			this.timer.pause();

			var prevTime = this.timer.getDelay();

			var diffDelay = (totalTime * 1000) - prevTime;

			if (diffDelay >= 0) {
				this.timer.addToDelay(diffDelay);
				this.timer.resume();
			} else {
				diffDelay = diffDelay * (-1); //because diffDelay is negative before this operation

				var remainingTime = this.timer.getRemaining();

				var diffRemaining = remainingTime - diffDelay;

				if (diffRemaining > 0) {
					this.timer.removeToDelay(diffDelay);
					this.timer.resume();
				} else {
					this.timer.stop();
					this.timer = null;
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

			this.managePriority(listInfos, event);
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
	 * @method managePriority
	 * @param {Array<Info>} listInfos - New received Info list.
	 * @param {RelativeEventItf} event - event associated to Infos in listInfos
	 */
	managePriority(listInfos : Array<Info>, event : RelativeEventItf) {
		var self = this;

		var listCurrentInfos:Array<Info> = new Array<Info>();

		if(this.timer != null) {
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
			if(self.timer != null) {
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

		if(this.timer != null && listInfosToRemove.length > 0) {
			listInfosToRemove.forEach(function(info : Info) {
				if(this.timer != null) {
					info.setDurationToDisplay(0);
					self.relativeTimeline.updateInfo(info);
				}
			});
		}

		if(listInfoRenderersToAdd.length > 0) {
			if(this.timer != null) {
				this.relativeTimeline.addToCurrentDisplay(listInfoRenderersToAdd);
				this.timer.addToDelay(totalTime * 1000);
			} else {
				this.relativeTimeline.pause();
				if(this.relativeTimeline.switchToSystemTriggerState()) {
					this.relativeTimeline.display(listInfoRenderersToAdd);
					this.timer = new Timer(function () {
						self.timer = null;
						self.relativeTimeline.restore();
						self.relativeTimeline.switchToRunnerState();
						self.relativeTimeline.resume();
					}, totalTime * 1000);
				}
			}
		}
	}
}