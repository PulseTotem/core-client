/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/PictureURL.ts" />
/// <reference path="./PictureHelper.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var _: any; // Use of Lodash

class BallonPictureAlbumRenderer implements Renderer<PictureAlbum> {

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
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : PictureAlbum, domElem : any, endCallback : Function) {

		var wrapperHTML = $("<div>");
		wrapperHTML.addClass("BallonPictureAlbumRenderer_wrapper");

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
				pictureHTML.addClass("BallonPictureAlbumRenderer_picture");
				pictureHTML.css("background-image", "url('" + picURL.getURL() + "')");
				var value = 1200*negative;
				negative *= -1;
				pictureHTML.css("transform", "translate(" + value + "px, 1200px)");
				pictureHTML.css("border-radius", "100%");
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
	 * @param {Function} endCallback - Callback function called at the end of updateRender method.
	 */
	updateRender(info : PictureAlbum, domElem : any, endCallback : Function) {
		$(domElem).empty();
		this.render(info, domElem, endCallback);
	}

	/**
	 * Animate rendering Info in specified DOM Element.
	 *
	 * @method animate
	 * @param {RenderInfo} info - The Info to animate.
	 * @param {DOM Element} domElem - The DOM Element where animate the info.
	 * @param {Function} endCallback - Callback function called at the end of animation.
	 */
	animate(info : PictureAlbum, domElem : any, endCallback : Function) {
		var delays = new Array();
		var seconds = 0;

		for(var i = 1; i < info.getPictures().length + 1; i++) {
			seconds = (seconds + 1) % 5;
			delays.push(seconds);
		}
		var shuffledDelays = _.shuffle(delays);


		$(domElem).find(".BallonPictureAlbumRenderer_picture").each(function(index, elem) {
			var delay = shuffledDelays[index];
			var duration = Math.floor((Math.random() * 3) + 1) + 2;

			$(elem).transition({ y: '0px', x: '0px', delay: delay * 1000 }, duration * 1000).transition({'border-radius': '0%'}, 2 * 1000);
		});

		endCallback();
	}
}