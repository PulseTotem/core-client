/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/PictureURL.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery

class ClearOnBlurPictureRenderer implements Renderer<Picture> {
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
				if(picture.getMedium() != null) {
					PictureHelper.preloadImage(picture, "medium");
				} else if(picture.getSmall() != null) {
					PictureHelper.preloadImage(picture, "small");
				} else if(picture.getThumb() != null) {
					PictureHelper.preloadImage(picture, "thumb");
				}

				picture.setTitle(pictureAlbum.getName());

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

		var pictureWrapper = $("<div>");
		pictureWrapper.addClass("ClearOnBlurPictureRenderer_wrapper");
		pictureWrapper.addClass(rendererTheme);

		var pictureTitle = $("<div>");
		pictureTitle.addClass("ClearOnBlurPictureRenderer_title");
		var pictureTitleSpan = $("<span>");
		pictureTitleSpan.html(info.getTitle());
		pictureTitle.append(pictureTitleSpan);

		pictureWrapper.append(pictureTitle);

		var pictureContainer = $("<div>");
		pictureContainer.addClass("ClearOnBlurPictureRenderer_container");

		pictureWrapper.append(pictureContainer);

		var picURL : PictureURL = null;
		if(info.getMedium() != null) {
			picURL = info.getMedium();
		} else if(info.getSmall() != null) {
			picURL = info.getSmall();
		} else if(info.getThumb() != null) {
			picURL = info.getThumb();
		}

		var pictureBackgroundContainer = $("<div>");
		pictureBackgroundContainer.addClass("ClearOnBlurPictureRenderer_background_container");

		pictureContainer.append(pictureBackgroundContainer);

		var pictureHTML = $("<div>");
		pictureHTML.addClass("ClearOnBlurPictureRenderer_picture");

		pictureContainer.append(pictureHTML);

		if(picURL != null) {
			pictureHTML.css("background-image", "url('" + picURL.getURL() + "')");
		}

		$(domElem).append(pictureWrapper);

		if(picURL != null) {
			pictureBackgroundContainer.backgroundBlur({
				imageURL: picURL.getURL(),
				blurAmount: 10,
				imageClass: 'ClearOnBlurPictureRenderer_background'
			});
		}

		pictureTitle.textfill({
			maxFontPixels: 500,
			success: function() {
				var fontSize = pictureTitle.find("span").first().css("font-size");
				var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
				var newFontSize = fontSizeInt - 4;
				pictureTitle.find("span").first().css("font-size", newFontSize.toString() + "px");
			}
		});

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
		var pictureHTML = $(domElem).find(".ClearOnBlurPictureRenderer_picture").first();

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