/**
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/MapList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/MapInfo.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var google: any; // Use of Google Maps

class GMapRenderer implements Renderer<MapInfo> {

    private static api_loaded = false;
    private static api_loading = false;
    private _gmap = null;
    private _domElement = null;
    private _trafficLayer = null;
    private _transitLayer = null;

    /**
     * Transform the Info list to another Info list.
     *
     * @method transformInfo<MapInfo extends Info>
     * @param {MapInfo} info - The Info to transform.
     * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
     */
    transformInfo(info : MapList) : Array<MapInfo> {
        var mapLists : Array<MapList> = new Array<MapList>();
        try {
            var newInfo = MapList.fromJSONObject(info);
            mapLists.push(newInfo);
        } catch(e) {
            Logger.error(e.message);
        }

        var infos : Array<MapInfo> = new Array<MapInfo>();

        for(var iMapList in mapLists) {
            var mapList : MapList = mapLists[iMapList];
            var mapInfos : Array<MapInfo> = mapList.getMaps();
            for(var iT in mapInfos) {
                var mapInfo : MapInfo = mapInfos[iT];
                infos.push(mapInfo);
            }
        }

        return infos;
    }

    /**
     * Render the Info in specified DOM Element.
     *
     * @method render
     * @param {RenderInfo} info - The Info to render.
     * @param {DOM Element} domElem - The DOM Element where render the info.
     * @param {string} rendererTheme - The Renderer's theme.
     * @param {Function} endCallback - Callback function called at the end of render method.
     */
    render(info : MapInfo, domElem : any, rendererTheme : string, endCallback : Function) {
        var self = this;

        if (this._domElement == null) {
            this._domElement = $("<div>");
        }

        this._domElement.addClass("GMapRenderer_wrapper");
        $(domElem).append(this._domElement);

        var loadMap = function () {
            GMapRenderer.api_loaded = true;
            var typeMap;

            switch (info.getType()) {
                case MapType.ROADMAP:
                    typeMap = google.maps.MapTypeId.ROADMAP;
                    break;

                case MapType.SATTELITE:
                    typeMap = google.maps.MapTypeId.SATELLITE;
                    break;

                case MapType.HYBRID:
                    typeMap = google.maps.MapTypeId.HYBRID;
                    break;

                case MapType.TERRAIN:
                    typeMap = google.maps.MapTypeId.TERRAIN;
                    break;
            }

            var mapOptions = {
                center: {
                    lat: info.getLatitude(),
                    lng: info.getLongitude()
                },
                zoom: info.getZoom(),
                mapTypeId: typeMap,
                disableDefaultUI: true
            };

            if (self._gmap == null) {
                self._gmap = new google.maps.Map(self._domElement[0],mapOptions);
            } else {
                self._gmap.setOptions(mapOptions);
            }


            if (info.getWithTraffic() && self._trafficLayer == null) {
                self._trafficLayer = new google.maps.TrafficLayer();
                self._trafficLayer.setMap(self._gmap);
            } else if (!info.getWithTraffic() && self._trafficLayer != null) {
                self._trafficLayer.setMap(null);
                self._trafficLayer = null;
            }

            if (info.getWithTransit() && self._transitLayer == null) {
                self._transitLayer = new google.maps.TransitLayer();
                self._transitLayer.setMap(self._gmap);
            } else if (!info.getWithTransit() && self._transitLayer != null) {
                self._transitLayer.setMap(null);
                self._transitLayer = null;
            }

            endCallback();
        };

        var fail = function (jqxhr, settings, exception) {
            console.error("Error while loading Google Maps API with the following API KEY : "+info.getApiKey());
            console.debug(exception);
            endCallback();
        };

        var apiUrl = "https://maps.googleapis.com/maps/api/js?key="+info.getApiKey();

        var cachedScript = function( url ) {

            // Allow user to set any option except for dataType, cache, and url
            var options = {
                dataType: "script",
                cache: true,
                url: url
            };

            // Use $.ajax() since it is more flexible than $.getScript
            // Return the jqXHR object so we can chain callbacks
            return $.ajax( options );
        };

        //var len = $('script[src="'+apiUrl+'"]').length;

        if (!GMapRenderer.api_loaded && !GMapRenderer.api_loading) {
            GMapRenderer.api_loading = true;
            cachedScript(apiUrl).done(loadMap).fail(fail);
        } else if (GMapRenderer.api_loaded) {
            loadMap();
        } else if (GMapRenderer.api_loading) {
            var waitForLoaded = function () {
                if (GMapRenderer.api_loaded) {
                    loadMap();
                } else {
                    setTimeout(waitForLoaded, 500);
                }
            };
            waitForLoaded();
        }

    }

    /**
     * Update rendering Info in specified DOM Element.
     *
     * @method updateRender
     * @param {RenderInfo} info - The Info to render.
     * @param {DOM Element} domElem - The DOM Element where render the info.
     * @param {string} rendererTheme - The Renderer's theme.
     * @param {Function} endCallback - Callback function called at the end of updateRender method.
     */
    updateRender(info : MapInfo, domElem : any, rendererTheme : string, endCallback : Function) {
        console.log("Update renderer");
        this.render(info, domElem, rendererTheme, endCallback);
    }

    /**
     * Animate rendering Info in specified DOM Element.
     *
     * @method animate
     * @param {RenderInfo} info - The Info to animate.
     * @param {DOM Element} domElem - The DOM Element where animate the info.
     * @param {string} rendererTheme - The Renderer's theme.
     * @param {Function} endCallback - Callback function called at the end of animation.
     */
    animate(info : MapInfo, domElem : any, rendererTheme : string, endCallback : Function) {
        //Nothing to do.

        endCallback();
    }
}