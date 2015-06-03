/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./Behaviour.ts" />
/// <reference path="../core/Timer.ts" />

/**
 * Represents "FadeIn" Behaviour of The6thScreen Client.
 *
 * @class FadeInBehaviour
 */
class FadeInBehaviour extends Behaviour {

	/**
	 * FadeInBehaviour's current InfoRenderer id in _listInfoRenderers array.
	 *
	 * @property _currentInfoRendererId
	 * @type number
	 */
	private _currentInfoRendererId : number;

	/**
	 * FadeInBehaviour's timer.
	 *
	 * @property _timer
	 * @type Timer
	 */
	private _timer : Timer;

	/**
	 * Backup of FadeInBehaviour's current InfoRenderer id.
	 *
	 * @property _currentInfoRendererIdBackup
	 * @type number
	 */
	private _currentInfoRendererIdBackup : number;

	/**
	 * Backup of FadeInBehaviour's timer.
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
		}, currentInfoRenderer.getInfo().getDurationToDisplay()*1000 + 2000);
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

		$(self.getZone().getZoneDiv())
			.find(".FadeInBehaviour_show")
			.removeClass("FadeInBehaviour_show")
			.addClass("FadeInBehaviour_hide");

		new Timer(function() {
			$(self.getZone().getZoneDiv()).empty();
			var content = $("<div>").addClass("FadeInBehaviour_hide FadeInBehaviour_fadein");
			$(self.getZone().getZoneDiv()).append(content);
			renderer.render(infoRenderer.getInfo(), content);
			$(self.getZone().getZoneDiv()).find(".FadeInBehaviour_hide").removeClass("FadeInBehaviour_hide").addClass("FadeInBehaviour_show");

			infoRenderer.getInfo().setCastingDate(new Date());
		}, 1000);
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
}