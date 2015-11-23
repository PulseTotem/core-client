/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./Behaviour.ts" />
/// <reference path="../core/Timer.ts" />

/**
 * Represents "ScrollUp" Behaviour of PulseTotem Client.
 *
 * @class ScrollUpBehaviour
 * @extends Behaviour
 */
class ScrollUpBehaviour extends Behaviour {

	/**
	 * ScrollUpBehaviour's current InfoRenderer id in _listInfoRenderers array.
	 *
	 * @property _currentInfoRendererId
	 * @type number
	 */
	private _currentInfoRendererId : number;

	/**
	 * ScrollUpBehaviour's translationY pixels.
	 *
	 * @property _translationYPixels
	 * @type number
	 */
	private  _translationYPixels : number;

	/**
	 * ScrollUpBehaviour's started status.
	 *
	 * @property _behaviourStarted
	 * @type boolean
	 */
	private _behaviourStarted : boolean;

	/**
	 * ScrollUpBehaviour's timer.
	 *
	 * @property _timer
	 * @type Timer
	 */
	private _timer : Timer;

	/**
	 * Backup of ScrollUpBehaviour's current InfoRenderer id in _listInfoRenderers array.
	 *
	 * @property _currentInfoRendererIdBackup
	 * @type number
	 */
	private _currentInfoRendererIdBackup : number;

	/**
	 * Backup of ScrollUpBehaviour's translationY pixels.
	 *
	 * @property _translationYPixelsBackup
	 * @type number
	 */
	private  _translationYPixelsBackup : number;

	/**
	 * Backup of ScrollUpBehaviour's started status.
	 *
	 * @property _behaviourStartedBackup
	 * @type boolean
	 */
	private _behaviourStartedBackup : boolean;

	/**
	 * Backup of ScrollUpBehaviour's timer.
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
		this._behaviourStarted = false;
		this._timer = null;
		this._currentInfoRendererId = null;
		this._translationYPixels = 0;

		this._behaviourStartedBackup = null;
		this._currentInfoRendererIdBackup = null;
		this._timerBackup = null;
		this._translationYPixelsBackup = null;
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
		this._behaviourStarted = false;
		this._translationYPixels = 0;
	}

	/**
	 * Start.
	 *
	 * @method start
	 */
	start() {
		this._nextInfoRenderer();
	}

	/**
	 * Manage next InfoRenderer to display.
	 *
	 * @method _nextInfoRenderer
	 * @private
	 */
	private _nextInfoRenderer() {
		var self = this;

		this._timer = null;

		var listInfoRenderers = this.getListInfoRenderers();

		if(listInfoRenderers.length > 0) {

			var setSrollTimer = function () {
				if (self._currentInfoRendererId == null) {
					self._currentInfoRendererId = 0;
				} else {
					self._currentInfoRendererId = (self._currentInfoRendererId + 1) % (listInfoRenderers.length);
				}

				var currentInfoRenderer = listInfoRenderers[self._currentInfoRendererId];
				currentInfoRenderer.getInfo().setCastingDate(new Date());

				var iRContainer = $(self.getZone().getZoneDiv()).find(".ScrollUpBehaviour_info_" + self._currentInfoRendererId).first();

				currentInfoRenderer.getRenderer().animate(currentInfoRenderer.getInfo(), iRContainer, function() {

				});

				var scrollUpContainer = $(self.getZone().getZoneDiv()).find(".ScrollUpBehaviour_container").first();
				self._translationYPixels = -scrollUpContainer.height()*self._currentInfoRendererId;
				scrollUpContainer.transition({
						transform: "translate(0px," + self._translationYPixels + "px)",
						easing: 'linear',
						duration: currentInfoRenderer.getInfo().getDurationToDisplay() * 1000
					});

				self._timer = new Timer(function () {
				 	self._nextInfoRenderer();
				}, currentInfoRenderer.getInfo().getDurationToDisplay() * 1000);
			};

			if(self._behaviourStarted) {
				setSrollTimer();
			} else {
				this._buildStructure(setSrollTimer);
			}
		}
	}


