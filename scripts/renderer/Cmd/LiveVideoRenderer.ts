/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/CmdList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Cmd.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var easyrtc: any; // Use of EasyRTC

class LiveVideoRenderer implements Renderer<Cmd> {

	/**
	 * LiveVideoRenderer's connected clients.
	 *
	 * @property _connected
	 * @type Array<boolean>
	 */
	private _connected : Array<boolean>;

	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : CmdList) : Array<Cmd> {
		var cmdLists : Array<CmdList> = new Array<CmdList>();
		try {
			var newInfo = CmdList.fromJSONObject(info);
			cmdLists.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		var cmds : Array<Cmd> = new Array<Cmd>();

		for(var iCL in cmdLists) {
			var cl : CmdList = cmdLists[iCL];
			var clCmds : Array<Cmd> = cl.getCmds();
			for(var iC in clCmds) {
				var c : Cmd = clCmds[iC];
				cmds.push(c);
			}
		}

		return cmds;
	}

	/**
	 * Render the Info in specified DOM Element.
	 *
	 * @method render
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : Cmd, domElem : any, endCallback : Function) {
		var self = this;

		switch(info.getCmd()) {
			case "LiveOn" :
				var liveWrapper = $("<div>");
				liveWrapper.addClass("LiveVideoRenderer_wrapper");

				$(domElem).append(liveWrapper);

				self._connected = new Array<boolean>();

				easyrtc.setSocketUrl("http://easyrtc.the6thscreen.fr");

				easyrtc.setStreamAcceptor( function(callerEasyrtcid, stream) {
					var callerVideo = $('<video muted="muted"></video>');
					callerVideo.addClass('LiveVideoRenderer_callerVideo');
					callerVideo.addClass('pull_left');
					callerVideo.attr('id', 'caller_' + callerEasyrtcid);

					easyrtc.setVideoObjectSrc(callerVideo[0], stream);

					self._connected[callerEasyrtcid] = true;
				});

				easyrtc.setOnStreamClosed( function (callerEasyrtcid) {
					var callerVideo = $('#caller_' + callerEasyrtcid);

					easyrtc.setVideoObjectSrc(callerVideo[0], "");

					callerVideo.remove();

					if( typeof(self._connected[callerEasyrtcid]) != "undefined" ) {
						delete self._connected[callerEasyrtcid];
					}
				});

				easyrtc.setRoomOccupantListener(function roomListener(roomName, otherPeers) {
					for(var peerId in otherPeers) {

						if(typeof(self._connected[peerId]) == "undefined") {
							easyrtc.call(
								peerId,
								function(easyrtcid) { Logger.debug("completed call to " + easyrtcid); },
								function(errorCode, errorText) { Logger.error("err:" + errorText); },
								function(accepted, bywho) {
									Logger.debug((accepted?"accepted":"rejected")+ " by " + bywho);
								}
							);
						}

					}
				});
				var connectSuccess = function(myId) {
					Logger.debug("My easyrtcid is " + myId);
				};
				var connectFailure = function(errorCode, errText) {
					Logger.error(errText);
				};
				easyrtc.initMediaSource(
					function(){        // success callback
						var roomName = "PulseTotem_VideoLive";
						if(info.getArgs().length > 0) {
							roomName = info.getArgs()[0];
						}

						easyrtc.connect(roomName, connectSuccess, connectFailure);
					},
					connectFailure
				);
				break;
		}
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
	updateRender(info : Cmd, domElem : any, endCallback : Function) {

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
	animate(info : Cmd, domElem : any, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}