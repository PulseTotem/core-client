/**
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/CmdList.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var Webcam: any; // use of WebcamJS

class PhotoboxRenderer implements Renderer<Cmd> {

	private webcam_settings = {
		image_format: 'jpeg',
		jpeg_quality: 90,
		force_flash: false,
		fps: 45,
		dest_width: 1280,
		dest_height: 720
	};

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
			this.waitMessage(domElem, info.getArgs()[0], info.getArgs()[1]);
		} else	if (info.getCmd() == "startSession") {
			this.startSession(domElem);
		} else if (info.getCmd() == "counter") {
			if (info.getArgs().length != 2) {
				this.startSession(domElem);
			}
			var counterTime = parseInt(info.getArgs()[0]);
			var servicePostPic = info.getArgs()[1];
			this.countAndSnap(domElem, counterTime, servicePostPic);
		} else if (info.getCmd() == "validatedPicture") {
			if (Webcam.container) {
				Webcam.reset();
			}
		}

		endCallback();
	}

	private waitMessage(domElem : any, qrCodeUrl : string, lastPicUrl : string) {
		var divText = $('<div>');
		divText.addClass("photobox_mainDiv");
		var title = $('<h4>');
		title.addClass("photobox_titleWait");
		title.text("Prenez-vous en photo !");
		divText.append(title);

		if (lastPicUrl) {
			var lastPic = $('<img src="'+lastPicUrl+'" />');
			lastPic.addClass("photobox_lastpic");
			divText.append(lastPic);
		}

		var content = $('<span>');
		content.addClass("photobox_contentWait");
		content.text("Flashez le QRCode et laissez vous guider : ");
		divText.append(content);

		var qrCode = $('<img src="'+qrCodeUrl+'" />');
		qrCode.addClass("photobox_qrcode");
		divText.append(qrCode);

		domElem.append(divText);
	}

	private preventFallback() {
		var self = this;
		var firstError = true;
		Webcam.on('error', function (err) {
			if (firstError) {
				self.webcam_settings.dest_width = 640;
				self.webcam_settings.dest_height = 360;

				Webcam.set(self.webcam_settings);
				Webcam.attach("#webCamview");
				firstError = false;
			} else {
				alert(err);
			}
		});
	}

	private startSession(domElem : any) {
		var divCam = $('<div>');
		divCam.attr("id","webCamview");
		divCam.addClass("photobox_divcam");

		domElem.append(divCam);
		this.preventFallback();

		Webcam.set(this.webcam_settings);

		Webcam.attach("#webCamview");
	}

	private countAndSnap(domElem : any, counterTime : number, servicePostPic : string) {
		var counter = counterTime;

		var html = $('<div>');
		html.addClass("photobox_divcam");

		var divCam = $('<div>');
		divCam.attr("id","webCamview");
		divCam.addClass("photobox_divcam");

		html.append(divCam);

		var divCounter = $('<div>');
		divCounter.addClass("photobox_divcounter");
		divCounter.text(counter+" ...");

		html.append(divCounter);

		domElem.append(html);

		this.preventFallback();

		Webcam.set(this.webcam_settings);

		Webcam.attach("#webCamview");

		var self = this;
		var managePicture = function(data_uri) {

			Webcam.on( 'uploadProgress', function(progress) {
				divCounter.text("L'image est en cours de traitement, veuillez patienter...");
				divCounter.show();
			} );

			Webcam.on( 'uploadComplete', function(code, text) {
				if (code == 200) {
					if (Webcam.container) {
						Webcam.reset();
					}
					divCam.html('<img src="'+data_uri+'" class="photobox_webcamImage" />');
					divCounter.text("L'image a été traitée avec succès ! Merci de valider la photo pour continuer.");
				} else {
					divCounter.text("Une erreur a eu lieu durant le traitement de l'image. Nous vous invitons à recommencer votre photo.");

					var retry = function () {
						if (Webcam.container) {
							Webcam.reset();
						}
					};
					setTimeout(retry, 3000);
				}
			} );

			Webcam.upload(data_uri, servicePostPic);

		};

		var timeoutFunction = function () {
			if (counter == 0) {
				divCounter.hide();
				Webcam.snap(managePicture);
			} else {
				counter--;
				divCounter.text(counter+" ...");
				setTimeout(timeoutFunction, 1000);
			}
		};

		setTimeout(timeoutFunction, 1000);
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
		if (Webcam.container) {
			Webcam.reset();
		}
		$(domElem).empty();
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