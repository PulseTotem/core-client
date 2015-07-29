/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../../t6s-core/core/scripts/infotype/TagList.ts" />
/// <reference path="../../../../t6s-core/core/scripts/infotype/Tag.ts" />
/// <reference path="../../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var d3: any; // Use of D3JS
declare var Snap: any; // Use of SnapSVG
declare var mina: any; // Use of SnapSVG (mina function)

class OperaParisTagListWhiteRenderer implements Renderer<TagList> {

	/**
	 * Words attached to each Info.
	 *
	 * @property _words
	 * @type Object
	 */
	private _words : Object;

	/**
	 * Constructor.
	 */
	constructor() {
		this._words = {};
	}

	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : TagList) : Array<TagList> {
		var tagLists : Array<TagList> = new Array<TagList>();
		try {
			var newInfo = TagList.fromJSONObject(info);
			tagLists.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		return tagLists;
	}

	/**
	 * Render the Info in specified DOM Element.
	 *
	 * @method render
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {Function} endCallback - Callback function called at the end of render method.
	 */
	render(info : TagList, domElem : any, endCallback : Function) {
		var self = this;

		var tagHTMLWrapper = $("<div>");
		tagHTMLWrapper.addClass("OperaParisTagListWhiteRenderer_wrapper");

		var titleDiv = $("<div>");
		titleDiv.addClass("OperaParisTagListWhiteRenderer_title");

		tagHTMLWrapper.append(titleDiv);

		var titleText = $("<div>");
		titleText.addClass("OperaParisTagListWhiteRenderer_title_text");
		titleText.html("Top 5 #Hashtags / ");

		titleDiv.append(titleText);

		var twitterLogo = $("<div>");
		twitterLogo.addClass("OperaParisTagListWhiteRenderer_title_twitter_logo");

		titleDiv.append(twitterLogo);

		var clearTitleDiv = $("<div>");
		clearTitleDiv.addClass("clearfix");

		titleDiv.append(clearTitleDiv);

		var tagMainzone = $("<div>");
		tagMainzone.addClass("OperaParisTagListWhiteRenderer_mainzone");

		tagHTMLWrapper.append(tagMainzone);

		$(domElem).append(tagHTMLWrapper);

		var totalPopularity = 0;

		info.getTags().forEach(function(tag : Tag) {
			totalPopularity += tag.getPopularity();
		});

		var layout = d3.layout.cloud();
		layout.size([tagMainzone.width(), tagMainzone.height()]);
		layout.words(info.getTags().map(function(d) {
					return {text: "#" + d.getName(), size: 100 + (d.getPopularity()*100/totalPopularity)};
				}));
		layout.padding(5);
		layout.rotate(0);
		layout.font("Impact");
		layout.fontSize(function(d) { return d.size; });
		layout.on("end", function(words) {

			tagMainzone.hide();

			d3.select(tagMainzone[0]).append("svg")
				.attr("width", layout.size()[0])
				.attr("height", layout.size()[1])
				.append("g")
				.attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
				.selectAll("text")
				.data(words)
				.enter().append("text")
				.style("font-size", function(d) { return d.size + "px"; })
				.style("font-family", "Impact")
				.style("fill", "white")
				.attr("text-anchor", "middle")
				.attr("transform", function(d) {
					return "translate(" + [-2000, 0] + ")rotate(" + d.rotate + ")";
				})
				.text(function(d) { return d.text; });

			tagMainzone.find("svg g text").css({'font-size' : '+=150px'});

			tagMainzone.show();

			self._words[info.getId()] = words;

			endCallback();
		});

		layout.start();
	}

	/**
	 * Update rendering Info in specified DOM Element.
	 *
	 * @method updateRender
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 * @param {Function} endCallback - Callback function called at the end of updateRender method.
	 */
	updateRender(info : TagList, domElem : any, endCallback : Function) {
		var self = this;

		var tagMainzone = $(domElem).find(".OperaParisTagListWhiteRenderer_mainzone").first();

		tagMainzone.fadeOut(500);

		var totalPopularity = 0;

		info.getTags().forEach(function (tag:Tag) {
			totalPopularity += tag.getPopularity();
		});

		var layout = d3.layout.cloud();
		layout.size([tagMainzone.width(), tagMainzone.height()]);
		layout.words(info.getTags().map(function (d) {
			return {text: "#" + d.getName(), size: 100 + (d.getPopularity() * 100 / totalPopularity)};
		}));
		layout.padding(5);
		layout.rotate(0);
		layout.font("Impact");
		layout.fontSize(function (d) {
			return d.size;
		});
		layout.on("end", function (words) {

			tagMainzone.hide();
			tagMainzone.empty();

			d3.select(tagMainzone[0]).append("svg")
				.attr("width", layout.size()[0])
				.attr("height", layout.size()[1])
				.append("g")
				.attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
				.selectAll("text")
				.data(words)
				.enter().append("text")
				.style("font-size", function (d) {
					return d.size + "px";
				})
				.style("font-family", "Impact")
				.style("fill", "black")
				.attr("text-anchor", "middle")
				.attr("transform", function (d) {
					return "translate(" + [-2000, 0] + ")rotate(" + d.rotate + ")";
				})
				.text(function (d) {
					return d.text;
				});

			tagMainzone.find("svg g text").css({'font-size': '+=150px'});

			tagMainzone.show();

			self._words[info.getId()] = words;

			endCallback();
		});

		new Timer(function() {
			layout.start();
		}, 500);
	}

	/**
	 * Animate rendering Info in specified DOM Element.
	 *
	 * @method animate
	 * @param {RenderInfo} info - The Info to animate.
	 * @param {DOM Element} domElem - The DOM Element where animate the info.
	 * @param {Function} endCallback - Callback function called at the end of animation.
	 */
	animate(info : TagList, domElem : any, endCallback : Function) {
		var tagMainzone = $(domElem).find(".OperaParisTagListWhiteRenderer_mainzone").first();
		var words = this._words[info.getId()];

		if(tagMainzone.find("svg g text").length > 0) {

			tagMainzone.find("svg g text").each(function (index) {
				var self = this;

				new Timer(function() {
					Snap(self).animate({'transform': 'translate(' + [words[index].x, 0] + ')rotate(' + words[index].rotate + ')'}, 1000, mina.easeinout, function () {
						$(self).transition({
							'font-size': '-=150px',
							'easing': 'in-out',
							'duration': 1000
						}, function () {
							Snap(self).animate({'transform': 'translate(' + [words[index].x, words[index].y] + ')rotate(' + words[index].rotate + ')'}, 500, mina.easeinout, function() {
								if(index == (words.length - 1)) {
									endCallback();
								}
							});
						});
					});
				}, 2000 * index + 500);
			});

		} else {
			endCallback();
		}
	}
}