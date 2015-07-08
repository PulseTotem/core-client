/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/DateTime.ts" />
/// <reference path="./StaticSource.ts" />


/**
 * Represent a static Clock Source in the client
 */
class ClockSource extends StaticSource<DateTime> {

	constructor(refreshTime : number = 1) {
		super(refreshTime);
	}

	computeInfo() : DateTime {
		var d = new Date();
		var info = new DateTime();
		info.setDate(d);
		info.setDescription("");
		return info;
	}
}