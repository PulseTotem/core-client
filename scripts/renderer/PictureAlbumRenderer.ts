/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../policy/RenderPolicy.ts" />
/// <reference path="./Renderer.ts" />

class PictureAlbumRenderer implements Renderer<Picture> {
    transformForBehaviour(listInfos : Array<PictureAlbum>, renderPolicy : RenderPolicy<PictureAlbum>) : Array<Picture> {
        console.log("List d'informations : ");
        console.log(listInfos);
        var listPictureAlbums = renderPolicy.process(listInfos);
        console.log("List processed : ");
        console.log(listPictureAlbums);

        var result = new Array<Picture>();
        listPictureAlbums.forEach(function(pictureAlbum : PictureAlbum) {
            pictureAlbum.getPictures().forEach(function (picture : Picture) {
                result.push(picture);
            })
        });

        return result;
    }

    render(info : Picture, domElem : any) {
        var pictureHTML = $("<img>");
        pictureHTML.src(info.getMedium().getURL());

        $(domElem).empty();
        $(domElem).append(pictureHTML);

        info.setCastingDate(new Date());
    }
}