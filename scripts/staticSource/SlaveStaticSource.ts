/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="./StaticSource.ts" />
/// <reference path="../core/MessageBus.ts" />
/// <reference path="../core/MessageBusChannel.ts" />
/// <reference path="../core/MessageBusAction.ts" />

/**
 * Represents a SlaveStaticSource of PulseTotem Client.
 *
 * @class SlaveStaticSource<SourceInfo extends Info>
 * @extends StaticSource<SourceInfo>
 */
class SlaveStaticSource<SourceInfo extends Info> extends StaticSource<SourceInfo> {

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

		MessageBus.subscribe(MessageBusChannel.TIMELINE, function(channel : any, data : any) {
			if(typeof(data.action) != "undefined" && data.action == MessageBusAction.DISPLAY) {
				var info = self.computeIncomingMessage(data.message);

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
	computeInfo() : SourceInfo {
		// SlaveStaticSource doesn't need this method.
		return null;
	}

	/**
	 * Create and return the information of the Static Source
	 *
	 * @method computeIncomingMessage
	 * @param {Array<InfoRenderer<any>>} listInfoRenderers - The ListInfoRenders to compute as Incoming Message.
	 */
	computeIncomingMessage(listInfoRenderers : Array<InfoRenderer<any>>) : SourceInfo {
		Logger.debug("SlaveStaticSource - computeIncomingMessage - Method need to be implemented !");
		return null;
	}

}