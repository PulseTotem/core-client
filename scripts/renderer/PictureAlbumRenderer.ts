/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/PictureURL.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery

class PictureAlbumRenderer implements Renderer<Picture> {
	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : PictureAlbum) : Array<Picture> {
		var newListInfos : Array<PictureAlbum> = new Array<PictureAlbum>();
		try {
			var newInfo = PictureAlbum.fromJSONObject(info);
			newListInfos.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

        var result = new Array<Picture>();

		newListInfos.forEach(function(pictureAlbum : PictureAlbum) {
            var pictures : Array<Picture> = pictureAlbum.getPictures();

            pictures.forEach(function (picture : Picture) {
                result.push(picture);
            });
        });

        return result;
    }

	/**
	 * Render the Info in specified DOM Element.
	 *
	 * @method render
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 */
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
		var picURL : PictureURL = null;
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

        $(domElem).append(pictureHTML);

    }

	/**
	 * Update rendering Info in specified DOM Element.
	 *
	 * @method updateRender
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 */
	updateRender(info : Picture, domElem : any) {
		var pictureHeader = $(domElem).find(".PictureAlbumRenderer_header").first();
		pictureHeader.empty();

		if(info.getTitle() != null && info.getTitle() != "") {
			var pictureTitle = $("<div>");
			pictureTitle.addClass("PictureAlbumRenderer_title");
			pictureTitle.html(info.getTitle());

			pictureHeader.append(pictureTitle);
		}

		var pictureContent = $(domElem).find(".PictureAlbumRenderer_content").first();
		pictureContent.empty();

		var pictureImg = $("<img>");
		pictureImg.addClass("img-responsive center-block");
		var picURL : PictureURL = null;
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

		var pictureFooter = $(domElem).find(".PictureAlbumRenderer_footer").first();
		pictureFooter.empty();

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
	}
}