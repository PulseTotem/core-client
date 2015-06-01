/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./LoggerLevel.ts" />

declare var log : any; // Use 'log' lib.

/**
 * Represents a logger with a coloration option.
 *
 * @class Logger
 */
class Logger {

    /**
     * Status of color mode.
     *
     * @property color
     * @type boolean
     * @static
     * @default true
     */
    static color : boolean = true;

    /**
     * Status of display mode.
     *
     * @property display
     * @type boolean
     * @static
     * @default false
     */
    static display : boolean = false;

    /**
     * Level status of the logger.
     *
     * @property level
     * @type LoggerLevel
     * @static
     * @default Error
     */
    static level : LoggerLevel = LoggerLevel.Error;

    /**
     * Change the color status.
     *
     * @method useColor
     * @static
     * @param {boolean} status - The new status.
     */
    static useColor(status : boolean) {
        Logger.color = status;
    }

    /**
     * Change the display status.
     *
     * @method enableDisplay
     * @static
     * @param {boolean} status - The new status.
     */
    static enableDisplay(status : boolean) {
        Logger.display = status;
    }

    /**
     * Change the level of the logger.
     *
     * @method setLevel
     * @static
     * @param level
     */
    static setLevel(level : LoggerLevel) {
        Logger.level = level;
    }

    /**
     * Store log messages in localStorage.
     *
     * @method storeMessage
     * @static
     * @param {Date} date
     * @param {LoggerLevel} level
     * @param {Object} msg
     */
    static storeMessage(date : Date, level : LoggerLevel, msg : any) {
        /*var sStorage : any = sessionStorage;

        var logMessages : any = null;
        if(sStorage.length == 0) {
            logMessages = new Array();
        } else {
            logMessages = JSON.parse(sStorage.getItem("logMessages"));
        }

        var logMessage : Object = new Object();
        logMessage["date"] = date;
        logMessage["level"] = level;
        logMessage["msg"] = msg;
        logMessages.push(JSON.stringify(logMessage));

        sStorage.setItem("logMessages", JSON.stringify(logMessages));*/

        /*var logMessage : Object = new Object();
        logMessage["date"] = date;
        logMessage["level"] = level;
        logMessage["msg"] = msg;
        sStorage.setItem(sStorage.length, JSON.stringify(logMessage));*/

    }

    /**
     * Clear log messages in localStorage.
     *
     * @method clear
     * @static
     */
    static clear() {
        /*var sStorage : any = sessionStorage;

        sStorage.clear();*/
    }

    /**
     * Log message as Debug Level.
     *
     * @method debug
     * @static
     * @param {string} msg - The message to log.
     */
    static debug(msg) {
//        Logger.storeMessage(new Date(), LoggerLevel.Debug, msg);

        if (Logger.display && Logger.level === LoggerLevel.Debug) {
            if (Logger.color && msg != null && msg != undefined && (typeof(msg) == "string" || msg instanceof String)) {
                log("[c=\"color:green\"]" + msg + "[c]");
            } else {
                console.log(msg);
            }
        }
    }

    /**
     * Log message as Info Level.
     *
     * @method info
     * @static
     * @param {string} msg - The message to log.
     */
    static info(msg) {
//        Logger.storeMessage(new Date(), LoggerLevel.Info, msg);

        if (Logger.display && (Logger.level === LoggerLevel.Debug || Logger.level === LoggerLevel.Info)) {
            if (Logger.color && msg != null && msg != undefined && (typeof(msg) == "string" || msg instanceof String)) {
                log("[c=\"color:blue\"]" + msg + "[c]");
            } else {
                console.log(msg);
            }
        }
    }

    /**
     * Log message as Warn Level.
     *
     * @method warn
     * @static
     * @param {string} msg - The message to log.
     */
    static warn(msg) {
//        Logger.storeMessage(new Date(), LoggerLevel.Warning, msg);

        if (Logger.display && (Logger.level === LoggerLevel.Debug || Logger.level === LoggerLevel.Info || Logger.level === LoggerLevel.Warning)) {
            if (Logger.color && msg != null && msg != undefined && (typeof(msg) == "string" || msg instanceof String)) {
                log("[c=\"color:orange\"]" + msg + "[c]");
            } else {
                console.log(msg);
            }
        }
    }

    /**
     * Log message as Error Level.
     *
     * @method error
     * @static
     * @param {string} msg - The message to log.
     */
    static error(msg) {
//        Logger.storeMessage(new Date(), LoggerLevel.Error, msg);

        if(Logger.display) {
            if (Logger.color && msg != null && msg != undefined && (typeof(msg) == "string" || msg instanceof String)) {
                log("[c=\"color:red\"]" + msg + "[c]");
            } else {
                console.error(msg);
            }
        }
    }

}