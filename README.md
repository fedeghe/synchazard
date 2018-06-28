[![Known Vulnerabilities](https://snyk.io/test/github/fedeghe/synchazard/badge.svg)](https://snyk.io/test/github/fedeghe/synchazard)


<img src="./synchazard4.svg" style="margin:0 auto;width:50%">

# SyncHazard  

This small project aims to minimize client-side data requests

---

### How it works  
The core of this project are the WebSockets for the communication layer and WebWorkers to put aside the client-side collaboration.  
The server runs some kind of IFTTT-like procedure that could be triggered by anything (fs watching, db hooks, kafka consumers, ...), and by using a websocket broadcast to all connected clients the relevant metadata needed to get the actual data. Now the client decides what to do and, in case it wants to proceed, it knows exactly how to: just forward the metadata to the WebWorker which starts its job (could be an xhr request or could use the websocket as well) using the information contained in the metadata. Once the request is complete, the response is given to a handler that knows exactly how to consume it.

---

### Expectations
- Get rid of most of API requests triggered by user events.
- Being able to **really** exploit the state of stateful frontend frameworks.
- Enable automated synchronization among all clients staring at the same data.

---
### Install deps, build and run ...

1. To install & build just run:  
`> npm i && npm run build`  
The build itself will be fast, and will build the `server` and `dataServer` folders in the project root.

2. Start it:  
`> npm start`  

3. Now open one or more browsers on http://localhost:4000

4. Opt for building the samples cause You just launched the raw lib build, there is nothing but the library itself, no samples, just an empty naked webpage.
---
### Build samples 
Here you can build:  
- a non trivial amount of sample code, which covers almost all the features provided:  
    `> npm run build:home`  
    then  
    `> npm start`  
- a minimalistic due _helloworld_ that shows the simplest example I could imagine  
    `> npm run build:hello`  
    then  
    `> npm start`  

in both cases the _terminal_ will invite You to visit http://localhost:4000

---

### Test broadcast to more clients within LAN

Testing all concurrency samples in Your LAN (including for example Your mobile connected to the LAN) is super easy. First get the current LAN ip of the machine running the server:

`> ifconfig en0 | grep inet | grep -v inet6 | awk '{print $2}'`

assume it is **192.168.5.107**

now open the `vars.json` file in the root of the project and edit the _DOMAIN\_OR\_IP_ keyed value so that it contains the found IP address, as follows:

    “DOMAIN_OR_IP”: “192.168.5.107”,  

The servers have to be restarted. To do this, go in the terminal where `npm start` has been started, press `ctrl + c` and relaunch \`em (in case You stopped the build, Youl will have to rerun it before rerun `npm start`) 

Now on one or more clients, open a browser and navigate to http://192.168.5.107:4000  
this is the port and IP address set as CLIENT.PORT and DOMAIN_OR_IP in the _vars.json_ file.

---

### More about the _build:home_ samples

I will assume here that the build is done using the local IP address _192.168.5.107_ and that the ports have not been changed.



#### @ url: http://192.168.5.107:4000  

here there are 4 _handlers_ connected to in _one_ or _two-way_ mode to server _Actions_:  

- **datajson**  
The Action on the dataServer, when the client connects, sends back metadata that contains all information to get the initliaization data. On the client a WebWorker knows he must trigger an xhr request to get the resource (`/dataServer/data1.json`) and once the response is available, it forwards the payload to the handler function. The handler on the client-side just uses it to render a title in the middle of the page - an image with a link and a small sentence below the image. The server Action does something more: watches the file, and whenever a change occurs it uses the websocket to broadcast the json to all connected clients. Here the data will be consumed by the handler.
    - client handler: `/server/js/handlers/jsonObserver.js`
    - server Action: `/dataServer/actions/jsonObserver.js`

- **script**  
The dataServer Action for this is pretty similar to the _datajson_ sample. There is a simple watch task on a file (`/dataServer/js/lib/sync_script.js`). What is different here, is the client handler function: it just injects the script. So, it is possible, for example, to inject a script that can do quite a lot - on all clients. If you uncomment the correct lines and simply save the file, then the injected script will inject a rude, ignorant assertion tester that will _run on all clients_ , and a couple of tests, checking that exactly two anchors are in the DOM and that a _canvas_ tag is rendered. The title will show the outcome. In case of errors the browser will display the assertion messages in the console.  
    - client handler: `/server/js/handlers/script.js`
    - server Action: `/dataServer/actions/script.js`

- **style**  
Again, a quite boring watch task on `/dataServer/css/sync_style.css`, which runs on change will be injected and will change the style on all clients.  
    - client handler: `/server/js/handlers/style.js`
    - server Action: `/dataServer/actions/style.js`

- **hundredRandom**  
The Action on the dataServer regularly broadcasts a random number &isin; [0,100]. The client's handlers renders a live line chart adding one point each time it receives the value through the socket.  
    - client handler: `/server/js/handlers/randomPercentage.js`
    - server Action: `/dataServer/actions/randomPercentage.js`  



#### @url:  http://192.168.5.107:4000/samples/reactor.html

- **reactor**  
Nothing to do with React, but the name fits somehow. Here I think there is a clearer hazard. And maybe it would be boring to read a long pseudo-description of the flow. But it's worth trying to summarize the functionality. I wrote a small client library to enable on targeted `input[text]` and `textarea` tags some sort of concurrrency. Basically, whenever the client Alice start typing in one of the target tags, immediately all other clients can see the tag being edited as disabled, when Alice leaves the focus on the tag, all other clients will see that tag enabled and filled with the value Alice entered.
    - client handler: `/server/js/handlers/reactor.js`
    - server Action: `/dataServer/actions/reactor.js`

- **incremental**  
This is the simplest one. The Action broadcasts every second an incremental counter. The client handler simply renders it somewhere. 
    - client handler: `/server/js/handlers/incremental.js`
    - server Action: `/dataServer/actions/incremental.js`




Almost in all cases a WebWorker runs a `proxy` between the client-side socket and the handler function, allowing, for example, for the _datajson_ example to receive simple metadata sent by the dataServer which contains all the information needed to get the real resource. The webWorker then decides in this case to start an xhr request for the resource and when the data is available it forwards all to the handler functions that decide how to consume it. In any case the WebWorker decides in the end which one is the handler function that will consume the data. The WebWorker used in the main example is `/server/js/workers/worker.js`

#### @url:  http://192.168.5.107:4000/samples/distcomp.html 
A raw, distributed computing sample to get a (bad) value for &pi; using other clients that will accept to help. 
... to be continued

#### @url:  http://192.168.5.107:4000/samples/collabText.html  
A couple of collaborative textareas where the content and the size is shared among all clients
... to be continued

#### @url:  http://192.168.5.107:4000/samples/chat.html  
A basic chat which will enable messages to be sent in broadcast and to the client that sent one message (check the console when a message is posted)
... to be continued

#### @url:  http://192.168.5.107:4000/samples/react.html   
The most simple immaginable example using React
... to be continued

#### @url:  http://192.168.5.107:4000/samples/job.html
This may look wierd because in the end the ws srv sends one specific function to the client that will be used to make a naive calculation.   
... to be continued

---


### More about client and server data flow
- [Client flow](docs/CLIENT.md)
- [Server flow](docs/SERVER.md)

---

## hello world
As the tradition dictates, I created the simplest example I could imagine:
- the websocket server starts, launching a single Action.
- the client(s) show a button `next` and an empty container to be used  to show the first two Fibonacci numbers 0 and 1, but the values comes from the server state, after initialization, thus the values rendered depend on the server state and only at the beginning will be 0 and 1.
- when the page is loaded the client sends the _init_ request (this happens automatically).
- the server handles the requests sending a unicast message containing the two current Fib values.
- on the client the worker receives the reply to the init request and update to dom to show the current status.
- whenever the _next_ button is pressed the client sends a message through the websocket asking to calculate the next number and update (A, B) to (B, A + B).
- the server will handle the request, unpdate the pair and broadcast the new state, but will aslo send a unicast message to the orign client to instruct it to bold the text.
- the client(s) worker receives the new pair forward to the right handler which updates the dom.
- the client that triggered the action will, thx to a parallel unicast message, render the numbers in red & bold.
- all clients when initialize/update show a round trip time in milliseconds respectively from init request to init values render and from button press to the rendering of the updated values.


To build that example simply run:

    > npm run build:hello  

and then 

    > npm start

Now open the browser at [http://localhost:4000/](http://localhost:4000/) with at least two different browsers and try it out.

In the project's root the two _server_ and _dataServer_ folders will contain the minimum code to implement the _hello world_ sample code.

---

## Actors
<img src="https://raw.githubusercontent.com/fedeghe/synchazard/master/source/collsion.png" alt="drawing" width="80%"/>

What would happen if calling `socketsSrv.launch` we pass among all needed actions two particural ones which replies with structurally similar objects to the same request, for example the _init_?  
For sure we could take the responsability on the ___ACTION field value of the response to pay it in terms of loss of semantic. Would be a naive solution.

Ignoring it in this case there will be a _race condition_, causing unpredictable and undesired outcomes. 

To avoid the risk and the responsability to manage it I added a pretty simple mechanism that requires on both sides to specify a label and run a check on every worker. 

On the webpage the user is in charge of setting a list of _actors_ (simple labels) that will be allowed.  
```
<script src="/pathTo/dataWorker.js"
    data-worker="/pathTo/webWorker.js"
    data-actors="dashboardHome,e2etest"
    ></script>
```

On the server-side each action launched specifies one single _actor_ that will be enabled to consume the data send by the _action_.

```
...
socketsSrv.launch([{
        path: 'action/myHomeAction'
        actor: 'dashboardHome'
    },{
        path: 'actions/mySettingsAction'
        actor: 'settings'
    }
    ...
    ... more actions if needed
    ... 
], argz);
```

The actors mechanism is hardcoded and to enable it we should rebuild _Synchazard_ setting to `true` the `CHECK_ACTORS` variable in the `vars.json`.

Now the client can only accept messages coming from _actions_ which declare an _actor_ that is included in those declared by the client. The webworker do not forward the data to the handling function/instance. Since webworker are not extensible, we cannot add to it special method to do the job, but we can use the _importScripts_ to make available one function to check if the actors match (in case this option is enabled on build):

```
...

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    ...
```

---

### Tests  
I started to write tests, more will come as far as the project becomes stable (in my mind). Btw some basic e2e tests are available (once the `home` code is started)

   > npm test

more are coming....

---

Guess what?  
Again ... to be continued... Meanwhile, feel free to reach out to me with any questions. federico.ghedina@gmail.com
