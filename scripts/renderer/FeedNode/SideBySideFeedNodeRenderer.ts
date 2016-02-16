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

class SideBySideFeedNodeRenderer implements Renderer<FeedNode> {

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
				feedNodes.push(fn);

				//TODO
				/*t.getPictures().forEach(function(picture : Picture) {
					var picSizeToLoad : string = "";
					if(picture.getOriginal() != null) {
						picSizeToLoad = "";
					} else if(picture.getLarge() != null) {
						picSizeToLoad = "large";
					} else if(picture.getMedium() != null) {
						picSizeToLoad = "medium";
					} else if(picture.getSmall() != null) {
						picSizeToLoad = "small";
					} else if(picture.getThumb() != null) {
						picSizeToLoad = "thumb";
					}
					PictureHelper.preloadImage(picture, picSizeToLoad);
				});*/
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
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : FeedNode, domElem : any, endCallback : Function) {
		var tweetHTMLWrapper = $("<div>");
		tweetHTMLWrapper.addClass("SideBySideFeedNodeRenderer_wrapper");

		//Profil
		var tweetProfil = $("<div>");
		tweetProfil.addClass("SideBySideFeedNodeRenderer_profil");
		tweetProfil.addClass("pull-left");

		tweetHTMLWrapper.append(tweetProfil);

		var tweetProfilPictureDiv = $("<div>");
		tweetProfilPictureDiv.addClass("SideBySideFeedNodeRenderer_profil_picture");
		//tweetProfilPictureDiv.css("background-image", "url('" + info.getOwner().getProfilPicture() + "')");

		var tweetProfilPictureImg = $("<img>");
		tweetProfilPictureImg.addClass("SideBySideFeedNodeRenderer_profil_picture_img");
		tweetProfilPictureImg.attr("src", info.getOwner().getProfilPicture());
		tweetProfilPictureDiv.append(tweetProfilPictureImg);

		tweetProfil.append(tweetProfilPictureDiv);

		var tweetProfilRealname = $("<div>");
		tweetProfilRealname.addClass("SideBySideFeedNodeRenderer_profil_realname");
		var tweetProfilRealnameSpan = $("<span>");
		tweetProfilRealnameSpan.html(info.getOwner().getRealname());
		tweetProfilRealname.append(tweetProfilRealnameSpan);

		tweetProfil.append(tweetProfilRealname);

		var tweetProfilUsername = $("<div>");
		tweetProfilUsername.addClass("SideBySideFeedNodeRenderer_profil_username");
		var tweetProfilUsernameSpan = $("<span>");
		tweetProfilUsernameSpan.html(info.getOwner().getUsername());
		tweetProfilUsername.append(tweetProfilUsernameSpan);

		tweetProfil.append(tweetProfilUsername);

		//Content
		var tweetContent = $("<div>");
		tweetContent.addClass("SideBySideFeedNodeRenderer_content");
		tweetContent.addClass("pull-left");

		tweetHTMLWrapper.append(tweetContent);

		//Content -> Arrow
		var tweetContentArrow = $("<div>");
		tweetContentArrow.addClass("SideBySideFeedNodeRenderer_content_arrow");
		tweetContentArrow.html("&#9664;");
		tweetContent.append(tweetContentArrow);

		//Content -> Message
		var tweetContentMessage = $("<div>");
		tweetContentMessage.addClass("SideBySideFeedNodeRenderer_content_message");

		tweetContent.append(tweetContentMessage);

		//Content -> Message -> Header
		var tweetContentMessageHeader = $("<div>");
		tweetContentMessageHeader.addClass("SideBySideFeedNodeRenderer_content_message_header");

		tweetContentMessage.append(tweetContentMessageHeader);

		var creationDate : any = moment(info.getCreationDate());
		var displayCreationDate = creationDate.fromNow();
		var tweetContentMessageHeaderSpan = $("<span>");
		tweetContentMessageHeaderSpan.html(displayCreationDate);

		tweetContentMessageHeader.append(tweetContentMessageHeaderSpan);

		//Content -> Message -> Main
		var tweetContentMessageMain = $("<div>");
		tweetContentMessageMain.addClass("SideBySideFeedNodeRenderer_content_message_main");

		tweetContentMessage.append(tweetContentMessageMain);

		var tweetContentMessageSpan = $("<span>");
		tweetContentMessageSpan.html(info.getMessage());

		tweetContentMessageMain.append(tweetContentMessageSpan);

		//Content -> Message -> Footer
		var tweetContentMessageFooter = $("<div>");
		tweetContentMessageFooter.addClass("SideBySideFeedNodeRenderer_content_message_footer");

		tweetContentMessage.append(tweetContentMessageFooter);

		//Content -> Message -> Footer -> Favorite
		var favoriteSpan = $("<span>");
		favoriteSpan.addClass("SideBySideFeedNodeRenderer_content_message_footer_favorite");
		favoriteSpan.addClass("pull-right");
		var favoriteContent = $("<span>");
		favoriteContent.addClass("badge");
		var glyphiconStar = $("<span>");
		glyphiconStar.addClass("glyphicon");
		glyphiconStar.addClass("glyphicon-star");

		favoriteContent.append(glyphiconStar);
		favoriteContent.append("&nbsp;" + info.getFavoriteCount());
		favoriteSpan.append(favoriteContent);

		tweetContentMessageFooter.append(favoriteSpan);

		//Content -> Message -> Footer -> Retweet
		var retweetSpan = $("<span>");
		retweetSpan.addClass("SideBySideFeedNodeRenderer_content_message_footer_retweet");
		retweetSpan.addClass("pull-right");
		var retweetContent = $("<span>");
		retweetContent.addClass("badge");
		var glyphiconRetweet = $("<span>");
		glyphiconRetweet.addClass("glyphicon");
		glyphiconRetweet.addClass("glyphicon-retweet");

		retweetContent.append(glyphiconRetweet);
		retweetContent.append("&nbsp;" + info.getRetweetCount());
		retweetSpan.append(retweetContent);

		tweetContentMessageFooter.append(retweetSpan);

		var clearFixtweetContentMessageFooter = $("<div>");
		clearFixtweetContentMessageFooter.addClass("clearfix");
		tweetContentMessageFooter.append(clearFixtweetContentMessageFooter);

		//Content -> Pictures
		var picturesHTMLElems = [];
		info.getPictures().forEach(function(picture : Picture) {
			var tweetContentPicture = $("<div>");
			tweetContentPicture.addClass("SideBySideFeedNodeRenderer_content_picture");
			tweetContentPicture.addClass("SideBySideFeedNodeRenderer_content_picture_" + picture.getId());

			tweetContent.append(tweetContentPicture);

			var picURL : PictureURL = null;
			if(picture.getOriginal() != null) {
				picURL = picture.getOriginal();
			} else if(picture.getLarge() != null) {
				picURL = picture.getLarge();
			} else if(picture.getMedium() != null) {
				picURL = picture.getMedium();
			} else if(picture.getSmall() != null) {
				picURL = picture.getSmall();
			} else if(picture.getThumb() != null) {
				picURL = picture.getThumb();
			}

			tweetContentPicture.css("background-image", "url('" + picURL.getURL() + "')");

			picturesHTMLElems.push(tweetContentPicture);
		});


		//Clearfix for Wrapper
		var clearFixtweetHTMLWrapper = $("<div>");
		clearFixtweetHTMLWrapper.addClass("clearfix");
		tweetHTMLWrapper.append(clearFixtweetHTMLWrapper);

		$(domElem).append(tweetHTMLWrapper);

		var contentWidth = tweetContent.width() + 10;
		picturesHTMLElems.forEach(function(elem : any) {
			elem.css("transform", "translateX(" + contentWidth + "px)");
		});

		tweetProfilRealname.textfill({
			maxFontPixels: 500
		});

		tweetProfilUsername.textfill({
			maxFontPixels: 500
		});

		tweetContentMessageHeader.textfill({
			maxFontPixels: 500
		});

		tweetContentMessageMain.textfill({
			maxFontPixels: 500
		});

		favoriteSpan.textfill({
			maxFontPixels: 500
		});

		retweetSpan.textfill({
			maxFontPixels: 500
		});

		endCallback();
	}

	/**
	 * Update rendering Info in specified DOM Element.
	 *
	 * @method updateRender
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {Function} endCallback - Callback function called at the end of updateRender method.
	 */
	updateRender(info : FeedNode, domElem : any, endCallback : Function) {

		var tweetProfilPictureImg = $(domElem).find(".SideBySideFeedNodeRenderer_profil_picture_img").first();
		tweetProfilPictureImg.attr("src", info.getOwner().getProfilPicture());

		var tweetProfilRealname = $(domElem).find(".SideBySideFeedNodeRenderer_profil_realname").first();
		tweetProfilRealname.empty();
		var tweetProfilRealnameSpan = $("<span>");
		tweetProfilRealnameSpan.html(info.getOwner().getRealname());
		tweetProfilRealname.append(tweetProfilRealnameSpan);

		tweetProfilRealname.textfill({
			maxFontPixels: 500
		});

		var tweetProfilUsername = $(domElem).find(".SideBySideFeedNodeRenderer_profil_username").first();
		tweetProfilUsername.empty();
		var tweetProfilUsernameSpan = $("<span>");
		tweetProfilUsernameSpan.html(info.getOwner().getUsername());
		tweetProfilUsername.append(tweetProfilUsernameSpan);

		tweetProfilUsername.textfill({
			maxFontPixels: 500
		});

		var tweetContentMessageHeader = $(domElem).find(".SideBySideFeedNodeRenderer_content_message_header").first();
		tweetContentMessageHeader.empty();
		var creationDate : any = moment(info.getCreationDate());
		var displayCreationDate = creationDate.fromNow();
		var tweetContentMessageHeaderSpan = $("<span>");
		tweetContentMessageHeaderSpan.html(displayCreationDate);
		tweetContentMessageHeader.append(tweetContentMessageHeaderSpan);

		tweetContentMessageHeader.textfill({
			maxFontPixels: 500
		});

		var tweetContentMessageMain = $(domElem).find(".SideBySideFeedNodeRenderer_content_message_main").first();
		tweetContentMessageMain.empty();
		var tweetContentMessageSpan = $("<span>");
		tweetContentMessageSpan.html(info.getMessage());

		tweetContentMessageMain.textfill({
			maxFontPixels: 500
		});

		var favoriteSpan = $(domElem).find(".SideBySideFeedNodeRenderer_content_message_footer_favorite").first();
		favoriteSpan.empty();
		var favoriteContent = $("<span>");
		favoriteContent.addClass("badge");
		var glyphiconStar = $("<span>");
		glyphiconStar.addClass("glyphicon");
		glyphiconStar.addClass("glyphicon-star");
		favoriteContent.append(glyphiconStar);
		favoriteContent.append("&nbsp;" + info.getFavoriteCount());
		favoriteSpan.append(favoriteContent);

		favoriteSpan.textfill({
			maxFontPixels: 500
		});

		var retweetSpan = $(domElem).find(".SideBySideFeedNodeRenderer_content_message_footer_retweet");
		retweetSpan.empty();
		var retweetContent = $("<span>");
		retweetContent.addClass("badge");
		var glyphiconRetweet = $("<span>");
		glyphiconRetweet.addClass("glyphicon");
		glyphiconRetweet.addClass("glyphicon-retweet");
		retweetContent.append(glyphiconRetweet);
		retweetContent.append("&nbsp;" + info.getRetweetCount());
		retweetSpan.append(retweetContent);

		retweetSpan.textfill({
			maxFontPixels: 500
		});

		info.getPictures().forEach(function(picture : Picture) {
			var tweetContentPicture = $(domElem).find(".SideBySideFeedNodeRenderer_content_picture_" + picture.getId()).first();

			var picURL : PictureURL = null;
			if(picture.getOriginal() != null) {
				picURL = picture.getOriginal();
			} else if(picture.getLarge() != null) {
				picURL = picture.getLarge();
			} else if(picture.getMedium() != null) {
				picURL = picture.getMedium();
			} else if(picture.getSmall() != null) {
				picURL = picture.getSmall();
			} else if(picture.getThumb() != null) {
				picURL = picture.getThumb();
			}

			tweetContentPicture.css("background-image", "url('" + picURL.getURL() + "')");
		});

		endCallback();
	}

	/**
	 * Animate rendering Info in specified DOM Element.
	 *
	 * @method animate
	 * @param {RenderInfo} info - The Info to animate.
	 * @param {DOM Element} domElem - The DOM Element where animate the info.
	 * @param {Function} endCallback - Callback function called at the end of animation.
	 */
	animate(info : FeedNode, domElem : any, endCallback : Function) {
		var totalDuration = info.getDurationToDisplay()*1000;
		var nbItems = info.getPictures().length + 1;
		var itemDuration = totalDuration/nbItems;

		$(domElem).find(".SideBySideFeedNodeRenderer_content_picture").each(function(index : any, elem : any) {
			$(elem).transition({
				'transform': 'translateX(0px)',
				'easing': 'easeInOutBack',
				'duration': 1000,
				'delay' : itemDuration*(index+1)
			});
		});

		endCallback();
	}
}