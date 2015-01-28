/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../core/MapInfoRenderer.ts" />

var DateJS = <any>Date; // Use of DateJS

class Behaviour {
	private _listMapInfoRenderer : Array<MapInfoRenderer<any>>;
	private _isRunning : boolean;
	private _currentDisplayedInformationIndex : number;
	private _domElement : any;
    private _timeout : any;

	constructor() {
		this._listMapInfoRenderer = new Array<MapInfoRenderer<any>>();
        this._timeout = null;
	}

    setZoneDiv(zoneDiv : any) {
        Logger.debug("setZoneDiv");
        this._domElement = zoneDiv;
    }

    restart(calls : Array<Call>) {
        var self = this;

        Logger.debug("restart");
        Logger.debug(calls);

        if(calls != null) {

            if (this._timeout != null) {
                clearTimeout(this._timeout);
                this._timeout = null;
            }
            this._isRunning = false;

            this.buildListMapInfoRenderer(calls);
            this.displayInfo();
        }
    }

	buildListMapInfoRenderer(calls : Array<Call>) {
		var self = this;

        Logger.debug("buildListMapInfoRenderer");

		calls.forEach(function(call) {
			var listInfos = call.getListInfos();
			var renderer = call.getRenderer();
			var renderPolicy = call.getRenderPolicy();

            Logger.debug("listInfos");
            Logger.debug(listInfos);

            Logger.debug("renderer");
            Logger.debug(renderer);

            Logger.debug("renderPolicy");
            Logger.debug(renderPolicy);

			var processedList = renderer.transformForBehaviour(listInfos, renderPolicy);

            Logger.debug("processedList");
            Logger.debug(processedList);

            if(processedList != null) {
                processedList.forEach(function (info) {
                    if(self.retrieveMapInfoRenderer(info) == null) {
                        self._listMapInfoRenderer.push(new MapInfoRenderer(info, renderer));
                    }
                });
            }
		});
	}

	displayInfo() {

		var self = this;

		if (!this._isRunning) {
			this._currentDisplayedInformationIndex = 0;
			this._isRunning = true;
		}

        if(this._listMapInfoRenderer.length > 0) {
            var mapToDisplay:MapInfoRenderer<any> = this._listMapInfoRenderer[this._currentDisplayedInformationIndex];

            var info = mapToDisplay.info;
            var renderer = mapToDisplay.renderer;

            this._currentDisplayedInformationIndex = (this._currentDisplayedInformationIndex + 1) % (this._listMapInfoRenderer.length);

            Logger.debug("displayInfo - obsolete date");
            Logger.debug(info.getObsoleteDate());

            try {

                //if (DateJS.compare(DateJS.today(), new DateJS(info.getObsoleteDate())) <= 0) {
                    Logger.debug("displayInfo - render");
                    renderer.render(info, this._domElement);
                    Logger.debug("displayInfo : wait ");
                    Logger.debug(info.getDurationToDisplay());
                    this._timeout = setTimeout(function () {
                        Logger.debug("displayInfo");
                        self.displayInfo();
                    }, info.getDurationToDisplay());
                /*} else {
                    Logger.debug("displayInfo : Obsolete");
                    this.displayInfo();
                }*/ // Infinite loop if all info are obsolete. Moreover, obsolete infos should be process only once. And finally, obsolete process don't have to be done here... (ReceivePolicy ?)
            } catch(e) {
                Logger.error(e.name + " : " + e.message);
            }
        } else {
            this._timeout = setTimeout(function () {
                Logger.debug("displayInfo : relance");
                self.displayInfo();
            }, 5000);
        }
	}

    retrieveMapInfoRenderer(info : Info) {
        Logger.debug("retrieveMapInfoRenderer");
        for(var iMir in this._listMapInfoRenderer) {
            var mir = this._listMapInfoRenderer[iMir];
            if(mir.info.getId() == info.getId()) {
                return mir;
            }
        }
        return null;
    }
}