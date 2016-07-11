/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/FeedContent.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/FeedNode.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class TopDownFeedNodeRenderer implements Renderer<FeedNode> {

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

				if((fn.getSummary() != null && fn.getSummary().trim() != "") || (fn.getDescription() != null && fn.getDescription().trim() != "") || (fn.getMediaUrl() != null && fn.getMediaUrl() != "")) {
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
		nodeHTMLWrapper.addClass("TopDownFeedNodeRenderer_wrapper");
		nodeHTMLWrapper.addClass(rendererTheme);

		//FeedContent logo
		var feedcontentHTMLLogoContainer = $("<div>");
		feedcontentHTMLLogoContainer.addClass("TopDownFeedNodeRenderer_feedcontent_logo_container");

		nodeHTMLWrapper.append(feedcontentHTMLLogoContainer);

		var feedcontentHTMLLogoShadow = $("<div>");
		feedcontentHTMLLogoShadow.addClass("TopDownFeedNodeRenderer_feedcontent_logo_shadow");

		feedcontentHTMLLogoContainer.append(feedcontentHTMLLogoShadow);

		var feedcontentHTMLLogoColor = $("<div>");
		feedcontentHTMLLogoColor.addClass("TopDownFeedNodeRenderer_feedcontent_logo_color");

		feedcontentHTMLLogoContainer.append(feedcontentHTMLLogoColor);

		var feedcontentHTMLLogo = $("<div>");
		feedcontentHTMLLogo.addClass("TopDownFeedNodeRenderer_feedcontent_logo");

		feedcontentHTMLLogoContainer.append(feedcontentHTMLLogo);

		//TitleContainer
		var titleContainer = $("<div>");
		titleContainer.addClass("TopDownFeedNodeRenderer_title_container");

		nodeHTMLWrapper.append(titleContainer);

		var titleContainerSpan = $("<span>");
		if(info.getTitle() != null) {
			titleContainerSpan.html(info.getTitle());
		} else {
			titleContainerSpan.html("");
		}
		titleContainer.append(titleContainerSpan);

		//Main
		var nodeMain = $("<div>");
		nodeMain.addClass("TopDownFeedNodeRenderer_main");

		nodeHTMLWrapper.append(nodeMain);

		//Main -> Arrow
		var nodeMainArrow = $("<div>");
		nodeMainArrow.addClass("TopDownFeedNodeRenderer_main_arrow");
		nodeMainArrow.html("&#9652;");
		nodeMain.append(nodeMainArrow);

		//Main -> Message
		var nodeMainMessage = $("<div>");
		nodeMainMessage.addClass("TopDownFeedNodeRenderer_main_message");
		nodeMainMessage.addClass("pull-left");

		nodeMain.append(nodeMainMessage);

		var nodeMainMessageSpan = $("<span>");
		if(info.getDescription() != null) {
			nodeMainMessageSpan.html(info.getDescription());
		}
		nodeMainMessage.append(nodeMainMessageSpan);

		//Main -> Picture
		if(info.getMediaUrl() != null && info.getMediaUrl() != "") {
			var nodeMainPicture = $("<div>");
			nodeMainPicture.addClass("TopDownFeedNodeRenderer_main_picture");
			nodeMainPicture.addClass("pull-left");

			nodeMain.append(nodeMainPicture);

			nodeMainPicture.css("background-image", "url('" + info.getMediaUrl() + "')");

			if(info.getDescription() != null && info.getDescription().trim() != "") {
				nodeMainMessage.addClass("TopDownFeedNodeRenderer_main_message_with_picture");
			} else {
				nodeMainMessage.addClass("TopDownFeedNodeRenderer_main_message_empty");
				nodeMainPicture.addClass("TopDownFeedNodeRenderer_main_picture_alone");
			}
		}

		//Clearfix for Main
		var clearFixMain = $("<div>");
		clearFixMain.addClass("clearfix");
		nodeMain.append(clearFixMain);

		//Footer
		var nodeFooter = $("<div>");
		nodeFooter.addClass("TopDownFeedNodeRenderer_footer");

		nodeHTMLWrapper.append(nodeFooter);

		//Footer -> Author
		var nodeFooterAuthor = $("<div>");
		nodeFooterAuthor.addClass("TopDownFeedNodeRenderer_footer_author");
		nodeFooterAuthor.addClass("pull-left");

		var nodeFooterAuthorSpan = $("<span>");
		if(info.getAuthor() != null) {
			nodeFooterAuthorSpan.html(info.getAuthor());
		}
		nodeFooterAuthor.append(nodeFooterAuthorSpan);

		nodeFooter.append(nodeFooterAuthor);

		//Footer -> date
		var nodeFooterDate = $("<div>");
		nodeFooterDate.addClass("TopDownFeedNodeRenderer_footer_date");
		nodeFooterDate.addClass("pull-right");

		nodeFooter.append(nodeFooterDate);

		var nodeFooterDateSpan = $("<span>");

		if(info.getCreationDate() != null) {
			var creationDate:any = moment(info.getCreationDate());
			var displayCreationDate = creationDate.fromNow();
			nodeFooterDateSpan.html(displayCreationDate);
		}

		nodeFooterDate.append(nodeFooterDateSpan);

		var clearFixNodeFooter = $("<div>");
		clearFixNodeFooter.addClass("clearfix");
		nodeFooter.append(clearFixNodeFooter);

		$(domElem).css("overflow", "visible");
		$(domElem).append(nodeHTMLWrapper);

		titleContainer.textfill({
			minFontPixels: 30,
			maxFontPixels: 600
		});

		nodeMainMessage.textfill({
			minFontPixels: 30,
			maxFontPixels: 600
		});

		nodeFooterAuthor.textfill({
			maxFontPixels: 600
		});

		nodeFooterDate.textfill({
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
		if(info.getMediaUrl() != null && info.getMediaUrl() != "") {

			var nodeMainPictures = $(domElem).find(".TopDownFeedNodeRenderer_main_picture");
			var nodeMainPicture;
			if(nodeMainPictures.length > 0) {
				nodeMainPicture = nodeMainPictures.first();
			} else {
				nodeMainPicture = $("<div>");
				nodeMainPicture.addClass("TopDownFeedNodeRenderer_main_picture");
				nodeMainPicture.addClass("pull-left");
			}

			nodeMainPicture.css("background-image", "url('" + info.getMediaUrl() + "')");

			var nodeMainMessage = $(domElem).find(".TopDownFeedNodeRenderer_main_message").first();
			nodeMainMessage.removeClass("TopDownFeedNodeRenderer_main_message_with_picture");
			nodeMainMessage.removeClass("TopDownFeedNodeRenderer_main_message_empty");
			nodeMainMessage.removeClass("TopDownFeedNodeRenderer_main_picture_alone");

			if(info.getDescription() != null && info.getDescription().trim() != "") {
				nodeMainMessage.addClass("TopDownFeedNodeRenderer_main_message_with_picture");
			} else {
				nodeMainMessage.addClass("TopDownFeedNodeRenderer_main_message_empty");
				nodeMainPicture.addClass("TopDownFeedNodeRenderer_main_picture_alone");
			}

		} else {
			$(domElem).find(".TopDownFeedNodeRenderer_main_picture").remove();
		}

		var nodeFooterAuthor = $(domElem).find(".TopDownFeedNodeRenderer_footer_author").first();
		nodeFooterAuthor.empty();
		var nodeFooterAuthorSpan = $("<span>");
		if(info.getAuthor() != null) {
			nodeFooterAuthorSpan.html(info.getAuthor());
		}
		nodeFooterAuthor.append(nodeFooterAuthorSpan);

		nodeFooterAuthor.textfill({
			maxFontPixels: 600
		});

		var nodeFooterDate = $(domElem).find(".TopDownFeedNodeRenderer_footer_date").first();
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


		var nodeMainMessage = $(domElem).find(".TopDownFeedNodeRenderer_main_message").first();
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

		var titleContainer = $(domElem).find(".TopDownFeedNodeRenderer_title_container").first();
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
		});

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