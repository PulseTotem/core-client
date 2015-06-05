/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/TweetList.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Tweet.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery

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
	 */
	render(info : Tweet, domElem : any) {
		var tweetHTMLWrapper = $("<div>");
		tweetHTMLWrapper.addClass("TweetHalfPictureHalfUserRenderer_wrapper");

		var tweetHTMLWrapperBackground = $("<div>");
		tweetHTMLWrapperBackground.addClass("TweetHalfPictureHalfUserRenderer_wrapperbackground");

		if(info.getPictures().length > 0) {

			var picture : Picture = info.getPictures()[0];
			var picURL : PictureURL = null;
			if(picture.getMedium() != null) {
				picURL = picture.getMedium();
			} else if(picture.getSmall() != null) {
				picURL = picture.getSmall();
			} else if(picture.getThumb() != null) {
				picURL = picture.getThumb();
			}

			tweetHTMLWrapperBackground.css("background-image", "url('" + picURL.getURL() + "')");
		}

		tweetHTMLWrapper.append(tweetHTMLWrapperBackground);

		var tweetHTML = $("<div>");
		tweetHTML.addClass("TweetHalfPictureHalfUserRenderer_tweet");

		if(info.getPictures().length > 0) {
			tweetHTML.css("background-color", "rgba(255, 255, 255, 0.6)");
		}

		tweetHTMLWrapper.append(tweetHTML);

		var tweetContent = $("<div>");
		tweetContent.addClass("TweetHalfPictureHalfUserRenderer_content");

		tweetHTML.append(tweetContent);

		var tweetContentWrapper = $("<div>");
		tweetContentWrapper.addClass("TweetHalfPictureHalfUserRenderer_content_wrapper");

		tweetContent.append(tweetContentWrapper);

		tweetContentWrapper.html(info.getMessage());

		var tweetFooter = $("<div>");
		tweetFooter.addClass("TweetHalfPictureHalfUserRenderer_footer");

		tweetContent.append(tweetFooter);

		var tweetCreateDate = $("<div>");
		tweetCreateDate.addClass("TweetHalfPictureHalfUserRenderer_create_date");
		var DateClass : any = <any>Date;
		var creationDate : any = new DateClass(info.getCreationDate());
		var displayCreationDate = creationDate.toString("dd/MM/yyyy ") + creationDate.toString("HH") + "h" + creationDate.toString("mm");
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

		var tweetCard = $("<div>");
		tweetCard.addClass("TweetHalfPictureHalfUserRenderer_card");

		tweetHTML.append(tweetCard);

		var tweetHeader = $("<div>");
		tweetHeader.addClass("TweetHalfPictureHalfUserRenderer_header");

		tweetCard.append(tweetHeader);

		var tweetProfilPictureDiv = $("<div>");
		tweetProfilPictureDiv.addClass("TweetHalfPictureHalfUserRenderer_profil_picture");

		tweetHeader.append(tweetProfilPictureDiv);

		var tweetProfilPictureImg = $("<img>");
		tweetProfilPictureImg.addClass("img-circle");
		tweetProfilPictureImg.attr("src", info.getOwner().getProfilPicture());

		tweetProfilPictureDiv.append(tweetProfilPictureImg);

		var tweetProfilInfoDiv = $("<div>");
		tweetProfilInfoDiv.addClass("TweetHalfPictureHalfUserRenderer_profil_info");

		tweetHeader.append(tweetProfilInfoDiv);

		var tweetProfilRealname = $("<div>");
		tweetProfilRealname.addClass("TweetHalfPictureHalfUserRenderer_profil_realname");
		tweetProfilRealname.html(info.getOwner().getRealname());

		tweetProfilInfoDiv.append(tweetProfilRealname);

		var tweetProfilUsername = $("<div>");
		tweetProfilUsername.addClass("TweetHalfPictureHalfUserRenderer_profil_username");
		tweetProfilUsername.html(info.getOwner().getUsername());

		tweetProfilInfoDiv.append(tweetProfilUsername);

		var tweetTwitterLogo = $("<div>");
		tweetTwitterLogo.addClass("TweetHalfPictureHalfUserRenderer_twitter_logo");

		tweetHeader.append(tweetTwitterLogo);


		var clearFixHeader = $("<div class=\"clearfix\"></div>");

		tweetHeader.append(clearFixHeader);

		$(domElem).append(tweetHTMLWrapper);
	}
}