/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/TweetList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Tweet.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery

class TweetListRenderer implements Renderer<TweetList> {
	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : TweetList) : Array<TweetList> {
		var tweetLists : Array<TweetList> = new Array<TweetList>();
		try {
			var newInfo = TweetList.fromJSONObject(info);
			tweetLists.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		return tweetLists;
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
	render(info : TweetList, domElem : any, rendererTheme : string, endCallback : Function) {

		var allTweets = $("<div>");
		allTweets.addClass("TweetListRenderer_allTweets");
		allTweets.addClass(rendererTheme);

		$(domElem).append(allTweets);


		var nbTweets = info.getTweets().length;
		var index = nbTweets-1;
		
		var nextTweet = function () {
			var currentTweet : Tweet = info.getTweets()[index];

			var tweetHTMLWrapper = $("<div>");
			tweetHTMLWrapper.addClass("TweetListRenderer_wrapper");

			var tweetHTMLTweet = $("<div>");
			tweetHTMLTweet.addClass("TweetListRenderer_tweet");

			if (currentTweet.getPictures().length > 0) {
				var tweetPic = $("<div>");
				tweetPic.addClass("TweetListRenderer_Picture");
				var pic : Picture = currentTweet.getPictures()[0];
				tweetPic.css("background-image","url("+pic.getOriginal().getURL()+")");
				tweetHTMLWrapper.css("height","45%");
				tweetHTMLWrapper.append(tweetPic);
				tweetHTMLTweet.css("height","33%");
			} else {
				tweetHTMLWrapper.css("height","15%");
				tweetHTMLTweet.css("height","100%");
			}

			var profilPic = $("<div>");
			profilPic.addClass("TweetListRenderer_profilpic");
			profilPic.css("background-image","url("+currentTweet.getOwner().getProfilPicture()+")");
			tweetHTMLTweet.append(profilPic);

			var allcontent = $("<div>");
			allcontent.addClass("TweetListRenderer_allcontent");

			var tweetHeader = $("<div>");
			tweetHeader.addClass("TweetListRenderer_header");

			var tweetDate = $("<span>");
			var DateClass : any = <any>Date;
			var creationDate : any = new DateClass(currentTweet.getCreationDate());
			var displayCreationDate = creationDate.toString("dd/MM/yyyy ") + creationDate.toString("HH") + "h" + creationDate.toString("mm");
			tweetDate.html(displayCreationDate);

			var tweetDateWrapper = $("<div>");
			tweetDateWrapper.addClass("TweetListRenderer_date");
			tweetDateWrapper.append(tweetDate);

			tweetHeader.append(tweetDateWrapper);

			var fullName = $("<div>");
			fullName.addClass("TweetListRenderer_fullname");
			fullName.html(currentTweet.getOwner().getRealname());
			tweetHeader.append(fullName);

			var username = $("<div>");
			username.addClass("TweetListRenderer_tweetname");
			username.html("@"+currentTweet.getOwner().getUsername());
			tweetHeader.append(username);

			allcontent.append(tweetHeader);

			var content = $("<div>");
			content.addClass("TweetListRenderer_content");

			var contentSpan = $("<span>");
			contentSpan.html(currentTweet.getMessage());
			content.append(contentSpan);

			allcontent.append(content);

			tweetHTMLTweet.append(allcontent);

			tweetHTMLWrapper.append(tweetHTMLTweet);

			allTweets.prepend(tweetHTMLWrapper);
			tweetHTMLWrapper.show('slow');

			var optionTextFill = {
				maxFontPixels: 500
			};

			fullName.textfill(optionTextFill);
			username.textfill(optionTextFill);
			content.textfill(optionTextFill);
			tweetDateWrapper.textfill(optionTextFill);

			if (index > -1) {
				index--;
				setTimeout(nextTweet, currentTweet.getDurationToDisplay()*1000);
			} else {
				endCallback();
			}
		};
		nextTweet();
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
	updateRender(info : TweetList, domElem : any, rendererTheme : string, endCallback : Function) {
		this.render(info, domElem, rendererTheme, endCallback);
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
	animate(info : TweetList, domElem : any, rendererTheme : string, endCallback : Function) {
		//Nothing to do.

		endCallback();
	}
}