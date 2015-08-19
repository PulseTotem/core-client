/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/VideoPlaylist.ts" />
/// <reference path="./StaticSource.ts" />

declare var $: any; // Use of JQuery

/**
 * Represent a static Video Source in the client
 */
class VideoSource extends StaticSource<VideoPlaylist> {

	private isURLValid : boolean;

	constructor(refreshTime : number = 60, params : any = []) {
		super(refreshTime, params);

		this.isURLValid = false;

		var request = $.ajax({
			url: this.params.URL,
			method: "HEAD"
		});

		var self = this;
		request.done(function( msg ) {
			self.isURLValid = true;
		});

		request.fail(function( jqXHR, textStatus ) {
			Logger.error( "Request failed: " + textStatus );
		});
	}

	/**
	 * Create and return the information of the Static Source
	 *
	 * @method computeInfo
	 */
	computeInfo() : VideoPlaylist {
		if (this.isURLValid) {
			var video : VideoURL = new VideoURL();
			video.setId(this.params.URL);
			video.setURL(this.params.URL);
			video.setType(VideoType.HTML5);

			var playlist : VideoPlaylist = new VideoPlaylist();
			playlist.setId(this.params.URL);
			playlist.addVideo(video);

			return playlist;
		} else {
			return null;
		}
	}
}