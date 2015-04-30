/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/Info.ts" />

/**
 * Represents a Policy of The6thScreen Client.
 *
 * @interface Policy
 */
interface Policy {

	/**
	 * Filter the Info list.
	 *
	 * @method filterInfo
	 * @param {Array<Info>} listInfos - The Info list to filter.
	 * @return {Array<Info>} listFilteredInfos - The Info list after filter.
	 */
	filterInfo(listInfos : Array<Info>) : Array<Info>;
}