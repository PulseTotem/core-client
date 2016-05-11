/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/PictureURL.ts" />
/// <reference path="./PictureHelper.ts" />
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

		var negative = -1;

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
				wrapperHTML.append(pictureHTML);
			}

		});

		$(domElem).append(wrapperHTML);

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

		if(info.getPictures().length > 4) {

			var nbMoves = Math.floor(info.getPictures().length / 4);

			var nbMovesDone = 0;

			var htmlWrapper = $(domElem).find(".PhotoWallPictureAlbumRenderer_wrapper").first();
			var moveDuration = info.getDurationToDisplay() * 1000 / (nbMoves + 1);

			var move = function() {

				if(nbMovesDone < nbMoves) {
					nbMovesDone++;
					$(domElem).find(".PhotoWallPictureAlbumRenderer_picture").transition({y: '-' + htmlWrapper.height() * nbMovesDone + 'px'}, 2000);

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