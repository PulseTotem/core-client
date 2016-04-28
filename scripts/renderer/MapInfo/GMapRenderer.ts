/**
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/MapList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/MapInfo.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var google: any; // Use of Google Maps

class GMapRenderer implements Renderer<MapInfo> {

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

        var mapWrapper = $("<div>");
        mapWrapper.addClass("GMapRenderer_wrapper");

        $(domElem).append(mapWrapper);

        var loadMap = function () {

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
                mapTypeId: typeMap
            };

            var map = new google.maps.Map(mapWrapper[0],mapOptions);

            if (info.getWithTraffic()) {
                var trafficLayer = new google.maps.TrafficLayer();
                trafficLayer.setMap(map);
            }

            if (info.getWithTransit()) {
                var transitLayer = new google.maps.TransitLayer();
                transitLayer.setMap(map);
            }

            endCallback();
        };

        var fail = function (jqxhr, settings, exception) {
            console.error("Error while loading Google Maps API with the following API KEY : "+info.getApiKey());
            console.debug(exception);
            endCallback();
        };

        var apiUrl = "https://maps.googleapis.com/maps/api/js?key="+info.getApiKey();

        var len = $('script[src="'+apiUrl+'"]').length;

        if (len == 0) {
            $.getScript(apiUrl).done(loadMap).fail(fail);
        } else {
            loadMap();
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