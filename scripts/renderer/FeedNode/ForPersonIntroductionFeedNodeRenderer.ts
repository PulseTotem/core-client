/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/FeedContent.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/FeedNode.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class ForPersonIntroductionFeedNodeRenderer implements Renderer<FeedNode> {

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
		nodeHTMLWrapper.addClass("ForPersonIntroductionFeedNodeRenderer_wrapper");
		nodeHTMLWrapper.addClass(rendererTheme);

		//FeedContent logo
		var feedcontentHTMLLogoContainer = $("<div>");
		feedcontentHTMLLogoContainer.addClass("ForPersonIntroductionFeedNodeRenderer_feedcontent_logo_container");

		nodeHTMLWrapper.append(feedcontentHTMLLogoContainer);

		var feedcontentHTMLLogoShadow = $("<div>");
		feedcontentHTMLLogoShadow.addClass("ForPersonIntroductionFeedNodeRenderer_feedcontent_logo_shadow");

		feedcontentHTMLLogoContainer.append(feedcontentHTMLLogoShadow);

		var feedcontentHTMLLogoColor = $("<div>");
		feedcontentHTMLLogoColor.addClass("ForPersonIntroductionFeedNodeRenderer_feedcontent_logo_color");

		feedcontentHTMLLogoContainer.append(feedcontentHTMLLogoColor);

		var feedcontentHTMLLogo = $("<div>");
		feedcontentHTMLLogo.addClass("ForPersonIntroductionFeedNodeRenderer_feedcontent_logo");

		feedcontentHTMLLogoContainer.append(feedcontentHTMLLogo);

		//Main
		var nodeMain = $("<div>");
		nodeMain.addClass("ForPersonIntroductionFeedNodeRenderer_main");

		nodeHTMLWrapper.append(nodeMain);

		//Main -> Picture
		if(info.getMediaUrl() != null && info.getMediaUrl() != "") {
			var nodeMainPicture = $("<div>");
			nodeMainPicture.addClass("ForPersonIntroductionFeedNodeRenderer_main_picture");
			nodeMainPicture.addClass("pull-left");

			nodeMain.append(nodeMainPicture);

			nodeMainPicture.css("background-image", "url('" + info.getMediaUrl() + "')");
		}

		//Main -> Message
		var nodeMainMessage = $("<div>");
		nodeMainMessage.addClass("ForPersonIntroductionFeedNodeRenderer_main_message");
		nodeMainMessage.addClass("pull-left");

		nodeMain.append(nodeMainMessage);

		if((info.getTitle() != null && info.getTitle().trim() != "") || (info.getSummary() != null && info.getSummary().trim() != "") || (info.getDescription() != null && info.getDescription().trim() != "")) {

			if(info.getMediaUrl() != null && info.getMediaUrl() != "") {
				nodeMainMessage.addClass("ForPersonIntroductionFeedNodeRenderer_main_message_with_picture");
			}
		} else {
			nodeMainMessage.addClass("ForPersonIntroductionFeedNodeRenderer_main_message_empty");

			if(info.getMediaUrl() != null && info.getMediaUrl() != "") {
				nodeMainPicture.addClass("ForPersonIntroductionFeedNodeRenderer_main_picture_alone");
			}
		}

		//Main -> Message -> TitleContainer
		var titleContainer = $("<div>");
		titleContainer.addClass("ForPersonIntroductionFeedNodeRenderer_main_message_title_container");

		nodeMainMessage.append(titleContainer);

		//Main -> Message -> TitleContainer -> Title
		var titleDiv = $("<div>");
		titleDiv.addClass("ForPersonIntroductionFeedNodeRenderer_main_message_title_container_title");

		titleContainer.append(titleDiv);

		var titleContainerSpan = $("<span>");
		if(info.getTitle() != null) {
			titleContainerSpan.html(info.getTitle());
		} else {
			titleContainerSpan.html("");
		}
		titleDiv.append(titleContainerSpan);

		//Main -> Message -> Container
		var messageContainer = $("<div>");
		messageContainer.addClass("ForPersonIntroductionFeedNodeRenderer_main_message_container");

		nodeMainMessage.append(messageContainer);

		//Main -> Message -> Container -> Arrow
		var nodeMessageArrow = $("<div>");
		nodeMessageArrow.addClass("ForPersonIntroductionFeedNodeRenderer_main_message_content_arrow");
		nodeMessageArrow.html("&#9652;");
		messageContainer.append(nodeMessageArrow);

		//Main -> Message -> Container -> Content
		var messageContent = $("<div>");
		messageContent.addClass("ForPersonIntroductionFeedNodeRenderer_main_message_content");

		messageContainer.append(messageContent);

		var nodeMainMessageSpan = $("<span>");
		if(info.getDescription() != null) {
			nodeMainMessageSpan.html(info.getDescription());
		} else if(info.getSummary() != null) {
			nodeMainMessageSpan.html(info.getSummary());
		}
		messageContent.append(nodeMainMessageSpan);

		//Clearfix for Main
		var clearFixMain = $("<div>");
		clearFixMain.addClass("clearfix");
		nodeMain.append(clearFixMain);

		$(domElem).css("overflow", "visible");
		$(domElem).append(nodeHTMLWrapper);

		titleDiv.textfill({
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
		var nodeMain = $(domElem).find(".ForPersonIntroductionFeedNodeRenderer_main");

		var nodeMainMessage = $(domElem).find(".ForPersonIntroductionFeedNodeRenderer_main_message").first();

		var nodeMainPicture : any = null;

		if(info.getMediaUrl() != null && info.getMediaUrl() != "") {
			var nodeMainPictures = $(domElem).find(".ForPersonIntroductionFeedNodeRenderer_main_picture");
			if(nodeMainPictures.length > 0) {
				nodeMainPicture = nodeMainPictures.first();
			} else {
				nodeMainPicture = $("<div>");
				nodeMainPicture.addClass("ForPersonIntroductionFeedNodeRenderer_main_picture");
				nodeMainPicture.addClass("pull-left");
				nodeMain.append(nodeMainPicture);
			}

			nodeMainPicture.css("background-image", "url('" + info.getMediaUrl() + "')");


			nodeMainMessage.removeClass("ForPersonIntroductionFeedNodeRenderer_main_message_with_picture");
			nodeMainMessage.removeClass("ForPersonIntroductionFeedNodeRenderer_main_message_empty");
			nodeMainPicture.removeClass("ForPersonIntroductionFeedNodeRenderer_main_picture_alone");
		} else {
			$(domElem).find(".ForPersonIntroductionFeedNodeRenderer_main_picture").remove();
		}

		var messageContent = $(domElem).find(".ForPersonIntroductionFeedNodeRenderer_main_message_content").first();
		messageContent.empty();

		var nodeMainMessageSpan = $("<span>");
		if(info.getDescription() != null) {
			nodeMainMessageSpan.html(info.getDescription());
		} else if(info.getSummary() != null) {
			nodeMainMessageSpan.html(info.getSummary());
		}
		messageContent.append(nodeMainMessageSpan);

		messageContent.textfill({
			minFontPixels: 30,
			maxFontPixels: 600
		});


		var titleDiv = $(domElem).find(".ForPersonIntroductionFeedNodeRenderer_main_message_title_container_title").first();
		titleDiv.empty();

		var titleContainerSpan = $("<span>");
		if(info.getTitle() != null) {
			titleContainerSpan.html(info.getTitle());
		} else {
			titleContainerSpan.html("");
		}
		titleDiv.append(titleContainerSpan);

		titleDiv.textfill({
			minFontPixels: 30,
			maxFontPixels: 600
		});

		if((info.getTitle() != null && info.getTitle().trim() != "") || (info.getSummary() != null && info.getSummary().trim() != "") || (info.getDescription() != null && info.getDescription().trim() != "")) {

			if(info.getMediaUrl() != null && info.getMediaUrl() != "") {
				nodeMainMessage.addClass("ForPersonIntroductionFeedNodeRenderer_main_message_with_picture");
			}
		} else {
			nodeMainMessage.addClass("ForPersonIntroductionFeedNodeRenderer_main_message_empty");

			if(nodeMainPicture != null && info.getMediaUrl() != null && info.getMediaUrl() != "") {
				nodeMainPicture.addClass("ForPersonIntroductionFeedNodeRenderer_main_picture_alone");
			}
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
		endCallback();
	}
}