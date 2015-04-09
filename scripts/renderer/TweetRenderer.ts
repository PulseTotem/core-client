/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/TweetList.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Tweet.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Info.ts" />
/// <reference path="../policy/RenderPolicy.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery

class TweetRenderer implements Renderer<Tweet> {
	transformForBehaviour(listInfos : Array<TweetList>, renderPolicy : RenderPolicy<any>) : Array<Tweet> {
		var newListInfos : Array<TweetList> = new Array<TweetList>();
		try {
			newListInfos = Info.fromJSONArray(listInfos, TweetList);
		} catch(e) {
			Logger.error(e.message);
		}

		//var discountsLists : Array<DiscountsList> = renderPolicy.process(newListInfos);
		var tweetLists : Array<TweetList> = newListInfos;

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

	render(info : Tweet, domElem : any) {
		/*var feedNodeHTML = $("<div>");
		 feedNodeHTML.addClass("feednode");

		 var titleContent = $("<div>");
		 titleContent.addClass("title_content");

		 feedNodeHTML.append(titleContent);

		 var title = $("<div>");
		 title.addClass("title");

		 titleContent.append(title);

		 var logo = $("<div>");
		 logo.addClass("logo");

		 titleContent.append(logo);

		 var titleClear = $("<div>");
		 titleClear.addClass("titleClear");

		 titleContent.append(titleClear);

		 var feedContent = $("<div>");
		 feedContent.addClass("main_content");

		 feedNodeHTML.append(feedContent);

		 var summary = $("<div>");

		 feedContent.append(summary);

		 var description = $("<div>");

		 feedContent.append(description);

		 //Fullfill with info

		 title.html(info.getTitle());

		 if(info.getMediaUrl() != null) {
		 var media = $("<div>");
		 media.addClass("feednode_media");
		 var mediaImg = $("<img>");
		 mediaImg.attr("src", info.getMediaUrl());
		 media.append(mediaImg);
		 summary.append(media);
		 }

		 summary.append(info.getSummary());

		 if(info.getDescription() != info.getSummary()) {
		 description.html(info.getDescription());
		 }

		 $(domElem).empty();
		 $(domElem).append(feedNodeHTML);

		 info.setCastingDate(new Date());*/

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

		$(domElem).empty();
		$(domElem).append(tweetHTML);

		info.setCastingDate(new Date());
	}
}