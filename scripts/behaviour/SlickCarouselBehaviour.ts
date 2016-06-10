/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./Behaviour.ts" />
/// <reference path="../core/Timer.ts" />

/**
 * Represents "Appearance" Behaviour of The6thScreen Client.
 *
 * @class AppearanceBehaviour
 *  @extends Behaviour
 */
class SlickCarouselBehaviour extends Behaviour {

	/**
	 * AppearanceBehaviour's current InfoRenderer id in _listInfoRenderers array.
	 *
	 * @property _currentInfoRendererId
	 * @type number
	 */
	private _currentInfoRendererId : number;

	/**
	 * AppearanceBehaviour's timer.
	 *
	 * @property _timer
	 * @type Timer
	 */
	private _timer : Timer;

	/**
	 * Backup of AppearanceBehaviour's current InfoRenderer id.
	 *
	 * @property _currentInfoRendererIdBackup
	 * @type number
	 */
	private _currentInfoRendererIdBackup : number;

	/**
	 * Backup of AppearanceBehaviour's timer.
	 *
	 * @property _timerBackup
	 * @type Timer
	 */
	private _timerBackup : Timer;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
    constructor() {
        super();
		this._currentInfoRendererId = null;
		this._timer = null;
		this._currentInfoRendererIdBackup = null;
		this._timerBackup = null;
    }

	/**
	 * Set list InfoRenderer.
	 *
	 * @method setListInfoRenderers
	 * @param {Array<InfoRenderer>} listInfoRenderers - The InfoRenderer list to set.
	 */
	setListInfoRenderers(listInfoRenderers : Array<InfoRenderer<any>>) {
		super.setListInfoRenderers(listInfoRenderers);
		this._currentInfoRendererId = null;
	}

	/**
	 * Start.
	 *
	 * @method start
	 */
	start() {
		$(this.getZone().getZoneDiv()).empty();

		var divSlick = $('<div style="height: 100%; width: 100%; position: relative; padding: 15px;">');

		for (var infoRendererKey in this.getListInfoRenderers()) {
			var infoRenderer : InfoRenderer<any> = this.getListInfoRenderers()[infoRendererKey];
			var renderer = infoRenderer.getRenderer();
			var rendererTheme = infoRenderer.getRendererTheme();
			var divCarousel = $('<div style="height: 100%; width: 100%; position: relative">');
			renderer.render(infoRenderer.getInfo(), divCarousel, rendererTheme, function() {
				divSlick.append(divCarousel);
			});
		}

		$(this.getZone().getZoneDiv()).append(divSlick);
		divSlick.slick({
			centerMode: true,
			centerPadding: '60px',
			slidesToShow: 3,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						arrows: false,
						centerMode: true,
						centerPadding: '40px',
						slidesToShow: 3
					}
				},
				{
					breakpoint: 480,
					settings: {
						arrows: false,
						centerMode: true,
						centerPadding: '40px',
						slidesToShow: 1
					}
				}
			]
		});
	}
	/**
	 * Pause.
	 *
	 * @method pause
	 */
	pause() {
		if(this._timer != null) {
			this._timer.pause();
		}
	}

	/**
	 * Resume.
	 *
	 * @method resume
	 */
	resume() {
		if(this._timer != null) {
			this._timer.resume();
		} else {
			this.start();
		}
	}

	/**
	 * Stop.
	 *
	 * @method stop
	 */
	stop() {
		if(this._timer != null) {
			this._timer.stop();
			this._timer = null;
		}
	}

	/**
	 * Save.
	 *
	 * @method save
	 */
	save() {
		super.save();
		this._currentInfoRendererIdBackup = this._currentInfoRendererId;
		this._timerBackup = this._timer;
	}

	/**
	 * Restore.
	 *
	 * @method restore
	 */
	restore() {
		super.restore();
	}



	/**
	 * Display previous Info.
	 *
	 * @method displayPreviousInfo
	 */
	displayPreviousInfo() {
		//TODO
		Logger.debug("TODO -> SlickCarouselBehaviour - displayPreviousInfo : Method need to be implemented.");
	}

	/**
	 * Display next Info.
	 *
	 * @method displayNextInfo
	 */
	displayNextInfo() {
		//TODO
		Logger.debug("TODO -> SlickCarouselBehaviour - displayNextInfo : Method need to be implemented.");
	}

	/**
	 * Display last Info.
	 *
	 * @method displayLastInfo
	 */
	displayLastInfo() {
		//TODO
		Logger.debug("TODO -> SlickCarouselBehaviour - displayLastInfo : Method need to be implemented.");
	}

	/**
	 * Display first Info.
	 *
	 * @method displayFirstInfo
	 */
	displayFirstInfo() {
		//TODO
		Logger.debug("TODO -> SlickCarouselBehaviour - displayFirstInfo : Method need to be implemented.");
	}

	/**
	 * Update Info if it's in current list to display (or currently displayed)
	 *
	 * @method updateInfo
	 * @param {Info} info - Info to update.
	 * @return {boolean} 'true' if done, else otherwise
	 */
	updateInfo(info : Info) : boolean {
		//TODO
		//TODO : Manage update of new Info and update display if info is displayed and different than previous one
		Logger.debug("TODO -> SlickCarouselBehaviour - updateInfo : Method need to be implemented.");
		return false;
	}
}