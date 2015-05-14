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
	private _listInfoRenderers : Array<InfoRenderer<any>>;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		this._zone = null;
		this._listInfoRenderers = new Array<InfoRenderer<any>>();
	}

	/**
	 * Get Zone.
	 *
	 * @method getZone
	 */
	getZone() {
		return this._zone;
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
	 * Get list InfoRenderer.
	 *
	 * @method getListInfoRenderers
	 */
	getListInfoRenderers() {
		return this._listInfoRenderers;
	}

	/**
	 * Set list InfoRenderer.
	 *
	 * @method setListInfoRenderers
	 * @param {Array<InfoRenderer>} listInfoRenderers - The InfoRenderer list to set.
	 */
	setListInfoRenderers(listInfoRenderers : Array<InfoRenderer<any>>) {
		this._listInfoRenderers = listInfoRenderers;
	}

	/**
	 * Start.
	 *
	 * @method start
	 */
	start() {
		Logger.error("Behaviour - start : Method need to be implemented.");
	}


	/**
	 * Stop.
	 *
	 * @method stop
	 */
	stop() {
		Logger.error("Behaviour - stop : Method need to be implemented.");
	}
}