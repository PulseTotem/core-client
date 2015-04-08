/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/PictureURL.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Info.ts" />
/// <reference path="../policy/RenderPolicy.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery

class PictureAlbumRenderer implements Renderer<Picture> {
    transformForBehaviour(listInfos : Array<PictureAlbum>, renderPolicy : RenderPolicy<PictureAlbum>) : Array<Picture> {
		var newListInfos : Array<PictureAlbum> = new Array<PictureAlbum>();
		try {
			newListInfos = Info.fromJSONArray(listInfos, PictureAlbum);
		} catch(e) {
			Logger.error(e.message);
		}

        //var listPictureAlbums : Array<PictureAlbum> = renderPolicy.process(listInfos);

        var result = new Array<Picture>();

		newListInfos.forEach(function(pictureAlbum : PictureAlbum) {
            var pictures : Array<Picture> = pictureAlbum.getPictures();

            pictures.forEach(function (picture : Picture) {
                result.push(picture);
            });
        });

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