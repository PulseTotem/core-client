/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/TweetList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Tweet.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class TweetHalfPictureHalfUserRenderer implements Renderer<Tweet> {
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
		tweetHTMLWrapper.addClass("TweetHalfPictureHalfUserRenderer_wrapper");

		var tweetHTMLLogoContainer = $("<div>");
		tweetHTMLLogoContainer.addClass("TweetHalfPictureHalfUserRenderer_twitter_logo_container");

		tweetHTMLWrapper.append(tweetHTMLLogoContainer);

		var tweetHTMLLogoShadow = $("<div>");
		tweetHTMLLogoShadow.addClass("TweetHalfPictureHalfUserRenderer_twitter_logo_shadow");

		tweetHTMLLogoContainer.append(tweetHTMLLogoShadow);

		var tweetHTMLLogoColor = $("<div>");
		tweetHTMLLogoColor.addClass("TweetHalfPictureHalfUserRenderer_twitter_logo_color");

		tweetHTMLLogoContainer.append(tweetHTMLLogoColor);

		var tweetHTMLLogo = $("<div>");
		tweetHTMLLogo.addClass("TweetHalfPictureHalfUserRenderer_twitter_logo");

		tweetHTMLLogoContainer.append(tweetHTMLLogo);

		//Begin : Top
		var tweetHTMLTop = $("<div>");
		tweetHTMLTop.addClass("TweetHalfPictureHalfUserRenderer_top");

		tweetHTMLWrapper.append(tweetHTMLTop);
		//End : Top

		//Begin : Bottom
		var tweetHTMLBottom = $("<div>");
		tweetHTMLBottom.addClass("TweetHalfPictureHalfUserRenderer_bottom");

		tweetHTMLWrapper.append(tweetHTMLBottom);

		var tweetProfilPictureDiv = $("<div>");
		tweetProfilPictureDiv.addClass("TweetHalfPictureHalfUserRenderer_profil_picture");

		tweetHTMLBottom.append(tweetProfilPictureDiv);

		var tweetProfilPictureImg = $("<img>");
		tweetProfilPictureImg.addClass("img-circle");
		tweetProfilPictureImg.attr("src", info.getOwner().getProfilPicture());

		tweetProfilPictureDiv.append(tweetProfilPictureImg);

		var tweetHTMLBottomContent = $("<div>");
		tweetHTMLBottomContent.addClass("TweetHalfPictureHalfUserRenderer_bottom_content");

		tweetHTMLBottom.append(tweetHTMLBottomContent);
		//End : Bottom

		//Begin : Footer
		var tweetFooter = $("<div>");
		tweetFooter.addClass("TweetHalfPictureHalfUserRenderer_footer");

		var tweetCreateDate = $("<div>");
		tweetCreateDate.addClass("TweetHalfPictureHalfUserRenderer_create_date");
		var creationDate : any = moment(info.getCreationDate());
		var displayCreationDate = creationDate.fromNow();
		tweetCreateDate.html(displayCreationDate);

		tweetFooter.append(tweetCreateDate);

		var tweetFavoriteDiv = $("<div>");
		tweetFavoriteDiv.addClass("TweetHalfPictureHalfUserRenderer_favorite_count");
		var glyphiconStar = $("<span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\">");
		var tweetFavoriteContent = $("<span>&nbsp;" + info.getFavoriteCount() + "</span>");
		tweetFavoriteDiv.append(glyphiconStar);
		tweetFavoriteDiv.append(tweetFavoriteContent);

		tweetFooter.append(tweetFavoriteDiv);

		var tweetRetweetDiv = $("<div>");
		tweetRetweetDiv.addClass("TweetHalfPictureHalfUserRenderer_retweet_count");
		var glyphiconRetweet = $("<span class=\"glyphicon glyphicon-retweet\" aria-hidden=\"true\">");
		var tweetRetweetContent = $("<span>&nbsp;" + info.getRetweetCount() + "</span>");
		tweetRetweetDiv.append(glyphiconRetweet);
		tweetRetweetDiv.append(tweetRetweetContent);

		tweetFooter.append(tweetRetweetDiv);

		var clearFixFooter = $("<div class=\"clearfix\"></div>");
		tweetFooter.append(clearFixFooter);
		//End : Footer

		//Begin : ProfilInfo
		var tweetProfilInfoDiv = $("<div>");
		tweetProfilInfoDiv.addClass("TweetHalfPictureHalfUserRenderer_profil_info");

		var tweetProfilRealname = $("<div>");
		tweetProfilRealname.addClass("TweetHalfPictureHalfUserRenderer_profil_realname");
		tweetProfilRealname.html(info.getOwner().getRealname());

		tweetProfilInfoDiv.append(tweetProfilRealname);

		var tweetProfilUsername = $("<div>");
		tweetProfilUsername.addClass("TweetHalfPictureHalfUserRenderer_profil_username");
		tweetProfilUsername.html(info.getOwner().getUsername());

		tweetProfilInfoDiv.append(tweetProfilUsername);

		var clearFixProfil = $("<div class=\"clearfix\"></div>");
		tweetProfilInfoDiv.append(clearFixProfil);
		//End : ProfilInfo

		var tweetContentWrapper = $("<div>");
		tweetContentWrapper.addClass("TweetHalfPictureHalfUserRenderer_content_wrapper");

		var tweetContentWrapperSpan = $("<span>");
		tweetContentWrapperSpan.html(info.getMessage());

		tweetContentWrapper.append(tweetContentWrapperSpan);

		if(info.getPictures().length > 0) {

			tweetHTMLTop.addClass("TweetHalfPictureHalfUserRenderer_top_with_image");
			tweetHTMLBottom.addClass("TweetHalfPictureHalfUserRenderer_bottom_with_image");

			var picture : Picture = info.getPictures()[0];
			var picURL : PictureURL = null;
			if(picture.getMedium() != null) {
				picURL = picture.getMedium();
			} else if(picture.getSmall() != null) {
				picURL = picture.getSmall();
			} else if(picture.getThumb() != null) {
				picURL = picture.getThumb();
			}

			var tweetHTMLWrapperBackground = $("<div>");
			tweetHTMLWrapperBackground.addClass("TweetHalfPictureHalfUserRenderer_wrapperbackground");

			tweetHTMLWrapperBackground.css("background-image", "url('" + picURL.getURL() + "')");

			tweetHTMLTop.append(tweetHTMLWrapperBackground);

			var tweetHTMLContent = $("<div>");
			tweetHTMLContent.addClass("TweetHalfPictureHalfUserRenderer_content");

			tweetHTMLBottomContent.append(tweetHTMLContent);

			var tweetHTMLHeader = $("<div>");
			tweetHTMLHeader.addClass("TweetHalfPictureHalfUserRenderer_header");

			tweetHTMLContent.append(tweetHTMLHeader);

			tweetHTMLHeader.append(tweetProfilInfoDiv);

			//Adding content
			tweetHTMLContent.append(tweetContentWrapper);

			tweetHTMLContent.append(tweetFooter);
		} else {
			var tweetHTMLContent = $("<div>");
			tweetHTMLContent.addClass("TweetHalfPictureHalfUserRenderer_content");

			tweetHTMLTop.append(tweetHTMLContent);

			//Adding content
			tweetHTMLContent.append(tweetContentWrapper);

			tweetHTMLContent.append(tweetFooter);

			tweetHTMLBottomContent.append(tweetProfilInfoDiv);
		}

		$(domElem).css("overflow", "visible");
		$(domElem).append(tweetHTMLWrapper);

		tweetContentWrapper.bigtext();

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
		var tweetProfilPictureDiv = $(domElem).find(".TweetHalfPictureHalfUserRenderer_profil_picture").first();
		tweetProfilPictureDiv.empty();
		var tweetProfilPictureImg = $("<img>");
		tweetProfilPictureImg.addClass("img-circle");
		tweetProfilPictureImg.attr("src", info.getOwner().getProfilPicture());
		tweetProfilPictureDiv.append(tweetProfilPictureImg);

		var tweetCreateDate = $(domElem).find(".TweetHalfPictureHalfUserRenderer_create_date").first();
		var creationDate : any = moment(info.getCreationDate());
		var displayCreationDate = creationDate.fromNow();
		tweetCreateDate.html(displayCreationDate);

		var tweetFavoriteDiv = $(domElem).find(".TweetHalfPictureHalfUserRenderer_favorite_count").first();
		tweetFavoriteDiv.empty();
		var glyphiconStar = $("<span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\">");
		var tweetFavoriteContent = $("<span>&nbsp;" + info.getFavoriteCount() + "</span>");
		tweetFavoriteDiv.append(glyphiconStar);
		tweetFavoriteDiv.append(tweetFavoriteContent);

		var tweetRetweetDiv = $(domElem).find(".TweetHalfPictureHalfUserRenderer_retweet_count").first();
		tweetRetweetDiv.empty();
		var glyphiconRetweet = $("<span class=\"glyphicon glyphicon-retweet\" aria-hidden=\"true\">");
		var tweetRetweetContent = $("<span>&nbsp;" + info.getRetweetCount() + "</span>");
		tweetRetweetDiv.append(glyphiconRetweet);
		tweetRetweetDiv.append(tweetRetweetContent);

		var tweetProfilRealname = $(domElem).find(".TweetHalfPictureHalfUserRenderer_profil_realname").first();
		tweetProfilRealname.html(info.getOwner().getRealname());

		var tweetProfilUsername = $(domElem).find(".TweetHalfPictureHalfUserRenderer_profil_username").first();
		tweetProfilUsername.html(info.getOwner().getUsername());

		var tweetContentWrapper = $(domElem).find(".TweetHalfPictureHalfUserRenderer_content_wrapper").first();
		tweetContentWrapper.empty();
		var tweetContentWrapperSpan = $("<span>");
		tweetContentWrapperSpan.html(info.getMessage());
		tweetContentWrapper.append(tweetContentWrapperSpan);
		tweetContentWrapper.bigtext();


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
		//Nothing to do.

		endCallback();
	}
}