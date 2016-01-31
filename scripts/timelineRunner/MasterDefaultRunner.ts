/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="./DefaultRunner.ts" />
/// <reference path="../core/MessageBus.ts" />

/**
 * Represents "Default" Runner in Master mode of PulseTotem Client.
 *
 * @class MasterDefaultRunner
 * @extends DefaultRunner
 */
class MasterDefaultRunner extends DefaultRunner {

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		super();

		var formerDisplay = this.relativeTimeline.display;

		this.relativeTimeline.display = function(listInfoRenderers : Array<InfoRenderer<any>>) {
			formerDisplay(listInfoRenderers);
			var data = {
				action : "relativeTimeline.display",
				data : listInfoRenderers
			};
			MessageBus.publish("global", data);
		};
		/*
//TODO : Put that on a static source to check Info Type.

		 infoRenderer.getInfo().__proto__.constructor.name

		 */
	}
}