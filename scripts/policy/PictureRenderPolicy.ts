/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./RenderPolicy.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Picture.ts" />

class PictureRenderPolicy implements RenderPolicy<Picture> {
    process(listInfos : Array<Picture>) : Array<Picture> {
        return listInfos;
    }
}