	/**
	 * Build HTML structure from ListInfosRenderers.
	 *
	 * @method _buildStructure
	 * @private
	 * @param {Function} endBuildCallback - Callback to call after building structure.
	 */
	private _buildStructure(endBuildCallback : Function) {
		var self = this;

		var listInfoRenderers = this.getListInfoRenderers();

		$(this.getZone().getZoneDiv()).empty();
		var scrollUpContainer = $("<div>");
		scrollUpContainer.addClass("ScrollUpBehaviour_container");
		scrollUpContainer.css("background-image", $(this.getZone().getZoneDiv()).css("background-image"));
		scrollUpContainer.css("opacity", $(this.getZone().getZoneDiv()).css("opacity"));
		scrollUpContainer.css("background-color", $(this.getZone().getZoneDiv()).css("background-color"));
		scrollUpContainer.css("font", $(this.getZone().getZoneDiv()).css("font"));
		scrollUpContainer.css("color", $(this.getZone().getZoneDiv()).css("color"));
		scrollUpContainer.css("border", $(this.getZone().getZoneDiv()).css("border"));
		scrollUpContainer.css("border-radius", $(this.getZone().getZoneDiv()).css("border-radius"));

		scrollUpContainer.css("transform", "translate(0px, 0px)");

		var listInfoIndex = 0;

		var buildRenderer = function () {
			var iRContainer = $("<div>");
			iRContainer.addClass("ScrollUpBehaviour_info");
			iRContainer.addClass("ScrollUpBehaviour_info_" + listInfoIndex);
			iRContainer.css("font", $(self.getZone().getZoneDiv()).css("font"));
			iRContainer.css("color", $(self.getZone().getZoneDiv()).css("color"));
			iRContainer.css("border", $(self.getZone().getZoneDiv()).css("border"));
			iRContainer.css("border-radius", $(self.getZone().getZoneDiv()).css("border-radius"));

			var currentInfoRenderer = listInfoRenderers[listInfoIndex];

			self._displayInfoRenderer(currentInfoRenderer, iRContainer, function () {
				listInfoIndex++;

				if (listInfoIndex < listInfoRenderers.length) {
					buildRenderer();
				} else {
					$(self.getZone().getZoneDiv()).append(scrollUpContainer);
					self._behaviourStarted = true;
					endBuildCallback();
				}

			});

			scrollUpContainer.append(iRContainer);
		};

		buildRenderer();
	}

	/**
	 * Display InfoRender in param in item space in param.
	 *
	 * @method _displayInfoRenderer
	 * @private
	 * @param {InfoRenderer} infoRenderer - The InfoRenderer to display.
	 * @param {any} itemSpace - The item space where render info.
	 * @param {Function} optionalCallback - An optional callback called after rendering.
	 */
	private _displayInfoRenderer(infoRenderer : InfoRenderer<any>, itemSpace : any, optionalCallback : Function = null) {
		var self = this;

		var renderer = infoRenderer.getRenderer();

		$(itemSpace).empty();

		var endRender = function() {
			if(optionalCallback != null) {
				optionalCallback();
			}
		};

		renderer.render(infoRenderer.getInfo(), $(itemSpace), endRender);
	}

	/**
	 * Refresh view.
	 *
	 * @method _refreshView
	 * @private
	 */
	private _refreshView() {
		var self = this;

		var listInfoRenderers = this.getListInfoRenderers();

		var listInfoIndex = 0;

		var refreshRenderer = function () {

			var infoRenderer = listInfoRenderers[listInfoIndex];

			var iRContainer = $(self.getZone().getZoneDiv()).find(".ScrollUpBehaviour_info_" + listInfoIndex).first();

			infoRenderer.getRenderer().updateRender(infoRenderer.getInfo(), iRContainer, function() {
				infoRenderer.getRenderer().animate(infoRenderer.getInfo(), iRContainer, function() {
				});
				listInfoIndex++;
				refreshRenderer();
			});
		};

		refreshRenderer();
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
		this._translationYPixelsBackup = this._translationYPixels;
		this._behaviourStartedBackup = this._behaviourStarted;
		this._timerBackup = this._timer;
	}

	/**
	 * Restore.
	 *
	 * @method restore
	 */
	restore() {
		var self = this;

		super.restore();

		if(this._translationYPixelsBackup != null) {
			this._translationYPixels = this._translationYPixelsBackup;
			this._translationYPixelsBackup = null;
		}

		if(this._behaviourStartedBackup != null) {
			this._behaviourStarted = this._behaviourStartedBackup;
			this._behaviourStartedBackup = null;
		}

		if(this._timerBackup != null) {
			this._timer = this._timerBackup;
			this._timerBackup = null;
		}

		if(this._currentInfoRendererIdBackup != null) {
			this._currentInfoRendererId = this._currentInfoRendererIdBackup;
			this._currentInfoRendererIdBackup = null;

			this._buildStructure(function() {
				var scrollUpContainer = $(self.getZone().getZoneDiv()).find(".ScrollUpBehaviour_container").first();
				scrollUpContainer.css("transform", "translate(0px," + self._translationYPixels + "px)");

				var listInfoRenderers = self.getListInfoRenderers();
				var currentInfoRenderer = listInfoRenderers[self._currentInfoRendererId];

				var iRContainer = $(self.getZone().getZoneDiv()).find(".ScrollUpBehaviour_info_" + self._currentInfoRendererId).first();

				currentInfoRenderer.getRenderer().updateRender(currentInfoRenderer.getInfo(), iRContainer, function() {
					currentInfoRenderer.getRenderer().animate(currentInfoRenderer.getInfo(), iRContainer, function() {
					});
				});
			});
		}
	}

