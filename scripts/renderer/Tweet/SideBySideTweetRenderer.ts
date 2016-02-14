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

class SideBySideTweetRenderer implements Renderer<Tweet> {

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
		tweetHTMLWrapper.addClass("SideBySideTweetRenderer_wrapper");

		//Profil
		var tweetProfil = $("<div>");
		tweetProfil.addClass("SideBySideTweetRenderer_profil");
		tweetProfil.addClass("pull-left");

		tweetHTMLWrapper.append(tweetProfil);

		var tweetProfilPictureDiv = $("<div>");
		tweetProfilPictureDiv.addClass("SideBySideTweetRenderer_profil_picture");
		//tweetProfilPictureDiv.css("background-image", "url('" + info.getOwner().getProfilPicture() + "')");

		var tweetProfilPictureImg = $("<img>");
		tweetProfilPictureImg.attr("src", info.getOwner().getProfilPicture());
		tweetProfilPictureDiv.append(tweetProfilPictureImg);

		tweetProfil.append(tweetProfilPictureDiv);

		var tweetProfilRealname = $("<div>");
		tweetProfilRealname.addClass("SideBySideTweetRenderer_profil_realname");
		var tweetProfilRealnameSpan = $("<span>");
		tweetProfilRealnameSpan.html(info.getOwner().getRealname());
		tweetProfilRealname.append(tweetProfilRealnameSpan);

		tweetProfil.append(tweetProfilRealname);

		var tweetProfilUsername = $("<div>");
		tweetProfilUsername.addClass("SideBySideTweetRenderer_profil_username");
		var tweetProfilUsernameSpan = $("<span>");
		tweetProfilUsernameSpan.html(info.getOwner().getUsername());
		tweetProfilUsername.append(tweetProfilUsernameSpan);

		tweetProfil.append(tweetProfilUsername);

		//Content
		var tweetContent = $("<div>");
		tweetContent.addClass("SideBySideTweetRenderer_content");
		tweetContent.addClass("pull-left");

		tweetHTMLWrapper.append(tweetContent);

		//Content -> Arrow
		var tweetContentArrow = $("<div>");
		tweetContentArrow.addClass("SideBySideTweetRenderer_content_arrow");
		tweetContentArrow.html("&#9664;");
		tweetContent.append(tweetContentArrow);

		//Content -> Message
		var tweetContentMessage = $("<div>");
		tweetContentMessage.addClass("SideBySideTweetRenderer_content_message");

		tweetContent.append(tweetContentMessage);

		//Content -> Message -> Header
		var tweetContentMessageHeader = $("<div>");
		tweetContentMessageHeader.addClass("SideBySideTweetRenderer_content_message_header");

		tweetContentMessage.append(tweetContentMessageHeader);

		var creationDate : any = moment(info.getCreationDate());
		var displayCreationDate = creationDate.fromNow();
		var tweetContentMessageHeaderSpan = $("<span>");
		tweetContentMessageHeaderSpan.html(displayCreationDate);

		tweetContentMessageHeader.append(tweetContentMessageHeaderSpan);

		//Content -> Message -> Main
		var tweetContentMessageMain = $("<div>");
		tweetContentMessageMain.addClass("SideBySideTweetRenderer_content_message_main");

		tweetContentMessage.append(tweetContentMessageMain);

		var tweetContentMessageSpan = $("<span>");
		tweetContentMessageSpan.html(info.getMessage());

		tweetContentMessageMain.append(tweetContentMessageSpan);

		//Content -> Message -> Footer
		var tweetContentMessageFooter = $("<div>");
		tweetContentMessageFooter.addClass("SideBySideTweetRenderer_content_message_footer");

		tweetContentMessage.append(tweetContentMessageFooter);

		//Content -> Message -> Footer -> Favorite
		var favoriteSpan = $("<span>");
		favoriteSpan.addClass("SideBySideTweetRenderer_content_message_footer_favorite");
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
		retweetSpan.addClass("SideBySideTweetRenderer_content_message_footer_retweet");
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
		/*info.getPictures().forEach(function(picture : Picture) {
			var tweetContentPicture = $("<div>");
			tweetContentPicture.addClass("SideBySideTweetRenderer_content_picture");

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
		});*/


		//Clearfix for Wrapper
		var clearFixtweetHTMLWrapper = $("<div>");
		clearFixtweetHTMLWrapper.addClass("clearfix");
		tweetHTMLWrapper.append(clearFixtweetHTMLWrapper);

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