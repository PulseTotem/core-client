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


declare var _: any; // Use of Lodash

/**
 * Represents "Shuffle" Runner of The6thScreen Client.
 *
 * @class ShuffleRunner
 * @extends TimelineRunner
 */
class ShuffleRunner extends TimelineRunner {

	/**
	 * ShuffleRunner's timer.
	 *
	 * @property _timer
	 * @type Timer
	 */
	private _timer : any;

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
		this._shuffle();
	}

	/**
	 * Manage shuffle in Timeline.
	 *
	 * @method _shuffle
	 * @private
	 */
	private _shuffle() {
		var self = this;

		this.stop();

		var relativeEvents : Array<RelativeEventItf> = this.relativeTimeline.getRelativeEvents();

		var allInfoRenderers : Array<InfoRenderer<any>> = new Array<InfoRenderer<any>>();

		var totalTime : number = 0;

		relativeEvents.forEach(function(relativeEvent : RelativeEventItf) {
			var renderer : Renderer<any> = relativeEvent.getCall().getCallType().getRenderer();

			var rendererTheme : string = relativeEvent.getCall().getRendererTheme();

			var listInfos : Array<Info> = relativeEvent.getCall().getListInfos();

			if(listInfos.length > 0) {

				var listInfoRenderers:Array<InfoRenderer<any>> = listInfos.map(function (e, i) {
					return new InfoRenderer(e, renderer, rendererTheme);
				});

				if (listInfoRenderers.length > 0) {
					allInfoRenderers = allInfoRenderers.concat(listInfoRenderers);

					//TODO: Manage boolean to force to use current.getDuration() or cumulated time of Info List...
					//Default: we choose cumulated time of Info List

					var totalDuration : number = 0;

					listInfoRenderers.forEach(function(infoRenderer) {
						totalDuration += infoRenderer.getInfo().getDurationToDisplay();
					});

					totalTime += totalDuration;

					//else if we use relativeEvent.getDuration()
					//totalTime += relativeEvent.getDuration();
				}
			}
		});

		if (allInfoRenderers.length > 0) {
			allInfoRenderers = _.shuffle(allInfoRenderers);

			this.relativeTimeline.display(allInfoRenderers);

			this._timer = new Timer(function () {
				self._shuffle();
			}, totalTime * 1000);
		} else {
			this._timer = new Timer(function() {
				self._shuffle();
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
		//this.relativeTimeline.getBehaviour().stop();
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
		this.relativeTimeline.displayLastInfo();
	}

	/**
	 * Display first Info of Next Event.
	 *
	 * @method displayFirstInfoOfNextEvent
	 */
	displayFirstInfoOfNextEvent() {
		this.relativeTimeline.displayFirstInfo();
	}

	/**
	 * Update current timer from list of current displayed Infos
	 *
	 * @method updateCurrentTimer
	 */
	updateCurrentTimer() {
		var self = this;

		if(this._timer != null) {

			var relativeEvents:Array<RelativeEventItf> = this.relativeTimeline.getRelativeEvents();

			var totalTime:number = 0;

			relativeEvents.forEach(function (relativeEvent:RelativeEventItf) {
				var listInfos:Array<Info> = relativeEvent.getCall().getListInfos();

				if (listInfos.length > 0) {

					//TODO: Manage boolean to force to use current.getDuration() or cumulated time of Info List...
					//Default: we choose cumulated time of Info List

					var totalDuration:number = 0;

					listInfos.forEach(function (info) {
						totalDuration += info.getDurationToDisplay();
					});

					totalTime += totalDuration;
				}
			});

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
					self._shuffle();
				}
			}
		}
	}
}