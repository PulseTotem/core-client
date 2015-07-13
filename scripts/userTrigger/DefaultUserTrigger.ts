/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./UserTrigger.ts" />
/// <reference path="./UserTriggerState.ts" />
/// <reference path="../core/Timer.ts" />

declare var $: any; // Use of JQuery
declare var Hammer: any; // Use of Hammer

/**
 * Represents "Default" Runner of The6thScreen Client.
 *
 * @class DefaultUserTrigger
 * @extends UserTrigger
 */
class DefaultUserTrigger extends UserTrigger {
	/**
	 * DefaultUserTrigger's timer.
	 *
	 * @property _timer
	 * @type Timer
	 */
	private _timer : Timer;

	/**
	 * DefaultUserTrigger's timer before waiting.
	 *
	 * @property _timerBeforeWaiting
	 * @type Timer
	 */
	private _timerBeforeWaiting : Timer;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		super();
		this._timer = null;
		this._timerBeforeWaiting = null;
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

		$(this.relativeTimeline.getBehaviour().getZone().getZoneDiv()).hammer();
		$(this.relativeTimeline.getBehaviour().getZone().getZoneDiv()).data("hammer").get('pan').set({ direction: Hammer.DIRECTION_ALL });
		$(this.relativeTimeline.getBehaviour().getZone().getZoneDiv()).hammer().bind("panleft panright tap", function(evt) {
			self.newUserAction(evt);
		});
	}

	/**
	 * Manage User action.
	 *
	 * @param {Hammer event} event - The event produce by user.
	 */
	private newUserAction(event : any) {
		var self = this;

		if(this._timer == null) {
			var validAction = false;

			switch (event.type) {
				case 'panleft' :
					switch(self.state) {
						case UserTriggerState.WAITING :
							self.relativeTimeline.pause();
							self.relativeTimeline.lockInUserTriggerState();
							self.state = UserTriggerState.CAPTURED;
						case UserTriggerState.CAPTURED :
							validAction = true;
							self.relativeTimeline.displayNextInfo();
							self._displayRightPanel();
							break;
					}
					break;
				case 'panright' :
					switch(self.state) {
						case UserTriggerState.WAITING :
							self.relativeTimeline.pause();
							self.relativeTimeline.lockInUserTriggerState();
							self.state = UserTriggerState.CAPTURED;
						case UserTriggerState.CAPTURED :
							validAction = true;
							self.relativeTimeline.displayPreviousInfo();
							self._displayLeftPanel();
							break;
					}
					break;
				case 'tap' :
					switch(self.state) {
						case UserTriggerState.WAITING :
							self.relativeTimeline.pause();
							self.relativeTimeline.lockInUserTriggerState();
							self.state = UserTriggerState.CAPTURED;
							validAction = true;
							self._displayPausePanel();
							break;
						case UserTriggerState.CAPTURED :
							self.state = UserTriggerState.WAITING;
							self.relativeTimeline.unlockFromUserTriggerState();
							self.relativeTimeline.resume();
							validAction = true;
							self._displayPlayPanel();
							break;
					}
					break;
			}

			if(validAction) {
				this._timer = new Timer(function () {
					self._timer = null;
				}, 500);

				if(this._timerBeforeWaiting != null) {
					this._timerBeforeWaiting.stop();
					this._timerBeforeWaiting = null;
				}

				this._timerBeforeWaiting = new Timer(function() {
					self.state = UserTriggerState.WAITING;
					self.relativeTimeline.unlockFromUserTriggerState();
					self.relativeTimeline.resume();
					self._displayPlayPanel();
					self._timerBeforeWaiting = null;
				}, 1000*60*2);
			}
		}
	}

	/**
	 * Display "Play" panel.
	 *
	 * @method _displayPlayPanel
	 * @private
	 */
	private _displayPlayPanel() {
		var playDiv = $("<div>");
		playDiv.addClass("zone_play_panel");

		$(this.relativeTimeline.getBehaviour().getZone().getZoneDiv()).parent(".zone").append(playDiv);

		new Timer(function() {
			playDiv.fadeOut(500, function () {
				playDiv.remove();
			});

		}, 100);
	}

	/**
	 * Display "Pause" panel.
	 *
	 * @method _displayPausePanel
	 * @private
	 */
	private _displayPausePanel() {
		var pauseDiv = $("<div>");
		pauseDiv.addClass("zone_pause_panel");

		$(this.relativeTimeline.getBehaviour().getZone().getZoneDiv()).parent(".zone").append(pauseDiv);

		new Timer(function() {
			pauseDiv.fadeOut(500, function () {
				pauseDiv.remove();
			});
		}, 100);
	}

	/**
	 * Display "Left" panel.
	 *
	 * @method _displayLeftPanel
	 * @private
	 */
	private _displayLeftPanel() {
		var leftDiv = $("<div>");
		leftDiv.addClass("zone_left_panel");

		$(this.relativeTimeline.getBehaviour().getZone().getZoneDiv()).parent(".zone").append(leftDiv);

		new Timer(function() {
			leftDiv.fadeOut(500, function () {
				leftDiv.remove();
			});
		}, 100);
	}

	/**
	 * Display "Right" panel.
	 *
	 * @method _displayRightPanel
	 * @private
	 */
	private _displayRightPanel() {
		var rightDiv = $("<div>");
		rightDiv.addClass("zone_right_panel");

		$(this.relativeTimeline.getBehaviour().getZone().getZoneDiv()).parent(".zone").append(rightDiv);

		new Timer(function() {
			rightDiv.fadeOut(500, function () {
				rightDiv.remove();
			});
		}, 100);
	}
}