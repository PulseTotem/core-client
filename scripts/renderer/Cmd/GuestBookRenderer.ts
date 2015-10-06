/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../core/Logger.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/CmdList.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery

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

		if (info.getCmd() == "Wait") {
			$(domElem).empty();
			var socketId = info.getArgs()[0];

			Logger.debug(socketId);
		}

		endCallback();
	}

	private waitMessage(domElem : any, qrCodeUrl : string, appliURL : string, lastPicUrl : string) {
		var wrapperDiv = $('<div>');
		wrapperDiv.addClass("PhotoboxRenderer_wrapper");

		var contentDiv = $('<div>');
		contentDiv.addClass("PhotoboxRenderer_content");
		wrapperDiv.append(contentDiv);

		var leftPanelDiv = $('<div>');
		leftPanelDiv.addClass("PhotoboxRenderer_leftpanel");
		leftPanelDiv.addClass("pull-left");
		contentDiv.append(leftPanelDiv);

		var leftTitleDiv = $('<div>');
		leftTitleDiv.addClass("PhotoboxRenderer_leftpanel_title");
		var leftTitleSpan = $('<span>');
		leftTitleSpan.html("Envie d'un selfie ?");
		leftTitleDiv.append(leftTitleSpan);
		leftPanelDiv.append(leftTitleDiv);

		var lastPicDiv = $('<div>');
		lastPicDiv.addClass("PhotoboxRenderer_leftpanel_lastpic");
		leftPanelDiv.append(lastPicDiv);

		var helperImg = $('<span>');
		helperImg.addClass("PhotoboxRenderer_helper");
		lastPicDiv.append(helperImg);

		var lastPicImg = $('<img>');
		lastPicImg.addClass("PhotoboxRenderer_leftpanel_lastpic_img");
		if (lastPicUrl) {
			lastPicImg.attr('src', lastPicUrl);
		} else {
			lastPicImg.attr('src', "http://cdn.the6thscreen.fr/selfie/selfie_default.png");
		}
		lastPicDiv.append(lastPicImg);

		var rightPanelDiv = $('<div>');
		rightPanelDiv.addClass("PhotoboxRenderer_rightpanel");
		rightPanelDiv.addClass("pull-left");
		contentDiv.append(rightPanelDiv);

		var rightTitleDiv = $('<div>');
		rightTitleDiv.addClass("PhotoboxRenderer_rightpanel_title");
		var rightTitleSpan = $('<span>');
		rightTitleSpan.html("Flashez le QR Code !");
		rightTitleDiv.append(rightTitleSpan);
		rightPanelDiv.append(rightTitleDiv);

		var qrCodeDiv = $('<div>');
		qrCodeDiv.addClass("PhotoboxRenderer_rightpanel_qrcode");
		rightPanelDiv.append(qrCodeDiv);

		var qrCodeImg = $('<img>');
		qrCodeImg.addClass("PhotoboxRenderer_rightpanel_qrcode_img");
		qrCodeImg.attr('src', qrCodeUrl);
		qrCodeDiv.append(qrCodeImg);

		var urlDiv = $('<div>');
		urlDiv.addClass("PhotoboxRenderer_rightpanel_url");
		var urlSpan = $('<span>');
		urlSpan.html(appliURL);
		urlDiv.append(urlSpan);
		rightPanelDiv.append(urlDiv);

		$(domElem).append(wrapperDiv);

		leftTitleDiv.textfill({
			maxFontPixels: 500
		});

		rightTitleDiv.textfill({
			maxFontPixels: 500
		});

		urlDiv.textfill({
			maxFontPixels: 500
		});
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