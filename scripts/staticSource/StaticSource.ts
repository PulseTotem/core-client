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
	 * Constructor.
	 *
	 * @constructor
	 * @param {number} refreshTime - interval time to refresh Source.
	 */
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

		this._connectToBackend();

		var self = this;

		var intervalFunction = function () {
			var info = self.computeInfo();
			self.getCall().onNewInfo(info);
		};

		setInterval(intervalFunction, this._refreshTime*1000);
	}

	/**
	 * Manage connection to Backend.
	 *
	 * @method connectToBackend
	 * @private
	 */
	private _connectToBackend() {
		var self = this;

		this._backendSocket = io(Constants.BACKEND_URL,
			{"reconnection" : true, 'reconnectionAttempts' : 10, "reconnectionDelay" : 1000, "reconnectionDelayMax" : 5000, "timeout" : 5000, "autoConnect" : true, "multiplex": false});

		this._listeningFromBackend();

		this._backendSocket.on("connect", function() {
			self._manageBackendConnection();
		});

		this._backendSocket.on("error", function(errorData) {
			Logger.error("An error occurred during connection to Backend.");
		});

		this._backendSocket.on("disconnect", function() {
			Logger.info("Disconnected to Backend.");
		});

		this._backendSocket.on("reconnect", function(attemptNumber) {
			Logger.info("Connected to Backend after " + attemptNumber + " attempts.");
		});

		this._backendSocket.on("reconnect_attempt", function() {
			Logger.info("Trying to reconnect to Backend.");
		});

		this._backendSocket.on("reconnecting", function(attemptNumber) {
			Logger.info("Trying to connect to Backend - Attempt number " + attemptNumber + ".");
		});

		this._backendSocket.on("reconnect_error", function(errorData) {
			Logger.error("An error occurred during reconnection to Backend.");
		});

		this._backendSocket.on("reconnect_failed", function() {
			Logger.error("Failed to connect to Backend. New attempt will be done in 5 seconds. Administrators received an Alert !");
			//TODO: Send an email and Notification to Admins !

			setTimeout(function() {
				self._backendSocket = null;
				self._connectToBackend();
			}, 5000);
		});
	}

	/**
	 * Disconnection from Backend.
	 *
	 * @method _disconnectFromBackend
	 * @private
	 */
	private _disconnectFromBackend() {
		if(typeof(this._backendSocket) != "undefined" && this._backendSocket != null) {
			//Disconnection from Backend
			this._backendSocket.disconnect();
			this._backendSocket = null;
		} // else // Nothing to do...
	}

	/**
	 * Step 2.2 : Listen from Backend answers.
	 *
	 * @method _listeningFromBackend
	 * @private
	 */
	private _listeningFromBackend() {
		Logger.debug("Step 2.2 : _listeningFromBackend");
		var self = this;

		this._backendSocket.on("CallDescription", function(response) {
			self.manageServerResponse(response, function(callDescription) {
				self.callDescriptionProcess(callDescription);
			}, function(error) {
				Logger.error(error);
				self._sendErrorToClient(error);
			});
		});
	}

	/**
	 * Step 2.3 : Manage backend connection.
	 *
	 * @method _manageBackendConnection
	 * @private
	 */
	private _manageBackendConnection() {
		Logger.debug("Step 2.3 : _manageBackendConnection");

		if(this._callDescription == null) {
			this._retrieveCallDescription();
		} else { // Step 3.1 : done.
			this._disconnectFromBackend();
		}
	}

	/**
	 * Step 3.1 : Retrieve Call Description.
	 *
	 * @method _retrieveCallDescription
	 * @private
	 */
	private _retrieveCallDescription() {
		Logger.debug("Step 3.1 : _retrieveCallDescription");
		this._backendSocket.emit("RetrieveCallDescription", {"callId": this._callId});
	}

	/**
	 * Step 3.2 : Process the Call Description
	 *
	 * @method callDescriptionProcess
	 * @param {JSON Object} callDescription - The call's description to process
	 */
	private callDescriptionProcess(callDescription : any) {
		this._callDescription = callDescription;
		Logger.debug("Step 3.2 : callDescriptionProcess");
		var self = this;

		this._disconnectFromBackend();

		this._connectToSource();
	}

	/**
	 * Create and return the information of the Static Source
	 */
	computeInfo() : SourceInfo {
		Logger.debug("StaticSource - computeInfo - Method need to be implemented !");
		return null;
	}
}