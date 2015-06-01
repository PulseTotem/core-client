/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./SystemTrigger.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/priorities/InfoPriority.ts" />
/// <reference path="../core/InfoRenderer.ts" />
/// <reference path="../renderer/Renderer.ts" />
/// <reference path="../core/Timer.ts" />

/**
 * Represents "Default" Runner of The6thScreen Client.
 *
 * @class DefaultSystemTrigger
 * @extends SystemTrigger
 */
class DefaultSystemTrigger extends SystemTrigger {

	/**
	 * DefaultSystemTrigger's timer.
	 *
	 * @property _timer
	 * @type Timer
	 */
	private _timer : Timer;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		super();
		this._timer = null;
	}

	/**
	 * Trigger.
	 *
	 * @method trigger
	 * @param {Array<Info>} listInfos - New received Info list.
	 * @param {RelativeEventItf} event - event associated to Infos in listInfos
	 */
	trigger(listInfos : Array<Info>, event : RelativeEventItf) {
		var self = this;

		var renderer : Renderer<any> = event.getCall().getCallType().getRenderer();

		var listInfoRenderers:Array<InfoRenderer<any>> = new Array<InfoRenderer<any>>();

		var totalTime : number = 0;

		listInfos.forEach(function(info : Info) {
			if(info.getPriority() == InfoPriority.HIGH) {
				listInfoRenderers.push(new InfoRenderer(info, renderer));
				totalTime += info.getDurationToDisplay();
			}
		});

		if(listInfoRenderers.length > 0) {
			if(this._timer != null) {
				this.relativeTimeline.addToCurrentDisplay(listInfoRenderers);
				this._timer.addToDelay(totalTime * 1000);
			} else {
				this.relativeTimeline.pauseAndDisplay(listInfoRenderers);
				this._timer = new Timer(function () {
					self._timer = null;
					self.relativeTimeline.resume();
				}, totalTime*1000);
			}
		}
	}
}