/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/Info.ts" />
/// <reference path="../renderer/Renderer.ts" />

class InfoRenderer<T extends Info> {
	/**
	 * Info.
	 *
	 * @property _info
	 * @type T extends Info
	 */
	private _info : T;

	/**
	 * Renderer.
	 *
	 * @property _renderer
	 * @type Renderer<T extends Info>
	 */
    private _renderer : Renderer<T>;

	/**
	 * Renderer's Theme.
	 *
	 * @property _rendererTheme
	 * @type string
	 */
	private _rendererTheme : string;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {T extends Info} info - The InfoRenderer's info.
	 * @param {Renderer<T extends Info>} renderer - The InfoRenderer's renderer.
	 * @param {string} rendererTheme - The InfoRenderer's rendererTheme.
	 */
    constructor(info : T, renderer : Renderer<T>, rendererTheme : string = "default") {
        this._info = info;
        this._renderer = renderer;
		this._rendererTheme = rendererTheme;
    }

	/**
	 * Get the InfoRenderer's info.
	 *
	 * @method getInfo
	 * @return {T extends Info} info - The InfoRenderer's info.
	 */
	getInfo() : T {
		return this._info;
	}

	/**
	 * Set the InfoRenderer's info.
	 *
	 * @method setInfo
	 * @param {T extends Info} info - The new InfoRenderer's info.
	 */
	setInfo(info : T) {
		this._info = info;
	}

	/**
	 * Get the InfoRenderer's renderer.
	 *
	 * @method getRenderer
	 * @return {Renderer<T>} renderer - The InfoRenderer's renderer.
	 */
	getRenderer() : Renderer<T> {
		return this._renderer;
	}

	/**
	 * Get the InfoRenderer's rendererTheme.
	 *
	 * @method getRendererTheme
	 * @return {string} rendererTheme - The InfoRenderer's rendererTheme.
	 */
	getRendererTheme() : string {
		return this._rendererTheme;
	}
}