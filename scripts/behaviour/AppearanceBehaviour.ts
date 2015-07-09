/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./Behaviour.ts" />
/// <reference path="../core/Timer.ts" />

/**
 * Represents "Appearance" Behaviour of The6thScreen Client.
 *
 * @class AppearanceBehaviour
 * @extends Behaviour
 */
class AppearanceBehaviour extends Behaviour {

	/**
	 * AppearanceBehaviour's current InfoRenderer id in _listInfoRenderers array.
	 *
	 * @property _currentInfoRendererId
	 * @type number
	 */
	private _currentInfoRendererId : number;

	/**
	 * AppearanceBehaviour's timer.
	 *
	 * @property _timer
	 * @type Timer
	 */
	private _timer : Timer;

	/**
	 * Backup of AppearanceBehaviour's current InfoRenderer id.
	 *
	 * @property _currentInfoRendererIdBackup
	 * @type number
	 */
	private _currentInfoRendererIdBackup : number;

	/**
	 * Backup of AppearanceBehaviour's timer.
	 *
	 * @property _timerBackup
	 * @type Timer
	 */
	private _timerBackup : Timer;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
    constructor() {
        super();
		this._currentInfoRendererId = null;
		this._timer = null;
		this._currentInfoRendererIdBackup = null;
		this._timerBackup = null;
    }

	/**
	 * Set list InfoRenderer.
	 *
	 * @method setListInfoRenderers
	 * @param {Array<InfoRenderer>} listInfoRenderers - The InfoRenderer list to set.
	 */
	setListInfoRenderers(listInfoRenderers : Array<InfoRenderer<any>>) {
		super.setListInfoRenderers(listInfoRenderers);
		this._currentInfoRendererId = null;
	}

	/**
	 * Start.
	 *
	 * @method start
	 */
	start() {
		this._nextInfoRenderer();
	}

	/**
	 * Manage next InfoRenderer to display.
	 *
	 * @method _nextInfoRenderer
	 * @private
	 */
	private _nextInfoRenderer() {
		var self = this;

		this._timer = null;

		var listInfoRenderers = this.getListInfoRenderers();

		if(this._currentInfoRendererId == null) {
			this._currentInfoRendererId = 0;
		} else {
			this._currentInfoRendererId = (this._currentInfoRendererId + 1) % (listInfoRenderers.length);
		}

		var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];

		this._displayInfoRenderer(currentInfoRenderer);

