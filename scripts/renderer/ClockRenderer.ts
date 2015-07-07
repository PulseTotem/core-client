/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/DateTime.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery
declare var moment: any; // Use of MomentJS

class ClockRenderer implements Renderer<DateTime> {
	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : DateTime) : Array<DateTime> {
		var result : Array<DateTime> = new Array<DateTime>();

		var newInfo = DateTime.fromJSONObject(info);
		result.push(newInfo);

		return result;
	}

	/**
	 * Render the Info in specified DOM Element.
	 *
	 * @method render
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 */
	render(info : DateTime, domElem : any) {
		domElem.empty();
		var dateTime = $("<div>");

		var formatDate = new moment(info.getDate());
		dateTime.html(formatDate.format("HH:mm:ss"));

		$(domElem).append(dateTime);
	}

	/**
	 * Update rendering Info in specified DOM Element.
	 *
	 * @method updateRender
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 */
	updateRender(info : DateTime, domElem : any) {
		this.render(info, domElem);
	}
}