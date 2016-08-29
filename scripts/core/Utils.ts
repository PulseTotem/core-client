/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr, simon.urli@gmail.com>
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
        if(typeof(response.success) != "undefined" && response.success != null && typeof(response.response) != "undefined" && response.response != null) {
            if(response.success == true) {
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

	/**
	 * Return a random int between min and mex (inclusive).
	 *
	 * @method getRandomInt
	 * @static
	 * @param {number} min - Min bound
	 * @param {number} max - Max bound
	 * @returns {number} value between min and max (inclusive)
	 */
	static getRandomInt(min : number, max : number) : number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min +1)) + min;
	}

}