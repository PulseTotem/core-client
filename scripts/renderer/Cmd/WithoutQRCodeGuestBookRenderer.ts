/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../core/Logger.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/CmdList.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var QRCode: any; // Use of QRCode.js

class WithoutQRCodeGuestBookRenderer implements Renderer<Cmd> {

	/**
	 * Renderer's status.
	 *
	 * @property _status
	 * @type string
	 */
	private _status : string;

	/**
	 * Renderer's lastBackgroundURL.
	 *
	 * @property lastBackgroundURL
	 * @type string
	 */
	private lastBackgroundURL : string;


	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		this._status = null;
	}

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
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : Cmd, domElem : any, rendererTheme : string, endCallback : Function) {
		var self = this;

		switch(info.getCmd()) {
			case "Wait" :
				$(domElem).empty();
				self.lastBackgroundURL = info.getArgs()[2];

				self._renderWait(domElem, self.lastBackgroundURL);
				break;
			case "StartSession" :
				$(domElem).empty();

				self.lastBackgroundURL = info.getArgs()[2];

				self._renderStartSession(domElem, self.lastBackgroundURL);
				break;
			case "NewDrawContent" :
				if($(domElem).find(".WithoutQRCodeGuestBookRenderer_canvas").length <= 0) {
					self._renderStartSession(domElem, self.lastBackgroundURL);
				}

				var drawContent = info.getArgs()[2];

				self._updateCanvasContent(domElem, drawContent);
				break;
			case "FinishSession" :
				self._renderFinishSession(domElem);
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
	private _renderWait(domElem : any, backgroundURL : string) {
		var wrapperDiv = $('<div>');
		wrapperDiv.addClass("WithoutQRCodeGuestBookRenderer_wrapper");
		wrapperDiv.css("background-image","url("+backgroundURL+")");

		var messageDiv = $('<div>');
		messageDiv.addClass("WithoutQRCodeGuestBookRenderer_message");
		var messageSpan = $('<span>');
		messageSpan.html("Prenez le contrôle de la tablette et laissez nous un message dans notre livre d'or interactif !");
		messageDiv.append(messageSpan);
		wrapperDiv.append(messageDiv);

		$(domElem).append(wrapperDiv);

		messageDiv.textfill({
			maxFontPixels: 500,
			success: function() {
				var messageSpan = messageDiv.find("span").first();
				var fontSize = messageSpan.css("font-size");
				var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
				var newFontSize = fontSizeInt - 4;
				messageSpan.css("font-size", newFontSize.toString() + "px");
			}
		});
	}

	/**
	 * Render "StartSession" command in specified DOM Element.
	 *
	 * @method _renderStartSession
	 * @private
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 */
	private _renderStartSession(domElem : any, backgroundURL : string) {
		var wrapperDiv = $('<div>');
		wrapperDiv.addClass("WithoutQRCodeGuestBookRenderer_wrapper");
		wrapperDiv.css("background-image","url("+backgroundURL+")");

		var drawCanvasDiv = $('<div>');
		drawCanvasDiv.addClass("WithoutQRCodeGuestBookRenderer_canvas_container");
		wrapperDiv.append(drawCanvasDiv);

		var drawCanvas = $('<canvas>');
		drawCanvas.addClass("WithoutQRCodeGuestBookRenderer_canvas");
		drawCanvas.css("background-image","url("+backgroundURL+")");
		drawCanvasDiv.append(drawCanvas);

		var explanationsColorsDiv = $('<div>');
		explanationsColorsDiv.addClass("WithoutQRCodeGuestBookRenderer_explanations_colors");
		var explanationsColorsSpan = $('<span>');
		explanationsColorsDiv.append(explanationsColorsSpan);
		wrapperDiv.append(explanationsColorsDiv);

		var explanationsColors = 'Utilisez <img src="https://cms.pulsetotem.fr/images/8c2aed50-767a-11e6-9f98-e9977d1c5052/raw" /> pour effacer ou changer les couleurs.';

		explanationsColorsSpan.html(explanationsColors);

		var explanationsSaveDiv = $('<div>');
		explanationsSaveDiv.addClass("WithoutQRCodeGuestBookRenderer_explanations_save");
		var explanationsSaveSpan = $('<span>');
		explanationsSaveDiv.append(explanationsSaveSpan);
		wrapperDiv.append(explanationsSaveDiv);

		var explanationsSave = 'Utilisez <img src="https://cms.pulsetotem.fr/images/8c2b1460-767a-11e6-9f98-e9977d1c5052/raw" /> pour enregistrer votre message !';

		explanationsSaveSpan.html(explanationsSave);

		$(domElem).append(wrapperDiv);

		explanationsColorsDiv.textfill({
			maxFontPixels: 500,
			success: function() {
				var explanationsColorsSpan = explanationsColorsDiv.find("span").first();
				var fontSize = explanationsColorsSpan.css("font-size");
				var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
				var newFontSize = fontSizeInt - 4;
				explanationsColorsSpan.css("font-size", newFontSize.toString() + "px");
			}
		});

		explanationsSaveDiv.textfill({
			maxFontPixels: 500,
			success: function() {
				var explanationsSaveSpan = explanationsSaveDiv.find("span").first();
				var fontSize = explanationsSaveSpan.css("font-size");
				var fontSizeInt = parseInt(fontSize.substring(0, fontSize.length-2));
				var newFontSize = fontSizeInt - 4;
				explanationsSaveSpan.css("font-size", newFontSize.toString() + "px");
			}
		});


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
			var drawCanvas = $(domElem).find(".WithoutQRCodeGuestBookRenderer_canvas").first();
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
	 * Render "FinishSession" command in specified DOM Element.
	 *
	 * @method _renderFinishSession
	 * @private
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 */
	private _renderFinishSession(domElem : any) {
		var divMessage = $('<div>');
		divMessage.addClass("WithoutQRCodeGuestBookRenderer_messageFin");

		var divMessageContent = $('<div>');
		divMessageContent.addClass("WithoutQRCodeGuestBookRenderer_messageFin_content");

		var messageSpan = $('<span>');
		messageSpan.html("Merci pour votre participation !");
		divMessageContent.append(messageSpan);
		divMessage.append(divMessageContent);
		$(domElem).append(divMessage);

		divMessage.textfill({
			maxFontPixels: 500
		});
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
	updateRender(info : Cmd, domElem : any, rendererTheme : string, endCallback : Function) {
		this.render(info, domElem, rendererTheme, endCallback);
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
	animate(info : Cmd, domElem : any, rendererTheme : string, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}