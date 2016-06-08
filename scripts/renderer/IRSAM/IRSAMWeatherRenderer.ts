/**
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/Weather.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Forecast.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class IRSAMWeatherRenderer implements Renderer<Weather> {
    /**
     * Transform the Info list to another Info list.
     *
     * @method transformInfo<ProcessInfo extends Info>
     * @param {ProcessInfo} info - The Info to transform.
     * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
     */
    transformInfo(info : Forecast) : Array<Weather> {
        var newListInfos : Array<Weather> = new Array<Weather>();
        try {
            var forecastInfo = Forecast.fromJSONObject(info);
            newListInfos.push(forecastInfo.getCurrent());
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
    render(info : Weather, domElem : any, rendererTheme : string, endCallback : Function) {
        var wrapperHTML = $("<div>");
        wrapperHTML.addClass("IRSAMWeatherRenderer_wrapper");
        wrapperHTML.addClass(rendererTheme);

        var divSymbol = $("<div>");
        divSymbol.addClass("IRSAMWeatherRenderer_divSymbol");

        var symbol = "";
        switch(info.getStatus()) {
            case WeatherStatus.CLEAR_DAY:
                symbol = "wi-day-sunny";
                break;

            case WeatherStatus.CLEAR_NIGHT:
                symbol = "wi-night-clear";
                break;

            case WeatherStatus.CLOUDY:
                symbol = "wi-cloudy";
                break;

            case WeatherStatus.FOG:
                symbol = "wi-fog";
                break;

            case WeatherStatus.PARTLY_CLOUDY_DAY:
                symbol = "wi-day-cloudy";
                break;

            case WeatherStatus.PARTLY_CLOUDY_NIGHT:
                symbol = "wi-night-partly-cloudy";
                break;

            case WeatherStatus.RAIN:
                symbol = "wi-rain";
                break;

            case WeatherStatus.SLEET:
                symbol = "wi-sleet";
                break;

            case WeatherStatus.SNOW:
                symbol = "wi-snow";
                break;

            case WeatherStatus.WIND:
                symbol = "wi-day-windy";
                break;

            case WeatherStatus.UNKNOWN:
                symbol = "wi-na";
                break;
        }

        var spanSymbol = $("<i>");
        spanSymbol.addClass("wi");
        spanSymbol.addClass(symbol);
        divSymbol.append(spanSymbol);
        wrapperHTML.append(divSymbol);

        var divTemperature = $("<div>");
        divTemperature.addClass("IRSAMWeatherRenderer_divTemperature");

        var spanTemperature = $("<span>");
        spanTemperature.html(info.getTemperature());
        divTemperature.append(spanTemperature);

        var liTemperatureSymbol = $("<li>");
        liTemperatureSymbol.addClass("wi");
        liTemperatureSymbol.addClass("wi-celsius");

        divTemperature.append(liTemperatureSymbol);

        wrapperHTML.append(divTemperature);

        $(domElem).append(wrapperHTML);

        divSymbol.textfill({
            maxFontPixels: 500
        });

        divTemperature.textfill({
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
    updateRender(info : Weather, domElem : any, rendererTheme : string, endCallback : Function) {
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
    animate(info : Weather, domElem : any, rendererTheme : string, endCallback : Function) {
        //Nothing to do.

        endCallback();
    }
}