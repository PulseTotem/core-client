/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

class PictureHelper {

	static preloadImage(pic : Picture, sizeToLoad : string) {
		var img = new Image();

		if (sizeToLoad == "thumb") {
			img.src = pic.getThumb().getURL();
		} else if (sizeToLoad == "small") {
			img.src = pic.getSmall().getURL();
		} else if (sizeToLoad == "medium") {
			img.src = pic.getMedium().getURL();
		} else if (sizeToLoad == "large") {
			img.src = pic.getLarge().getURL();
		} else {
			img.src = pic.getOriginal().getURL();
		}

		var time = pic.getDurationToDisplay();
		pic.setDurationToDisplay(0);

		img.onload = function() {
			pic.setDurationToDisplay(time);
		}
	}
}