/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/DateTimeList.ts" />
/// <reference path="./StaticSource.ts" />

/**
 * Represent a static Clock Source in the client
 */
class ClockSource extends StaticSource<DateTimeList> {

	/**
	 * Create and return the information of the Static Source
	 *
	 * @method computeInfo
	 */
	computeInfo() : DateTimeList {
		var d = new Date();
		var info = new DateTime();
		info.setId("now");
		info.setDate(d);
		info.setDescription("");

		var dtl = new DateTimeList();
		dtl.setId("nowList");
		dtl.addDateTime(info);

		return dtl;
	}
}