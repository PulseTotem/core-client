/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
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
		info.setDurationToDisplay(parseInt(this.params.InfoDuration));

		var dtl = new DateTimeList();
		dtl.setId("nowList");
		dtl.addDateTime(info);
		dtl.setDurationToDisplay(parseInt(this.params.InfoDuration));

		return dtl;
	}
}