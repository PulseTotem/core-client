/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="./StaticSource.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/CmdList.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Cmd.ts" />
/// <reference path="../core/MessageBus.ts" />
/// <reference path="../core/MessageBusChannel.ts" />
/// <reference path="../core/MessageBusAction.ts" />

declare var uuid: any; // Use of uuid

/**
 * Represents the "OneArmedBandit" StaticSource of PulseTotem Client.
 *
 * @class OneArmedBanditSource
 * @extends StaticSource<CmdList>
 */
class OneArmedBanditSource extends StaticSource<CmdList> {

	/**
	 * OneArmedBandit's counter.
	 *
	 * @property _counter
	 * @type number
	 */
	private _counter : number;

	/**
	 * OneArmedBandit's hash.
	 *
	 * @property _oneArmedBanditHash
	 * @type string
	 */
	private _oneArmedBanditHash : string;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {number} refreshTime - interval time to refresh Source.
	 * @param {Array<any>} params - StaticSource's params.
	 */
	constructor(refreshTime : number = 60, params : any = []) {
		super(refreshTime, params);

		this._counter = null;
		this._oneArmedBanditHash = uuid.v1();
	}

	/**
	 * Start the source
	 */
	public start() {
		var self = this;

		var info = self.computeInfo();

		if (info != null) {
			self.getCall().onNewInfo(info);
		}

		MessageBus.subscribe(MessageBusChannel.USERTRIGGER, function(channel : any, data : any) {
			if(typeof(data.action) != "undefined" && data.action == MessageBusAction.TRIGGER) {
				var info = self.computeInfo();

				if (info != null) {
					self.getCall().onNewInfo(info);
				}
			}
		});
	}

	/**
	 * Create and return the information of the Static Source
	 *
	 * @method computeInfo
	 */
	computeInfo() : CmdList {
		if(this._counter != null) {
			if(this._counter > 0) {
				this._counter = this._counter - 1;
			}
		} else {
			if(typeof(this.params.InitialValue) != "undefined" && parseInt(this.params.InitialValue) >= 0) {
				this._counter = parseInt(this.params.InitialValue);
			} else {
				this._counter = 50;
			}
		}

		var cmd : Cmd = new Cmd();
		cmd.setId(this._oneArmedBanditHash);
		cmd.setDurationToDisplay(this.params.InfoDuration);
		cmd.setCmd("Stop");

		var args : Array<string> = new Array<string>();
		if(this._counter > 0) {
			args.push("true");
		} else {
			args.push("true");
		}
		cmd.setArgs(args);

		var cmdList : CmdList = new CmdList();
		cmdList.setId(this._oneArmedBanditHash);
		cmdList.addCmd(cmd);
		cmdList.setDurationToDisplay(this.params.InfoDuration);

		return cmdList;
	}
}