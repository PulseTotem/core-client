/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/VideoURL.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/VideoPlaylist.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery

class VideoPlaylistRenderer implements Renderer<VideoURL> {
	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : VideoPlaylist) : Array<VideoURL> {
		var videoList : Array<VideoURL> = new Array<VideoURL>();

		var newInfo = VideoPlaylist.fromJSONObject(info);
		try {
			for (var indexVideo in newInfo.getVideos()) {
				var videoUrl : VideoURL = newInfo.getVideos()[indexVideo];
				videoList.push(videoUrl);
			}
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
		videoHTML.addClass("VideoPlaylistRenderer_mainDiv");

		var html = "";

		if (info.getType() == VideoType.DAILYMOTION) {
			html = '<iframe src="'+info.getURL()+'?chromeless=1&html=1&related=0&logo=0&info=0&autoplay=1" allowfullscreen></iframe>';
		} else {
			html = "<video autoplay class='VideoPlaylistRenderer_videoHTML'><source src='"+info.getURL()+"'></video>";
		}
		videoHTML.html(html);

		$(domElem).append(videoHTML);
	}

	/**
	 * Update rendering Info in specified DOM Element.
	 *
	 * @method updateRender
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 */
	updateRender(info : VideoURL, domElem : any) {
		//TODO
	}
}