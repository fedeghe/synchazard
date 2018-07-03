
/*========================================================================================*/
/**/function actorsDontMatch(e) {
/**/
/**/    /* MANDATORY TO SET/CHECK collisions */
/**/    /*-----------------------------------*/
/**/    var enforceActorsMatch = $CHECK_ACTORS$,
/**/        notifyActorsChecking = $NOTIFY_ACTORS_CHECKING$,
/**/        gotActorsDontMatch = null;
/**/
/**/    // this is for init settings of the actors,
/**/    // from bro toward the worker
/**/    if (e.data._TYPE === '_INITACTORS') {
/**/        actors = e.data._ACTORS || '';
/**/    }
/**/    gotActorsDontMatch = actors && actors.indexOf(e.data._ACTOR) < 0;
/**/
/**/    // this is the check about actors when the
/**/    // worker receives a message from the websocket
/**/    if (gotActorsDontMatch || (enforceActorsMatch && !actors)) {
/**/        if (notifyActorsChecking) {
/**/            console.log("Actors mismatch");
/**/            console.log('required: ', actors);
/**/            console.log('provided: ', e.data._ACTOR);
/**/        }
/**/        return true;
/**/    }
/**/    return false;
/**/}
/*========================================================================================*/