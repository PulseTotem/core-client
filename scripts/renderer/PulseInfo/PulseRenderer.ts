/**
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/PulseList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/PulseInfo.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery

class PulseRenderer implements Renderer<PulseInfo> {

    /**
     * Transform the Info list to another Info list.
     *
     * @method transformInfo<ProcessInfo extends Info>
     * @param {ProcessInfo} info - The Info to transform.
     * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
     */
    transformInfo(info : PulseList) : Array<PulseInfo> {
        var pulseList : Array<PulseList> = new Array<PulseList>();
        try {
            var newInfo = PulseList.fromJSONObject(info);
            pulseList.push(newInfo);
        } catch(e) {
            Logger.error(e.message);
        }

        var pulseInfo : Array<PulseInfo> = new Array<PulseInfo>();

        for(var iPL in pulseList) {
            var pl : PulseList = pulseList[iPL];
            var pulseInfos : Array<PulseInfo> = pl.getPulses();
            for(var iP in pulseInfos) {
                var pInfo : PulseInfo = pulseInfos[iP];
                pulseInfo.push(pInfo);
            }
        }

        return pulseInfo;
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
    render(info : PulseInfo, domElem : any, rendererTheme : string, endCallback : Function) {
        var self = this;

        var textWrapper = $("<div>");
        textWrapper.addClass("PulseInfoRenderer_wrapper");

        var textSpan = $("<span>");
        textSpan.addClass("PulseInfoTextRenderer_text");

        var frequencyText;

        switch (info.getFrequency()) {
            case PulseFrequency.SECONDLY:
                frequencyText = "par seconde";
                break;

            case PulseFrequency.MINUTELY:
                frequencyText = "par minute";
                break;

            case PulseFrequency.HOURLY:
                frequencyText = "par heure";
                break;

            case PulseFrequency.DAILY:
                frequencyText = "par jour";
                break;

            case PulseFrequency.WEEKLY:
                frequencyText = "par semaine";
                break;

            case PulseFrequency.MONTHLY:
                frequencyText = "par mois";
                break;

            case PulseFrequency.YEARLY:
                frequencyText = "par an";
                break;
        }

        textSpan.html(Math.round(info.getValue())+" "+info.getUnity()+" "+frequencyText);
        textWrapper.append(textSpan);

        $(domElem).append(textWrapper);

        textWrapper.textfill({
            maxFontPixels: 500
        });

        endCallback();
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
    updateRender(info : PulseInfo, domElem : any, rendererTheme : string, endCallback : Function) {
        $(domElem).empty();
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
    animate(info : PulseInfo, domElem : any, rendererTheme : string, endCallback : Function) {
        //Nothing to do.

        endCallback();
    }
}