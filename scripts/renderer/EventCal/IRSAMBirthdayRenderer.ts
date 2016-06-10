/**
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/EventCal.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/EventList.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class IRSAMBirthdayRenderer implements Renderer<EventList> {
    /**
     * Transform the Info list to another Info list.
     *
     * @method transformInfo<ProcessInfo extends Info>
     * @param {ProcessInfo} info - The Info to transform.
     * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
     */
    transformInfo(info : EventList) : Array<EventList> {
        var newListInfos : Array<EventList> = new Array<EventList>();
        try {
            var newInfo = EventList.fromJSONObject(info);
            newListInfos.push(newInfo);
        } catch(e) {
            Logger.error(e.message);
        }

        return newListInfos;
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
    render(info : EventList, domElem : any, rendererTheme : string, endCallback : Function) {
        var wrapperHTML = $("<div>");
        wrapperHTML.addClass("IRSAMBirthdayRenderer_wrapper");
        wrapperHTML.addClass(rendererTheme);
        var date = moment().format('dddd DD MMMM YYYY');

        var texte = "Nous sommes le "+date;
        var divDate = $('<div>');
        divDate.addClass("IRSAMBirthdayRenderer_date");
        var spanDate = $('<span>');
        spanDate.html(texte);
        divDate.append(spanDate);

        wrapperHTML.append(divDate);

        var divBirthday = $('<div>');
        divBirthday.addClass("IRSAMBirthdayRenderer_divBirthday");
        var spanDivBirthday = $('<span>');
        spanDivBirthday.html("Joyeux anniversaire à : ");
        divBirthday.append(spanDivBirthday);

        wrapperHTML.append(divBirthday);

        var imageCake = $('<div>');
        imageCake.addClass("IRSAMBirthdayRenderer_imageCake");
        imageCake.css("background-image","url('static/images/irsam/Birthday-Cake.svg')");
        wrapperHTML.append(imageCake);
        
        var listeBirthday = $('<ul>');
        listeBirthday.addClass("IRSAMBirthdayRenderer_listeBirthday");

        var allLiBirthday = [];
        info.getEvents().forEach(function (event: EventCal) {
            var birthday = $('<li>');
            birthday.addClass("IRSAMBirthdayRenderer_puceBirthday");

            var spanBirthday = $('<span>');
            spanBirthday.html(event.getName());
            birthday.append(spanBirthday);
            listeBirthday.append(birthday);
            allLiBirthday.push(birthday);
        });

        wrapperHTML.append(listeBirthday);

        $(domElem).append(wrapperHTML);

        divDate.textfill({
            maxFontPixels: 500
        });

        divBirthday.textfill({
            maxFontPixels: 500
        });

        allLiBirthday.forEach(function (element : any) {
            element.textfill({
                maxFontPixels: 500
            });
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
    updateRender(info : EventList, domElem : any, rendererTheme : string, endCallback : Function) {
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
    animate(info : EventList, domElem : any, rendererTheme : string, endCallback : Function) {
        //Nothing to do.

        endCallback();
    }
}