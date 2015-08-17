/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/VideoPlaylist.ts" />
/// <reference path="./StaticSource.ts" />

/**
 * Represent a static Video Source in the client
 */
class VideoSource extends StaticSource<VideoPlaylist> {

	/**
	 * Create and return the information of the Static Source
	 *
	 * @method computeInfo
	 */
	computeInfo() : VideoPlaylist {
		var video : VideoURL = new VideoURL();
		video.setId(this.params.VideoURL);
		video.setURL(this.params.VideoURL);
		video.setType(VideoType.HTML5);

		var playlist : VideoPlaylist = new VideoPlaylist();
		playlist.setId(this.params.VideoURL);
		playlist.addVideo(video);

		return playlist;
	}
}