/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/VideoURL.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/VideoPlaylist.ts" />
/// <reference path="../Renderer.ts" />
/// <reference path="../../core/MessageBus.ts" />
/// <reference path="../../core/MessageBusChannel.ts" />
/// <reference path="../../core/MessageBusAction.ts" />

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
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : VideoPlaylist, domElem : any, rendererTheme : string, endCallback : Function) {
		var listingHTML = $("<div>");
		listingHTML.addClass("VideoListingRenderer_wrapper");

		info.getVideos().forEach(function(video : VideoURL) {
			var videoDiv = $("<div>");
			videoDiv.addClass("VideoListingRenderer_video");
			videoDiv.addClass("VideoListingRenderer_video_" + video.getId());

			videoDiv.hammer();
			videoDiv.hammer().bind("tap", function(evt) {
				var data = {
					action : MessageBusAction.SELECT,
					message: {
						originalInfo : info,
						selectedInfo : video
					}
				};
				MessageBus.publish(MessageBusChannel.RENDERER, data);
			});

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

				var videoThumbnailSelected = $("<span>");
				videoThumbnailSelected.addClass("glyphicon glyphicon-play VideoListingRenderer_video_thumbnail_selected");
				//videoThumbnailSelected.css("margin-left", (video.getThumbnail().getThumb().getWidth() + 40)*(-1));
				videoThumbnailSelected.css("margin-left", "-30px");
				videoThumbnailSelected.css("margin-top", (video.getThumbnail().getThumb().getHeight() / 2) - 10);

				videoThumbnail.append(videoThumbnailSelected);

				videoDiv.append(videoThumbnail);
			}

			listingHTML.append(videoDiv);

			MessageBus.subscribe(MessageBusChannel.BEHAVIOUR, function(channel : any, data : any) {
				if(typeof(data.action) != "undefined" && data.action == MessageBusAction.DISPLAY) {
					if(data.message.getClassName() == "VideoURL") {
						var displayedVideo : VideoURL = data.message;

						if(displayedVideo.getId() == video.getId()) {
							$(domElem).find(".VideoListingRenderer_video").removeClass("VideoListingRenderer_video_selected");
							videoDiv.addClass("VideoListingRenderer_video_selected");
						}
					}
				}
			});
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
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {Function} endCallback - Callback function called at the end of updateRender method.
	 */
	updateRender(info : VideoPlaylist, domElem : any, rendererTheme : string, endCallback : Function) {
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