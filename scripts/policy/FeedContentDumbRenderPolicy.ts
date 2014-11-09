/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./RenderPolicy.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/FeedContent.ts" />

class FeedContentDumbRenderPolicy implements RenderPolicy<FeedContent> {
    process(listInfos : Array<FeedContent>) : Array<FeedContent> {
        Logger.debug("FeedContentDumbRenderPolicy : listInfos");
        Logger.debug(listInfos);

        return listInfos;
    }
}