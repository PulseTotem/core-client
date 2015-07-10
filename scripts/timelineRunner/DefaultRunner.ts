/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./TimelineRunner.ts" />
/// <reference path="../timeline/RelativeEventItf.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Info.ts" />
/// <reference path="../core/InfoRenderer.ts" />
/// <reference path="../renderer/Renderer.ts" />
/// <reference path="../core/Timer.ts" />

/**
 * Represents "Default" Runner of The6thScreen Client.
 *
 * @class DefaultRunner
 * @extends TimelineRunner
 */
class DefaultRunner extends TimelineRunner {

	/**
	 * RelativeTimeline's current RelativeEvent id in _relativeEvents array.
	 *
	 * @property _currentEventId
	 * @type number
	 */
	private _currentEventId : number;

	/**
	 * TimelineRunner's timer.
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
		this._currentEventId = null;
		this._timer = null;
	}

	/**
	 * Start.
	 *
	 * @method start
	 */
	start() {
		this._nextEvent();
	}

	/**
	 * Manage next event in Timeline.
	 *
	 * @method _nextEvent
	 * @private
	 */
	private _nextEvent() {
		var self = this;

		var relativeEvents : Array<RelativeEventItf> = this.relativeTimeline.getRelativeEvents();

		this._timer = null;

		if(this._currentEventId == null) {
			this._currentEventId = 0;
		} else {
			this._currentEventId = (this._currentEventId + 1) % (relativeEvents.length);
		}

		var currentEvent : RelativeEventItf = relativeEvents[this._currentEventId];

		var renderer : Renderer<any> = currentEvent.getCall().getCallType().getRenderer();

		var listInfos : Array<Info> = currentEvent.getCall().getListInfos();

		if(listInfos.length > 0) {

			var listInfoRenderers:Array<InfoRenderer<any>> = listInfos.map(function (e, i) {
				return new InfoRenderer(e, renderer);
			});

			if (listInfoRenderers.length > 0) {
				this.relativeTimeline.display(listInfoRenderers);

				//TODO: Manage boolean to force to use current.getDuration() or cumulated time of Info List...
				//Default: we choose cumulated time of Info List

				var totalDuration : number = 0;

				listInfoRenderers.forEach(function(infoRenderer) {
					totalDuration += infoRenderer.getInfo().getDurationToDisplay();
				});

				this.stop();
				this._timer = new Timer(function () {
					self._nextEvent();
				}, totalDuration * 1000);

				//If we use currentEvent.getDuration()
				/*this.stop();
				this._timer = new Timer(function () {
					self._nextEvent();
				}, currentEvent.getDuration() * 1000);*/


			} else {
				this.stop();
				this._timer = new Timer(function() {
					self._nextEvent();
				}, 1000);
			}

		} else {
			this.stop();
			this._timer = new Timer(function() {
				self._nextEvent();
			}, 1000);
		}
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
		var self = this;

		var relativeEvents : Array<RelativeEventItf> = this.relativeTimeline.getRelativeEvents();

		if(this._currentEventId == null && this._currentEventId > 0) {
			this._currentEventId = this._currentEventId - 1;
		} else {
			if(this._currentEventId == 0) {
				this._currentEventId = relativeEvents.length - 1;
			}
		}

		var currentEvent : RelativeEventItf = relativeEvents[this._currentEventId];

		var renderer : Renderer<any> = currentEvent.getCall().getCallType().getRenderer();

		var listInfos : Array<Info> = currentEvent.getCall().getListInfos();

		if(listInfos.length > 0) {

			var listInfoRenderers:Array<InfoRenderer<any>> = listInfos.map(function (e, i) {
				return new InfoRenderer(e, renderer);
			});

			if (listInfoRenderers.length > 0) {
				this.relativeTimeline.display(listInfoRenderers);

				//TODO: Manage boolean to force to use current.getDuration() or cumulated time of Info List...
				//Default: we choose cumulated time of Info List

				var totalDuration : number = 0;

				listInfoRenderers.forEach(function(infoRenderer) {
					totalDuration += infoRenderer.getInfo().getDurationToDisplay();
				});

				this.stop();
				this._timer = new Timer(function () {
					self._nextEvent();
				}, totalDuration * 1000);

				this.relativeTimeline.pause();

				this.relativeTimeline.displayLastInfo();
			} else {
				this.stop();
				this._timer = new Timer(function() {
					self.displayLastInfoOfPreviousEvent();
				}, 1000);
			}
		} else {
			this.stop();
			this._timer = new Timer(function() {
				self.displayLastInfoOfPreviousEvent();
			}, 1000);
		}
	}

