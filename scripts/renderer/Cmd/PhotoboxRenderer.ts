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
	 * Last photo.
	 *
	 * @property _lastPhoto
	 * @type string
	 */
	private _lastPhoto : String;

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
			$(domElem).empty();
			var qrCodeUrl = info.getArgs()[0];
			var appliURL = info.getArgs()[1];
			var lastPic = info.getArgs()[2];

			//this.waitMessage(domElem, qrCodeUrl, appliURL, lastPic);
		} else	if (info.getCmd() == "startSession") {
			$(domElem).empty();
			this.startSession(domElem);
		} else if (info.getCmd() == "counter") {
			$(domElem).empty();
			if (info.getArgs().length != 2) {
				this.startSession(domElem);
			}
			var counterTime = parseInt(info.getArgs()[0]);
			var servicePostPic = info.getArgs()[1];
			this.countAndSnap(domElem, counterTime, servicePostPic);
		} else if (info.getCmd() == "validatedPicture") {
			$(domElem).empty();
			if (Webcam.container) {
				Webcam.reset();
			}
			this.resetZone(domElem);
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

		var divResultPhoto = $('<div>');
		divResultPhoto.addClass('PhotoboxRenderer_result_photo');
		divResultPhoto.hide();

		html.append(divResultPhoto);

		var divShutter = $('<div>');
		divShutter.addClass("PhotoboxRenderer_shutter");

		var topLeftShutter = $('<div>');
		topLeftShutter.addClass("PhotoboxRenderer_shutter_top_left");
		divShutter.append(topLeftShutter);

		var topRightShutter = $('<div>');
		topRightShutter.addClass("PhotoboxRenderer_shutter_top_right");
		divShutter.append(topRightShutter);

		var bottomLeftShutter = $('<div>');
		bottomLeftShutter.addClass("PhotoboxRenderer_shutter_bottom_left");
		divShutter.append(bottomLeftShutter);

		var bottomRightShutter = $('<div>');
		bottomRightShutter.addClass("PhotoboxRenderer_shutter_bottom_right");
		divShutter.append(bottomRightShutter);

		html.append(divShutter);

		var divCounter = $('<div>');
		divCounter.addClass("PhotoboxRenderer_counter");
		var spanCounter = $('<span>');
		spanCounter.html(counter);
		divCounter.append(spanCounter);

		html.append(divCounter);
		var audio = $('<audio src="http://www.soundjay.com/mechanical/camera-shutter-click-08.mp3">');
		html.append(audio);

		domElem.append(html);

		divCounter.textfill({
			maxFontPixels: 500
		});

		this.preventFallback();

		Webcam.set(this.webcam_settings);

		Webcam.attach("#webCamview");

		var self = this;
		var managePicture = function(data_uri) {
			Webcam.freeze();

			self._lastPhoto = data_uri;

			var divResultPhotoImg = $('<img>');
			divResultPhotoImg.addClass("PhotoboxRenderer_result_photo_img");
			divResultPhotoImg.attr('src', data_uri);

			divResultPhoto.append(divResultPhotoImg);
			divResultPhoto.show();

			topLeftShutter.transition({
				'top': '-100%',
				'left': '-100%',
				'easing': 'in-out',
				'duration': 1000
			});

			topRightShutter.transition({
				'top': '-100%',
				'right': '-100%',
				'easing': 'in-out',
				'duration': 1000
			});

			bottomLeftShutter.transition({
				'bottom': '-100%',
				'left': '-100%',
				'easing': 'in-out',
				'duration': 1000
			});

			bottomRightShutter.transition({
				'bottom': '-100%',
				'right': '-100%',
				'easing': 'in-out',
				'duration': 1000
			});

			divCounter.empty();

			var progressTextDiv = $('<div>');
			var progressTextSpan = $('<span>');
			progressTextSpan.html("Traitement en cours...");
			progressTextDiv.append(progressTextSpan);

			divCounter.append(progressTextDiv);

			var progressDiv = $('<div>');
			progressDiv.addClass("progress");

			var progressBar = $('<div>');
			progressBar.addClass("progress-bar");
			progressBar.addClass("progress-bar-info");
			progressBar.addClass("progress-bar-striped");
			progressBar.css('width', '0%');
			progressDiv.append(progressBar);

			divCounter.append(progressDiv);

			progressTextDiv.textfill({
				maxFontPixels: 500
			});

			divCounter.show();

			Webcam.on( 'uploadProgress', function(progress) {

				var progressPercent = Math.round(progress*100);

				progressBar.css('width', progressPercent + '%');
			});

			Webcam.on( 'uploadComplete', function(code, text) {
				divCounter.empty();
				if (code == 200) {
					if (Webcam.container) {
						Webcam.reset();
					}

					var spanCounter = $('<span>');
					spanCounter.html("L'image a été traitée avec succès ! Merci de valider la photo sur votre téléphone pour continuer.");
					divCounter.append(spanCounter);
					divCounter.textfill({
						maxFontPixels: 500
					});
				} else {
					var spanCounter = $('<span>');
					spanCounter.html("Une erreur a eu lieu durant le traitement de l'image. Nous vous invitons à recommencer votre photo.");
					divCounter.append(spanCounter);
					divCounter.textfill({
						maxFontPixels: 500
					});

					var retry = function () {
						if (Webcam.container) {
							Webcam.reset();
						}
					};
					setTimeout(retry, 3000);
				}
			});

			Webcam.upload(data_uri, servicePostPic);
		};

		var timeoutFunction = function () {
			counter--;
			if (counter == 0) {
				divCounter.hide();
				audio[0].play();
				topLeftShutter.transition({
					'top': '0',
					'left': '0',
					'easing': 'in-out',
					'duration': 1000
				});

				topRightShutter.transition({
					'top': '0',
					'right': '0',
					'easing': 'in-out',
					'duration': 1000
				});

				bottomLeftShutter.transition({
					'bottom': '0',
					'left': '0',
					'easing': 'in-out',
					'duration': 1000
				});

				bottomRightShutter.transition({
					'bottom': '0',
					'right': '0',
					'easing': 'in-out',
					'duration': 1000
				}, function() {
					Webcam.snap(managePicture);
				});
			} else {
				spanCounter.html(counter);
				divCounter.textfill({
					maxFontPixels: 500
				});
				setTimeout(timeoutFunction, 1000);
			}
		};

		setTimeout(timeoutFunction, 1000);
	}

	private resetZone(domElem : any) {
		var divResultPhoto = $('<div>');
		divResultPhoto.addClass('PhotoboxRenderer_result_photo');

		var divResultPhotoImg = $('<img>');
		divResultPhotoImg.addClass("PhotoboxRenderer_result_photo_img");
		divResultPhotoImg.attr('src', this._lastPhoto);

		divResultPhoto.append(divResultPhotoImg);

		$(domElem).append(divResultPhoto);

		var divMessage = $('<div>');
		divMessage.addClass("PhotoboxRenderer_messageFin");

		var divMessageContent = $('<div>');
		divMessageContent.addClass("PhotoboxRenderer_messageFin_content");

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
	 * @param {Function} endCallback - Callback function called at the end of updateRender method.
	 */
	updateRender(info : Cmd, domElem : any, endCallback : Function) {

		/** On Going **/ //		if (info.getCmd() != "validatedPicture") {

			if (Webcam.container) {
				Webcam.reset();
			}

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