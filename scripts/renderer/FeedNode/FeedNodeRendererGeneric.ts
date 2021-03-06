/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/FeedContent.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/FeedNode.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery

class FeedNodeRendererGeneric implements Renderer<FeedNode> {
	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : FeedContent) : Array<FeedNode> {
		var newListInfos : Array<FeedContent> = new Array<FeedContent>();
		try {
			var newInfo = FeedContent.fromJSONObject(info);
			newListInfos.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		var result = new Array<FeedNode>();

		newListInfos.forEach(function(fc : FeedContent) {
			var fcNodes : Array<FeedNode> = fc.getFeedNodes();

			fcNodes.forEach(function (fn : FeedNode) {
				result.push(fn);
			});
		});

		return result;
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
        var feedNodeHTML = $("<div>");
        feedNodeHTML.addClass("FeedNodeRendererGeneric_feednode");

        var titleContent = $("<div>");
        titleContent.addClass("FeedNodeRendererGeneric_title_content");

        feedNodeHTML.append(titleContent);

        var title = $("<div>");
        title.addClass("FeedNodeRendererGeneric_title");

        titleContent.append(title);

        var logo = $("<div>");
        logo.addClass("FeedNodeRendererGeneric_logo");

        titleContent.append(logo);

        var titleClear = $("<div>");
        titleClear.addClass("FeedNodeRendererGeneric_titleClear");
		titleClear.addClass("clearfix");

        titleContent.append(titleClear);

        var feedContent = $("<div>");
        feedContent.addClass("FeedNodeRendererGeneric_main_content");

        feedNodeHTML.append(feedContent);

        var summary = $("<div>");
		summary.addClass("FeedNodeRendererGeneric_summary");

        feedContent.append(summary);

        var description = $("<div>");
        description.addClass("FeedNodeRendererGeneric_description");

        feedContent.append(description);

        var descriptionContent = $("<div>");
        descriptionContent.addClass("FeedNodeRendererGeneric_description_content");

        description.append(descriptionContent);

        title.html(info.getTitle());

        if(info.getMediaUrl() != null) {
            var media = $("<div>");
            media.addClass("FeedNodeRendererGeneric_feednode_media");
            var mediaImg = $("<img>");
            mediaImg.attr("src", info.getMediaUrl());
            media.append(mediaImg);
            summary.append(media);
        }

        summary.append(info.getSummary());

        if(info.getDescription() != info.getSummary()) {
            descriptionContent.html(info.getDescription());
        }

        $(domElem).append(feedNodeHTML);

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
		$(domElem).find(".FeedNodeRendererGeneric_title").first().html(info.getTitle());

		var summary = $(domElem).find(".FeedNodeRendererGeneric_summary").first();
		summary.empty();
		if(info.getMediaUrl() != null) {
			var media = $("<div>");
			media.addClass("FeedNodeRendererGeneric_feednode_media");
			var mediaImg = $("<img>");
			mediaImg.attr("src", info.getMediaUrl());
			media.append(mediaImg);
			summary.append(media);
		}
		summary.append(info.getSummary());


		var descriptionContent = $(domElem).find(".FeedNodeRendererGeneric_description_content").first();
		descriptionContent.removeClass("FeedNodeRendererGeneric_description_content_animation");
		descriptionContent.empty();
		if(info.getDescription() != info.getSummary()) {
			descriptionContent.html(info.getDescription());
		}

		endCallback();
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
		var descriptionContent = $(domElem).find(".FeedNodeRendererGeneric_description_content").first();
		descriptionContent.removeClass("FeedNodeRendererGeneric_description_content_animation");
		descriptionContent.addClass("FeedNodeRendererGeneric_description_content_animation");

		endCallback();
	}
}