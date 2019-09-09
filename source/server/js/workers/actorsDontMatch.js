/* eslint-disable no-undef */

/*= ======================================================================================= */
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