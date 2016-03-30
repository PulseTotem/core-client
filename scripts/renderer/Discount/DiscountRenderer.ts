/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/DiscountsList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Discount.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery

class DiscountRenderer implements Renderer<Discount> {
	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : DiscountsList) : Array<Discount> {
		var discountsLists : Array<DiscountsList> = new Array<DiscountsList>();
		try {
			var newInfo = DiscountsList.fromJSONObject(info);
			discountsLists.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

        var discounts : Array<Discount> = new Array<Discount>();

        for(var iDL in discountsLists) {
            var dl : DiscountsList = discountsLists[iDL];
            var dlDiscounts : Array<Discount> = dl.getDiscounts();
            for(var iD in dlDiscounts) {
                var d : Discount = dlDiscounts[iD];
                discounts.push(d);
            }
        }

        return discounts;
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
	render(info : Discount, domElem : any, rendererTheme : string, endCallback : Function) {
        /*var feedNodeHTML = $("<div>");
        feedNodeHTML.addClass("feednode");

        var titleContent = $("<div>");
        titleContent.addClass("title_content");

        feedNodeHTML.append(titleContent);

        var title = $("<div>");
        title.addClass("title");

        titleContent.append(title);

        var logo = $("<div>");
        logo.addClass("logo");

        titleContent.append(logo);

        var titleClear = $("<div>");
        titleClear.addClass("titleClear");

        titleContent.append(titleClear);

        var feedContent = $("<div>");
        feedContent.addClass("main_content");

        feedNodeHTML.append(feedContent);

        var summary = $("<div>");

        feedContent.append(summary);

        var description = $("<div>");

        feedContent.append(description);

        //Fullfill with info

        title.html(info.getTitle());

        if(info.getMediaUrl() != null) {
            var media = $("<div>");
            media.addClass("feednode_media");
            var mediaImg = $("<img>");
            mediaImg.attr("src", info.getMediaUrl());
            media.append(mediaImg);
            summary.append(media);
        }

        summary.append(info.getSummary());

        if(info.getDescription() != info.getSummary()) {
            description.html(info.getDescription());
        }

        $(domElem).empty();
        $(domElem).append(feedNodeHTML);

        info.setCastingDate(new Date());*/

        $(domElem).html(info.getProductName() + '<br/><br/>' + info.getProductDescription());

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
	updateRender(info : Discount, domElem : any, rendererTheme : string, endCallback : Function) {
		$(domElem).html(info.getProductName() + '<br/><br/>' + info.getProductDescription());

		endCallback();
	}

	/**
	 * Animate rendering Info in specified DOM Element.
	 *
	 * @method animate
	 * @param {RenderInfo} info - The Info to animate.
	 * @param {DOM Element} domElem - The DOM Element where animate the info.
	 * @param {Function} endCallback - Callback function called at the end of animation.
	 */
	animate(info : Discount, domElem : any, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}