/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="./StaticSource.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/CmdList.ts" />
/// <reference path="../core/MessageBus.ts" />
/// <reference path="../core/MessageBusChannel.ts" />
/// <reference path="../core/MessageBusAction.ts" />

/**
 * Represents the "OneArmedBandit" StaticSource of PulseTotem Client.
 *
 * @class OneArmedBandit
 * @extends StaticSource<CmdList>
 */
class OneArmedBandit extends StaticSource<CmdList> {

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {number} refreshTime - interval time to refresh Source.
	 * @param {Array<any>} params - StaticSource's params.
	 */
	constructor(refreshTime : number = 60, params : any = []) {
		super(refreshTime, params);
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

		//TODO

		MessageBus.subscribe(MessageBusChannel.RENDERER, function(channel : any, data : any) {
			if(typeof(data.action) != "undefined" && data.action == MessageBusAction.SELECT) {
				var info = self.computeSelectionFromRenderer(data.message);

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
		// SlaveStaticSource doesn't need this method.
		return null;
	}

	/**
	 * Create and return the information of the Static Source
	 *
	 * @method computeIncomingMessageFromTimeline
	 * @param {any} selectionMessage - The selection message.
	 */
	computeSelectionFromRenderer(selectionMessage : any) : CmdList {
		Logger.debug("SlaveStaticSource - computeSelectionFromRenderer - Method need to be implemented !");
		return null;
	}
}