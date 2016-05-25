/**
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/CmdList.ts" />
/// <reference path="../Renderer.ts" />

/// <reference path="../../core/MessageBus.ts" />
/// <reference path="../../core/MessageBusChannel.ts" />
/// <reference path="../../core/MessageBusAction.ts" />

declare var $: any; // Use of JQuery
declare var Webcam: any; // use of WebcamJS
declare var io: any; // Use of Socket.IO lib

class PhotoboxClientRenderer implements Renderer<Cmd> {

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

    private _websockets = {};

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
     * @param {string} rendererTheme - The Renderer's theme.
     * @param {Function} endCallback - Callback function called at the end of render method.
     */
    render(info : Cmd, domElem : any, rendererTheme : string, endCallback : Function) {

        if (info.getCmd() == "Wait") {
            $(domElem).empty();
            var socketId = info.getArgs()[0];
            var baseAppliUrl = info.getArgs()[1];
            var lastPic = info.getArgs()[2];

            this.waitMessage(domElem, socketId, baseAppliUrl, lastPic);

        } else	if (info.getCmd() == "startSession") {
            $(domElem).empty();
            this.startSession(domElem);

        } else if (info.getCmd() == "counter") {
            $(domElem).empty();
            if (info.getArgs().length != 1) {
                this.startSession(domElem);
            }
            var counterTime = parseInt(info.getArgs()[0]);

            this.countAndSnap(domElem, counterTime, info.getCallChannel());

        } else if (info.getCmd() == "postedPicture") {

            this.postedPicture(domElem);

        } else if (info.getCmd() == "validatedPicture") {
            $(domElem).empty();
            if (Webcam.container) {
                Webcam.reset();
            }
            this.resetZone(domElem);

        } else if (info.getCmd() == "removeInfo") {
            $(domElem).empty();
            if (Webcam.container) {
                Webcam.reset();
            }
            this.resetZone(domElem);
        }

        endCallback();
    }

    private waitMessage(domElem : any, socketId : string, baseAppliUrl : string, lastPicUrl : string) {
        var self = this;
        var initWebsocket = function () {
            self.connectToClientSocket(socketId, baseAppliUrl);
        };

		MessageBus.subscribe(MessageBusChannel.USERTRIGGER, function(channel : any, data : any) {
			if(typeof(data.action) != "undefined" && data.action == MessageBusAction.TRIGGER) {
				initWebsocket();
			}
		});
    }

    private listen(socketId : string) {
        var self = this;

        this._websockets[socketId].on("LockedControl", function () {
            self._websockets[socketId].emit("StartCounter");
        });

        this._websockets[socketId].on("DisplayPicture", function () {
            self._websockets[socketId].emit("ValidatePicture");
        });

        this._websockets[socketId].on("SessionEndedWithValidation", function () {
            self._websockets[socketId].disconnect();
            delete self._websockets[socketId];
        });
    }

    private connectToClientSocket(socketId : string, appliUrl : string) {
        var self = this;

        this._websockets[socketId] = io(appliUrl,
            {"reconnection" : true, 'reconnectionAttempts' : 10, "reconnectionDelay" : 1000, "reconnectionDelayMax" : 5000, "timeout" : 5000, "autoConnect" : true, "multiplex": false});

        this.listen(socketId);

        this._websockets[socketId].on("connect", function() {
            console.log("Connected ! ");
            console.log("Emit on : "+self._websockets[socketId]);
            self._websockets[socketId].emit("TakeControl", {'callSocketId': socketId});
        });

        this._websockets[socketId].on("error", function(errorData) {
            Logger.error("An error occurred during connection to Backend.");
        });

        this._websockets[socketId].on("disconnect", function() {
            Logger.info("Disconnected to Backend.");
        });

        this._websockets[socketId].on("reconnect", function(attemptNumber) {
            Logger.info("Connected to Backend after " + attemptNumber + " attempts.");
        });

        this._websockets[socketId].on("reconnect_attempt", function() {
            Logger.info("Trying to reconnect to Backend.");
        });

        this._websockets[socketId].on("reconnecting", function(attemptNumber) {
            Logger.info("Trying to connect to Backend - Attempt number " + attemptNumber + ".");
        });

        this._websockets[socketId].on("reconnect_error", function(errorData) {
            Logger.error("An error occurred during reconnection to Backend.");
        });

        this._websockets[socketId].on("reconnect_failed", function() {
            Logger.error("Failed to connect to Backend. New attempt will be done in 5 seconds. Administrators received an Alert !");
            //TODO: Send an email and Notification to Admins !

            setTimeout(function() {
                self._websockets[socketId] = null;
                self.connectToClientSocket(socketId, appliUrl);
            }, 5000);
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

    private countAndSnap(domElem : any, counterTime : number, callChannel : string) {

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

        var audio = $('<audio src="http://cdn.the6thscreen.fr/static/sound/camera-shutter-click-08.mp3">');
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

            divCounter.append(progressDiv);

            progressTextDiv.textfill({
                maxFontPixels: 500
            });

            divCounter.show();

            MessageBus.publishToCall(callChannel, "PostPicture", data_uri);
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

    private postedPicture(domElem : any) {
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
     * @param {string} rendererTheme - The Renderer's theme.
     * @param {Function} endCallback - Callback function called at the end of updateRender method.
     */
    updateRender(info : Cmd, domElem : any, rendererTheme : string, endCallback : Function) {

        /** On Going **/ //		if (info.getCmd() != "validatedPicture") {

        if (Webcam.container) {
            Webcam.reset();
        }

        this.render(info, domElem, rendererTheme, endCallback);
        /** On Going **/ //		}
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