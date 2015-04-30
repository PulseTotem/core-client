/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/DiscountsList.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Discount.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery

class DiscountRenderer implements Renderer<Discount> {
	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {Array<ProcessInfo>} listInfos - The Info list to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(listInfos : Array<DiscountsList>) : Array<Discount> {
		var newListInfos : Array<DiscountsList> = new Array<DiscountsList>();
		try {
			newListInfos = Info.fromJSONArray(listInfos, DiscountsList);
		} catch(e) {
			Logger.error(e.message);
		}

        var discountsLists : Array<DiscountsList> = newListInfos;

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
	 */
	render(info : Discount, domElem : any) {
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

        $(domElem).empty();
        $(domElem).html(info.getProductName() + '<br/><br/>' + info.getProductDescription());
    }
}