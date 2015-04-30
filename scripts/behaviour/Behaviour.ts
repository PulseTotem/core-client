/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../core/InfoRenderer.ts" />

/**
 * Represents a Behaviour of The6thScreen Client.
 *
 * @class Behaviour
 */
class Behaviour {

	/**
	 * Zone linked to a Behaviour.
	 *
	 * @property _zone
	 * @type Zone
	 */
	private _zone : Zone;

	/**
	 * InfoRenderer list.
	 *
	 * @property _listInfoRenderers
	 * @type Array<InfoRenderer>
	 */
	private _listInfoRenderers : Array<InfoRenderer>;

	/**
	 * Behaviour's current InfoRenderer id in _listInfoRenderers array.
	 *
	 * @property _currentInfoRendererId
	 * @type number
	 */
	private _currentInfoRendererId : number;

	/**
	 * Behaviour's loop timeout.
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
		this._zone = null;
		this._listInfoRenderers = new Array<InfoRenderer>();
		this._currentInfoRendererId = null;
		this._loopTimeout = null;
	}

	/**
	 * Set Zone.
	 *
	 * @method setZone
	 * @param {Zone} zone - The Zone to set.
	 */
	setZone(zone : Zone) {
		this._zone = zone;
	}

	/**
	 * Set list InfoRenderer.
	 *
	 * @method setListInfoRenderers
	 * @param {Array<InfoRenderer>} listInfoRenderers - The InfoRenderer list to set.
	 */
	setListInfoRenderers(listInfoRenderers : Array<InfoRenderer>) {
		this._listInfoRenderers = listInfoRenderers;
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

		if(this._currentInfoRendererId == null) {
			this._currentInfoRendererId = 0;
		} else {
			this._currentInfoRendererId = (this._currentInfoRendererId + 1) % (this._listInfoRenderers.length);
		}

		var currentInfoRenderer = this._listInfoRenderers[this._currentInfoRendererId];

		var renderer = currentInfoRenderer.getRenderer();

		renderer.render(currentInfoRenderer.getInfo(), this._zone.getZoneDiv());

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
		clearTimeout(this._loopTimeout);
		this._loopTimeout = null;
	}
}