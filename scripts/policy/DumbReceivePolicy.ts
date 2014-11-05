/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./ReceivePolicy.ts" />
/// <reference path="../../t6s-core/core/scripts/infotype/Picture.ts" />

class DumbReceivePolicy implements ReceivePolicy {
    process(listInfos : Array<Info>) : Array<Info> {
        return listInfos;
    }
}