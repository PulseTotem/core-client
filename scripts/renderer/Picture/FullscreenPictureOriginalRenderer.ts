/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/PictureURL.ts" />
/// <reference path="../Renderer.ts" />
/// <reference path="./PictureHelper.ts" />

declare var $: any; // Use of JQuery

class FullscreenPictureOriginalRenderer implements Renderer<Picture> {
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
				if(picture.getOriginal() != null) {
					PictureHelper.preloadImage(picture, "original");
				} else if(picture.getMedium() != null) {
					PictureHelper.preloadImage(picture, "medium");
				} else if(picture.getSmall() != null) {
					PictureHelper.preloadImage(picture, "small");
				} else if(picture.getThumb() != null) {
					PictureHelper.preloadImage(picture, "thumb");
				}

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
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : Picture, domElem : any, rendererTheme : string, endCallback : Function) {

		var pictureHTML = $("<div>");
		pictureHTML.addClass("FullscreenPictureRenderer_picture");

		var picURL : PictureURL = null;
		if(info.getOriginal() != null) {
			picURL = info.getOriginal();
		} else if(info.getMedium() != null) {
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

		endCallback();
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
	updateRender(info : Picture, domElem : any, rendererTheme : string, endCallback : Function) {
		var pictureHTML = $(domElem).find(".FullscreenPictureRenderer_picture").first();

		var picURL : PictureURL = null;
		if(info.getOriginal() != null) {
			picURL = info.getOriginal();
		} else if(info.getMedium() != null) {
			picURL = info.getMedium();
		} else if(info.getSmall() != null) {
			picURL = info.getSmall();
		} else if(info.getThumb() != null) {
			picURL = info.getThumb();
		}

		if(picURL != null) {
			pictureHTML.css("background-image", "url('" + picURL.getURL() + "')");
		}

		endCallback();
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
	animate(info : Picture, domElem : any, rendererTheme : string, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}