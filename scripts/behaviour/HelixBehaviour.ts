/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./Behaviour.ts" />
/// <reference path="../core/Timer.ts" />

/**
 * Represents "Helix" Behaviour of The6thScreen Client.
 *
 * @class HelixBehaviour
 * @extends Behaviour
 */
class HelixBehaviour extends Behaviour {

	/**
	 * HelixBehaviour's previous InfoRenderer id in _listInfoRenderers array.
	 *
	 * @property _previousInfoRendererId
	 * @type number
	 */
	private _previousInfoRendererId : number;

	/**
	 * HelixBehaviour's current InfoRenderer id in _listInfoRenderers array.
	 *
	 * @property _currentInfoRendererId
	 * @type number
	 */
	private _currentInfoRendererId : number;

	/**
	 * HelixBehaviour's next InfoRenderer id in _listInfoRenderers array.
	 *
	 * @property _nextInfoRendererId
	 * @type number
	 */
	private _nextInfoRendererId : number;

	/**
	 * HelixBehaviour's rotate angle.
	 *
	 * @property _rotateAngle
	 * @type number
	 */
	private _rotateAngle : number;

	/**
	 * HelixBehaviour's started status.
	 *
	 * @property _behaviourStarted
	 * @type boolean
	 */
	private _behaviourStarted : boolean;

	/**
	 * HelixBehaviour's timer.
	 *
	 * @property _timer
	 * @type Timer
	 */
	private _timer : Timer;

	/**
	 * Backup of HelixBehaviour's previous InfoRenderer id in _listInfoRenderers array.
	 *
	 * @property _previousInfoRendererIdBackup
	 * @type number
	 */
	private _previousInfoRendererIdBackup : number;

	/**
	 * Backup of HelixBehaviour's current InfoRenderer id in _listInfoRenderers array.
	 *
	 * @property _currentInfoRendererIdBackup
	 * @type number
	 */
	private _currentInfoRendererIdBackup : number;

	/**
	 * Backup of HelixBehaviour's next InfoRenderer id in _listInfoRenderers array.
	 *
	 * @property _nextInfoRendererIdBackup
	 * @type number
	 */
	private _nextInfoRendererIdBackup : number;

	/**
	 * Backup of HelixBehaviour's rotate angle.
	 *
	 * @property _rotateAngleBackup
	 * @type number
	 */
	private _rotateAngleBackup : number;

	/**
	 * Backup of HelixBehaviour's started status.
	 *
	 * @property _behaviourStartedBackup
	 * @type boolean
	 */
	private _behaviourStartedBackup : boolean;

