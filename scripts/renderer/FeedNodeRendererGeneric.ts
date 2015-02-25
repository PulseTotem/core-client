/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/FeedContent.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/FeedNode.ts" />
/// <reference path="../policy/RenderPolicy.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery

class FeedNodeRendererGeneric implements Renderer<FeedNode> {
    transformForBehaviour(listInfos : Array<FeedContent>, renderPolicy : RenderPolicy<FeedContent>) : Array<FeedNode> {

        var newListInfos : Array<FeedContent> = new Array<FeedContent>();

        for(var iInfo in listInfos) {
            try {
                var infoDesc = listInfos[iInfo];
                var infoInstance = FeedContent.fromJSONObject(infoDesc);
                newListInfos.push(infoInstance);
            } catch(e) {
                Logger.error(e.message);
            }
        }

        var feedContents : Array<FeedContent> = renderPolicy.process(newListInfos);

        var feedNodes : Array<FeedNode> = new Array<FeedNode>();

        for(var iFC in feedContents) {
            var fc : FeedContent = feedContents[iFC];
            var fcNodes : Array<FeedNode> = fc.getFeedNodes();
            for(var iFN in fcNodes) {
                var fn : FeedNode = fcNodes[iFN];
                feedNodes.push(fn);
            }
        }

        return feedNodes;
    }

    render(info : FeedNode, domElem : any) {
        var feedNodeHTML = $("<div>");
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

        info.setCastingDate(new Date());
    }
}