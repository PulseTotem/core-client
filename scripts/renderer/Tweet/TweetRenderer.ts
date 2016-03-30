/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/TweetList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Tweet.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery

class TweetRenderer implements Renderer<Tweet> {
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
	 * @param {string} rendererTheme - The Renderer's theme.
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : Tweet, domElem : any, rendererTheme : string, endCallback : Function) {
		var tweetHTML = $("<div>");
		tweetHTML.addClass("TweetRenderer_tweet");

		var tweetHeader = $("<div>");
		tweetHeader.addClass("TweetRenderer_header");

		tweetHTML.append(tweetHeader);

		var tweetProfilPictureDiv = $("<div>");
		tweetProfilPictureDiv.addClass("TweetRenderer_profil_picture");

		tweetHeader.append(tweetProfilPictureDiv);

		var tweetProfilPictureImg = $("<img>");
		tweetProfilPictureImg.addClass("img-circle");
		tweetProfilPictureImg.attr("src", info.getOwner().getProfilPicture());

		tweetProfilPictureDiv.append(tweetProfilPictureImg);

		var tweetProfilInfoDiv = $("<div>");
		tweetProfilInfoDiv.addClass("TweetRenderer_profil_info");

		tweetHeader.append(tweetProfilInfoDiv);

		var tweetProfilRealname = $("<div>");
		tweetProfilRealname.addClass("TweetRenderer_profil_realname");
		tweetProfilRealname.html(info.getOwner().getRealname());

		tweetProfilInfoDiv.append(tweetProfilRealname);

		var tweetProfilUsername = $("<div>");
		tweetProfilUsername.addClass("TweetRenderer_profil_username");
		tweetProfilUsername.html(info.getOwner().getUsername());

		tweetProfilInfoDiv.append(tweetProfilUsername);

		var tweetTwitterLogo = $("<div>");
		tweetTwitterLogo.addClass("TweetRenderer_twitter_logo");

		tweetHeader.append(tweetTwitterLogo);


		var clearFixHeader = $("<div class=\"clearfix\"></div>");

		tweetHeader.append(clearFixHeader);

		var tweetContent = $("<div>");
		tweetContent.addClass("TweetRenderer_content");
		tweetContent.html(info.getMessage());

		tweetHTML.append(tweetContent);

		if(info.getPictures().length > 0) {
			var tweetPictures = $("<div>");
			tweetPictures.addClass("TweetRenderer_pictures");

			info.getPictures().forEach(function(picture : Picture) {
				var tweetPicture = $("<img>");
				tweetPicture.addClass("img-responsive img-thumbnail pull-left");
				tweetPicture.attr("src", picture.getThumb().getURL());

				tweetPictures.append(tweetPicture);
			});

			var clearFixPictures = $("<div class=\"clearfix\"></div>");
			tweetPictures.append(clearFixPictures);

			tweetHTML.append(tweetPictures);
		}

		var tweetFooter = $("<div>");
		tweetFooter.addClass("TweetRenderer_footer");

		tweetHTML.append(tweetFooter);

		var tweetCreateDate = $("<div>");
		tweetCreateDate.addClass("TweetRenderer_create_date");
		var DateClass : any = <any>Date;
		var creationDate : any = new DateClass(info.getCreationDate());
		var displayCreationDate = creationDate.toString("dd/MM/yyyy ") + creationDate.toString("HH") + "h" + creationDate.toString("mm");
		tweetCreateDate.html(displayCreationDate);

		tweetFooter.append(tweetCreateDate);

		var tweetFavoriteDiv = $("<div>");
		tweetFavoriteDiv.addClass("TweetRenderer_favorite_count");
		var glyphiconStar = $("<span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\">");
		var tweetFavoriteContent = $("<span>&nbsp;" + info.getFavoriteCount() + "</span>");
		tweetFavoriteDiv.append(glyphiconStar);
		tweetFavoriteDiv.append(tweetFavoriteContent);

		tweetFooter.append(tweetFavoriteDiv);

		var tweetRetweetDiv = $("<div>");
		tweetRetweetDiv.addClass("TweetRenderer_retweet_count");
		var glyphiconRetweet = $("<span class=\"glyphicon glyphicon-retweet\" aria-hidden=\"true\">");
		var tweetRetweetContent = $("<span>&nbsp;" + info.getRetweetCount() + "</span>");
		tweetRetweetDiv.append(glyphiconRetweet);
		tweetRetweetDiv.append(tweetRetweetContent);

		tweetFooter.append(tweetRetweetDiv);

		var clearFixFooter = $("<div class=\"clearfix\"></div>");
		tweetFooter.append(clearFixFooter);

		$(domElem).append(tweetHTML);

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
	updateRender(info : Tweet, domElem : any, rendererTheme : string, endCallback : Function) {
		var tweetProfilPictureDiv = $(domElem).find(".TweetRenderer_profil_picture").first();
		tweetProfilPictureDiv.empty();
		tweetProfilPictureDiv.addClass("TweetRenderer_profil_picture");
		var tweetProfilPictureImg = $("<img>");
		tweetProfilPictureImg.addClass("img-circle");
		tweetProfilPictureImg.attr("src", info.getOwner().getProfilPicture());
		tweetProfilPictureDiv.append(tweetProfilPictureImg);

		var tweetProfilRealname = $(domElem).find(".TweetRenderer_profil_realname").first();
		tweetProfilRealname.html(info.getOwner().getRealname());

		var tweetProfilUsername = $(domElem).find(".TweetRenderer_profil_username").first();
		tweetProfilUsername.html(info.getOwner().getUsername());

		var tweetContent = $(domElem).find(".TweetRenderer_content").first();
		tweetContent.html(info.getMessage());

		var tweetCreateDate = $(domElem).find(".TweetRenderer_create_date").first();
		tweetCreateDate.empty();
		var DateClass : any = <any>Date;
		var creationDate : any = new DateClass(info.getCreationDate());
		var displayCreationDate = creationDate.toString("dd/MM/yyyy ") + creationDate.toString("HH") + "h" + creationDate.toString("mm");
		tweetCreateDate.html(displayCreationDate);

		var tweetFavoriteDiv = $(domElem).find(".TweetRenderer_favorite_count").first();
		tweetFavoriteDiv.empty();
		tweetFavoriteDiv.addClass("TweetRenderer_favorite_count");
		var glyphiconStar = $("<span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\">");
		var tweetFavoriteContent = $("<span>&nbsp;" + info.getFavoriteCount() + "</span>");
		tweetFavoriteDiv.append(glyphiconStar);
		tweetFavoriteDiv.append(tweetFavoriteContent);

		var tweetRetweetDiv = $(domElem).find(".TweetRenderer_retweet_count").first();
		tweetRetweetDiv.empty();
		tweetRetweetDiv.addClass("TweetRenderer_retweet_count");
		var glyphiconRetweet = $("<span class=\"glyphicon glyphicon-retweet\" aria-hidden=\"true\">");
		var tweetRetweetContent = $("<span>&nbsp;" + info.getRetweetCount() + "</span>");
		tweetRetweetDiv.append(glyphiconRetweet);
		tweetRetweetDiv.append(tweetRetweetContent);

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
	animate(info : Tweet, domElem : any, rendererTheme : string, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}