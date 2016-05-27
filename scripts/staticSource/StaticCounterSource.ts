/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="./StaticSource.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/CounterList.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Counter.ts" />
/// <reference path="../core/MessageBus.ts" />
/// <reference path="../core/MessageBusChannel.ts" />
/// <reference path="../core/MessageBusAction.ts" />

declare var uuid: any; // Use of uuid

/**
 * Represents the "StaticCounter" StaticSource of PulseTotem Client.
 *
 * @class StaticCounterSource
 * @extends StaticSource<CounterList>
 */
class StaticCounterSource extends StaticSource<CounterList> {

	/**
	 * StaticCounterSource's counter.
	 *
	 * @property _counter
	 * @type number
	 */
	private _counter : number;

	/**
	 * StaticCounterSource's counter hash.
	 *
	 * @property _counterHash
	 * @type string
	 */
	private _counterHash : string;

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
		this._counterHash = uuid.v1();
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
	computeInfo() : CounterList {
		if(this._counter != null) {
			this._counter = this._counter + 1;
		} else {
			if(typeof(this.params.InitialValue) != "undefined" && parseInt(this.params.InitialValue) >= 0) {
				this._counter = parseInt(this.params.InitialValue);
			} else {
				this._counter = 0;
			}
		}

		var counter : Counter = new Counter();
		counter.setId(this._counterHash);
		counter.setValue(this._counter);
		counter.setDurationToDisplay(this.params.InfoDuration);

		var counterList : CounterList = new CounterList();
		counterList.setId(this._counterHash);
		counterList.addCounter(counter);
		counterList.setDurationToDisplay(this.params.InfoDuration);

		return counterList;
	}
}