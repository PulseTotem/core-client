/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/PictureURL.ts" />
/// <reference path="../policy/RenderPolicy.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery

class PictureAlbumRenderer implements Renderer<Picture> {
    transformForBehaviour(listInfos : Array<PictureAlbum>, renderPolicy : RenderPolicy<PictureAlbum>) : Array<Picture> {
        console.log("List d'informations : ");
        console.log(listInfos);
        var listPictureAlbums : Array<PictureAlbum> = renderPolicy.process(listInfos);
        console.log("List processed : ");
        console.log(listPictureAlbums);

        var result = new Array<Picture>();

        listPictureAlbums.forEach(function(pictureAlbumJSON : any) {
            var pictureAlbum : PictureAlbum = PictureAlbum.fromJSONObject(pictureAlbumJSON);

            console.log("Picture album :");
            console.log(pictureAlbum);

            var pictures : Array<Picture> = pictureAlbum.getPictures();

            pictures.forEach(function (pictureJSON : Picture) {
                var picture : Picture = Picture.fromJSONObject(pictureJSON);
                console.log("Valeur de reuslt :");
                console.log(result);
                result.push(picture);
            });
        });

        console.log("Result final");
        console.log(result);
        return result;
    }

    render(info : Picture, domElem : any) {
        console.log("Info reçue : ");
        console.log(info);
        var pictureHTML = $("<img>");
        var pictureUrl : any = info.getMedium();
        console.log("URL : ");
        console.log(pictureUrl);
        pictureHTML.attr('src',pictureUrl._url);

        $(domElem).empty();
        $(domElem).append(pictureHTML);

        info.setCastingDate(new Date());
    }
}