/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./CallTypeItf.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Info.ts" />

/**
 * Represents Call Interface of The6thScreen Client.
 *
 * @interface CallItf
 */
interface CallItf {

	/**
	 * Get the Call's callType.
	 *
	 * @method getCallType
	 * @return {CallTypeItf} callType - The Call's CallType.
	 */
	getCallType() : CallTypeItf;

	/**
	 * Get the Call's rendererTheme.
	 *
	 * @method getRendererTheme
	 * @return {string} rendererTheme - The CallType's RendererTheme.
	 */
	getRendererTheme() : string;

	/**
	 * Returns Call's Info List.
	 *
	 * @method getListInfos
	 */
	getListInfos() : Array<Info>;

	/**
	 * Method to call to inform the Call for a new information
	 * @param info
	 */
	onNewInfo(info : any);
}