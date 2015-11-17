/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./Logger.ts" />

declare var PubSub : any; // Use 'PubSubJS' lib.

/**
 * Represents a Message Bus.
 *
 * @class MessageBus
 */
class MessageBus {

	/**
	 * Publish data on a channel.
	 *
	 * @method publish
	 * @static
	 * @param {string} channel - The channel to send data.
	 * @param {any} data - The data to send.
	 */
	static publish(channel : string, data : any) {
		return PubSub.publish(channel, data);
	}

	/**
	 * Publish data on a call's channel.
	 *
	 * @method publishToCall
	 * @static
	 * @param {string} callChannel - The call channel to send data.
	 * @param {string} action - The action description.
	 * @param {any} data - The data to send.
	 */
	static publishToCall(callChannel : string, action : string, data : any) {
		var callData = {
			"action" : action,
			"data" : data
		};
		return PubSub.publish(callChannel, callData);
	}

	/**
	 * Subscribe to a channel with callback function.
	 *
	 * @method subscribe
	 * @static
	 * @param {string} channel - The channel to subscribe.
	 * @param {Function} callbackFunction - The callback function to execute when a message is send on the channel.
	 */
	static subscribe(channel : string, callbackFunction : Function) {
		return PubSub.subscribe(channel, callbackFunction);
	}

	/**
	 * Subscribe once to a channel with callback function.
	 *
	 * @method subscribeOnce
	 * @static
	 * @param {string} channel - The channel to subscribe.
	 * @param {Function} callbackFunction - The callback function to execute when a message is send on the channel.
	 */
	static subscribeOnce(channel : string, callbackFunction : Function) {
		var token = PubSub.subscribe(channel, function(msg, data) {
			PubSub.unsubscribe(token);
			callbackFunction(msg, data);
		});

		return token;
	}

	/**
	 * Channel unsubscription.
	 *
	 * @method unsubscribe
	 * @static
	 * @param {any} subscription - The subscription to cancel.
	 */
	static unsubscribe(subscription : any) {
		return PubSub.unsubscribe(subscription);
	}

}