	/**
	 * Display previous Info.
	 *
	 * @method displayPreviousInfo
	 */
	displayPreviousInfo() {
		var self = this;

		var listInfoRenderers = this.getListInfoRenderers();

		if(listInfoRenderers.length > 0) {
			if(this._currentInfoRendererId != null) {
				if (this._currentInfoRendererId > 0) {
					this._currentInfoRendererId = this._currentInfoRendererId - 1;

					var scrollUpContainer = $(self.getZone().getZoneDiv()).find(".ScrollUpBehaviour_container").first();
					self._translationYPixels = -scrollUpContainer.height()*self._currentInfoRendererId;
					scrollUpContainer.css("transform", "translate(0px," + self._translationYPixels + "px)");

					return true;
				} else {
					if (this._currentInfoRendererId == 0) {
						return false;
					}
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	/**
	 * Display next Info.
	 *
	 * @method displayNextInfo
	 */
	displayNextInfo() {
		var self = this;

		var listInfoRenderers = this.getListInfoRenderers();

		if(listInfoRenderers.length > 0) {
			if (this._currentInfoRendererId != null) {
				if (this._currentInfoRendererId < (listInfoRenderers.length - 1)) {
					this._currentInfoRendererId = this._currentInfoRendererId + 1;

					var scrollUpContainer = $(self.getZone().getZoneDiv()).find(".ScrollUpBehaviour_container").first();
					self._translationYPixels = -scrollUpContainer.height()*self._currentInfoRendererId;
					scrollUpContainer.css("transform", "translate(0px," + self._translationYPixels + "px)");

					return true;
				} else {
					if (this._currentInfoRendererId == (listInfoRenderers.length - 1)) {
						return false;
					}
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	/**
	 * Display last Info.
	 *
	 * @method displayLastInfo
	 */
	displayLastInfo() {
		var self = this;

		var listInfoRenderers = this.getListInfoRenderers();

		if(listInfoRenderers.length > 0) {

			this._currentInfoRendererId = listInfoRenderers.length - 1;

			var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];

			var scrollUpContainer = $(self.getZone().getZoneDiv()).find(".ScrollUpBehaviour_container").first();
			self._translationYPixels = -scrollUpContainer.height()*self._currentInfoRendererId;
			scrollUpContainer.css("transform", "translate(0px," + self._translationYPixels + "px)");

			this._timer = new Timer(function () {
				self._nextInfoRenderer();
			}, currentInfoRenderer.getInfo().getDurationToDisplay() * 1000);

			this.pause();
		} else {
			this.stop();
		}
	}

	/**
	 * Display first Info.
	 *
	 * @method displayFirstInfo
	 */
	displayFirstInfo() {
		var self = this;

		var listInfoRenderers = this.getListInfoRenderers();

		if(listInfoRenderers.length > 0) {

			this._currentInfoRendererId = 0;
			var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];

			var scrollUpContainer = $(self.getZone().getZoneDiv()).find(".ScrollUpBehaviour_container").first();
			self._translationYPixels = -scrollUpContainer.height()*self._currentInfoRendererId;
			scrollUpContainer.css("transform", "translate(0px," + self._translationYPixels + "px)");

			this._timer = new Timer(function () {
				self._nextInfoRenderer();
			}, currentInfoRenderer.getInfo().getDurationToDisplay() * 1000);

			this.pause();
		} else {
			this.stop();
		}
	}

	/**
	 * Update Info if it's in current list to display (or currently displayed)
	 *
	 * @method updateInfo
	 * @param {Info} info - Info to update.
	 * @return {boolean} 'true' if done, else otherwise
	 */
	updateInfo(info : Info) : boolean {
		var self = this;

		var listInfoRenderers = this.getListInfoRenderers();

		if(listInfoRenderers.length > 0) {

			var updated = false;

			listInfoRenderers.forEach(function(infoRenderer : InfoRenderer<any>) {
				if (infoRenderer.getInfo().getId() == info.getId()) {
					infoRenderer.setInfo(info);
					self._refreshView();
					updated = true;
				}
			});

			return updated;
		} else {
			return false;
		}
	}

	/**
	 * Method called after enabling fullscreen on zone.
	 *
	 * @method afterEnableFullscreenZone
	 */
	afterEnableFullscreenZone() {
		this._refreshView();
	}

	/**
	 * Method called after disabling fullscreen on zone.
	 *
	 * @method afterDisableFullscreenZone
	 */
	afterDisableFullscreenZone() {
		this._refreshView();
	}
}