		this._timer = new Timer(function() {
			self._nextInfoRenderer();
		}, currentInfoRenderer.getInfo().getDurationToDisplay()*1000);
	}

	/**
	 * Display InfoRender in param.
	 *
	 * @method _displayInfoRenderer
	 * @private
	 * @param {InfoRenderer} infoRenderer - The InfoRenderer to display.
	 */
	private _displayInfoRenderer(infoRenderer : InfoRenderer<any>) {
		var self = this;

		var renderer = infoRenderer.getRenderer();

		$(this.getZone().getZoneDiv()).empty();

		var endRender = function() {
			renderer.animate(infoRenderer.getInfo(), self.getZone().getZoneDiv(), function() {});
			infoRenderer.getInfo().setCastingDate(new Date());
		};

		renderer.render(infoRenderer.getInfo(), this.getZone().getZoneDiv(), endRender);
	}

	/**
	 * Refresh view.
	 *
	 * @method _refreshView
	 * @private
	 */
	private _refreshView() {
		var self = this;

		if(this._haveEnoughTime()) {
			var listInfoRenderers = this.getListInfoRenderers();
			var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];
			var renderer = currentInfoRenderer.getRenderer();

			var endRender = function () {
				renderer.animate(currentInfoRenderer.getInfo(), self.getZone().getZoneDiv(), function () {
				});
				currentInfoRenderer.getInfo().setCastingDate(new Date());
			};

			renderer.updateRender(currentInfoRenderer.getInfo(), this.getZone().getZoneDiv(), endRender);
		} else {
			this._nextInfoRenderer();
		}
	}

	/**
	 * Test if updated current info have enough time to display.
	 *
	 * @method _haveEnoughTime
	 * @private
	 */
	private _haveEnoughTime() {
		var self = this;

		var listInfoRenderers = this.getListInfoRenderers();
		var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];
		var info = currentInfoRenderer.getInfo();

		this._timer.pause();

		var prevTime = this._timer.getDelay();

		var diffDelay = info.getDurationToDisplay() - prevTime;

		if(diffDelay >= 0) {
			this._timer.addToDelay(diffDelay);
			this._timer.resume();
			return true;
		} else {
			var remainingTime = this._timer.getRemaining();

			var diffRemaining = remainingTime - diffDelay;

			if(diffRemaining > 0) {
				this._timer.removeToDelay(diffDelay);
				this._timer.resume();
				return true;
			} else {
				this._timer.stop();
				return false;
			}
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
		} else {
			this.start();
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
	 * Save.
	 *
	 * @method save
	 */
	save() {
		super.save();
		this._currentInfoRendererIdBackup = this._currentInfoRendererId;
		this._timerBackup = this._timer;
	}

	/**
	 * Restore.
	 *
	 * @method restore
	 */
	restore() {
		super.restore();

		if(this._currentInfoRendererIdBackup != null) {
			this._currentInfoRendererId = this._currentInfoRendererIdBackup;
			this._currentInfoRendererIdBackup = null;

			var listInfoRenderers = this.getListInfoRenderers();
			var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];
			this._displayInfoRenderer(currentInfoRenderer);
		}

		if(this._timerBackup != null) {
			this._timer = this._timerBackup;
			this._timerBackup = null;
		}
	}

	/**
	 * Display previous Info.
	 *
	 * @method displayPreviousInfo
	 */
	displayPreviousInfo() {
		var listInfoRenderers = this.getListInfoRenderers();

		if(this._currentInfoRendererId != null && this._currentInfoRendererId > 0) {
			this._currentInfoRendererId = this._currentInfoRendererId - 1;
			var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];

			this._displayInfoRenderer(currentInfoRenderer);
			return true;
		} else {
			if(this._currentInfoRendererId == 0) {
				return false;
			}
		}
	}

	/**
	 * Display next Info.
	 *
	 * @method displayNextInfo
	 */
	displayNextInfo() {
		var listInfoRenderers = this.getListInfoRenderers();

		if(this._currentInfoRendererId != null && this._currentInfoRendererId < (listInfoRenderers.length - 1)) {
			this._currentInfoRendererId = this._currentInfoRendererId + 1;
			var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];

			this._displayInfoRenderer(currentInfoRenderer);
			return true;
		} else {
			if(this._currentInfoRendererId == (listInfoRenderers.length - 1)) {
				return false;
			}
		}
	}

	/**
	 * Display last Info.
	 *
	 * @method displayLastInfo
	 */
	displayLastInfo() {
		var self = this;

		var listInfoRenderers = this.getListInfoRenderers();

		this._currentInfoRendererId = listInfoRenderers.length - 1;
		var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];

		this._displayInfoRenderer(currentInfoRenderer);

		this._timer = new Timer(function() {
			self._nextInfoRenderer();
		}, currentInfoRenderer.getInfo().getDurationToDisplay()*1000 + 2100);

		this.pause();
	}

	/**
	 * Display first Info.
	 *
	 * @method displayFirstInfo
	 */
	displayFirstInfo() {
		var self = this;

		var listInfoRenderers = this.getListInfoRenderers();

		this._currentInfoRendererId = 0;
		var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];

		this._displayInfoRenderer(currentInfoRenderer);

		this._timer = new Timer(function() {
			self._nextInfoRenderer();
		}, currentInfoRenderer.getInfo().getDurationToDisplay()*1000 + 2100);

		this.pause();
	}

	/**
	 * Update Info if it's currently display
	 *
	 * @method updateInfoIfCurrentlyDisplay
	 * @param {Info} info - Info to update.
	 */
	updateInfoIfCurrentlyDisplay(info : Info) {
		var self = this;

		var listInfoRenderers = this.getListInfoRenderers();

		if(listInfoRenderers.length > 0) {

			var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];

			if(typeof(currentInfoRenderer) != "undefined" && currentInfoRenderer != null) {
				if (currentInfoRenderer.getInfo().getId() == info.getId() && ! currentInfoRenderer.getInfo().equals(info)) {
					currentInfoRenderer.setInfo(info);
					this._refreshView();
				}
			}
		}
	}
}