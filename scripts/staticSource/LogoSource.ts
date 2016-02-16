/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/PictureAlbum.ts" />
/// <reference path="./StaticSource.ts" />

/**
 * Represent a static Logo Source in the client
 */
class LogoSource extends StaticSource<PictureAlbum> {

	/**
	 * Create and return the information of the Static Source
	 *
	 * @method computeInfo
	 */
	computeInfo() : PictureAlbum {
		var picture : Picture = new Picture();
		picture.setId(this.params.LogoName);
		picture.setTitle(this.params.LogoName);
		picture.setDescription(this.params.LogoName);
		picture.setDurationToDisplay(this.params.InfoDuration);

		var pictureURL : PictureURL = new PictureURL();
		pictureURL.setId(this.params.LogoName + " URL");
		pictureURL.setURL(this.params.URL);
		pictureURL.setDurationToDisplay(this.params.InfoDuration);

		picture.setOriginal(pictureURL);
		picture.setMedium(pictureURL);

		var pictureAlbum : PictureAlbum = new PictureAlbum();
		pictureAlbum.setId(this.params.LogoName);
		pictureAlbum.setDurationToDisplay(this.params.InfoDuration);
		pictureAlbum.addPicture(picture);

		return pictureAlbum;
	}
}