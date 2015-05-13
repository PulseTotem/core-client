/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./TimelineRunner.ts" />
/// <reference path="../timeline/RelativeEventItf.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Info.ts" />
/// <reference path="../core/InfoRenderer.ts" />
/// <reference path="../renderer/Renderer.ts" />

/**
 * Represents "Default" Runner of The6thScreen Client.
 *
 * @class DefaultRunner
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
	 * TimelineRunner's loop timeout.
	 *
	 * @property _loopTimeout
	 * @type number (id of timeout)
	 */
	private _loopTimeout : any;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		super();
		this._currentEventId = null;
		this._loopTimeout = null;
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

		this._loopTimeout = null;

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

				this._loopTimeout = setTimeout(function () {
					self._nextEvent();
				}, currentEvent.getDuration() * 1000);
			} else {
				setTimeout(function() {
					self._nextEvent();
				}, 1000);
			}

		} else {
			setTimeout(function() {
				self._nextEvent();
			}, 1000);
		}
	}


	/**
	 * Stop.
	 *
	 * @method stop
	 */
	stop() {
		if(this._loopTimeout != null) {
			clearTimeout(this._loopTimeout);
			this._loopTimeout = null;
		}
	}
}