	/**
	 * Display first Info of Next Event.
	 *
	 * @method displayFirstInfoOfNextEvent
	 */
	displayFirstInfoOfNextEvent() {
		var self = this;

		var relativeEvents : Array<RelativeEventItf> = this.relativeTimeline.getRelativeEvents();

		if(this._currentEventId == null && this._currentEventId < relativeEvents.length - 1) {
			this._currentEventId = this._currentEventId + 1;
		} else {
			if(this._currentEventId == (relativeEvents.length - 1)) {
				this._currentEventId = 0;
			}
		}

		var currentEvent : RelativeEventItf = relativeEvents[this._currentEventId];

		var renderer : Renderer<any> = currentEvent.getCall().getCallType().getRenderer();

		var listInfos : Array<Info> = currentEvent.getCall().getListInfos();

		if(listInfos.length > 0) {

			var listInfoRenderers:Array<InfoRenderer<any>> = listInfos.map(function (e, i) {
				return new InfoRenderer(e, renderer);
			});

			if (listInfoRenderers.length > 0) {
				this.relativeTimeline.display(listInfoRenderers);

				//TODO: Manage boolean to force to use current.getDuration() or cumulated time of Info List...
				//Default: we choose cumulated time of Info List

				var totalDuration : number = 0;

				listInfoRenderers.forEach(function(infoRenderer) {
					totalDuration += infoRenderer.getInfo().getDurationToDisplay();
				});

				this.stop();
				this._timer = new Timer(function () {
					self._nextEvent();
				}, totalDuration * 1000);

				this.relativeTimeline.pause();

				this.relativeTimeline.displayFirstInfo();
			} else {
				this.stop();
				this._timer = new Timer(function() {
					self.displayFirstInfoOfNextEvent();
				}, 1000);
			}
		} else {
			this.stop();
			this._timer = new Timer(function() {
				self.displayFirstInfoOfNextEvent();
			}, 1000);
		}
	}

	/**
	 * Update current timer from list of current displayed Infos
	 *
	 * @method updateCurrentTimer
	 */
	updateCurrentTimer() {
		var self = this;

		var relativeEvents : Array<RelativeEventItf> = this.relativeTimeline.getRelativeEvents();

		var currentEvent : RelativeEventItf = relativeEvents[this._currentEventId];

		if(typeof(currentEvent) != "undefined" && currentEvent != null) {
			var listInfos : Array<Info> = currentEvent.getCall().getListInfos();

			if(listInfos.length > 0) {
				//TODO: Manage boolean to force to use current.getDuration() or cumulated time of Info List...
				//Default: we choose cumulated time of Info List

				var totalDuration : number = 0;

				listInfos.forEach(function(info : Info) {
					totalDuration += info.getDurationToDisplay();
				});

				this._timer.pause();

				var prevTime = this._timer.getDelay();

				var diffDelay = (totalDuration*1000) - prevTime;

				if(diffDelay >= 0) {
					this._timer.addToDelay(diffDelay);
					this._timer.resume();
				} else {
					diffDelay = diffDelay*(-1); //because diffDelay is negative before this operation

					var remainingTime = this._timer.getRemaining();

					var diffRemaining = remainingTime - diffDelay;

					if(diffRemaining > 0) {
						this._timer.removeToDelay(diffDelay);
						this._timer.resume();
					} else {
						this._timer.stop();
						self._nextEvent();
					}
				}
			}
		}
	}

	/**
	 * Update Info in current Event.
	 * It would be just to manage new Info 'getDurationToDisplay'
	 *
	 * @method updateInfo
	 * @param {Info} prevInfo - Info before update.
	 * @param {Info} updatedInfo - Info after update.
	 */
	updateInfo(prevInfo : Info, updatedInfo : Info) {

		//TODO !!!!!!! Besoin de changer, car le runner ne connait pas l'ancienne version de l'info...



		/*var self = this;

		var relativeEvents : Array<RelativeEventItf> = this.relativeTimeline.getRelativeEvents();

		var currentEvent : RelativeEventItf = relativeEvents[this._currentEventId];

		var listInfos : Array<Info> = currentEvent.getCall().getListInfos();

		listInfos.forEach(function(info : Info) {
			if(info.getId() == updatedInfo.getId()) {

				this._timer.pause();

				var prevTime = info.getDurationToDisplay()*1000;

				var diffDelay = (updatedInfo.getDurationToDisplay()*1000) - prevTime;

				if(diffDelay >= 0) {
					this._timer.addToDelay(diffDelay);
					this._timer.resume();

					info.setDurationToDisplay(updatedInfo.getDurationToDisplay());
				} else {
					diffDelay = diffDelay*(-1); //because diffDelay is negative before this operation

					var remainingTime = this._timer.getRemaining();

					var diffRemaining = remainingTime - diffDelay;

					if(diffRemaining > 0) {
						this._timer.removeToDelay(diffDelay);
						this._timer.resume();

						info.setDurationToDisplay(updatedInfo.getDurationToDisplay());
					} else {
						this._timer.stop();


					}
				}

			}
		});

		*/

	}
}