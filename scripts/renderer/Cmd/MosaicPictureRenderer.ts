/**
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/CmdList.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery

class MosaicPictureRenderer implements Renderer<Cmd> {

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

        if (info.getCmd() == "counterMosaic") {
            var nbPics = parseInt(info.getArgs()[0]);
            var totalPics = parseInt(info.getArgs()[1]);

            var percent = (nbPics / totalPics) * 100;

            var progressBarContainer = $('<div>');
            progressBarContainer.addClass('progress');
            progressBarContainer.addClass('progress-bar-vertical');

            var progressBar = $('<div>');
            progressBar.addClass('progress-bar');
            progressBar.addClass('progress-bar-striped');
            progressBar.addClass('active');

            if (percent < 50) {
                progressBar.addClass('progress-bar-danger');
            } else if (percent < 75) {
                progressBar.addClass('progress-bar-warning');
            } else {
                progressBar.addClass('progress-bar-success');
            }

            progressBar.attr('role', 'progress-bar');
            progressBar.attr('aria-valuenow', percent);
            progressBar.attr('aria-valuemin',0);
            progressBar.attr('aria-valuemax',100);
            progressBar.css('height','60%');
            progressBar.text(percent+'%');

            progressBarContainer.append(progressBar);

            domElem.append(progressBarContainer);

        } else if  (info.getCmd() == "startProcessing") {

            var infoProcessing = $('<div>');
            infoProcessing.addClass('jumbotron');
            infoProcessing.text('Picture start to process...');
            domElem.append(infoProcessing);

        } else if (info.getCmd() == "mosaicProcessed") {
            var urlPic = info.getArgs()[0];

            var pic = $('<img>');
            pic.addClass('img-responsive');
            pic.addClass('img-rounded');
            pic.attr('src',urlPic);
            domElem.append(pic);
        }
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