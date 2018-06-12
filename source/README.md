[![Known Vulnerabilities](https://snyk.io/test/github/fedeghe/synchazard/badge.svg)](https://snyk.io/test/github/fedeghe/synchazard)

# SyncHazard  

This small project aims to minimize client-side data requests

---

### How it works  
The core of the app are the WebSockets for the communication layer and WebWorkers to put aside the client-side collaboration.  
The server runs some kind of IFTTT-like procedure that could be triggered by anything (fs watching, db hooks, kafka consumers, ...), and by using a websocket broadcast to all connected clients the relevant metadata needed to get the actual data. Now the client decides what to do and, in case it wants to proceed, it knows exactly how to: just forward the metadata to the WebWorker which starts its job (could be an xhr request or could use the websocket as well) using the information contained in the metadata. Once the request is complete, the response is given to a handler that knows exactly how to consume it.

---

### Expectations
- Get rid of most of API requests triggered by user events.
- Being able to **really** exploit the state of stateful frontend frameworks.
- Enable automated synchronization among all clients staring at the same data.

---
#### Install dependencies, build libs and samples

Simply run:

`> npm i && npm run build`

and let it go... The build itself will be fast, and will observe/rebuild anything relevant on the _source_ folder... Then open another terminal window.  

Now everything is set, just start it.

`> npm start`  

and open one or more browsers on http://localhost:4000

---

### Test broadcast to more clients within LAN

Get the current LAN ip of the machine running the server:

`> ifconfig en0 | grep inet | grep -v inet6 | awk '{print $2}'`

assume it is **192.168.5.107**

now open the `vars.json` file in the root of the project and edit the _DOMAIN\_OR\_IP_ value so that it contains the found IP address.  

The servers have to be restarted. To do this, go in the terminal where `npm start` has been launched, press `ctrl + c` and relaunch \`em.  

Now on one or more clients, open a browser and navigate to http://192.168.5.107:4000 - this is the port and IP address set as CLIENT.PORT and DOMAIN_OR_IP in the _vars.json_ file.

---

### What are in the samples

I will assume here that the build is done using the local IP address _192.168.5.107_ and that the ports have not been changed.



### http://192.168.5.107:4000  
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



#### http://192.168.5.107:4000/samples/reactor.html

- **reactor**  
Nothing to do with React, but the name fits somehow. Here I think there is a clearer hazard. And maybe it would be boring to read a long pseudo-description of the flow. But it's worth trying to summarize the functionality. I wrote a small client library to enable on targeted `input[text]` and `textarea` tags some sort of concurrrency. Basically, whenever the client Alice start typing in one of the target tags, immediately all other clients can see the tag being edited as disabled, when Alice leaves the focus on the tag, all other clients will see that tag enabled and filled with the value Alice entered.
    - client handler: `/server/js/handlers/reactor.js`
    - server Action: `/dataServer/actions/reactor.js`

- **incremental**  
This is the simplest one. The Action broadcasts every second an incremental counter. The client handler simply renders it somewhere. 
    - client handler: `/server/js/handlers/incremental.js`
    - server Action: `/dataServer/actions/incremental.js`




Almost in all cases a WebWorker runs a `proxy` between the client-side socket and the handler function, allowing, for example, for the _datajson_ example to receive simple metadata sent by the dataServer which contains all the information needed to get the real resource. The webWorker then decides in this case to start an xhr request for the resource and when the data is available it forwards all to the handler functions that decide how to consume it. In any case the WebWorker decides in the end which one is the handler function that will consume the data. The WebWorker used in the main example is `/server/js/workers/worker.js`

#### http://192.168.5.107:4000/samples/distcomp.html 
A raw, distributed computing sample to get a (bad) value for &pi; using other clients that will accept to help. 
... to be continued

#### http://192.168.5.107:4000/samples/collabText.html  
A couple of collaborative textareas where the content and the size is shared among all clients
... to be continued

#### http://192.168.5.107:4000/samples/chat.html  
A basic chat which will enable messages to be sent to the client that sent one message  (check the console when a message is posted)
... to be continued

#### http://192.168.5.107:4000/samples/react.html   
The most simple immaginable example using React
... to be continued

#### http://192.168.5.107:4000/samples/job.html
This may look wierd because in the end the ws srv sends one specific function to the client that will be used to make a naive calculation.   
... to be continued

---

### Clean, use it    
The  default _build_ script creates a lot of sample files useful only as samples. If you want to build the few files really needed to exploit Synchazard just run  

`> npm run base`

then use them on client and on the server, adding _actions_ and _handlers_ files  as needed.

--- 

### More about client and server data flow
- [Client flow](CLIENT.md)
- [Server flow](SERVER.md)
---


Guess what?  
Again ... to be continued... Meanwhile, feel free to reach out to me with any questions. federico.ghedina@gmail.com
