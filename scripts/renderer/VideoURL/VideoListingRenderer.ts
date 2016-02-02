/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/VideoURL.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/VideoPlaylist.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery

class VideoListingRenderer implements Renderer<VideoPlaylist> {

	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : VideoPlaylist) : Array<VideoPlaylist> {
		var newListInfos : Array<VideoPlaylist> = new Array<VideoPlaylist>();
		try {
			var newInfo = VideoPlaylist.fromJSONObject(info);
			newListInfos.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

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
	render(info : VideoPlaylist, domElem : any, endCallback : Function) {
		var listingHTML = $("<div>");
		listingHTML.addClass("VideoListingRenderer_wrapper");

		info.getVideos().forEach(function(video : VideoURL) {
			var videoDiv = $("<div>");
			videoDiv.addClass("VideoListingRenderer_video");

			if(video.getTitle() != "") {
				var videoTitle = $("<div>");
				videoTitle.addClass("VideoListingRenderer_video_title");
				videoTitle.addClass("VideoListingRenderer_video_title_" + video.getId());
				var videoTitleSpan = $("<span>");
				videoTitleSpan.html(video.getTitle());
				videoTitle.append(videoTitleSpan);
				videoDiv.append(videoTitle);
			}

			if(video.getThumbnail() != null) {
				var videoThumbnail = $("<div>");
				videoThumbnail.addClass("VideoListingRenderer_video_thumbnail");
				videoThumbnail.css("width", video.getThumbnail().getThumb().getWidth());
				videoThumbnail.css("height", video.getThumbnail().getThumb().getHeight());
				videoThumbnail.css("background-image", "url('" + video.getThumbnail().getThumb().getURL() + "')");
				videoDiv.append(videoThumbnail);
			}

			listingHTML.append(videoDiv);
		});

		$(domElem).append(listingHTML);

		info.getVideos().forEach(function(video : VideoURL) {
			if(video.getTitle() != "") {
				$(domElem).find(".VideoListingRenderer_video_title_" + video.getId()).first().textfill({
					maxFontPixels: 500
				});
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
	 * @param {Function} endCallback - Callback function called at the end of updateRender method.
	 */
	updateRender(info : VideoPlaylist, domElem : any, endCallback : Function) {
		//TODO

		endCallback();
	}

	/**
	 * Animate rendering Info in specified DOM Element.
	 *
	 * @method animate
	 * @param {RenderInfo} info - The Info to animate.
	 * @param {DOM Element} domElem - The DOM Element where animate the info.
	 * @param {Function} endCallback - Callback function called at the end of animation.
	 */
	animate(info : VideoPlaylist, domElem : any, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}