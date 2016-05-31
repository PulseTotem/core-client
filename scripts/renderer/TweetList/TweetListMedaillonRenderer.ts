/**
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/TweetList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Tweet.ts" />
/// <reference path="../Renderer.ts" />
/// <reference path="../../core/Timer.ts" />

declare var $: any; // Use of JQuery

class TweetListMedaillonRenderer implements Renderer<TweetList> {

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
			allTweets.addClass("TweetListMedaillonRenderer_allTweets");
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
			tweetWrapper.addClass("TweetListMedaillonRenderer_tweet_wrapper");

			//TweetWrapper -> Picture
			var profilPic = $("<div>");
			profilPic.addClass("TweetListMedaillonRenderer_profilpic");
			profilPic.css("background-image","url("+currentTweet.getOwner().getProfilPicture()+")");


			//Wrapper -> Main
			var tweetMain = $("<div>");
			tweetMain.addClass("TweetListMedaillonRenderer_main");

			if (currentTweet.getPictures().length > 0) {

				//Wrapper -> Picture
				var tweetPic = $("<div>");
				tweetPic.addClass("TweetListMedaillonRenderer_picture");
				var pic : Picture = currentTweet.getPictures()[0];
				tweetPic.css("background-image","url("+pic.getOriginal().getURL()+")");
				var tweetPicWrapper = $("<div>");
				tweetPicWrapper.addClass("TweetListMedaillonRenderer_picture_wrapper");
				tweetPicWrapper.append(tweetPic);

				tweetPicWrapper.append(profilPic);

				tweetWrapper.append(tweetPicWrapper);
			} else {
				tweetWrapper.addClass("TweetListMedaillonRenderer_tweet_wrapper_without_picture");
				tweetMain.addClass("TweetListMedaillonRenderer_main_without_picture");
			}

			tweetWrapper.append(tweetMain);

			//Wrapper -> Main -> Header
			var contentHeader = $("<div>");
			contentHeader.addClass("TweetListMedaillonRenderer_main_header");
			tweetMain.append(contentHeader);

			//Wrapper -> Main -> Header -> Date
			var tweetCreateDate = $("<div>");
			tweetCreateDate.addClass("TweetListMedaillonRenderer_main_header_date");
			contentHeader.append(tweetCreateDate);
			var tweetCreateDateSpan = $("<span>");
			var creationDate : any = moment(currentTweet.getCreationDate());
			creationDate.locale("en");
			var displayCreationDate = creationDate.fromNow();
			tweetCreateDateSpan.html(displayCreationDate);
			tweetCreateDate.append(tweetCreateDateSpan);

			//WrapperContent -> Main -> Wrapper -> Message
			var contentMessageWrapper = $("<div>");
			contentMessageWrapper.addClass("TweetListMedaillonRenderer_main_message_wrapper");
			tweetMain.append(contentMessageWrapper);

			if(currentTweet.getPictures().length <= 0) {
				contentMessageWrapper.append(profilPic);
			}

			var contentMessage = $("<div>");
			contentMessage.addClass("TweetListMedaillonRenderer_main_message");
			contentMessageWrapper.append(contentMessage);

			var contentMessageSpan = $("<span>");
			contentMessageSpan.html(currentTweet.getMessage());
			contentMessage.append(contentMessageSpan);

			if (currentTweet.getPictures().length > 0) {
				self._domContents[info.getId()].css("transform", "translateY(-62%)");
			} else {
				self._domContents[info.getId()].css("transform", "translateY(-32%)");
			}

			self._domContents[info.getId()].prepend(tweetWrapper);

			var optionTextFill = {
				maxFontPixels: 500
			};

			contentMessage.textfill(optionTextFill);
			tweetCreateDate.textfill(optionTextFill);

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