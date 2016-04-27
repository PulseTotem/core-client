/**
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/MapList.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/MapInfo.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/MapType.ts" />
/// <reference path="./StaticSource.ts" />

/**
 * Represent a static Map Source in the client
 */
class MapSource extends StaticSource<MapList> {

    /**
     * Create and return the information of the Static Source
     *
     * @method computeInfo
     */
    computeInfo() : MapList {
        var map : MapInfo = new MapInfo();
        map.setId(moment().toString());
        map.setDurationToDisplay(parseInt(this.params.InfoDuration));
        map.setAddress(this.params.Address);
        map.setApiKey(this.params.ApiKey);
        map.setLatitude(parseFloat(this.params.Latitude));
        map.setLongitude(parseFloat(this.params.Longitude));

        switch(this.params.MapType) {
            case 'ROADMAP':
                map.setType(MapType.ROADMAP);
                break;

            case 'SATTELITE':
                map.setType(MapType.SATTELITE);
                break;

            case 'HYBRID':
                map.setType(MapType.HYBRID);
                break;

            case 'TERRAIN':
                map.setType(MapType.TERRAIN);
                break;
        }

        map.setWithTraffic(this.params.WithTraffic == "true");
        map.setWithTransit(this.params.WithTransit == "true");
        var mapList : MapList = new MapList();
        mapList.setId(map.getId());
        mapList.setDurationToDisplay(map.getDurationToDisplay());
        mapList.addMap(map);

        return mapList;
    }
}