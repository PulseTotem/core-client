/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/FeedContent.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/FeedNode.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class IRSAMFeedRenderer implements Renderer<FeedNode> {

    /**
     * Transform the Info list to another Info list.
     *
     * @method transformInfo<ProcessInfo extends Info>
     * @param {ProcessInfo} info - The Info to transform.
     * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
     */
    transformInfo(info : FeedContent) : Array<FeedNode> {
        var feedContents : Array<FeedContent> = new Array<FeedContent>();
        try {
            var newInfo = FeedContent.fromJSONObject(info);
            feedContents.push(newInfo);
        } catch(e) {
            Logger.error(e.message);
        }

        var feedNodes : Array<FeedNode> = new Array<FeedNode>();

        for(var iFC in feedContents) {
            var fc : FeedContent = feedContents[iFC];
            var fcFeedNodes : Array<FeedNode> = fc.getFeedNodes();
            for(var iFN in fcFeedNodes) {
                var fn : FeedNode = fcFeedNodes[iFN];

                if((fn.getTitle() != null && fn.getTitle().trim() != "") || (fn.getSummary() != null && fn.getSummary().trim() != "") || (fn.getDescription() != null && fn.getDescription().trim() != "") || (fn.getMediaUrl() != null && fn.getMediaUrl() != "")) {
                    feedNodes.push(fn);

                    if (fn.getMediaUrl() != null && fn.getMediaUrl() != "") {
                        var img = new Image();
                        img.src = fn.getMediaUrl();
                    }
                }
            }
        }

        return feedNodes;
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
    render(info : FeedNode, domElem : any, rendererTheme : string, endCallback : Function) {
        var nodeHTMLWrapper = $("<div>");
        nodeHTMLWrapper.addClass("IRSAMFeedRenderer_wrapper");
        nodeHTMLWrapper.addClass(rendererTheme);

        //Main -> Picture
        if(info.getMediaUrl() != null && info.getMediaUrl() != "") {
            var nodeMainPicture = $("<div>");
            nodeMainPicture.addClass("IRSAMFeedRenderer_picture");
            nodeMainPicture.css("background-image", "url('" + info.getMediaUrl() + "')");

            nodeHTMLWrapper.append(nodeMainPicture);
        }

        //Main -> Message
        var nodeMainMessage = $("<div>");
        nodeMainMessage.addClass("IRSAMFeedRenderer_mainMessage");

        if (!((info.getTitle() != null && info.getTitle().trim() != "") || (info.getSummary() != null && info.getSummary().trim() != "") || (info.getDescription() != null && info.getDescription().trim() != ""))) {
            nodeMainMessage.addClass("IRSAMFeedRenderer_mainMessage_empty");

            if(info.getMediaUrl() != null && info.getMediaUrl() != "") {
                nodeMainPicture.addClass("IRSAMFeedRenderer_picture_alone");
            }
        } else {
            if(info.getMediaUrl() != null && info.getMediaUrl() != "") {
                nodeMainMessage.addClass("pull-right");
            }
            nodeMainPicture.addClass("pull-left");
        }

        //Main -> Message -> TitleContainer
        var titleContainer = $("<div>");
        titleContainer.addClass("IRSAMFeedRenderer_mainMessage_title");

        var titleContainerSpan = $("<span>");
        if(info.getTitle() != null) {
            titleContainerSpan.html(info.getTitle());
        } else {
            titleContainerSpan.html("");
        }
        titleContainer.append(titleContainerSpan);

        nodeMainMessage.append(titleContainer);

        //Main -> Message -> Container -> Content
        var messageContent = $("<div>");
        messageContent.addClass("IRSAMFeedRenderer_mainMessage_content");

        var html = "";
        if(info.getDescription() != null) {
            html = info.getDescription();
        } else if(info.getSummary() != null) {
            html = info.getSummary();
        }

        html = html.replace(/<p>/g,"");
        html = html.replace(/<\/p>/g,"<br />");

        var nodeMainMessageSpan = $("<span>");
        nodeMainMessageSpan.html(html);
        messageContent.append(nodeMainMessageSpan);

        nodeMainMessage.append(messageContent);
        nodeHTMLWrapper.append(nodeMainMessage);

        $(domElem).css("overflow", "visible");
        $(domElem).append(nodeHTMLWrapper);

        titleContainer.textfill({
            minFontPixels: 30,
            maxFontPixels: 600
        });

        messageContent.textfill({
            minFontPixels: 30,
            maxFontPixels: 600
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
    updateRender(info : FeedNode, domElem : any, rendererTheme : string, endCallback : Function) {
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
    animate(info : FeedNode, domElem : any, rendererTheme : string, endCallback : Function) {
        endCallback();
    }
}