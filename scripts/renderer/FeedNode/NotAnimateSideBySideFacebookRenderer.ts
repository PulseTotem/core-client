/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/FeedContent.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/FeedNode.ts" />
/// <reference path="../Renderer.ts" />

/// <reference path="../Picture/PictureHelper.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class NotAnimateSideBySideFacebookRenderer implements Renderer<FeedNode> {

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

				if((fn.getDescription() != null && fn.getDescription().trim() != "") || (fn.getMediaUrl() != null && fn.getMediaUrl() != "")) {
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
		nodeHTMLWrapper.addClass("NotAnimateSideBySideFacebookRenderer_wrapper");
		nodeHTMLWrapper.addClass(rendererTheme);

		//Facebook logo
		var facebookHTMLLogoContainer = $("<div>");
		facebookHTMLLogoContainer.addClass("NotAnimateSideBySideFacebookRenderer_facebook_logo_container");

		nodeHTMLWrapper.append(facebookHTMLLogoContainer);

		var facebookHTMLLogoShadow = $("<div>");
		facebookHTMLLogoShadow.addClass("NotAnimateSideBySideFacebookRenderer_facebook_logo_shadow");

		facebookHTMLLogoContainer.append(facebookHTMLLogoShadow);

		var facebookHTMLLogoColor = $("<div>");
		facebookHTMLLogoColor.addClass("NotAnimateSideBySideFacebookRenderer_facebook_logo_color");

		facebookHTMLLogoContainer.append(facebookHTMLLogoColor);

		var facebookHTMLLogo = $("<div>");
		facebookHTMLLogo.addClass("NotAnimateSideBySideFacebookRenderer_facebook_logo");

		facebookHTMLLogoContainer.append(facebookHTMLLogo);

		// Arrow
		var nodeWrapperArrow = $("<div>");
		nodeWrapperArrow.addClass("NotAnimateSideBySideFacebookRenderer_wrapper_arrow");
		nodeWrapperArrow.html("&#9658;");
		nodeHTMLWrapper.append(nodeWrapperArrow);

		//Header
		var nodeHeader = $("<div>");
		nodeHeader.addClass("NotAnimateSideBySideFacebookRenderer_header");

		nodeHTMLWrapper.append(nodeHeader);

		//Header -> Author
		var nodeHeaderAuthor = $("<div>");
		nodeHeaderAuthor.addClass("NotAnimateSideBySideFacebookRenderer_header_author");
		nodeHeaderAuthor.addClass("pull-left");

		var nodeHeaderAuthorSpan = $("<span>");
		if(info.getAuthor() != null) {
			nodeHeaderAuthorSpan.html(info.getAuthor());
		}
		nodeHeaderAuthor.append(nodeHeaderAuthorSpan);

		nodeHeader.append(nodeHeaderAuthor);

		//Header -> date
		var nodeHeaderDate = $("<div>");
		nodeHeaderDate.addClass("NotAnimateSideBySideFacebookRenderer_header_date");
		nodeHeaderDate.addClass("pull-left");

		nodeHeader.append(nodeHeaderDate);

		var nodeHeaderDateSpan = $("<span>");

		if(info.getCreationDate() != null) {
			var creationDate:any = moment(info.getCreationDate());
			var displayCreationDate = creationDate.fromNow();
			nodeHeaderDateSpan.html(displayCreationDate);
		}

		nodeHeaderDate.append(nodeHeaderDateSpan);

		var clearFixNodeHeader = $("<div>");
		clearFixNodeHeader.addClass("clearfix");
		nodeHeader.append(clearFixNodeHeader);

		//Main
		var nodeMain = $("<div>");
		nodeMain.addClass("NotAnimateSideBySideFacebookRenderer_main");

		nodeHTMLWrapper.append(nodeMain);

		//Main -> Message
		var nodeMainMessage = $("<div>");
		nodeMainMessage.addClass("NotAnimateSideBySideFacebookRenderer_main_message");
		nodeMainMessage.addClass("pull-left");

		nodeMain.append(nodeMainMessage);

		//Main -> Message -> Content
		var nodeMainMessageContent = $("<div>");
		nodeMainMessageContent.addClass("NotAnimateSideBySideFacebookRenderer_main_message_content");

		nodeMainMessage.append(nodeMainMessageContent);

		var nodeMainMessageContentSpan = $("<span>");
		if(info.getDescription() != null) {
			nodeMainMessageContentSpan.html(info.getDescription());
		}
		nodeMainMessageContent.append(nodeMainMessageContentSpan);

		//Main -> Message -> Footer
		var nodeMainMessageFooter = $("<div>");
		nodeMainMessageFooter.addClass("NotAnimateSideBySideFacebookRenderer_main_message_footer");

		nodeMainMessage.append(nodeMainMessageFooter);

		//Main -> Message -> Footer -> Like
		var likeSpan = $("<span>");
		likeSpan.addClass("NotAnimateSideBySideFacebookRenderer_main_message_footer_like");
		likeSpan.addClass("pull-right");
		var likeContent = $("<span>");
		likeContent.addClass("badge");
		var glyphiconLike = $("<span>");
		glyphiconLike.addClass("glyphicon");
		glyphiconLike.addClass("glyphicon-heart");

		likeContent.append(glyphiconLike);
		likeContent.append("&nbsp;" + info.getSocialStats().likeCount());
		likeSpan.append(likeContent);

		nodeMainMessageFooter.append(likeSpan);

		//Main -> Message -> Footer -> Share
		var shareSpan = $("<span>");
		shareSpan.addClass("NotAnimateSideBySideFacebookRenderer_main_message_footer_share");
		shareSpan.addClass("pull-right");
		var shareContent = $("<span>");
		shareContent.addClass("badge");
		var glyphiconShare = $("<span>");
		glyphiconShare.addClass("glyphicon");
		glyphiconShare.addClass("glyphicon-retweet");

		shareContent.append(glyphiconShare);
		shareContent.append("&nbsp;" + info.getSocialStats().shareCount());
		shareSpan.append(shareContent);

		nodeMainMessageFooter.append(shareSpan);

		//Main -> Message -> Footer -> Comment
		var commentSpan = $("<span>");
		commentSpan.addClass("NotAnimateSideBySideFacebookRenderer_main_message_footer_comment");
		commentSpan.addClass("pull-right");
		var commentContent = $("<span>");
		commentContent.addClass("badge");
		var glyphiconComment = $("<span>");
		glyphiconComment.addClass("glyphicon");
		glyphiconComment.addClass("glyphicon-comment");

		commentContent.append(glyphiconComment);
		commentContent.append("&nbsp;" + info.getSocialStats().commentCount());
		commentSpan.append(commentContent);

		nodeMainMessageFooter.append(commentSpan);

		var clearFixNodeMainMessageFooter = $("<div>");
		clearFixNodeMainMessageFooter.addClass("clearfix");
		nodeMainMessageFooter.append(clearFixNodeMainMessageFooter);

		//Main -> Picture
		if(info.getMediaUrl() != null && info.getMediaUrl() != "") {
			var nodeMainPicture = $("<div>");
			nodeMainPicture.addClass("NotAnimateSideBySideFacebookRenderer_main_picture");
			nodeMainPicture.addClass("pull-left");

			nodeMain.append(nodeMainPicture);

			nodeMainPicture.css("background-image", "url('" + info.getMediaUrl() + "')");

			if(info.getDescription() != null && info.getDescription().trim() != "") {
				nodeMainMessage.addClass("NotAnimateSideBySideFacebookRenderer_main_message_with_picture");
			} else {
				nodeMainMessage.addClass("NotAnimateSideBySideFacebookRenderer_main_message_empty");
				nodeMainPicture.addClass("NotAnimateSideBySideFacebookRenderer_main_picture_alone");
			}
		}

		//Clearfix for Main
		var clearFixMaint = $("<div>");
		clearFixMaint.addClass("clearfix");
		nodeMain.append(clearFixMaint);

		$(domElem).css("overflow", "visible");
		$(domElem).append(nodeHTMLWrapper);

		nodeHeaderAuthor.textfill({
			maxFontPixels: 600
		});

		nodeHeaderDate.textfill({
			maxFontPixels: 600
		});

		nodeMainMessageContent.textfill({
			minFontPixels: 30,
			maxFontPixels: 600
		});

		likeSpan.textfill({
			maxFontPixels: 600
		});

		shareSpan.textfill({
			maxFontPixels: 600
		});

		commentSpan.textfill({
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

			var nodeMainPictures = $(domElem).find(".NotAnimateSideBySideFacebookRenderer_main_picture");
			var nodeMainPicture;
			if(nodeMainPictures.length > 0) {
				nodeMainPicture = nodeMainPictures.first();
			} else {
				nodeMainPicture = $("<div>");
				nodeMainPicture.addClass("NotAnimateSideBySideFacebookRenderer_main_picture");

				var nodeMain = $(domElem).find(".NotAnimateSideBySideFacebookRenderer_main").first();
				nodeMain.append(nodeMainPicture);

				var contentWidth = nodeMain.width() + 50;
				nodeMainPicture.css("transform", "translateX(" + contentWidth + "px)");
			}

			nodeMainPicture.css("background-image", "url('" + info.getMediaUrl() + "')");
		} else {
			$(domElem).find(".NotAnimateSideBySideFacebookRenderer_main_picture").remove();
		}

		var nodeHeaderAuthor = $(domElem).find(".NotAnimateSideBySideFacebookRenderer_header_author").first();
		nodeHeaderAuthor.empty();
		var nodeHeaderAuthorSpan = $("<span>");
		if(info.getAuthor() != null) {
			nodeHeaderAuthorSpan.html(info.getAuthor());
		}
		nodeHeaderAuthor.append(nodeHeaderAuthorSpan);

		nodeHeaderAuthor.textfill({
			maxFontPixels: 600
		});


		var nodeHeaderDate = $(domElem).find(".NotAnimateSideBySideFacebookRenderer_header_date").first();
		nodeHeaderDate.empty();

		var nodeHeaderDateSpan = $("<span>");

		if(info.getCreationDate() != null) {
			var creationDate:any = moment(info.getCreationDate());
			var displayCreationDate = creationDate.fromNow();
			nodeHeaderDateSpan.html(displayCreationDate);
		}

		nodeHeaderDate.append(nodeHeaderDateSpan);

		nodeHeaderDate.textfill({
			maxFontPixels: 600
		});

		var nodeMainMessageContent = $(domElem).find(".NotAnimateSideBySideFacebookRenderer_main_message_content").first();
		nodeMainMessageContent.empty();

		var nodeMainMessageContentSpan = $("<span>");
		if(info.getDescription() != null) {
			nodeMainMessageContentSpan.html(info.getDescription());
		}

		nodeMainMessageContent.append(nodeMainMessageContentSpan);

		nodeMainMessageContent.textfill({
			minFontPixels: 30,
			maxFontPixels: 600
		});

		var likeSpan = $(domElem).find(".NotAnimateSideBySideFacebookRenderer_main_message_footer_like").first();
		likeSpan.empty();
		var likeContent = $("<span>");
		likeContent.addClass("badge");
		var glyphiconLike = $("<span>");
		glyphiconLike.addClass("glyphicon");
		glyphiconLike.addClass("glyphicon-heart");

		likeContent.append(glyphiconLike);
		likeContent.append("&nbsp;" + info.getSocialStats().likeCount());
		likeSpan.append(likeContent);

		likeSpan.textfill({
			maxFontPixels: 500
		});

		var shareSpan =  $(domElem).find(".NotAnimateSideBySideFacebookRenderer_main_message_footer_share").first();
		shareSpan.empty();
		var shareContent = $("<span>");
		shareContent.addClass("badge");
		var glyphiconShare = $("<span>");
		glyphiconShare.addClass("glyphicon");
		glyphiconShare.addClass("glyphicon-retweet");

		shareContent.append(glyphiconShare);
		shareContent.append("&nbsp;" + info.getSocialStats().shareCount());
		shareSpan.append(shareContent);

		shareSpan.textfill({
			maxFontPixels: 600
		});

		var commentSpan = $(domElem).find(".NotAnimateSideBySideFacebookRenderer_main_message_footer_comment").first();
		commentSpan.empty();
		var commentContent = $("<span>");
		commentContent.addClass("badge");
		var glyphiconComment = $("<span>");
		glyphiconComment.addClass("glyphicon");
		glyphiconComment.addClass("glyphicon-comment");

		commentContent.append(glyphiconComment);
		commentContent.append("&nbsp;" + info.getSocialStats().commentCount());
		commentSpan.append(commentContent);

		commentSpan.textfill({
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