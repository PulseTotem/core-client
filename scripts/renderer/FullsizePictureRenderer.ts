/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/PictureURL.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery

class FullsizePictureRenderer implements Renderer<Picture> {
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

		var pictureHTML = $("<div>");
		pictureHTML.addClass("FullsizePictureRenderer_picture");

		var picURL : PictureURL = null;
		if(info.getMedium() != null) {
			picURL = info.getMedium();
		} else if(info.getSmall() != null) {
			picURL = info.getSmall();
		} else if(info.getThumb() != null) {
			picURL = info.getThumb();
		}

		if(picURL != null) {
			pictureHTML.css("background-image", "url('" + picURL.getURL() + "')");
		}

		$(domElem).append(pictureHTML);

	}
}