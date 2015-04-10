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

		var domElemHeight = $(domElem).height();

		var pictureHTML = $("<div>");
		pictureHTML.addClass("PictureAlbumRenderer_picture");

		var pictureHeader = $("<div>");
		pictureHeader.addClass("PictureAlbumRenderer_header");

		pictureHTML.append(pictureHeader);

		if(info.getTitle() != null && info.getTitle() != "") {
			var pictureTitle = $("<div>");
			pictureTitle.addClass("PictureAlbumRenderer_title");
			pictureTitle.html(info.getTitle());

			pictureHeader.append(pictureTitle);
		}

		var pictureContent = $("<div>");
		pictureContent.addClass("PictureAlbumRenderer_content");
		pictureContent.attr("style", "line-height: " + domElemHeight + ";");

		pictureHTML.append(pictureContent);

		var pictureImg = $("<img>");
		pictureImg.addClass("img-responsive center-block");
		var picURL = null;
		if(info.getMedium() != null) {
			picURL = info.getMedium();
		} else if(info.getSmall() != null) {
			picURL = info.getSmall();
		} else if(info.getThumb() != null) {
			picURL = info.getThumb();
		}

		if(picURL != null) {
			pictureImg.attr("src", picURL.getURL());
		}

		pictureContent.append(pictureImg);

		var pictureFooter = $("<div>");
		pictureFooter.addClass("PictureAlbumRenderer_footer");

		pictureHTML.append(pictureFooter);

		if(info.getTags().length > 0) {
			var pictureTags = $("<div>");
			pictureTags.addClass("PictureAlbumRenderer_tags");

			info.getTags().forEach(function(tag) {
				var picTag = $("<span>");
				picTag.addClass("PictureAlbumRenderer_tag");
				picTag.html(tag.getName());
			});

			pictureFooter.append(pictureTags);
		}

		if(info.getOwner() != null && info.getOwner().getRealname() != null) {
			var pictureOwner = $("<div>");
			pictureOwner.addClass("PictureAlbumRenderer_owner");
			pictureOwner.html(info.getOwner().getRealname());

			pictureFooter.append(pictureOwner);
		}

		var clearFixFooter = $("<div class=\"clearfix\"></div>");
		pictureFooter.append(clearFixFooter);

        $(domElem).empty();
        $(domElem).append(pictureHTML);

        info.setCastingDate(new Date());
    }
}