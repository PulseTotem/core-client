/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/FeedContent.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/FeedNode.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class PictureTitleFeedNodeRenderer implements Renderer<FeedNode> {

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
		nodeHTMLWrapper.addClass("PictureTitleFeedNodeRenderer_wrapper");
		nodeHTMLWrapper.addClass(rendererTheme);

		var backgroundColors = [];
		backgroundColors.push("rgba(233,98,24,.5)");
		backgroundColors.push("rgba(248,226,7,.5)");
		backgroundColors.push("rgba(227,35,43,.5)");
		backgroundColors.push("rgba(250,250,250,.7)");

		var indexBackgroundColors = Math.floor(Math.random() * backgroundColors.length);

		nodeHTMLWrapper.css("background-color", backgroundColors[indexBackgroundColors]);

		//Main -> Picture
		if(info.getMediaUrl() != null && info.getMediaUrl() != "") {

			var nodeMainPictureContainer = $("<div>");
			nodeMainPictureContainer.addClass("PictureTitleFeedNodeRenderer_main_picture_container");

			var nodeMainPicture = $("<div>");
			nodeMainPicture.addClass("PictureTitleFeedNodeRenderer_main_picture");

			nodeMainPicture.css("background-image", "url('" + info.getMediaUrl() + "')");

			nodeMainPictureContainer.append(nodeMainPicture);

			nodeHTMLWrapper.append(nodeMainPictureContainer);
		}

		//TitleContainer
		var titleContainer = $("<div>");
		titleContainer.addClass("PictureTitleFeedNodeRenderer_title_container");

		nodeHTMLWrapper.append(titleContainer);
		if(info.getTitle() != null) {
			titleContainer.html(info.getTitle());
		} else {
			titleContainer.html("");
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
		/*if(info.getMediaUrl() != null && info.getMediaUrl() != "") {

			var nodeMainPictures = $(domElem).find(".PictureTitleFeedNodeRenderer_main_picture");
			var nodeMainPicture;
			if(nodeMainPictures.length > 0) {
				nodeMainPicture = nodeMainPictures.first();
			} else {
				nodeMainPicture = $("<div>");
				nodeMainPicture.addClass("PictureTitleFeedNodeRenderer_main_picture");
				nodeMainPicture.addClass("pull-left");
			}

			nodeMainPicture.css("background-image", "url('" + info.getMediaUrl() + "')");

			var nodeMainMessage = $(domElem).find(".PictureTitleFeedNodeRenderer_main_message").first();
			nodeMainMessage.removeClass("PictureTitleFeedNodeRenderer_main_message_with_picture");
			nodeMainMessage.removeClass("PictureTitleFeedNodeRenderer_main_message_empty");
			nodeMainMessage.removeClass("PictureTitleFeedNodeRenderer_main_picture_alone");

			if(info.getDescription() != null && info.getDescription().trim() != "") {
				nodeMainMessage.addClass("PictureTitleFeedNodeRenderer_main_message_with_picture");
			} else {
				nodeMainMessage.addClass("PictureTitleFeedNodeRenderer_main_message_empty");
				nodeMainPicture.addClass("PictureTitleFeedNodeRenderer_main_picture_alone");
			}

		} else {
			$(domElem).find(".PictureTitleFeedNodeRenderer_main_picture").remove();
		}

		var nodeFooterAuthor = $(domElem).find(".PictureTitleFeedNodeRenderer_footer_author").first();
		nodeFooterAuthor.empty();
		var nodeFooterAuthorSpan = $("<span>");
		if(info.getAuthor() != null) {
			nodeFooterAuthorSpan.html(info.getAuthor());
		}
		nodeFooterAuthor.append(nodeFooterAuthorSpan);

		nodeFooterAuthor.textfill({
			maxFontPixels: 600
		});

		var nodeFooterDate = $(domElem).find(".PictureTitleFeedNodeRenderer_footer_date").first();
		nodeFooterDate.empty();

		var nodeFooterDateSpan = $("<span>");

		if(info.getCreationDate() != null) {
			var creationDate:any = moment(info.getCreationDate());
			var displayCreationDate = creationDate.fromNow();
			nodeFooterDateSpan.html(displayCreationDate);
		}

		nodeFooterDate.append(nodeFooterDateSpan);

		nodeFooterDate.textfill({
			maxFontPixels: 600
		});


		var nodeMainMessage = $(domElem).find(".PictureTitleFeedNodeRenderer_main_message").first();
		nodeMainMessage.empty();

		var nodeMainMessageSpan = $("<span>");
		if(info.getDescription() != null) {
			nodeMainMessageSpan.html(info.getDescription());
		}

		nodeMainMessage.append(nodeMainMessageSpan);

		nodeMainMessage.textfill({
			minFontPixels: 30,
			maxFontPixels: 600
		});

		var titleContainer = $(domElem).find(".PictureTitleFeedNodeRenderer_title_container").first();
		titleContainer.empty();

		var titleContainerSpan = $("<span>");
		if(info.getTitle() != null) {
			titleContainerSpan.html(info.getTitle());
		} else {
			titleContainerSpan.html("");
		}

		titleContainer.append(titleContainerSpan);

		titleContainer.textfill({
			minFontPixels: 30,
			maxFontPixels: 600
		});*/

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
		endCallback();
	}
}