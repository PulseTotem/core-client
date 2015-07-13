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
	 * Backup of InfoRenderer list.
	 *
	 * @property _listInfoRenderersBackup
	 * @type Array<InfoRenderer>
	 */
	private _listInfoRenderersBackup : Array<InfoRenderer<any>>;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		this._zone = null;
		this._listInfoRenderers = new Array<InfoRenderer<any>>();
		this._listInfoRenderersBackup = null;
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
	 * Add some InfoRenderer to current InfoRenderer list.
	 *
	 * @method addToCurrentListInfoRenderers
	 * @param {Array<InfoRenderer>} listInfoRenderers - The InfoRenderer list to add.
	 */
	addToCurrentListInfoRenderers(listInfoRenderers : Array<InfoRenderer<any>>) {
		var self = this;

		listInfoRenderers.forEach(function(infoR : InfoRenderer<any>) {
			self._listInfoRenderers.push(infoR);
		});
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
	 * Pause.
	 *
	 * @method pause
	 */
	pause() {
		Logger.error("Behaviour - pause : Method need to be implemented.");
	}

	/**
	 * Resume.
	 *
	 * @method resume
	 */
	resume() {
		Logger.error("Behaviour - resume : Method need to be implemented.");
	}

	/**
	 * Stop.
	 *
	 * @method stop
	 */
	stop() {
		Logger.error("Behaviour - stop : Method need to be implemented.");
	}

	/**
	 * Display previous Info.
	 *
	 * @method displayPreviousInfo
	 */
	displayPreviousInfo() {
		Logger.error("Behaviour - displayPreviousInfo : Method need to be implemented.");
	}

	/**
	 * Display next Info.
	 *
	 * @method displayNextInfo
	 */
	displayNextInfo() {
		Logger.error("Behaviour - displayNextInfo : Method need to be implemented.");
	}

	/**
	 * Display last Info.
	 *
	 * @method displayLastInfo
	 */
	displayLastInfo() {
		Logger.error("Behaviour - displayLastInfo : Method need to be implemented.");
	}

	/**
	 * Display first Info.
	 *
	 * @method displayFirstInfo
	 */
	displayFirstInfo() {
		Logger.error("Behaviour - displayFirstInfo : Method need to be implemented.");
	}

	/**
	 * Update Info if it's in current list to display (or currently displayed)
	 *
	 * @method updateInfo
	 * @param {Info} info - Info to update.
	 * @return {boolean} 'true' if done, else otherwise
	 */
	updateInfo(info : Info) : boolean {
		Logger.error("Behaviour - updateInfoIfCurrentlyDisplay : Method need to be implemented.");
		return false;
	}

	/**
	 * Save.
	 *
	 * @method save
	 */
	save() {
		this._listInfoRenderersBackup = this._listInfoRenderers;
	}

	/**
	 * Restore.
	 *
	 * @method restore
	 */
	restore() {
		if(this._listInfoRenderersBackup != null) {
			this._listInfoRenderers = this._listInfoRenderersBackup;
			this._listInfoRenderersBackup = null;
		}
	}
}