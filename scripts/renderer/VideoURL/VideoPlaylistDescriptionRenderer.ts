/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/VideoURL.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/VideoPlaylist.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery

class VideoPlaylistDescriptionRenderer implements Renderer<VideoPlaylist> {

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
		var playlistWrapper = $("<div>");
		playlistWrapper.addClass("VideoPlaylistDescriptionRenderer_wrapper");

		var playlistTitle = $("<div>");
		playlistTitle.addClass("VideoPlaylistDescriptionRenderer_title");
		var playlistTitleSpan = $("<span>");
		playlistTitleSpan.html(info.getTitle());
		playlistTitle.append(playlistTitleSpan);

		playlistWrapper.append(playlistTitle);

		var playlistDescription = $("<div>");
		playlistDescription.addClass("VideoPlaylistDescriptionRenderer_description");
		var playlistDescriptionSpan = $("<span>");
		playlistDescriptionSpan.html(info.getDescription());
		playlistDescription.append(playlistDescriptionSpan);

		playlistWrapper.append(playlistDescription);

		$(domElem).append(playlistWrapper);

		playlistTitle.textfill({
			maxFontPixels: 500
		});

		playlistDescription.textfill({
			maxFontPixels: 500
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
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {Function} endCallback - Callback function called at the end of animation.
	 */
	animate(info : VideoPlaylist, domElem : any, rendererTheme : string, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}