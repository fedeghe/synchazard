/* eslint-disable no-undef */

/**
 * this file is imported at the very beginning of each worker
 * using `importScripts` function 
 * and each worker has to define an `actors` variable
 * initialized to null
 * basically the following is a template to be used when writing a worker
 * for synchazard
 * 
 * | var actors = null;
 * | importScripts('actorsDontMatch.js');
 * | self.onmessage = function (e) {
 * |    if (actorsDontMatch(e)) return;
 * |    if (e.data._TYPE !== 'action') return;
 * |    switch (e.data._ACTION) {
 * |        case ....
 * |    }
 * | };
 * 
 * this mechanism allows the client to filter any incoming message that 
 * is not meant to be consumed in that page context
 */

// eslint-disable-next-line no-unused-vars
function actorsDontMatch(e) {

    /* MANDATORY TO SET/CHECK collisions */
    /*-----------------------------------*/
    var enforceActorsMatch = true,
        notifyActorsChecking = maltaV('NOTIFY_ACTORS_CHECKING_FAILURE'),
        gotActorsDontMatch = null;

    // this is for init settings of the actors,
    // from bro toward the worker
    if (e.data._TYPE === '_INITACTORS') {
        actors = e.data._ACTORS || '';
    }
    gotActorsDontMatch = actors && actors.indexOf(e.data._ACTOR) < 0;

    // this is the check about actors when the
    // worker receives a message from the websocket
    if (gotActorsDontMatch || (enforceActorsMatch && !actors)) {
        if (notifyActorsChecking) {
            console.log("Actors mismatch");
            console.log('required: ', actors);
            console.log('provided: ', e.data._ACTOR);
        }
        return true;
    }
    return false;
}
/*= ======================================================================================= */