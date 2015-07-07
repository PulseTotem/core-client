/**
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

	constructor(refreshTime : number = 60) {
		this._refreshTime = refreshTime;
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

		var intervalFunction = function () {
			var info = self.computeInfo();
			self.getCall().onNewInfo(info);
		};

		setInterval(intervalFunction, this._refreshTime*1000);
	}

	/**
	 * Create and return the information of the Static Source
	 */
	computeInfo() : SourceInfo {
		Logger.debug("StaticSource - computeInfo - Method need to be implemented !");
		return null;
	}
}