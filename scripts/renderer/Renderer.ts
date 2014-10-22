/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/infotype/Info.ts" />

interface Renderer<RenderInfo extends Info> {
    transformForBehaviour<ProcessInfo extends Info>(listInfos : Array<ProcessInfo>, renderPolicy : RenderPolicy<ProcessInfo>) : Array<RenderInfo>;

    render(info : RenderInfo, domElem : any);
}