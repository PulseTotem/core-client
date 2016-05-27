/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/TextList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/TextInfo.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery

class FullSizeTextRenderer implements Renderer<TextInfo> {

	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : TextList) : Array<TextInfo> {
		var textLists : Array<TextList> = new Array<TextList>();
		try {
			var newInfo = TextList.fromJSONObject(info);
			textLists.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		var texts : Array<TextInfo> = new Array<TextInfo>();

		for(var iTL in textLists) {
			var tl : TextList = textLists[iTL];
			var tlTexts : Array<TextInfo> = tl.getTexts();
			for(var iT in tlTexts) {
				var t : TextInfo = tlTexts[iT];
				texts.push(t);
			}
		}

		return texts;
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
	render(info : TextInfo, domElem : any, rendererTheme : string, endCallback : Function) {
		var self = this;

		var textWrapper = $("<div>");
		textWrapper.addClass("FullSizeTextRenderer_wrapper");
		textWrapper.addClass(rendererTheme);

		var textSpan = $("<span>");
		textSpan.addClass("FullSizeTextRenderer_text");
		textSpan.html(info.getValue());
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
	updateRender(info : TextInfo, domElem : any, rendererTheme : string, endCallback : Function) {
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
	animate(info : TextInfo, domElem : any, rendererTheme : string, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}