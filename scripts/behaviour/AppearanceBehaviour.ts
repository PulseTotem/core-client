/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./Behaviour.ts" />

/**
 * Represents "Appearance" Behaviour of The6thScreen Client.
 *
 * @class AppearanceBehaviour
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
	 * AppearanceBehaviour's loop timeout.
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
		this._currentInfoRendererId = null;
		this._loopTimeout = null;
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

		this._loopTimeout = null;

		var listInfoRenderers = this.getListInfoRenderers();

		if(this._currentInfoRendererId == null) {
			this._currentInfoRendererId = 0;
		} else {
			this._currentInfoRendererId = (this._currentInfoRendererId + 1) % (listInfoRenderers.length);
		}

		var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];

		var renderer = currentInfoRenderer.getRenderer();

		renderer.render(currentInfoRenderer.getInfo(), this.getZone().getZoneDiv());

		currentInfoRenderer.getInfo().setCastingDate(new Date());

		this._loopTimeout = setTimeout(function() {
			self._nextInfoRenderer();
		}, currentInfoRenderer.getInfo().getDurationToDisplay());
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