	/**
	 * Backup of HelixBehaviour's timer.
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
		this._previousInfoRendererId = null;
		this._currentInfoRendererId = null;
		this._nextInfoRendererId = null;
		this._behaviourStarted = false;
		this._rotateAngle = 0;
		this._timer = null;

		this._previousInfoRendererIdBackup = null;
		this._currentInfoRendererIdBackup = null;
		this._nextInfoRendererIdBackup = null;
		this._rotateAngleBackup = null;
		this._behaviourStartedBackup = null;
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
		this._behaviourStarted = false;
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

			var currentInfoRenderer : InfoRenderer<any> = null;

			if(this._behaviourStarted) {
				this._currentInfoRendererId = this._nextInfoRendererId;
				this._nextInfoRendererId = null;

				currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];

				$(this.getZone().getZoneDiv()).css("overflow", "hidden");
				$(this.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item").show();

				var helixDiv = $(this.getZone().getZoneDiv()).find(".HelixBehaviour_helix").first();

				this._rotateAngle = this._rotateAngle + 90;
				helixDiv.transition({
					'transform': 'rotateZ(' + self._rotateAngle + 'deg)',
					'easing': 'in-out',
					'duration': 1100
				}, function () {
					var currentItemPanelNumber = (self._rotateAngle % 360)/90;

					for(var i = 0; i < 4; i++) {
						if(i != currentItemPanelNumber) {
							$(self.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item_" + i).hide();
						}
					}

					$(self.getZone().getZoneDiv()).css("overflow", "visible");

					var currentItemPanel = $(self.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item_" + currentItemPanelNumber).first();
					currentInfoRenderer.getRenderer().animate(currentInfoRenderer.getInfo(), currentItemPanel, function() {});

					self._updateHelix();
				});

			} else {
				$(this.getZone().getZoneDiv()).empty();
				$(this.getZone().getZoneDiv()).css("overflow", "visible");


				var helixContainer = $("<div>");
				helixContainer.addClass("HelixBehaviour_container");

				var helixDiv = $("<div>");
				helixDiv.addClass("HelixBehaviour_helix");
				helixDiv.css("transform", "rotateZ(0deg)");

				helixContainer.append(helixDiv);

				for(var i = 0; i < 4; i++) {
					var helixItem = $("<div>");
					helixItem.addClass("HelixBehaviour_helix_item");
					helixItem.addClass("HelixBehaviour_helix_item_" + i);

					helixItem.css("background-image", $(this.getZone().getZoneDiv()).css("background-image"));
					helixItem.css("opacity", $(this.getZone().getZoneDiv()).css("opacity"));
					helixItem.css("background-color", $(this.getZone().getZoneDiv()).css("background-color"));
					helixItem.css("font", $(this.getZone().getZoneDiv()).css("font"));
					helixItem.css("color", $(this.getZone().getZoneDiv()).css("color"));
					helixItem.css("border", $(this.getZone().getZoneDiv()).css("border"));

					helixItem.css("transform", "rotateZ(" + (-1)*i*90 + "deg)");

					helixItem.hide();

					helixDiv.append(helixItem);
				}

				$(this.getZone().getZoneDiv()).append(helixContainer);

				this._previousInfoRendererId = null;
				this._currentInfoRendererId = 0;
				this._nextInfoRendererId = null;

				this._rotateAngle = 0;

				this._behaviourStarted = true;

				currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];
				var itemPanel = $(this.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item_0").first();
				itemPanel.show();
				this._displayInfoRenderer(currentInfoRenderer, itemPanel, function() {
					currentInfoRenderer.getRenderer().animate(currentInfoRenderer.getInfo(), itemPanel, function() {
						self._updateHelix();
					});
				});
			}

			currentInfoRenderer.getInfo().setCastingDate(new Date());

			this._timer = new Timer(function () {
				self._nextInfoRenderer();
			}, currentInfoRenderer.getInfo().getDurationToDisplay() * 1000);
		}
	}

	/**
	 * Update helix.
	 *
	 * @method _updateHelix
	 * @private
	 */
	private _updateHelix() {
		var self = this;

		var listInfoRenderers = this.getListInfoRenderers();

		if(this._currentInfoRendererId > 0) {
			this._previousInfoRendererId = this._currentInfoRendererId - 1;
		} else {
			this._previousInfoRendererId = listInfoRenderers.length - 1;
		}

		if(this._currentInfoRendererId < listInfoRenderers.length - 1) {
			this._nextInfoRendererId = this._currentInfoRendererId + 1;
		} else {
			this._nextInfoRendererId = 0;
		}

		var currentItemPanelNumber = (this._rotateAngle % 360)/90;

		var prevItemPanelNumber = -1;
		var nextItemPanelNumber = 7;

		if(currentItemPanelNumber > 0) {
			prevItemPanelNumber = currentItemPanelNumber - 1;
		} else {
			prevItemPanelNumber = 3;
		}

		if(currentItemPanelNumber < 3) {
			nextItemPanelNumber = currentItemPanelNumber + 1;
		} else {
			nextItemPanelNumber = 0;
		}

		var prevInfoRenderer = listInfoRenderers[this._previousInfoRendererId];
		var prevItemPanel = $(this.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item_" + prevItemPanelNumber).first();
		this._displayInfoRenderer(prevInfoRenderer, prevItemPanel);
		var nextInfoRenderer = listInfoRenderers[this._nextInfoRendererId];
		var nextItemPanel = $(this.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item_" + nextItemPanelNumber).first();
		this._displayInfoRenderer(nextInfoRenderer, nextItemPanel);
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

		if(this._haveEnoughTime()) {
			var listInfoRenderers = this.getListInfoRenderers();
			var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];
			var renderer = currentInfoRenderer.getRenderer();

			var endRender = function () {
				renderer.animate(currentInfoRenderer.getInfo(), self.getZone().getZoneDiv(), function () {
				});
				currentInfoRenderer.getInfo().setCastingDate(new Date());
			};

			renderer.updateRender(currentInfoRenderer.getInfo(), this.getZone().getZoneDiv(), endRender);
		} else {
			this._nextInfoRenderer();
		}
	}

	/**
	 * Test if updated current info have enough time to display.
	 *
	 * @method _haveEnoughTime
	 * @private
	 */
	private _haveEnoughTime() {
		var self = this;

		if(this._timer != null) {

			var listInfoRenderers = this.getListInfoRenderers();
			var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];
			var info = currentInfoRenderer.getInfo();

			this._timer.pause();

			var prevTime = this._timer.getDelay();

			var diffDelay = (info.getDurationToDisplay() * 1000) - prevTime;

			if (diffDelay >= 0) {
				this._timer.addToDelay(diffDelay);
				this._timer.resume();
				return true;
			} else {
				diffDelay = diffDelay * (-1); //because diffDelay is negative before this operation

				var remainingTime = this._timer.getRemaining();

				var diffRemaining = remainingTime - diffDelay;

				if (diffRemaining > 0) {
					this._timer.removeToDelay(diffDelay);
					this._timer.resume();
					return true;
				} else {
					this._timer.stop();
					return false;
				}
			}
		} else {
			return false;
		}
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
		this._previousInfoRendererIdBackup = this._previousInfoRendererId;
		this._currentInfoRendererIdBackup = this._currentInfoRendererId;
		this._nextInfoRendererIdBackup = this._nextInfoRendererId;
		this._rotateAngleBackup = this._rotateAngle;
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

		if(this._previousInfoRendererIdBackup != null) {
			this._previousInfoRendererId = this._previousInfoRendererIdBackup;
			this._previousInfoRendererIdBackup = null;
		}

		if(this._nextInfoRendererIdBackup != null) {
			this._nextInfoRendererId = this._nextInfoRendererIdBackup;
			this._nextInfoRendererIdBackup = null;
		}

		if(this._rotateAngleBackup != null) {
			this._rotateAngle = this._rotateAngleBackup;
			this._rotateAngleBackup = null;
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

			var listInfoRenderers = this.getListInfoRenderers();
			var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];

			var currentItemPanelNumber = (this._rotateAngle % 360)/90;
			var currentItemPanel = $(this.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item_" + currentItemPanelNumber).first();

			this._displayInfoRenderer(currentInfoRenderer, currentItemPanel, function() {
				currentInfoRenderer.getRenderer().animate(currentInfoRenderer.getInfo(), currentItemPanel, function() {
					self._updateHelix();
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

					this._currentInfoRendererId = this._previousInfoRendererId;
					this._previousInfoRendererId = null;

					var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];

					$(this.getZone().getZoneDiv()).css("overflow", "hidden");
					$(this.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item").show();

					var helixDiv = $(this.getZone().getZoneDiv()).find(".HelixBehaviour_helix").first();


					self._rotateAngle = self._rotateAngle - 90;
					if(self._rotateAngle < 0) {
						self._rotateAngle = self._rotateAngle + 360;
					}
					helixDiv.transition({
						'transform': 'rotateZ(' + self._rotateAngle + 'deg)',
						'easing': 'in-out',
						'duration': 1100
					}, function () {


						var currentItemPanelNumber = (self._rotateAngle % 360)/90;

						for(var i = 0; i < 4; i++) {
							if(i != currentItemPanelNumber) {
								$(self.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item_" + i).hide();
							}
						}

						$(self.getZone().getZoneDiv()).css("overflow", "visible");

						var currentItemPanel = $(self.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item_" + currentItemPanelNumber).first();
						currentInfoRenderer.getRenderer().animate(currentInfoRenderer.getInfo(), currentItemPanel, function() {});

						self._updateHelix();
					});


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

					this._currentInfoRendererId = this._nextInfoRendererId;
					this._nextInfoRendererId = null;

					var currentInfoRenderer = listInfoRenderers[this._currentInfoRendererId];

					$(this.getZone().getZoneDiv()).css("overflow", "hidden");
					$(this.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item").show();

					var helixDiv = $(this.getZone().getZoneDiv()).find(".HelixBehaviour_helix").first();

					self._rotateAngle = self._rotateAngle + 90;
					helixDiv.transition({
						'transform': 'rotateZ(' + self._rotateAngle + 'deg)',
						'easing': 'in-out',
						'duration': 1100
					}, function () {
						var currentItemPanelNumber = (self._rotateAngle % 360)/90;

						for(var i = 0; i < 4; i++) {
							if(i != currentItemPanelNumber) {
								$(self.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item_" + i).hide();
							}
						}

						$(self.getZone().getZoneDiv()).css("overflow", "visible");

						var currentItemPanel = $(self.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item_" + currentItemPanelNumber).first();
						currentInfoRenderer.getRenderer().animate(currentInfoRenderer.getInfo(), currentItemPanel, function() {});

						self._updateHelix();
					});

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

			this._currentInfoRendererId = 1;
			this._previousInfoRendererId = listInfoRenderers.length - 1;

			var previousInfoRenderer = listInfoRenderers[this._previousInfoRendererId];
			var currentItemPanelNumber = (this._rotateAngle % 360)/90;

			var prevItemPanelNumber = -1;
			if(currentItemPanelNumber > 0) {
				prevItemPanelNumber = currentItemPanelNumber - 1;
			} else {
				prevItemPanelNumber = 3;
			}

			var prevItemPanel = $(this.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item_" + prevItemPanelNumber).first();
			this._displayInfoRenderer(previousInfoRenderer, prevItemPanel);

			this.displayPreviousInfo();

			this._timer = new Timer(function () {
				self._nextInfoRenderer();
			}, previousInfoRenderer.getInfo().getDurationToDisplay() * 1000);

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

			this._currentInfoRendererId = - 1;
			this._nextInfoRendererId = 0;

			var currentItemPanelNumber = (this._rotateAngle % 360)/90;

			var nextItemPanelNumber = 7;
			if(currentItemPanelNumber < 3) {
				nextItemPanelNumber = currentItemPanelNumber + 1;
			} else {
				nextItemPanelNumber = 0;
			}

			var nextInfoRenderer = listInfoRenderers[this._nextInfoRendererId];
			var nextItemPanel = $(this.getZone().getZoneDiv()).find(".HelixBehaviour_helix_item_" + nextItemPanelNumber).first();
			this._displayInfoRenderer(nextInfoRenderer, nextItemPanel);

			this.displayNextInfo();

			this._timer = new Timer(function () {
				self._nextInfoRenderer();
			}, nextInfoRenderer.getInfo().getDurationToDisplay() * 1000);

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
					var currentInfoRenderer = listInfoRenderers[self._currentInfoRendererId];
					if(typeof(currentInfoRenderer) != "undefined"
						&& currentInfoRenderer != null
						&& currentInfoRenderer.getInfo().getId() == info.getId()
						&& ! currentInfoRenderer.getInfo().equals(info)) {

						currentInfoRenderer.setInfo(info);
						self._refreshView();

					} else {
						infoRenderer.setInfo(info);
					}
					updated = true;
				}
			});

			return updated;
		} else {
			return false;
		}
	}
}