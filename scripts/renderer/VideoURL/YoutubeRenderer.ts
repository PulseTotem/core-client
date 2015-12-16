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
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : VideoURL, domElem : any, endCallback : Function) {
		var videoHTMLWrapper = $("<div>");
		videoHTMLWrapper.addClass("YoutubeRenderer_wrapper");

		/*
		 <iframe id="ytplayer" type="text/html" width="640" height="390"
		 src="http://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com"
		 frameborder="0"/>

		 */

		$(domElem).append(videoHTMLWrapper);

		var videoIFrame = $("<iframe>");
		videoIFrame.addClass("YoutubeRenderer_iframe");

		videoIFrame.attr("type", "text/html");
		videoIFrame.attr("frameborder", "0");

		videoIFrame.attr("width", videoHTMLWrapper.width() - 20);
		videoIFrame.attr("height", videoHTMLWrapper.height() - 20);
		videoIFrame.attr("src", info.getURL());

		videoHTMLWrapper.append(videoIFrame);

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
	updateRender(info : VideoURL, domElem : any, endCallback : Function) {
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
	animate(info : VideoURL, domElem : any, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}