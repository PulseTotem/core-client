/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../renderer/Renderer.ts" />

/**
 * Represents CallType Interface of The6thScreen Client.
 *
 * @interface CallTypeItf
 */
interface CallTypeItf {

	/**
	 * Get the CallType's renderer.
	 *
	 * @method getRenderer
	 * @return {Renderer} renderer - The CallType's Renderer.
	 */
	getRenderer() : Renderer<any>;
}