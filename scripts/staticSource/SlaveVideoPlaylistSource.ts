/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/VideoPlaylist.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/priorities/InfoPriority.ts" />
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
	 * @method computeIncomingMessageFromTimeline
	 * @param {Array<InfoRenderer<any>>} listInfoRenderers - The ListInfoRenders to compute as Incoming Message.
	 */
	computeIncomingMessageFromTimeline(listInfoRenderers : Array<InfoRenderer<any>>) : VideoPlaylist {
		if(listInfoRenderers.length > 1 || listInfoRenderers.length == 0) {
			return null;
		} else {
			var infoRenderer : InfoRenderer<any> = listInfoRenderers[0];

			if(infoRenderer.getInfo().getClassName() == "VideoPlaylist") {
				return infoRenderer.getInfo();
			} else {
				return null;
			}
		}
	}

	/**
	 * Create and return the information of the Static Source
	 *
	 * @method computeIncomingMessageFromTimeline
	 * @param {any} selectionMessage - The selection message.
	 */
	computeSelectionFromRenderer(selectionMessage : any) : VideoPlaylist {
		if(selectionMessage.originalInfo.getClassName() == "VideoPlaylist"
			&& selectionMessage.selectedInfo.getClassName() == "VideoURL") {

			var playlist : VideoPlaylist = selectionMessage.originalInfo;
			var selected : VideoURL = selectionMessage.selectedInfo;

			playlist.getVideos().forEach(function(video : VideoURL) {
				if(video.getId() != selected.getId()) {
					video.setPriority(InfoPriority.LOW);
				} else {
					video.setPriority(InfoPriority.HIGH);
				}
			});

			return playlist;

		} else {
			return null;
		}
	}
}