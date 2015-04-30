/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./Policy.ts" />

/**
 * Represents a IdemPolicy of The6thScreen Client.
 * This Policy does nothing...
 *
 * @class IdemPolicy
 * @extends Policy
 */
class IdemPolicy implements Policy {

	/**
	 * Filter the Info list.
	 *
	 * @method filterInfo
	 * @param {Array<ProcessInfo>} listInfos - The Info list to filter.
	 * @return {Array<ProcessInfo>} listFilteredInfos - The Info list after filter.
	 */
	filterInfo(listInfos : Array<Info>) : Array<Info> {
		return listInfos;
	}
}