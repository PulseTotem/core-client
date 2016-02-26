/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/TweetList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Tweet.ts" />
/// <reference path="../Renderer.ts" />

/// <reference path="../Picture/PictureHelper.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class NotAnimateSideBySideTweetRenderer implements Renderer<Tweet> {

	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : TweetList) : Array<Tweet> {
		var tweetLists : Array<TweetList> = new Array<TweetList>();
		try {
			var newInfo = TweetList.fromJSONObject(info);
			tweetLists.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		var tweets : Array<Tweet> = new Array<Tweet>();

		for(var iTL in tweetLists) {
			var tl : TweetList = tweetLists[iTL];
			var tlTweets : Array<Tweet> = tl.getTweets();
			for(var iT in tlTweets) {
				var t : Tweet = tlTweets[iT];
				tweets.push(t);

				t.getPictures().forEach(function(picture : Picture) {
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
				});
			}
		}

		return tweets;
	}

	/**
	 * Render the Info in specified DOM Element.
	 *
	 * @method render
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : Tweet, domElem : any, endCallback : Function) {
		var tweetHTMLWrapper = $("<div>");
		tweetHTMLWrapper.addClass("NotAnimateSideBySideTweetRenderer_wrapper");

		//Tweet logo
		var tweetHTMLLogoContainer = $("<div>");
		tweetHTMLLogoContainer.addClass("NotAnimateSideBySideTweetRenderer_twitter_logo_container");

		tweetHTMLWrapper.append(tweetHTMLLogoContainer);

		var tweetHTMLLogoShadow = $("<div>");
		tweetHTMLLogoShadow.addClass("NotAnimateSideBySideTweetRenderer_twitter_logo_shadow");

		tweetHTMLLogoContainer.append(tweetHTMLLogoShadow);

		var tweetHTMLLogoColor = $("<div>");
		tweetHTMLLogoColor.addClass("NotAnimateSideBySideTweetRenderer_twitter_logo_color");

		tweetHTMLLogoContainer.append(tweetHTMLLogoColor);

		var tweetHTMLLogo = $("<div>");
		tweetHTMLLogo.addClass("NotAnimateSideBySideTweetRenderer_twitter_logo");

		tweetHTMLLogoContainer.append(tweetHTMLLogo);

		//Profil
		var tweetProfil = $("<div>");
		tweetProfil.addClass("NotAnimateSideBySideTweetRenderer_profil");
		tweetProfil.addClass("pull-left");

		tweetHTMLWrapper.append(tweetProfil);

		var tweetProfilPictureDiv = $("<div>");
		tweetProfilPictureDiv.addClass("NotAnimateSideBySideTweetRenderer_profil_picture");
		//tweetProfilPictureDiv.css("background-image", "url('" + info.getOwner().getProfilPicture() + "')");

		var tweetProfilPictureImg = $("<img>");
		tweetProfilPictureImg.addClass("NotAnimateSideBySideTweetRenderer_profil_picture_img");
		tweetProfilPictureImg.attr("src", info.getOwner().getProfilPicture());
		tweetProfilPictureDiv.append(tweetProfilPictureImg);

		tweetProfil.append(tweetProfilPictureDiv);

		var tweetProfilRealname = $("<div>");
		tweetProfilRealname.addClass("NotAnimateSideBySideTweetRenderer_profil_realname");
		var tweetProfilRealnameSpan = $("<span>");
		tweetProfilRealnameSpan.html(info.getOwner().getRealname());
		tweetProfilRealname.append(tweetProfilRealnameSpan);

		tweetProfil.append(tweetProfilRealname);

		var tweetProfilUsername = $("<div>");
		tweetProfilUsername.addClass("NotAnimateSideBySideTweetRenderer_profil_username");
		var tweetProfilUsernameSpan = $("<span>");
		tweetProfilUsernameSpan.html(info.getOwner().getUsername());
		tweetProfilUsername.append(tweetProfilUsernameSpan);

		tweetProfil.append(tweetProfilUsername);

		//Content
		var tweetContent = $("<div>");
		tweetContent.addClass("NotAnimateSideBySideTweetRenderer_content");
		tweetContent.addClass("pull-left");

		tweetHTMLWrapper.append(tweetContent);

		//Content -> Arrow
		var tweetContentArrow = $("<div>");
		tweetContentArrow.addClass("NotAnimateSideBySideTweetRenderer_content_arrow");
		tweetContentArrow.html("&#9664;");
		tweetContent.append(tweetContentArrow);

		//Content -> Message
		var tweetContentMessage = $("<div>");
		tweetContentMessage.addClass("NotAnimateSideBySideTweetRenderer_content_message");
		tweetContentMessage.addClass("pull-left");

		tweetContent.append(tweetContentMessage);

		//Content -> Message -> Header
		var tweetContentMessageHeader = $("<div>");
		tweetContentMessageHeader.addClass("NotAnimateSideBySideTweetRenderer_content_message_header");

		tweetContentMessage.append(tweetContentMessageHeader);

		var creationDate : any = moment(info.getCreationDate());
		var displayCreationDate = creationDate.fromNow();
		var tweetContentMessageHeaderSpan = $("<span>");
		tweetContentMessageHeaderSpan.html(displayCreationDate);

		tweetContentMessageHeader.append(tweetContentMessageHeaderSpan);

		//Content -> Message -> Main
		var tweetContentMessageMain = $("<div>");
		tweetContentMessageMain.addClass("NotAnimateSideBySideTweetRenderer_content_message_main");

		tweetContentMessage.append(tweetContentMessageMain);

		var tweetContentMessageSpan = $("<span>");
		tweetContentMessageSpan.html(info.getMessage());

		tweetContentMessageMain.append(tweetContentMessageSpan);

		//Content -> Message -> Footer
		var tweetContentMessageFooter = $("<div>");
		tweetContentMessageFooter.addClass("NotAnimateSideBySideTweetRenderer_content_message_footer");

		tweetContentMessage.append(tweetContentMessageFooter);

		//Content -> Message -> Footer -> Favorite
		var favoriteSpan = $("<span>");
		favoriteSpan.addClass("NotAnimateSideBySideTweetRenderer_content_message_footer_favorite");
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
		retweetSpan.addClass("NotAnimateSideBySideTweetRenderer_content_message_footer_retweet");
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
		if(info.getPictures().length > 0) {
			var picture : Picture = info.getPictures()[0];
			var tweetContentPicture = $("<div>");
			tweetContentPicture.addClass("NotAnimateSideBySideTweetRenderer_content_picture");
			tweetContentPicture.addClass("pull-left");
			tweetContentPicture.addClass("NotAnimateSideBySideTweetRenderer_content_picture_" + picture.getId());

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

			tweetContentMessage.addClass("NotAnimateSideBySideTweetRenderer_content_message_with_picture");

		}

		//Clearfix for Content
		var clearFixContent = $("<div>");
		clearFixContent.addClass("clearfix");
		tweetContent.append(clearFixContent);

		//Clearfix for Wrapper
		var clearFixtweetHTMLWrapper = $("<div>");
		clearFixtweetHTMLWrapper.addClass("clearfix");
		tweetHTMLWrapper.append(clearFixtweetHTMLWrapper);

		$(domElem).css("overflow", "visible");
		$(domElem).append(tweetHTMLWrapper);

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
			minFontPixels: 30,
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
	updateRender(info : Tweet, domElem : any, endCallback : Function) {

		var tweetProfilPictureImg = $(domElem).find(".NotAnimateSideBySideTweetRenderer_profil_picture_img").first();
		tweetProfilPictureImg.attr("src", info.getOwner().getProfilPicture());

		var tweetProfilRealname = $(domElem).find(".NotAnimateSideBySideTweetRenderer_profil_realname").first();
		tweetProfilRealname.empty();
		var tweetProfilRealnameSpan = $("<span>");
		tweetProfilRealnameSpan.html(info.getOwner().getRealname());
		tweetProfilRealname.append(tweetProfilRealnameSpan);

		tweetProfilRealname.textfill({
			maxFontPixels: 500
		});

		var tweetProfilUsername = $(domElem).find(".NotAnimateSideBySideTweetRenderer_profil_username").first();
		tweetProfilUsername.empty();
		var tweetProfilUsernameSpan = $("<span>");
		tweetProfilUsernameSpan.html(info.getOwner().getUsername());
		tweetProfilUsername.append(tweetProfilUsernameSpan);

		tweetProfilUsername.textfill({
			maxFontPixels: 500
		});

		var tweetContentMessageHeader = $(domElem).find(".NotAnimateSideBySideTweetRenderer_content_message_header").first();
		tweetContentMessageHeader.empty();
		var creationDate : any = moment(info.getCreationDate());
		var displayCreationDate = creationDate.fromNow();
		var tweetContentMessageHeaderSpan = $("<span>");
		tweetContentMessageHeaderSpan.html(displayCreationDate);
		tweetContentMessageHeader.append(tweetContentMessageHeaderSpan);

		tweetContentMessageHeader.textfill({
			maxFontPixels: 500
		});

		var tweetContentMessageMain = $(domElem).find(".NotAnimateSideBySideTweetRenderer_content_message_main").first();
		tweetContentMessageMain.empty();
		var tweetContentMessageSpan = $("<span>");
		tweetContentMessageSpan.html(info.getMessage());

		tweetContentMessageMain.textfill({
			minFontPixels: 30,
			maxFontPixels: 500
		});

		var favoriteSpan = $(domElem).find(".NotAnimateSideBySideTweetRenderer_content_message_footer_favorite").first();
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

		var retweetSpan = $(domElem).find(".NotAnimateSideBySideTweetRenderer_content_message_footer_retweet");
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

		//Content -> Pictures
		if(info.getPictures().length > 0) {
			var picture : Picture = info.getPictures()[0];
			var tweetContentPicture = $(domElem).find(".NotAnimateSideBySideTweetRenderer_content_picture_" + picture.getId()).first();

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
		}

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
	animate(info : Tweet, domElem : any, endCallback : Function) {
		endCallback();
	}
}