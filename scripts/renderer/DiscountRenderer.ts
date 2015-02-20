/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/DiscountsList.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Discount.ts" />
/// <reference path="../policy/RenderPolicy.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery

class DiscountRenderer implements Renderer<Discount> {
    transformForBehaviour(listInfos : Array<DiscountsList>, renderPolicy : RenderPolicy<any>) : Array<Discount> {

        Logger.debug("Renderer : listInfos");
        Logger.debug(listInfos);

        var newListInfos : Array<DiscountsList> = new Array<DiscountsList>();

        Logger.debug("Renderer : listInfos.length");
        Logger.debug(listInfos.length);

        for(var iInfo in listInfos) {
            try {
                var infoDesc = listInfos[iInfo];
                var infoInstance = DiscountsList.fromJSONObject(infoDesc);
                newListInfos.push(infoInstance);
            } catch(e) {
                Logger.error(e.message);
            }
        }

        Logger.debug("Renderer : newListInfos");
        Logger.debug(newListInfos);

        //var discountsLists : Array<DiscountsList> = renderPolicy.process(newListInfos);
        var discountsLists : Array<DiscountsList> = newListInfos;

        Logger.debug("Renderer : discountsLists");
        Logger.debug(discountsLists);

        var discounts : Array<Discount> = new Array<Discount>();

        for(var iDL in discountsLists) {
            var dl : DiscountsList = discountsLists[iDL];
            var dlDiscounts : Array<Discount> = dl.getDiscounts();
            for(var iD in dlDiscounts) {
                var d : Discount = dlDiscounts[iD];
                discounts.push(d);
            }
        }

        Logger.debug("Renderer : discounts");
        Logger.debug(discounts);

        return discounts;
    }

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

        info.setCastingDate(new Date());
    }
}