/*========================================================================================*/
/*====*/
/*====*/    /*-----------------------------------*/
/*====*/    /* MANDATORY TO SET/CHECK collisions */
/*====*/    /*-----------------------------------*/
/*====*/
/*====*/    var enforceActorsMatch = $CHECK_ACTORS$,
/*====*/        notifyActorsChecking = $NOTIFY_ACTORS_CHECKING$,
/*====*/        gotActorsDontMatch = null;
/*====*/
/*====*/    // this is for init settings of the actors,
/*====*/    // from bro toward the worker
/*====*/    if (e.data.___TYPE === '___INITACTORS') {
/*====*/        actors = e.data.___ACTORS || '';
/*====*/    }
/*====*/    gotActorsDontMatch = actors && actors.indexOf(e.data.___ACTORS) < 0;
/*====*/
/*====*/    // this is the check about actors when the
/*====*/    // worker receives a message from the websocket
/*====*/    if (gotActorsDontMatch || (enforceActorsMatch && !actors)){
/*====*/        if (notifyActorsChecking) {
/*====*/            console.log("Actors mismatch");
/*====*/            console.log('required: ', actors);
/*====*/            console.log('provided: ', e.data.___ACTORS);
/*====*/        }
/*====*/        return;
/*====*/    }
/*====*/
/*====*/    /*--------------------------------------------------*/
/*====*/    /* end of mandatory stuff, unlukily for the moment  */
/*====*/    /* is not possible to write it in the worker when   */
/*====*/    /* created                                          */
/*====*/    /*--------------------------------------------------*/
/*====*/
/*========================================================================================*/