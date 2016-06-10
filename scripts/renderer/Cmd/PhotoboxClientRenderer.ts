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
declare var ProgressBar : any;

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
	private _medaillonPicture : string;

    constructor() {
        this._isWaiting = false;
        this._isInitalized = false;

		this._medaillonPicture = "https://cms.pulsetotem.fr/images/d27d44f0-224d-11e6-83f6-33e3ba783274/raw?size=small";
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
            this.countAndSnap(domElem, counterTime, info.getCallChannel(), info.getId());
        } else if (info.getCmd() == "removeInfo") {
            var data = {
                action : MessageBusAction.REFRESH
            };
            MessageBus.publish(MessageBusChannel.RENDERER, data);
            $(domElem).empty();
            if (Webcam.container) {
                Webcam.reset();
            }
            this.displayEndMessage(domElem);
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
                //console.debug("Emit snap !");
                if (self._isWaiting) {
                    MessageBus.publishToCall(callChannel, "Snap", {});
                    self._isWaiting = false;
                }
            };
            MessageBus.subscribe(MessageBusChannel.USERTRIGGER, function(channel : any, data : any) {
                if(typeof(data.action) != "undefined" && data.action == MessageBusAction.TRIGGER) {
                    snap();
                }
            });

            if (messages) {
                var separator = "||";
                var allMessages = messages.split(separator);

                if (allMessages[0]) {
                    this._initMsg = allMessages[0];
                } else {
                    this._initMsg = PhotoboxClientRenderer.DEFAULT_INIT_MSG;
                }

                if (allMessages[1]) {
                    this._counterMsg = allMessages[1];
                } else {
                    this._counterMsg = PhotoboxClientRenderer.DEFAULT_COUNTER_MSG;
                }

                if (allMessages[2]) {
                    this._processMsg = allMessages[2];
                } else {
                    this._processMsg = PhotoboxClientRenderer.DEFAULT_PROCESS_MSG;
                }

                if (allMessages[3]) {
                    this._endMsg = allMessages[3];
                } else {
                    this._endMsg = PhotoboxClientRenderer.DEFAULT_END_MSG;
                }
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
        var divCam = $('<div>');
        divCam.attr("id","webCamview");
        divCam.addClass("PhotoboxClientRenderer_WebcamView");

        divWrapper.append(divCam);

        var divCommand = $('<div>');
        divCommand.addClass("PhotoboxClientRenderer_command");

        var imgPush = $('<div>');
        imgPush.addClass("PhotoboxClientRenderer_command_pic");
        imgPush.css("background-image","url('https://cms.pulsetotem.fr/images/d4052200-2772-11e6-83f6-33e3ba783274/raw')");
        divCommand.append(imgPush);

		var divCommandText = $('<div>');
		divCommandText.addClass("PhotoboxClientRenderer_command_text");

        /*var simulateKeyEvent = function (element) {
            console.log("Click detected !");
            var e = $.Event('keypress');
            e.keyCode = 65; // Character 'A'
            e.shiftKey = true;
            $(document).trigger(e);
        };

        divCommandText.click(function() {
            simulateKeyEvent(divCommandText);
        });

        divCommandText.css('cursor','pointer');
        */
        var headerTextSpan = $('<span>');
        headerTextSpan.html(this._initMsg);
        headerTextSpan.addClass("PhotoboxClientRenderer_command_span");

		divCommandText.append(headerTextSpan);
		divCommand.append(divCommandText);
        divWrapper.append(divCommand);

        domElem.append(divWrapper);

		divCommandText.textfill({
            maxFontPixels: 500
        });

        this.preventFallback();

        Webcam.set(this.webcam_settings);

        Webcam.attach("#webCamview");
    }

    private countAndSnap(domElem : any, counterTime : number, callChannel : string, infoid : string) {
        var counter = counterTime;
        var counterMax = counter;
        var divWrapper = $('<div>');
        divWrapper.addClass("PhotoboxClientRenderer_wrapper");

        var randomId = "divCounter"+(Math.round(Math.random()*1000));
        var divCounter = $('<div id="'+randomId+'">');
        divCounter.addClass("PhotoboxClientRenderer_counter");
        divWrapper.append(divCounter);

        var divCam = $('<div>');
        divCam.attr("id","webCamview");
        divCam.addClass("PhotoboxClientRenderer_WebcamView");

        divWrapper.append(divCam);

        var divCommand = $('<div>');
        divCommand.addClass("PhotoboxClientRenderer_command");

        var headerTextSpan = $('<span>');
        headerTextSpan.html(this._counterMsg);
        headerTextSpan.addClass("PhotoboxClientRenderer_command_span");

        divCommand.append(headerTextSpan);
        divWrapper.append(divCommand);

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

        var circle = new ProgressBar.Circle(divCounter[0], {
            color: '#FFA500',
            strokeWidth: 10,
            trailColor: 'rgba(0,0,0,1)',
            trailWidth: 10,
            svgStyle: {
                display: 'block',

                // Important: make sure that your container has same
                // aspect ratio as the SVG canvas. See SVG canvas sizes above.
                width: '100%'
            },
            fill: 'rgba(0,0,0,0.5)',
            text: {
                autoStyleContainer: false,
                className: 'PhotoboxClientRenderer_counter_span',
                style: {
                    position: 'absolute',
                    left: '0',
                    top: '20%',
                }
            }
        });
        circle.setText(counter);

        divCommand.textfill({
            maxFontPixels: 500
        });

        this.preventFallback();

        Webcam.set(this.webcam_settings);

        Webcam.attach("#webCamview");

        var self = this;
        var managePicture = function(data_uri) {
            Webcam.freeze();
            self._lastPhoto = data_uri;

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

            divCommand.textfill({
                maxFontPixels: 500
            });

            MessageBus.publishToCall(callChannel, "PostAndValidate", {"image": data_uri, "id": infoid});
        };

        var timeoutFunction = function () {
            counter--;

            circle.set(0);
            circle.animate(1);
            circle.setText(counter);

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
                setTimeout(timeoutFunction, 1000);
            }
        };

        setTimeout(timeoutFunction, 1000);
    }

    private displayEndMessage(domElem : any) {
        var divWrapper = $('<div>');
        divWrapper.addClass("PhotoboxClientRenderer_wrapper");

        var divResultPhotoImg = $('<div>');
        divResultPhotoImg.addClass("PhotoboxClientRenderer_photoResult");
        divResultPhotoImg.css('background-image', 'url('+this._lastPhoto+')');

		 var divCommand = $('<div>');
		 divCommand.addClass("PhotoboxClientRenderer_messageFin");

		 var divCommandText = $('<div>');
		 divCommandText.addClass("PhotoboxClientRenderer_command_text");

		 var headerTextSpan = $('<span>');
		 headerTextSpan.html(this._endMsg);
		 headerTextSpan.addClass("PhotoboxClientRenderer_command_span");

		 divCommandText.append(headerTextSpan);
		 divCommand.append(divCommandText);
		divResultPhotoImg.append(divCommand);

		var medaillon = $("<div>");
		medaillon.addClass("PhotoboxClientRenderer_profilpic");
		medaillon.css("background-image","url(" + this._medaillonPicture + ")");


		divResultPhotoImg.append(medaillon);

		divWrapper.append(divResultPhotoImg);

		 $(domElem).append(divWrapper);

		 divCommandText.textfill({
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

        if (Webcam.container) {
            Webcam.reset();
        }

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