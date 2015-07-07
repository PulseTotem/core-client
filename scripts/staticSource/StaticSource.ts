/**
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/Info.ts" />

/**
 * Represents a StaticSource of The6thScreen Client.
 *
 * @interface StaticSource<SourceInfo extends Info>
 */
interface StaticSource<SourceInfo extends Info> {

	/**
	 * Create and return a new list of information
	 */
	computeInfo() : SourceInfo;
}