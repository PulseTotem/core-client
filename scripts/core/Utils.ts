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
        if(!!response.success && response.response !== undefined) {
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
	 * Method to check if string begins with http, https or ftp
	 *
	 * @method beginsWithHttp
	 * @static
	 * @param {string} value - The string value to test
	 * @returns {boolean} true if value begins with 'http', 'https', or 'ftp', false otherwise
	 */
	static beginsWithHttp = function(value : string) : boolean {
		var pattern = new RegExp('^((http|https|ftp):\/\/)', 'i');

		return pattern.test(value);
	};
}