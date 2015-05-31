/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/**
 * Utils class : Use to keep together some useful methods.
 *
 * @class Utils
 */
class Utils {

    /**
     * Method to manage response from Server (Backend or SourcesServer).
     *
     * @method manageServerResponse
     * @static
     * @param {any} response - The response from Server Socket.
     * @param {Function} successCB - The callback function for success response.
     * @param {Function} failCB - The callback function for fail response.
     */
    static manageServerResponse(response : any, successCB : Function, failCB : Function) {
        if(!!response.success && !!response.response) {
            if(response.success) {
                successCB(response.response);
            } else {
                failCB(response.response);
            }
        } else {
            failCB(new Error("Server response is not well formatted."));
        }
    }

	/**
	 * Methods to help conversion of hexadecimal color into RGB color.
	 */

	/**
	 * @method cutHex
	 * @static
	 * @param {string} h - The Hexadecimal color.
	 */
	static cutHex(h : string) {
		return (h.charAt(0)=="#") ? h.substring(1,7):h
	}

	/**
	 * @method hexToR
	 * @static
	 * @param {string} h - The Hexadecimal color.
	 */
	static hexToR(h : string) {
		return parseInt((Utils.cutHex(h)).substring(0,2),16)
	}

	/**
	 * @method hexToG
	 * @static
	 * @param {string} h - The Hexadecimal color.
	 */
	static hexToG(h : string) {
		return parseInt((Utils.cutHex(h)).substring(2,4),16)
	}

	/**
	 * @method hexToB
	 * @static
	 * @param {string} h - The Hexadecimal color.
	 */
	static hexToB(h : string) {
		return parseInt((Utils.cutHex(h)).substring(4,6),16)
	}

	/**
	 * Method to return RGBA color from hexadecimal color and opacity
	 *
	 * @method toRGBA
	 * @static
	 * @param {string} h - The Hexadecimal color.
	 * @param {string} opacity - The color's opacity.
	 */
	static toRGBA(h : string, opacity : string) {
		return "rgba(" + Utils.hexToR(h) + "," + Utils.hexToG(h) + "," + Utils.hexToB(h) + "," + opacity + ")";
	}
}