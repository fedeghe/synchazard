[![Known Vulnerabilities](https://snyk.io/test/github/fedeghe/synchazard/badge.svg)](https://snyk.io/test/github/fedeghe/synchazard)

# SyncHazard  

This small project aims to minimize client side data requests

---

### How it works  
The core are the WebSockets for the communication layer and WebWorkers to put aside the client-side collaboration.  
The server runs some kind of IFTTT like procedure that could be triggered by anything (fs watching, db hooks, kafka consumers, ...) and using a websocket broadcasts to all connected clients the relevant metadata needed to get the actual data. Now the client decides what to do and, in case it wants to proceed, it knows exactly how to: just forward the metadata to the WebWorker which starts his job (could be a xhr request or could use the websocket as well) using the information contained in the metadata. Once the request is done the response is given to a handler that knows exactly how to consume it.

---

### Expectations
- Get rid of most of API requests triggered by user events.
- Being able to **really** exploit the state of stateful frontend frameworks.
- Enable automated synchronization among all clients stairing at the same data.

---
#### Install dependencies and build

Simply run:

`> npm i && npm run build`

and let it go, the build itself will be fast, and will observe/rebuild anything relevant on the _source_ folder... then open another terminal window.  

One last thing that needs to be installed is a npm dependency on the _dataServer_ folder: `ws` 

`> npm --prefix ./dataServer install`

now everything is set for start.

`> npm start`  

now open one or more browsers on http://localhost:4000

---

### Test broadcast to more clients within LAN

Get the current LAN ip of the machine running the server:

`> ifconfig en0 | grep inet | grep -v inet6 | awk '{print $2}'`

assume it is **192.168.5.107**

now open the `vars.json` file in the root of the project and edit the _DOMAIN\_OR\_IP_ value so that it contains the found IP address.  

The servers have to be restarted, go in the terminal where `npm start` has been launched, press `ctrl + c` and relaunch \`em.  

Now on one or more clients open a browser and navigate to http://192.168.5.107:4000 standing this is the port and IP address set as CLIENT.PORT and DOMAIN_OR_IP in the _vars.json_ file.

---

### What is in the samples

I will assume here that the build is done using the local IP address _192.168.5.107_ and that the ports have not been changed.



### http://192.168.5.107:4000  
here there are 6 _handlers_ connected to in _one_ or _two-way_ mode to server _Actions_:  

- **datajson**  
the Action on the dataServer, when the client connects, sends back a metadata that contains all information to get the initliaization data; on the client a WebWorker knows he must trigger an xhr request to get the resource (`/dataServer/data1.json`) and once the response is available, it forwards the payload to the handler function; the handler on the client side just uses it to render a title in the middle of the page, an image with a link and a small sentende below the image. The server Action does something more: watches the file and whenever a change occur to it it uses the websocket to broadcast the json to all connected clients, where the data will be consumed by the handler.
    - client handler: `/server/js/handlers/jsonObserver.js`
    - server Action: `/dataServer/actions/jsonObserver.js`

- **script**  
the dataServer Action for this is pretty similar to the _datajson_ sample, there's a simple watcher on a file (`/dataServer/js/lib/sync_script.js`); what is different is the client handler function, it just inject the script. So it is possible for example inject a script that can do quite a lot, on all clients. If You uncomment the right lines and simply save the file then the injected script will inject a rude ingorant assertion tester that will _run on all clients_ a couple of tests, checking that exactly two anchors are in the dom and that the number rendered by the _incremental_ can be correctly coerced to an Integer. The title will show the outcome, in case of errors also the browser console will show the assertion messages.  
    - client handler: `/server/js/handlers/script.js`
    - server Action: `/dataServer/actions/script.js`

- **style**  
again quite boring watcher on `/dataServer/css/sync_style.css`, on change will be injected and will change the style on all clients.  
    - client handler: `/server/js/handlers/style.js`
    - server Action: `/dataServer/actions/style.js`

- **hundredRandom**  
the Action on the dataServer simply broadcasts regularly a random number &isin; [0,100]; the clients handlers simply renders a live line chart adding one point each time it receive the value through the socket.  
    - client handler: `/server/js/handlers/randomPercentage.js`
    - server Action: `/dataServer/actions/randomPercentage.js`  



#### http://192.168.5.107:4000/samples/reactor.html

- **reactor**  
Nothing to do with React, but the name fits in somehow. Here I think there is a more clear hazard. And maybe it would be boring to read a long pseudo-description of the flow. But it's worth to try out to summarize the functionality. I wrote a small client library to enable on targeted `input[text]` and `textarea` tags some sort of concurrrency. Basically whenever the client Alice start typing in one of the target tags, immediately all other clients see the tag being edited as disabled, when Alice leave the focus on the tag, all other clients will see that tag enabled and filled with the value Alice entered.
    - client handler: `/server/js/handlers/reactor.js`
    - server Action: `/dataServer/actions/reactor.js`

- **incremental**  
this is the simplest one, the Action broadcasts evey second an incremental counter; the client hnadler simply render it somewhere. 
    - client handler: `/server/js/handlers/incremental.js`
    - server Action: `/dataServer/actions/incremental.js`




Almost in all cases a WebWorker runs a `proxy` between the client side socket and the handler function, allowing for example to the _datajson_ example to receive simple metadata sent by the dataServer containing all the information needed to get the real resource, the webWorker then decides in this case to start an xhr request for the resource and when the data is available it forwards all to the handler function that decides how to consume it. In any case the WebWorker decide in the end which one is the handler function that will consume the data. The WebWorker used in the main example is `/server/js/workers/worker.js`

#### http://192.168.5.107:4000/samples/distcomp.html 
A raw distributed computing sample to get (a bad) value for &pi; using other clients that will accept to help. 
... to be continued

#### http://192.168.5.107:4000/samples/collabText.html  
A couple of collaborative textareas where the content and the size is shared among all clients
... to be continued

#### http://192.168.5.107:4000/samples/chat.html  
A basic chat, here is used also the ability to send a message only to the client that sent one message  (check the console when a message is posted)
... to be continued

#### http://192.168.5.107:4000/samples/react.html   
The most simple immaginable example using React
... to be continued

#### http://192.168.5.107:4000/samples/job.html
This may look wierd cause in the end the ws srv sends to the client one specific function that will be used to make a naive calculation.   
... to be continued

---

guess what  
again ... to be continued, meanwhile feel free to reach me out for any question federico.ghedina@gmail.com
