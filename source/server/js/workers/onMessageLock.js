/*========================================================================================*/
/*====*/
/*====*/    /*-----------------------------------*/
/*====*/    /* MANDATORY TO SET/CHECK collisions */
/*====*/    /*-----------------------------------*/
/*====*/
/*====*/    var enforceActorsMatch = $CHECK_ACTORS$,
/*====*/        gotActorsDontMatch = null;
/*====*/
/*====*/    // this is for init settings of the actors,
/*====*/    // from bro toward the worker
/*====*/    if (e.data.___TYPE === '___INITACTORS') {
/*====*/        actors = e.data.___ACTORS || '';
/*====*/        gotActorsDontMatch = actors && actors !== e.data.___ACTORS;
/*====*/    }
/*====*/
/*====*/    // this is the check about actors when the
/*====*/    // worker receives a message from the websocket
/*====*/    if (gotActorsDontMatch || (enforceActorsMatch && !actors)){
/*====*/        console.log("Actors mismatch");
/*====*/        console.log('required: ', actors);
/*====*/        console.log('provided: ', e.data.___ACTORS);
/*====*/        throw 'Actors area required and are not provided OR does not match';
/*====*/    }
/*====*/
/*====*/    /*--------------------------------------------------*/
/*====*/    /* end of mandatory stuff, unlukily for the moment  */
/*====*/    /* is not possible to write it in the worker when   */
/*====*/    /* created                                          */
/*====*/    /*--------------------------------------------------*/
/*====*/
/*========================================================================================*/