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
		dest_height: 720,
		width: 0,
		height: 0
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
				/** On Going **/ //				cmd.setDurationToDisplay(61000);
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

			var qrCodeUrl = info.getArgs()[0];
			var appliURL = info.getArgs()[1];
			var lastPic = info.getArgs()[2];

			this.waitMessage(domElem, qrCodeUrl, appliURL, lastPic);
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

	private waitMessage(domElem : any, qrCodeUrl : string, appliURL : string, lastPicUrl : string) {
		var wrapperDiv = $('<div>');
		wrapperDiv.addClass("PhotoboxRenderer_wrapper");

		var mainTitleDiv = $('<div>');
		mainTitleDiv.addClass("PhotoboxRenderer_maintitle");
		var mainTitleSpan = $('<span>');
		mainTitleSpan.html("Prenez-vous en photo !");
		mainTitleDiv.append(mainTitleSpan);
		wrapperDiv.append(mainTitleDiv);

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
		rightTitleSpan.html("Flashez le QRCode !");
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

		mainTitleDiv.textfill({
			maxFontPixels: 500
		});

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
		var audio = $('<audio src="http://www.soundjay.com/mechanical/camera-shutter-click-08.mp3">');
		html.append(audio);

		/** On Going **/ //		var divShutter = $('<div>');
		/** On Going **/ //		divShutter.addClass("PhotoboxRenderer_shutter");
		/** On Going **/ //		var divShutterContainer = $('<div>');
		/** On Going **/ //		divShutterContainer.addClass("PhotoboxRenderer_shutter_container");
		/** On Going **/ //		divShutter.append(divShutterContainer);
		/** On Going **/ //
		/** On Going **/ //		html.append(divShutter);


		domElem.append(html);

		this.preventFallback();

		Webcam.set(this.webcam_settings);

		Webcam.attach("#webCamview");


		/** On Going **/ //		divShutterContainer.tzShutter({
		/** On Going **/ //			imgSrc: 'http://cdn.the6thscreen.fr/jquery.shutter/shutter.png',
		/** On Going **/ //			closeCallback: function(){
		/** On Going **/ //
		/** On Going **/ //				/*setTimeout(function(){
		/** On Going **/ //					divShutterContainer.trigger('shutterOpen')
		/** On Going **/ //				},100);*/
		/** On Going **/ //			},
		/** On Going **/ //			loadCompleteCallback:function(){
		/** On Going **/ //
		/** On Going **/ //			}
		/** On Going **/ //		});

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

				/** On Going **/ //				divShutterContainer.trigger('shutterClose');

				Webcam.freeze();

				audio[0].play();

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

		/** On Going **/ //		if (info.getCmd() != "validatedPicture") {

			if (Webcam.container) {
				Webcam.reset();
			}
			$(domElem).empty();
			this.render(info, domElem, endCallback);
		/** On Going **/ //		}
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