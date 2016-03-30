/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/VideoURL.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/VideoPlaylist.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery

class YoutubeRenderer implements Renderer<VideoURL> {

	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : VideoPlaylist) : Array<VideoURL> {
		var videoList : Array<VideoURL> = new Array<VideoURL>();

		var newInfo : VideoPlaylist = VideoPlaylist.fromJSONObject(info);

		newInfo.getVideos().forEach(function(videoUrl : VideoURL) {
			videoList.push(videoUrl);
		});

		return videoList;
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
	render(info : VideoURL, domElem : any, rendererTheme : string, endCallback : Function) {
		var videoHTMLWrapper = $("<div>");
		videoHTMLWrapper.addClass("YoutubeRenderer_wrapper");

		var videoTitle = $("<div>");
		videoTitle.addClass("YoutubeRenderer_title");
		var videoTitleSpan = $("<span>");
		videoTitleSpan.html(info.getTitle());
		videoTitle.append(videoTitleSpan);

		videoHTMLWrapper.append(videoTitle);


		var youtubeIFrameContainer = $("<div>");
		youtubeIFrameContainer.addClass("YoutubeRenderer_iframe_container");

		videoHTMLWrapper.append(youtubeIFrameContainer);

		var videoDescription = $("<div>");
		videoDescription.addClass("YoutubeRenderer_description");
		var videoDescriptionSpan = $("<span>");
		videoDescriptionSpan.html(info.getDescription());
		videoDescription.append(videoDescriptionSpan);

		videoHTMLWrapper.append(videoDescription);

		$(domElem).append(videoHTMLWrapper);

		videoTitle.textfill({
			maxFontPixels: 500
		});

		videoDescription.textfill({
			maxFontPixels: 500
		});

		var videoIFrame = $("<iframe>");
		videoIFrame.addClass("YoutubeRenderer_iframe");

		videoIFrame.attr("type", "text/html");
		videoIFrame.attr("frameborder", "0");

		videoIFrame.attr("width", youtubeIFrameContainer.width() - 20);
		videoIFrame.attr("height", youtubeIFrameContainer.height() - 20);
		videoIFrame.attr("src", info.getURL());

		youtubeIFrameContainer.append(videoIFrame);

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
	updateRender(info : VideoURL, domElem : any, rendererTheme : string, endCallback : Function) {
		//TODO

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
	animate(info : VideoURL, domElem : any, rendererTheme : string, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}