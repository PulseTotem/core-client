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

        if (info.getCmd() == "WaitOneClick") {
            $(domElem).empty();
            var counterTime : number = parseInt(info.getArgs()[0]);
            this.initListener(domElem, info.getCallChannel(), counterTime, info.getId());
        } else {
            $(domElem).empty();
            console.error("PhotoboxClientRenderer - Wrong command ! cmd : "+info.getCmd());
            if (Webcam.container) {
                Webcam.reset();
            }
        }

        endCallback();
    }

    private initListener(domElem: any, callChannel : string, counterTime : number, infoId : string) {
        var self = this;

		MessageBus.subscribe(MessageBusChannel.USERTRIGGER, function(channel : any, data : any) {
			if(typeof(data.action) != "undefined" && data.action == MessageBusAction.TRIGGER) {
                self.countAndSnap(domElem, counterTime, callChannel);
			}
		});

        MessageBus.publishToCall(callChannel, "DestroyInitInfo", {"infoId":infoId});
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

            progressTextDiv.textfill({
                maxFontPixels: 500
            });

            divCounter.show();

            MessageBus.publishToCall(callChannel, "PostAndValidate", data_uri);
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