/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core/scripts/infotype/TagList.ts" />
/// <reference path="../../../t6s-core/core/scripts/infotype/Tag.ts" />
/// <reference path="../Renderer.ts" />

declare var $: any; // Use of JQuery
declare var d3: any; // Use of D3JS

class WordCloudRenderer implements Renderer<TagList> {

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
     * @param {string} rendererTheme - The Renderer's theme.
     * @param {Function} endCallback - Callback function called at the end of render method.
     */
    render(info : TagList, domElem : any, rendererTheme : string, endCallback : Function) {
        var self = this;

        var tagHTMLWrapper = $("<div>");
        tagHTMLWrapper.addClass("WordCloudRenderer_wrapper");

        var tagTitleZone = $("<div>");
        tagTitleZone.addClass("WordCloudRenderer_titleZone");

        var tagTitleSpanTitle = $("<span>");
        tagTitleSpanTitle.addClass("WordCloudRenderer_spanTitle");
        tagTitleSpanTitle.html("Tweets à propos de ");

        var tagTitleSpanQuery = $("<span>");
        tagTitleSpanQuery.addClass("WordCloudRenderer_spanQuery");
        var query = decodeURIComponent(info.getQuery());
        tagTitleSpanQuery.html(query);

        tagTitleZone.append(tagTitleSpanTitle);
        tagTitleZone.append(tagTitleSpanQuery);

        tagHTMLWrapper.append(tagTitleZone);

        var tagMainzone = $("<div>");
        tagMainzone.addClass("WordCloudRenderer_mainzone");

        tagHTMLWrapper.append(tagMainzone);

        $(domElem).append(tagHTMLWrapper);

        var layout = d3.layout.cloud();
        layout.size([tagMainzone.width(), tagMainzone.height()]);

        layout.words(info.getTags().map(function(d) {
            return {text: d.getName(), value: d.getPopularity()};
        }));

        layout.padding(1);
        layout.rotate(function() { return (~~(Math.random() * 6)-3) * 30; });
        layout.font("Impact");
        layout.fontSize(function(d) { return d.value; });

        var fill = d3.scale.category20();

        layout.on("end", function(words) {

            //tagMainzone.hide();

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
                .style("fill", function(d, i) { return fill(i); })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });

            //tagMainzone.show();

            endCallback();
        });

        layout.start();

        tagTitleZone.textfill({
            maxFontPixels: 500
        });
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
    updateRender(info : TagList, domElem : any, rendererTheme : string, endCallback : Function) {
        var self = this;
        this.render(info, domElem, rendererTheme, endCallback);
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
    animate(info : TagList, domElem : any, rendererTheme : string, endCallback : Function) {
        endCallback();
    }
}