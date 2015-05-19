/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/UserList.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/User.ts" />
/// <reference path="./Renderer.ts" />

declare var $: any; // Use of JQuery

class UserRenderer implements Renderer<User> {
	/**
	 * Transform the Info list to another Info list.
	 *
	 * @method transformInfo<ProcessInfo extends Info>
	 * @param {ProcessInfo} info - The Info to transform.
	 * @return {Array<RenderInfo>} listTransformedInfos - The Info list after transformation.
	 */
	transformInfo(info : UserList) : Array<User> {
		var userLists : Array<UserList> = new Array<UserList>();
		try {
			var newInfo = UserList.fromJSONObject(info);
			userLists.push(newInfo);
		} catch(e) {
			Logger.error(e.message);
		}

		var users : Array<User> = new Array<User>();

		for(var iUL in userLists) {
			var ul : UserList = userLists[iUL];
			var ulUsers : Array<User> = ul.getUsers();
			for(var iT in ulUsers) {
				var t : User = ulUsers[iT];
				users.push(t);
			}
		}

		return users;
	}

	/**
	 * Render the Info in specified DOM Element.
	 *
	 * @method render
	 * @param {RenderInfo} info - The Info to render.
	 * @param {DOM Element} domElem - The DOM Element where render the info.
	 */
	render(info : User, domElem : any) {
		var userHTML = $("<div>");
		userHTML.addClass("UserRenderer_user");

		var userContent = $("<div>");
		userContent.addClass("UserRenderer_content");
		userContent.html("Welcome " + info.getUsername() + " !!!");

		userHTML.append(userContent);

		$(domElem).empty();
		$(domElem).append(userHTML);
	}
}