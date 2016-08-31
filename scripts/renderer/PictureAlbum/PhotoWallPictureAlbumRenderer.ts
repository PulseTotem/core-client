/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/PictureURL.ts" />
/// <reference path="../Picture/PictureHelper.ts" />
/// <reference path="../Renderer.ts" />

/// <reference path="../../core/Timer.ts" />

declare var $: any; // Use of JQuery
declare var _: any; // Use of Lodash

class PhotoWallPictureAlbumRenderer implements Renderer<PictureAlbum> {

	/**
	 * Current timers.
	 *
	 * @property _timers
	 * @type Object
	 */
	private _timers : Object = {};

	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : PictureAlbum) : Array<PictureAlbum> {
		var newListInfos : Array<PictureAlbum> = new Array<PictureAlbum>();
		try {
			var newInfo = PictureAlbum.fromJSONObject(info);
			newListInfos.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

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
			});
		});

		return newListInfos;
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
	render(info : PictureAlbum, domElem : any, rendererTheme : string, endCallback : Function) {

		var wrapperHTML = $("<div>");
		wrapperHTML.addClass("PhotoWallPictureAlbumRenderer_wrapper");
		wrapperHTML.addClass(rendererTheme);

		var albumTitle = $("<div>");
		albumTitle.addClass("PhotoWallPictureAlbumRenderer_album_title");
		var albumTitleSpan = $("<span>");
		albumTitleSpan.html(info.getName());
		albumTitle.append(albumTitleSpan);

		wrapperHTML.append(albumTitle);

		var albumHTML = $("<div>");
		albumHTML.addClass("PhotoWallPictureAlbumRenderer_album");

		wrapperHTML.append(albumHTML);

		info.getPictures().forEach(function(picture : Picture) {

			var picURL : PictureURL = null;
			if(picture.getMedium() != null) {
				picURL = picture.getMedium();
			} else if(picture.getSmall() != null) {
				picURL = picture.getSmall();
			} else if(picture.getThumb() != null) {
				picURL = picture.getThumb();
			}

			if(picURL != null) {
				var pictureHTML = $("<div>");
				pictureHTML.addClass("PhotoWallPictureAlbumRenderer_picture");
				pictureHTML.css("background-image", "url('" + picURL.getURL() + "')");
				albumHTML.append(pictureHTML);
			}

		});

		$(domElem).append(wrapperHTML);

		albumTitle.textfill({
			maxFontPixels: 500,
			success: function() {
				var fontSize = albumTitle.find("span").first().css("font-size");
				var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
				var newFontSize = fontSizeInt - 4;
				albumTitle.find("span").first().css("font-size", newFontSize.toString() + "px");
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
	updateRender(info : PictureAlbum, domElem : any, rendererTheme : string, endCallback : Function) {
		$(domElem).empty();
		this.render(info, domElem, rendererTheme, endCallback);
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
	animate(info : PictureAlbum, domElem : any, rendererTheme : string, endCallback : Function) {
		var self = this;

		var htmlWrapper = $(domElem).find(".PhotoWallPictureAlbumRenderer_album").first();

		var picturesHTMLElems = $(domElem).find(".PhotoWallPictureAlbumRenderer_picture");

		var firstPicture = picturesHTMLElems.first();
		var firstPictureWidth = firstPicture.width();
		var firstPictureHeight = firstPicture.height();

		var nbPerRows = Math.round(htmlWrapper.width() / firstPictureWidth);
		var nbRows = Math.round(htmlWrapper.height() / firstPictureHeight);

		var nbPicturesPerView = nbPerRows * nbRows;

		for(var i = 0; i < picturesHTMLElems.length ; i++) {
			var jqueryPictureElem = $(picturesHTMLElems[i]);
			jqueryPictureElem.removeClass("PhotoWallPictureAlbumRenderer_picture");
			jqueryPictureElem.addClass("PhotoWallPictureAlbumRenderer_picture_without_size");
			jqueryPictureElem.width(firstPictureWidth - 10);
			jqueryPictureElem.height(firstPictureHeight - 10);
			jqueryPictureElem.css("margin", "5px");
		}

		if(info.getPictures().length > nbPicturesPerView) {

			var nbMoves = Math.floor(info.getPictures().length / nbPicturesPerView);

			var totalDisplay = nbMoves*nbPicturesPerView;
			if(totalDisplay == info.getPictures().length) {
				nbMoves--;
			}

			var nbMovesDone = 0;

			var moveDuration = info.getDurationToDisplay() * 1000 / (nbMoves + 1);

			var move = function() {

				if(nbMovesDone < nbMoves) {
					nbMovesDone++;
					picturesHTMLElems.transition({y: '-' + htmlWrapper.height() * nbMovesDone + 'px'}, 2000);

					if(typeof(self._timers[info.getId()]) != "undefined") {
						self._timers[info.getId()].stop();
					}

					self._timers[info.getId()] = new Timer(move, moveDuration);
				}
			};

			if(typeof(self._timers[info.getId()]) != "undefined") {
				self._timers[info.getId()].stop();
			}

			self._timers[info.getId()] = new Timer(move, moveDuration);
		}

		endCallback();
	}
}