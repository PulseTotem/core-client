/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="./DefaultRunner.ts" />
/// <reference path="../core/MessageBus.ts" />
/// <reference path="../core/MessageBusChannel.ts" />
/// <reference path="../core/MessageBusAction.ts" />

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
	}

	/**
	 * Set the TimelineRunner's RelativeTimeline.
	 *
	 * @method setRelativeTimeline
	 * @param {RelativeTimelineItf} relativeTimeline - The RelativeTimeline to set.
	 */
	setRelativeTimeline(relativeTimeline : RelativeTimelineItf) {
		super.setRelativeTimeline(relativeTimeline);

		var self = this;

		var formerDisplay = this.relativeTimeline.display;

		this.relativeTimeline.display = function(listInfoRenderers : Array<InfoRenderer<any>>) {

			formerDisplay.call(self.relativeTimeline, listInfoRenderers);

			var data = {
				action : MessageBusAction.DISPLAY,
				message : listInfoRenderers
			};
			MessageBus.publish(MessageBusChannel.TIMELINE, data);
		};
	}
}