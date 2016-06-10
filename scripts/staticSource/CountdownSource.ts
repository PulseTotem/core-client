/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/DateTimeList.ts" />
/// <reference path="./StaticSource.ts" />

/**
 * Represent a static Countdown Source in the client
 */
class CountdownSource extends StaticSource<DateTimeList> {

	/**
	 * Create and return the information of the Static Source
	 *
	 * @method computeInfo
	 */
	computeInfo() : DateTimeList {
		var d = moment.unix(parseInt(this.params.SearchQuery)).toDate();
		var info = new DateTime();
		info.setId("countdown");
		info.setDate(d);
		info.setDescription("");

		var dtl = new DateTimeList();
		dtl.setId("countdownList");
		dtl.addDateTime(info);

		return dtl;
	}
}