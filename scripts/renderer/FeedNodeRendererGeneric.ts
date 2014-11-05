/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/FeedContent.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/FeedNode.ts" />
/// <reference path="../policy/RenderPolicy.ts" />
/// <reference path="./Renderer.ts" />

declare var $;

class FeedNodeRendererGeneric implements Renderer<FeedNode> {
    transformForBehaviour(listInfos : Array<FeedContent>, renderPolicy : RenderPolicy<FeedContent>) : Array<FeedNode> {
        var feedContents : Array<FeedContent> = renderPolicy.process(listInfos);

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
        var titleH1 = $("<h1>");
        titleH1.html(info.getTitle());
        $(domElem).empty();
        $(domElem).append(titleH1);
    }
}