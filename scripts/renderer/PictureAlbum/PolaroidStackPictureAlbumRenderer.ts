/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/PictureURL.ts" />
/// <reference path="../Picture/PictureHelper.ts" />
/// <reference path="../Renderer.ts" />

/// <reference path="../../core/Timer.ts" />
/// <reference path="../../core/Utils.ts" />

declare var $: any; // Use of JQuery
declare var _: any; // Use of Lodash

class PolaroidStackPictureAlbumRenderer implements Renderer<PictureAlbum> {

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
		wrapperHTML.addClass("PolaroidStackPictureAlbumRenderer_wrapper");
		wrapperHTML.addClass(rendererTheme);

		var albumTitle = $("<div>");
		albumTitle.addClass("PolaroidStackPictureAlbumRenderer_album_title");
		var albumTitleSpan = $("<span>");
		albumTitleSpan.html(info.getName());
		albumTitle.append(albumTitleSpan);

		wrapperHTML.append(albumTitle);

		var albumHTML = $("<div>");
		albumHTML.addClass("PolaroidStackPictureAlbumRenderer_album");

		wrapperHTML.append(albumHTML);

		var titles = [];
		var picturesContainers = [];

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
				var pictureContainerHTML = $("<div>");
				pictureContainerHTML.addClass("PolaroidStackPictureAlbumRenderer_picture_container");

				var rotateDeg = Utils.getRandomInt(1, 15);
				var translation = "1000px";
				var minus = Utils.getRandomInt(0, 10);
				if(minus < 5) {
					rotateDeg = rotateDeg*(-1);
					translation = "-" + translation;
				}
				pictureContainerHTML.css("transform", "rotate(" + rotateDeg + "deg) translate(" + translation + ", 0px)")

				var pictureHTML = $("<div>");
				pictureHTML.addClass("PolaroidStackPictureAlbumRenderer_picture");
				pictureHTML.css("background-image", "url('" + picURL.getURL() + "')");

				pictureContainerHTML.append(pictureHTML);

				if(picture.getTitle() != null && picture.getTitle() != "") {
					var pictureTitle = $("<div>");
					pictureTitle.addClass("PolaroidStackPictureAlbumRenderer_picture_title");

					var pictureTitleSpan = $("<span>");
					pictureTitleSpan.html(picture.getTitle());
					pictureTitle.append(pictureTitleSpan);

					pictureContainerHTML.append(pictureTitle);

					titles.push(pictureTitle);
				}

				albumHTML.append(pictureContainerHTML);

				picturesContainers.push(pictureContainerHTML);
			}

		});

		$(domElem).append(wrapperHTML);

		var newContainerWidth = albumHTML.height() * 0.8;
		var newContainerLeft = (albumHTML.width() - newContainerWidth) / 2;

		picturesContainers.forEach(function(container : any) {
			var newContainerTop = (albumHTML.height() - container.height()) / 2;

			container.css("width", newContainerWidth + "px");
			container.css("left", newContainerLeft + "px");
			container.css("top", newContainerTop + "px");
		});

		albumTitle.textfill({
			maxFontPixels: 500,
			success: function() {
				var fontSize = albumTitle.find("span").first().css("font-size");
				var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
				var newFontSize = fontSizeInt - 4;
				albumTitle.find("span").first().css("font-size", newFontSize.toString() + "px");
				//albumTitle.find("span").first().css("line-height", (newFontSize * 2).toString() + "px");
			}
		});

		titles.forEach(function(titleDiv : any) {
			titleDiv.textfill({
				maxFontPixels: 500,
				success: function() {
					var titleSpan = titleDiv.find("span").first();
					var fontSize = titleSpan.css("font-size");
					var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
					var newFontSize = fontSizeInt - 4;
					titleSpan.css("font-size", newFontSize.toString() + "px");
					var paddingTop = (titleDiv.height() - titleSpan.height()) / 2;
					titleDiv.css("padding-top", paddingTop + "px");
				}
			});
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

		var picturesContainersElems = $(domElem).find(".PolaroidStackPictureAlbumRenderer_picture_container");

		var nbMovesDone = 0;
		var moveDuration = (info.getDurationToDisplay() / info.getPictures().length) * 1000 - 2000;

		var move = function() {
			if(nbMovesDone < picturesContainersElems.length) {
				var rotateAngle = $(picturesContainersElems[nbMovesDone]).css('rotate');
				var translateValue = $(picturesContainersElems[nbMovesDone]).css('translate');
				$(picturesContainersElems[nbMovesDone]).css('transform', "translate(" + translateValue + ") rotate(-180deg)");

				var newTranslateX = Utils.getRandomInt(0, 30);
				var minus = Utils.getRandomInt(0, 10);
				if(minus < 5) {
					newTranslateX = newTranslateX*(-1);
				}
				var newTranslateY = Utils.getRandomInt(0, 10);
				minus = Utils.getRandomInt(0, 10);
				if(minus < 5) {
					newTranslateY = newTranslateY*(-1);
				}

				$(picturesContainersElems[nbMovesDone]).transition({translate: newTranslateX + "px, " + newTranslateY + "px", rotate: rotateAngle}, 2000, 'easeInOutQuart');

				if(typeof(self._timers[info.getId()]) != "undefined") {
					self._timers[info.getId()].stop();
				}

				self._timers[info.getId()] = new Timer(move, moveDuration);

				nbMovesDone++;
			}
		};

		move();

		endCallback();
	}
}