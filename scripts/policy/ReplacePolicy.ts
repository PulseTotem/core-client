/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./Policy.ts" />

/**
 * Represents a ReplacePolicy of The6thScreen Client.
 * This Policy replace listInfos by newInfos.
 *
 * @class ReplacePolicy
 * @extends Policy
 */
class ReplacePolicy implements Policy {

	/**
	 * Filter the Info list during 'getListInfos' method on a Call.
	 *
	 * @method filterOnGet
	 * @param {Array<Info>} listInfos - The Info list to filter.
	 * @return {Array<Info>} listFilteredInfos - The Info list after filter.
	 */
	filterOnGet(listInfos : Array<Info>) : Array<Info> {
		return listInfos;
	}

	/**
	 * Filter the Info list after new Infos reception in a Call.
	 *
	 * @method filterOnNew
	 * @param {Array<Info>} listInfos - The Info list to filter.
	 * @param {Array<Info>} newInfos - The Info list to filter.
	 * @return {Array<Info>} listFilteredInfos - The Info list after filter.
	 */
	filterOnNew(listInfos : Array<Info>, newInfos : Array<Info>) : Array<Info> {
		return newInfos;
	}
}