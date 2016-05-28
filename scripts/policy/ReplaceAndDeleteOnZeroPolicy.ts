/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./Policy.ts" />

/**
 * Represents a ReplaceAndDeleteOnZeroPolicy of The6thScreen Client.
 * This Policy replace listInfos by newInfos and delete Info with a durationToDisplay set to 0.
 *
 * @class ReplaceAndDeleteOnZeroPolicy
 * @extends Policy
 */
class ReplaceAndDeleteOnZeroPolicy implements Policy {

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
		var newInfosWithoutZero : Array<Info> = new Array<Info>();

		newInfos.forEach(function(info : Info) {
			if(info.getDurationToDisplay() != 0) {
				newInfosWithoutZero.push(info);
			}
		});

		return newInfosWithoutZero;
	}
}