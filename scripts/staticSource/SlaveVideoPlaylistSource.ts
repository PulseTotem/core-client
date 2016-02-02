/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/VideoPlaylist.ts" />
/// <reference path="./SlaveStaticSource.ts" />

/**
 * Represent a static Slave VideoPlaylist Source in the client
 *
 * @class SlaveVideoPlaylistSource
 * @extends SlaveStaticSource<VideoPlaylist>
 */
class SlaveVideoPlaylistSource extends SlaveStaticSource<VideoPlaylist> {

	/**
	 * Create and return the information of the Static Source
	 *
	 * @method computeIncomingMessage
	 * @param {Array<InfoRenderer<any>>} listInfoRenderers - The ListInfoRenders to compute as Incoming Message.
	 */
	computeIncomingMessage(listInfoRenderers : Array<InfoRenderer<any>>) : VideoPlaylist {
		/*var video : VideoURL = new VideoURL();
		video.setId(this.params.YoutubeID);
		video.setURL("http://www.youtube.com/embed/" + this.params.YoutubeID + "?autoplay=1&controls=0&modestbranding=1");
		video.setType(VideoType.HTML5);
		video.setDurationToDisplay(this.params.InfoDuration);

		var playlist : VideoPlaylist = new VideoPlaylist();
		playlist.setId(this.params.YoutubeID);
		playlist.addVideo(video);
		playlist.setDurationToDisplay(this.params.InfoDuration);

		return playlist;*/

		Logger.debug(listInfoRenderers);

		return null;
	}
}