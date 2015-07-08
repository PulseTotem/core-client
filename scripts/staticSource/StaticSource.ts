/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/Info.ts" />
/// <reference path="../timeline/CallItf.ts" />

/**
 * Represents a StaticSource of The6thScreen Client.
 *
 * @class StaticSource<SourceInfo extends Info>
 */
class StaticSource<SourceInfo extends Info> {

	/**
	 * Refresh time of the static source
	 *
	 * @property _refreshTime
	 * @type number
	 */
	private _refreshTime : number;

	/**
	 * Call using the instance of the staticSource
	 *
	 * @property _call
	 * @type CallItf
	 */
	private _call : CallItf;

	/**
	 * StaticSource's params.
	 *
	 * @property _params
	 * @type any
	 */
	private _params : any;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {number} refreshTime - interval time to refresh Source.
	 * @param {Array<any>} params - StaticSource's params.
	 */
	constructor(refreshTime : number = 60, params : any = []) {
		this._refreshTime = refreshTime;
		this._params = params;
	}

	/**
	 * Return the StaticSource Call
	 *
	 * @method getCall
	 * @returns {CallItf}
	 */
	public getCall() : CallItf {
		return this._call;
	}

	/**
	 * Set the StaticSource call
	 *
	 * @method setCall
	 * @param call
	 */
	public setCall(call : CallItf) {
		this._call = call;
	}

	/**
	 * Start the source
	 */
	public start() {
		var self = this;

		var info = self.computeInfo(self._params);
		self.getCall().onNewInfo(info);

		var intervalFunction = function () {
			var info = self.computeInfo(self._params);
			self.getCall().onNewInfo(info);
		};

		setInterval(intervalFunction, this._refreshTime*1000);
	}

	/**
	 * Create and return the information of the Static Source
	 *
	 * @method computeInfo
	 * @param {Array<any>} params - StaticSource's params.
	 */
	computeInfo(params : any = []) : SourceInfo {
		Logger.debug("StaticSource - computeInfo - Method need to be implemented !");
		return null;
	}
}