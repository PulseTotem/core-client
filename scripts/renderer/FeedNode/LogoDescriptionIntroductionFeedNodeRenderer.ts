/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/FeedContent.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/FeedNode.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class LogoDescriptionIntroductionFeedNodeRenderer implements Renderer<FeedNode> {

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
		nodeHTMLWrapper.addClass("LogoDescriptionIntroductionFeedNodeRenderer_wrapper");
		nodeHTMLWrapper.addClass(rendererTheme);

		//Main -> Picture
		if(info.getMediaUrl() != null && info.getMediaUrl() != "") {
			var nodeMainPictureContainer = $("<div>");
			nodeMainPictureContainer.addClass("LogoDescriptionIntroductionFeedNodeRenderer_main_picture_container");

			var nodeMainPicture = $("<div>");
			nodeMainPicture.addClass("LogoDescriptionIntroductionFeedNodeRenderer_main_picture");

			nodeMainPicture.css("background-image", "url('" + info.getMediaUrl() + "')");

			nodeMainPictureContainer.append(nodeMainPicture);

			nodeHTMLWrapper.append(nodeMainPictureContainer);
		}

		//DescriptionContainer
		var descriptionContainer = $("<div>");
		descriptionContainer.addClass("LogoDescriptionIntroductionFeedNodeRenderer_description_container");

		nodeHTMLWrapper.append(descriptionContainer);
		if(info.getDescription() != null) {
			descriptionContainer.html(info.getDescription());
		} else if(info.getSummary() != null) {
			descriptionContainer.html(info.getSummary());
		}

		$(domElem).append(nodeHTMLWrapper);

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