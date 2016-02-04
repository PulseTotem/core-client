/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/TextList.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/TextInfo.ts" />
/// <reference path="./StaticSource.ts" />

/**
 * Represent a static Logo Source in the client
 */
class TextSource extends StaticSource<TextList> {

	/**
	 * Create and return the information of the Static Source
	 *
	 * @method computeInfo
	 */
	computeInfo() : TextList {

		var text : TextInfo = new TextInfo();
		text.setId(this.params.TextValue);
		text.setValue(this.params.TextValue);

		var textList : TextList = new TextList();
		textList.setId(this.params.TextValue);
		textList.addText(text);

		return textList;
	}
}