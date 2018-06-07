/*========================================================================================*/
/*====*/
/*====*/    /*-----------------------------------*/
/*====*/    /* MANDATORY TO SET/CHECK collisions */
/*====*/    /*-----------------------------------*/
/*====*/
/*====*/    var enforceActorsMatch = $ACTORS.ENFORCE$,
/*====*/        gotActorsDontMatch = null;
/*====*/
/*====*/    // this is for init settings of the actors,
/*====*/    // from bro toward the worker
/*====*/    if (e.data.___TYPE === '___INITACTORS') {
/*====*/        actors = e.data.___ACTORS || '';
/*====*/        gotActorsDontMatch = actors && actors.split(',').indexOf(e.data.___ACTORS) < 0;        
/*====*/    }
/*====*/
/*====*/    // this is the check about actors when the
/*====*/    // worker receives a message from the websocket
/*====*/    if (gotActorsDontMatch || (enforceActorsMatch && !actors))
/*====*/        throw 'Actors area required and are not provided OR does not match';
/*====*/
/*====*/    /*--------------------------------------------------*/
/*====*/    /* end of mandatory stuff, unlukily for the moment  */
/*====*/    /* is not possible to write it in the worker when   */
/*====*/    /* created                                          */
/*====*/    /*--------------------------------------------------*/
/*====*/
/*========================================================================================*/