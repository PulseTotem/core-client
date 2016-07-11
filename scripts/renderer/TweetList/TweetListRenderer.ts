/**
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/TweetList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Tweet.ts" />
/// <reference path="../Renderer.ts" />
/// <reference path="../../core/Timer.ts" />

declare var $: any; // Use of JQuery

class TweetListRenderer implements Renderer<TweetList> {

	/**
	 * Subscriptions.
	 *
	 * @property _subscriptions
	 * @type Array
	 */
	private _subscriptions : any;

	/**
	 * DOM contents for each info.
	 *
	 * @property _domContents
	 * @type Array
	 */
	private _domContents : any;

	/**
	 * Tweets to display.
	 *
	 * @property _tweetsToDisplay
	 * @type Array
	 */
	private _tweetsToDisplay : any;

	/**
	 * Last inserted tweet.
	 *
	 * @property _lastInsertedTweet
	 * @type Array
	 */
	private _lastInsertedTweet : any;

	/**
	 * Timers.
	 *
	 * @property _timers
	 * @type Array
	 */
	private _timers : any;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		this._subscriptions = [];
		this._domContents = [];
		this._tweetsToDisplay = [];
		this._timers = [];
		this._lastInsertedTweet = [];
	}

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

		if(typeof(this._subscriptions[info.getId()]) == "undefined") {
			MessageBus.subscribe(MessageBusChannel.RENDERER, function(channel : any, data : any) {
				if(typeof(data.action) != "undefined" && data.action == MessageBusAction.REFRESH) {
					MessageBus.publishToCall(info.getCallChannel(), "RefreshInfos", null);
				}
			});

			this._subscriptions[info.getId()] = true;
		}

		if(typeof(this._domContents[info.getId()]) == "undefined") {
			var allTweets = $("<div>");
			allTweets.addClass("TweetListRenderer_allTweets");
			allTweets.addClass(rendererTheme);

			$(domElem).append(allTweets);

			this._domContents[info.getId()] = allTweets;
		} else {
			$(domElem).append(this._domContents[info.getId()]);
		}

		this.refreshTweetsToDisplay(info);

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
	updateRender(info : TweetList, domElem : any, rendererTheme : string, endCallback : Function) {
		this.refreshTweetsToDisplay(info);
		endCallback();
	}

	/**
	 * Refresh list of tweets to display.
	 *
	 * @method refreshTweetsToDisplay
	 * @param {RenderInfo} info - The Info to render.
	 */
	refreshTweetsToDisplay(info : TweetList) {
		var tweets = info.getTweets();
		var nbTweets = tweets.length;

		if(nbTweets > 0) {
			if(typeof(this._tweetsToDisplay[info.getId()]) == "undefined") {
				this._tweetsToDisplay[info.getId()] = [];
			}

			if(typeof(this._lastInsertedTweet[info.getId()]) == "undefined") {
				this._lastInsertedTweet[info.getId()] = null;
			}

			var tweetsToDisplay = this._tweetsToDisplay[info.getId()];

			var insertFromIndex = nbTweets - 1;

			if(tweetsToDisplay.length > 0) {
				for (var i = 0; i < nbTweets; i++) {
					for (var j = (tweetsToDisplay.length - 1); j >= 0; j--) {
						if (tweetsToDisplay[j].getId() == tweets[i].getId()) {
							insertFromIndex = i - 1;
						}
					}
				}
			} else {
				if(this._lastInsertedTweet[info.getId()] != null) {
					for (var i = 0; i < nbTweets; i++) {
						if (this._lastInsertedTweet[info.getId()].getId() == tweets[i].getId()) {
							insertFromIndex = i - 1;
						}
					}
				}
			}

			for(var k = insertFromIndex; k >= 0; k--) {
				tweetsToDisplay.push(tweets[k]);
				this._lastInsertedTweet[info.getId()] = tweets[k];
			}

			this._tweetsToDisplay[info.getId()] = tweetsToDisplay;
		}
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
		var self = this;

		if(typeof(self._timers[info.getId()]) == "undefined") {
			self._timers[info.getId()] = null;
		}

		var displayNextTweet = function() {
			var currentTweet : Tweet = self._tweetsToDisplay[info.getId()].shift();

			var tweetWrapper = $("<div>");
			tweetWrapper.addClass("TweetListRenderer_tweet_wrapper");


			//TweetWrapper -> ProfilPictureWrapper
			var profilPicWrapper = $("<div>");
			profilPicWrapper.addClass("TweetListRenderer_main_profilpic_wrapper");
			profilPicWrapper.addClass("pull-left");
			tweetWrapper.append(profilPicWrapper);

			//TweetWrapper -> ProfilPictureWrapper -> Profil
			var headerProfil = $("<div>");
			headerProfil.addClass("TweetListRenderer_main_content_header_profil");
			profilPicWrapper.append(headerProfil);

			//TweetWrapper -> ProfilPictureWrapper -> Profil -> Fullname
			var fullName = $("<div>");
			fullName.addClass("TweetListRenderer_main_content_header_profil_fullname");
			var fullNameSpan = $("<span>");
			fullNameSpan.html(currentTweet.getOwner().getRealname());
			fullName.append(fullNameSpan);
			headerProfil.append(fullName);

			//TweetWrapper -> ProfilPictureWrapper -> Profil -> Username
			var username = $("<div>");
			username.addClass("TweetListRenderer_main_content_header_profil_username");
			var usernameSpan = $("<span>");
			usernameSpan.html("@" + currentTweet.getOwner().getUsername());
			username.append(usernameSpan);
			headerProfil.append(username);

			//TweetWrapper -> ProfilPictureWrapper -> Picture
			var profilPic = $("<div>");
			profilPic.addClass("TweetListRenderer_main_profilpic");
			profilPic.css("background-image","url("+currentTweet.getOwner().getProfilPicture()+")");
			profilPicWrapper.append(profilPic);

			//TweetWrapper -> WrapperContent
			var tweetWrapperContent = $("<div>");
			tweetWrapperContent.addClass("TweetListRenderer_tweet_wrapper_content");
			tweetWrapperContent.addClass("pull-left");

			tweetWrapper.append(tweetWrapperContent);

			//TweetWrapper -> Clearfix
			var clearTweetWrapper = $("<div>");
			clearTweetWrapper.addClass("clearfix");
			tweetWrapper.append(clearTweetWrapper);

			//WrapperContent -> Main
			var tweetMain = $("<div>");
			tweetMain.addClass("TweetListRenderer_main");

			if (currentTweet.getPictures().length > 0) {

				//WrapperContent -> PictureWrapper -> Picture

				var tweetPic = $("<div>");
				tweetPic.addClass("TweetListRenderer_picture");
				var pic : Picture = currentTweet.getPictures()[0];
				tweetPic.css("background-image","url("+pic.getOriginal().getURL()+")");
				var tweetPicWrapper = $("<div>");
				tweetPicWrapper.addClass("TweetListRenderer_picture_wrapper");
				tweetPicWrapper.append(tweetPic);

				tweetWrapperContent.append(tweetPicWrapper);
			} else {
				tweetWrapper.addClass("TweetListRenderer_tweet_wrapper_without_picture");
				tweetMain.addClass("TweetListRenderer_main_without_picture");
			}

			tweetWrapperContent.append(tweetMain);

			//WrapperContent -> Main -> Content
			var mainContent = $("<div>");
			mainContent.addClass("TweetListRenderer_main_content");
			tweetMain.append(mainContent);

			//WrapperContent -> Main -> Content -> Header
			var contentHeader = $("<div>");
			contentHeader.addClass("TweetListRenderer_main_content_header");
			mainContent.append(contentHeader);

			//WrapperContent -> Main -> Content -> Header -> Date
			var tweetCreateDate = $("<div>");
			tweetCreateDate.addClass("TweetListRenderer_main_content_header_date");
			tweetCreateDate.addClass("pull-left");
			contentHeader.append(tweetCreateDate);
			var tweetCreateDateSpan = $("<span>");
			var creationDate : any = moment(currentTweet.getCreationDate());
			var displayCreationDate = creationDate.fromNow();
			tweetCreateDateSpan.html(displayCreationDate);
			tweetCreateDate.append(tweetCreateDateSpan);

			//WrapperContent -> Main -> Content -> Header -> Clearfix
			var clearHeader = $("<div>");
			clearHeader.addClass("clearfix");
			contentHeader.append(clearHeader);

			//WrapperContent -> Main -> Content -> Message
			var contentMessage = $("<div>");
			contentMessage.addClass("TweetListRenderer_main_content_message");
			mainContent.append(contentMessage);

			var contentMessageSpan = $("<span>");
			contentMessageSpan.html(currentTweet.getMessage());
			contentMessage.append(contentMessageSpan);

			if (currentTweet.getPictures().length > 0) {
				self._domContents[info.getId()].css("transform", "translateY(-62%)");
			} else {
				self._domContents[info.getId()].css("transform", "translateY(-32%)");
			}

			self._domContents[info.getId()].prepend(tweetWrapper);

			fullName.textfill({
				maxFontPixels: 500
			});

			username.textfill({
				maxFontPixels: 500
			});

			contentMessage.textfill({
				maxFontPixels: 500,
				success: function() {
					var wrapperSpan = contentMessage.find("span").first();
					twemoji.parse(wrapperSpan[0]);
				}
			});

			tweetCreateDate.textfill({
				maxFontPixels: 500
			});

			self._domContents[info.getId()].transition({
				'transform': 'translateY(0%)',
				'easing': 'in-out',
				'duration': 1000
			}, function() {
				self._timers[info.getId()] = new Timer(function() {
					self._timers[info.getId()] = null;
					if(self._tweetsToDisplay[info.getId()].length > 0) {
						displayNextTweet();
					}
				}, currentTweet.getDurationToDisplay() * 1000 - 1000);
			});
		};

		if(self._tweetsToDisplay[info.getId()].length > 0 && self._timers[info.getId()] == null) {
			displayNextTweet();
		}

		endCallback();
	}
}