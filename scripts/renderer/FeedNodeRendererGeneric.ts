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

        Logger.debug("Renderer : listInfos");
        Logger.debug(listInfos);

        var newListInfos : Array<FeedContent> = new Array<FeedContent>();

        Logger.debug("Renderer : listInfos.length");
        Logger.debug(listInfos.length);

        for(var iInfo in listInfos) {
            try {
                var infoDesc = listInfos[iInfo];
                var infoInstance = FeedContent.fromJSONObject(infoDesc);
                newListInfos.push(infoInstance);
            } catch(e) {
                Logger.error(e.message);
            }
        }

        Logger.debug("Renderer : newListInfos");
        Logger.debug(newListInfos);

        var feedContents : Array<FeedContent> = renderPolicy.process(newListInfos);

        Logger.debug("Renderer : feedContents");
        Logger.debug(feedContents);

        var feedNodes : Array<FeedNode> = new Array<FeedNode>();

        for(var iFC in feedContents) {
            var fc : FeedContent = feedContents[iFC];
            var fcNodes : Array<FeedNode> = fc.getFeedNodes();
            for(var iFN in fcNodes) {
                var fn : FeedNode = fcNodes[iFN];
                feedNodes.push(fn);
            }
        }

        Logger.debug("Renderer : feedNodes");
        Logger.debug(feedNodes);

        return feedNodes;
    }

    render(info : FeedNode, domElem : any) {
        var titleH1 = $("<h1>");
        titleH1.html(info.getTitle());
        $(domElem).empty();
        $(domElem).append(titleH1);

        info.setCastingDate(new Date());
    }
}