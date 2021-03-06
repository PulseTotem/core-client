/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/VideoPlaylist.ts" />
/// <reference path="./StaticSource.ts" />

/**
 * Represent a static Youtube Source in the client
 */
class YoutubeSource extends StaticSource<VideoPlaylist> {

	/**
	 * Create and return the information of the Static Source
	 *
	 * @method computeInfo
	 */
	computeInfo() : VideoPlaylist {
		var video : VideoURL = new VideoURL();
		video.setId(this.params.YoutubeID);
		video.setURL("https://www.youtube.com/embed/" + this.params.YoutubeID + "?autoplay=1&controls=0&modestbranding=1");
		video.setType(VideoType.HTML5);
		video.setDurationToDisplay(parseInt(this.params.InfoDuration));

		var playlist : VideoPlaylist = new VideoPlaylist();
		playlist.setId(this.params.YoutubeID);
		playlist.addVideo(video);
		playlist.setDurationToDisplay(parseInt(this.params.InfoDuration));

		return playlist;
	}
}