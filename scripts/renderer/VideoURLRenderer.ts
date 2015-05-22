/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/VideoURL.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery

class VideoURLRenderer implements Renderer<VideoURL> {
	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : VideoURL) : Array<VideoURL> {
		var videoList : Array<VideoURL> = new Array<VideoURL>();
		try {
			var newInfo = VideoURL.fromJSONObject(VideoURL);
			videoList.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		return videoList;
	}

	/**
	 * Render the Info in specified DOM Element.
	 *
	 * @method render
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 */
	render(info : VideoURL, domElem : any) {
		var videoHTML = $("<div>");
		videoHTML.addClass("VideoURLRenderer_mainDiv");
		videoHTML.html('<iframe src="'+info.getURL()+'?chromeless=1&html=1&related=0&logo=0&info=0&autoplay=1" allowfullscreen></iframe>');

		$(domElem).append(videoHTML);
	}
}