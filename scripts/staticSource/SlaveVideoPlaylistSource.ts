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
		if(listInfoRenderers.length > 1 || listInfoRenderers.length == 0) {
			return null;
		} else {
			var infoRenderer : InfoRenderer<any> = listInfoRenderers[0];

			if(infoRenderer.getInfo().__proto__.constructor.name == "VideoPlaylist") {
				return infoRenderer.getInfo();
			} else {
				return null;
			}
		}
	}
}