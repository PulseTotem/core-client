/**
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/DateTime.ts" />
/// <reference path="./StaticSource.ts" />

class ClockSource implements StaticSource<DateTime> {


	computeInfo() : Array<DateTime> {
		var info = new DateTime();
		info.setDate(new Date());
		info.setDescription("");

		var result = new Array<DateTime>();
		result.push(info);
		return result;
	}
}