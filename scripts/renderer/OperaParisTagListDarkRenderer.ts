/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/TagList.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Tag.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery
declare var d3: any; // Use of D3JS

class OperaParisTagListDarkRenderer implements Renderer<TagList> {
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
	 */
	render(info : TagList, domElem : any) {

		var tagHTMLWrapper = $("<div>");
		tagHTMLWrapper.addClass("OperaParisTagListDarkRenderer_wrapper");

		var titleDiv = $("<div>");
		titleDiv.addClass("OperaParisTagListDarkRenderer_title");

		tagHTMLWrapper.append(titleDiv);

		var titleText = $("<div>");
		titleText.addClass("OperaParisTagListDarkRenderer_title_text");
		titleText.html("Top 5 #Hashtags / ");

		titleDiv.append(titleText);

		var twitterLogo = $("<div>");
		twitterLogo.addClass("OperaParisTagListDarkRenderer_title_twitter_logo");

		titleDiv.append(twitterLogo);

		var clearTitleDiv = $("<div>");
		clearTitleDiv.addClass("clearfix");

		titleDiv.append(clearTitleDiv);

		var tagMainzone = $("<div>");
		tagMainzone.addClass("OperaParisTagListDarkRenderer_mainzone");

		tagHTMLWrapper.append(tagMainzone);

		$(domElem).append(tagHTMLWrapper);

		var totalPopularity = 0;

		info.getTags().forEach(function(tag : Tag) {
			totalPopularity += tag.getPopularity();
		});

		var layout = d3.layout.cloud();
		layout.size([tagMainzone.width(), tagMainzone.height()]);
		layout.words(info.getTags().map(function(d) {
					return {text: "#" + d.getName(), size: 100 + d.getPopularity()/totalPopularity};
				}));
		layout.padding(5);
		layout.rotate(0);
		layout.font("Impact");
		layout.fontSize(function(d) { return d.size; });
		layout.on("end", function(words) {

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
				.style("fill", "black")
				.attr("text-anchor", "middle")
				.attr("transform", function(d) {
					return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
				})
				.text(function(d) { return d.text; });

			function bouncing() {
				tagMainzone.find("svg g text").animate({ 'font-size': '+=10px' }, 500, function() {
					tagMainzone.find("svg g text").animate({ 'font-size': '-=10px' }, 500, function() {
						setTimeout(function() {
							bouncing();
						}, 2000);
					});
				});
			}

			bouncing();
		});

		layout.start();
	}
}