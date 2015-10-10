/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../core/Logger.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/CmdList.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var QRCode: any; // Use of QRCode.js

class GuestBookRenderer implements Renderer<Cmd> {

	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : CmdList) : Array<Cmd> {
		var newListInfos : Array<CmdList> = new Array<CmdList>();
		try {
			var newInfo = CmdList.fromJSONObject(info);
			newListInfos.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		var result = new Array<Cmd>();

		newListInfos.forEach(function(cmdList : CmdList) {
			var cmds : Array<Cmd> = cmdList.getCmds();

			cmds.forEach(function (cmd : Cmd) {
				result.push(cmd);
			});
		});

		return result;
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

		switch(info.getCmd()) {
			case "Wait" :
				$(domElem).empty();
				var socketId = info.getArgs()[0];

				this._renderWait(domElem, socketId);

				break;
			case "StartSession" :
				$(domElem).empty();
				var socketId = info.getArgs()[0];
				var sessionDesc = JSON.parse(info.getArgs()[1]);

				this._renderStartSession(domElem);

				break;
			case "NewDrawContent" :
				var socketId = info.getArgs()[0];
				var sessionDesc = JSON.parse(info.getArgs()[1]);
				var drawContent = info.getArgs()[2];

				this._updateCanvasContent(domElem, drawContent);
				break;
			default :
				// Nothing to do ?
		}

		endCallback();
	}

	/**
	 * Render "Wait" command in specified DOM Element.
	 *
	 * @method _renderWait
	 * @private
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {string} socketId - call socket's Id.
	 */
	private _renderWait(domElem : any, socketId : string) {
		//var client_guestbook_url = "http://client-guestbook.pulsetotem.fr/session/" + socketId;
		var client_guestbook_url = "http://localhost:9002/session/" + socketId;

		var wrapperDiv = $('<div>');
		wrapperDiv.addClass("GuestBookRenderer_wrapper");

		var qrcodeDiv = $('<div>');
		qrcodeDiv.addClass("GuestBookRenderer_qrcode");
		wrapperDiv.append(qrcodeDiv);

		var qrcodeUrlDiv = $('<div>');
		qrcodeUrlDiv.addClass("GuestBookRenderer_qrcode_url");
		var qrcodeUrlSpan = $('<span>');
		qrcodeUrlSpan.html(client_guestbook_url);
		qrcodeUrlDiv.append(qrcodeUrlSpan);
		wrapperDiv.append(qrcodeUrlDiv);

		$(domElem).append(wrapperDiv);

		new QRCode(qrcodeDiv[0], client_guestbook_url);

		qrcodeUrlDiv.textfill({
			maxFontPixels: 500
		});
	}

	/**
	 * Render "StartSession" command in specified DOM Element.
	 *
	 * @method _renderStartSession
	 * @private
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 */
	private _renderStartSession(domElem : any) {
		var wrapperDiv = $('<div>');
		wrapperDiv.addClass("GuestBookRenderer_wrapper");

		var drawCanvasDiv = $('<div>');
		drawCanvasDiv.addClass("GuestBookRenderer_canvas_container");
		wrapperDiv.append(drawCanvasDiv);

		var drawCanvas = $('<canvas>');
		drawCanvas.addClass("GuestBookRenderer_canvas");
		drawCanvasDiv.append(drawCanvas);

		$(domElem).append(wrapperDiv);

		var width = drawCanvasDiv.width();
		var height = drawCanvasDiv.height();

		drawCanvas.attr("width",  width + "px");
		drawCanvas.attr("height", height + "px");
	}

	/**
	 * Render "NewDrawContent" command in specified DOM Element.
	 *
	 * @method _updateCanvasContent
	 * @private
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {any} drawContent - The new drawContent to display.
	 */
	private _updateCanvasContent(domElem : any, drawContent : any) {
		var img = new Image();
		img.onload = loadDrawContent;
		img.src = drawContent;
		function loadDrawContent() {
			var drawCanvas = $(domElem).find(".GuestBookRenderer_canvas").first();
			var ctx = drawCanvas[0].getContext('2d');
			ctx.clearRect(0, 0, drawCanvas[0].width, drawCanvas[0].height);

			var imgWidth = img.width;
			var imgHeight = img.height;

			var left = (drawCanvas[0].width - imgWidth) / 2;
			var top = (drawCanvas[0].height - imgHeight) / 2;

			ctx.drawImage(img, left, top);
			//ctx.drawImage(img, 0, 0);
			//ctx.drawImage(img, 0, 0, drawCanvas[0].width, drawCanvas[0].height);
		}
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
		this.render(info, domElem, endCallback);
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