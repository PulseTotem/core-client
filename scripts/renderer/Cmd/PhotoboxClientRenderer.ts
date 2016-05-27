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

    private static DEFAULT_INIT_MSG = "Appuyez sur le bouton et prenez la pose !";
    private static DEFAULT_COUNTER_MSG = "La photo sera prise dans... ";
    private static DEFAULT_PROCESS_MSG = "Veuillez patienter pendant l'envoie de l'image...";
    private static DEFAULT_END_MSG = "Merci pour votre participation !";

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

    private _lastPhoto : string;

    private _isWaiting : boolean;
    private _isInitalized : boolean;

    private _initMsg : string;
    private _counterMsg : string;
    private _processMsg : string;
    private _endMsg : string;

    constructor() {
        this._isWaiting = false;
        this._isInitalized = false;
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

        if (info.getCmd() == "WaitOneClick" && info.getArgs().length > 0) {
            $(domElem).empty();
            this.initListener(info.getCallChannel(), info.getId(), info.getArgs()[1]);
            this.startSession(domElem);
        } else if(info.getCmd() == "counter" && info.getArgs().length > 0) {
            $(domElem).empty();
            var counterTime:number = parseInt(info.getArgs()[0]);
            this._isWaiting = false;
            this.countAndSnap(domElem, counterTime, info.getCallChannel(), info.getId());
        } else if (info.getCmd() == "removeInfo") {
            $(domElem).empty();
            if (Webcam.container) {
                Webcam.reset();
            }
            this.resetZone(domElem);
            this._isWaiting = true;
        } else {
            $(domElem).empty();
            console.error("PhotoboxClientRenderer - Wrong command ! cmd : "+info.getCmd());
            if (Webcam.container) {
                Webcam.reset();
            }
            this._isWaiting = true;
        }

        endCallback();
    }

    private initListener(callChannel : string, infoId : string, messages : string) {
        var self = this;

        if (!this._isInitalized) {
            var snap = function () {
                console.debug("Emit snap !");
                if (self._isWaiting) {
                    MessageBus.publishToCall(callChannel, "Snap", {});
                }
            };
            MessageBus.subscribe(MessageBusChannel.USERTRIGGER, function(channel : any, data : any) {
                if(typeof(data.action) != "undefined" && data.action == MessageBusAction.TRIGGER) {
                    snap();
                }
            });

            if (messages) {
                // TODO
            } else {
                this._initMsg = PhotoboxClientRenderer.DEFAULT_INIT_MSG;
                this._counterMsg = PhotoboxClientRenderer.DEFAULT_COUNTER_MSG;
                this._processMsg = PhotoboxClientRenderer.DEFAULT_PROCESS_MSG;
                this._endMsg = PhotoboxClientRenderer.DEFAULT_END_MSG;
            }


            this._isInitalized = true;
        }

        //MessageBus.publishToCall(callChannel, "DestroyInitInfo", {"infoId":infoId});
        this._isWaiting = true;
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

        var divWrapper = $('<div>');
        divWrapper.addClass("PhotoboxClientRenderer_wrapper");

        var divHeader = $('<div>');
        divHeader.addClass("PhotoboxClientRenderer_header");

        var headerTextSpan = $('<span>');
        headerTextSpan.html(this._initMsg);
        headerTextSpan.addClass("PhotoboxClientRenderer_header_span");
        headerTextSpan.append(headerTextSpan);

        divHeader.append(headerTextSpan);
        divWrapper.append(divHeader);

        var divCam = $('<div>');
        divCam.attr("id","webCamview");
        divCam.addClass("PhotoboxClientRenderer_WebcamView");

        divWrapper.append(divCam);

        domElem.append(divWrapper);

        headerTextSpan.textfill({
            maxFontPixels: 500
        });

        this.preventFallback();

        Webcam.set(this.webcam_settings);

        Webcam.attach("#webCamview");
    }

    private countAndSnap(domElem : any, counterTime : number, callChannel : string, infoid : string) {
        var counter = counterTime;

        var divWrapper = $('<div>');
        divWrapper.addClass("PhotoboxClientRenderer_wrapper");

        var divHeader = $('<div>');
        divHeader.addClass("PhotoboxClientRenderer_header");

        var headerTextSpan = $('<span>');
        headerTextSpan.html(this._counterMsg);
        headerTextSpan.addClass("PhotoboxClientRenderer_header_span");
        headerTextSpan.append(headerTextSpan);

        divHeader.append(headerTextSpan);
        divWrapper.append(divHeader);

        var divCam = $('<div>');
        divCam.attr("id","webCamview");
        divCam.addClass("PhotoboxClientRenderer_WebcamView");

        divWrapper.append(divCam);

        var divShutter = $('<div>');
        divShutter.addClass("PhotoboxClientRenderer_shutter");

        var topLeftShutter = $('<div>');
        topLeftShutter.addClass("PhotoboxClientRenderer_shutter_top_left");
        divShutter.append(topLeftShutter);

        var topRightShutter = $('<div>');
        topRightShutter.addClass("PhotoboxClientRenderer_shutter_top_right");
        divShutter.append(topRightShutter);

        var bottomLeftShutter = $('<div>');
        bottomLeftShutter.addClass("PhotoboxClientRenderer_shutter_bottom_left");
        divShutter.append(bottomLeftShutter);

        var bottomRightShutter = $('<div>');
        bottomRightShutter.addClass("PhotoboxClientRenderer_shutter_bottom_right");
        divShutter.append(bottomRightShutter);

        divWrapper.append(divShutter);

        var audio = $('<audio src="http://cdn.the6thscreen.fr/static/sound/camera-shutter-click-08.mp3">');
        divWrapper.append(audio);

        domElem.append(divWrapper);

        headerTextSpan.textfill({
            maxFontPixels: 500
        });

        this.preventFallback();

        Webcam.set(this.webcam_settings);

        Webcam.attach("#webCamview");

        var self = this;
        var managePicture = function(data_uri) {
            Webcam.freeze();

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

            headerTextSpan.html(self._processMsg);

            headerTextSpan.textfill({
                maxFontPixels: 500
            });

            MessageBus.publishToCall(callChannel, "PostAndValidate", {"image": data_uri, "id": infoid});
            MessageBus.publishToCall(MessageBusChannel.RENDERER, MessageBusChannel.REFRESH);
        };

        var timeoutFunction = function () {
            counter--;
            if (counter == 0) {
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
                setTimeout(timeoutFunction, 1000);
            }
        };

        setTimeout(timeoutFunction, 1000);
    }

    private resetZone(domElem : any) {
        var divResultPhoto = $('<div>');
        divResultPhoto.addClass('PhotoboxClientRenderer_result_photo');

        var divResultPhotoImg = $('<img>');
        divResultPhotoImg.addClass("PhotoboxClientRenderer_result_photo_img");
        divResultPhotoImg.attr('src', this._lastPhoto);

        divResultPhoto.append(divResultPhotoImg);

        $(domElem).append(divResultPhoto);

        var divMessage = $('<div>');
        divMessage.addClass("PhotoboxClientRenderer_messageFin");

        var divMessageContent = $('<div>');
        divMessageContent.addClass("PhotoboxClientRenderer_messageFin_content");

        var messageSpan = $('<span>');
        messageSpan.html("Find your pictures on Twitter with the following hashtag: #IWANTMYAPP");
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