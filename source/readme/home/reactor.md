#### @url:  http://192.168.5.107:4000/reactor.html  

- **reactor**  
Nothing to do with React, but the name fits somehow. Here I think there is a clearer hazard. It would be boring to read a long pseudo-description of the flow. But it's worth trying to summarize the functionality. I wrote a small client library to enable on targeted `input[text]` and `textarea` tags some sort of concurrency. Basically, whenever the client Alice start typing in one of the target tags, immediately all other clients will see the tag being edited as disabled, when Alice leaves the focus from the tag, all other clients will see that tag enabled and filled with the value Alice entered.  

    - client handler: `/server/js/handlers/reactor.js`
    - server Action: `/serverws/actions/reactor.js`

- **incremental**  
This is the simplest one. The Action broadcasts every second an incremental counter. The client handler simply renders it somewhere. 
    - client handler: `/server/js/handlers/incremental.js`
    - server Action: `/serverws/actions/incremental.js`  

Almost in all cases a WebWorker runs a `proxy` between the client-side socket and the handler function, allowing, for example, for the _datajson_ example to receive simple metadata sent by the serverws which contains all the information needed to get the real resource. The webWorker then decides in this case to start an xhr request for the resource and when the data is available it forwards all to the handler functions that decide how to consume it. In any case the WebWorker decides in the end which one is the handler function that will consume the data.  
The WebWorker used in the main example is `/server/js/workers/worker.js`  