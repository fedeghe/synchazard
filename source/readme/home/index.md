#### @ url: http://192.168.5.107:4000  

here there are 4 _handlers_ connected to in _one_ or _two-way_ mode to server _Actions_:  

- **datajson**  
The Action on the serverws, when the client connects, sends back metadata that contains all information to get the initialization data. On the client a WebWorker knows he must trigger an xhr request to get the resource (`/serverws/data1.json`) and once the response is available, it forwards the payload to the handler function. The handler on the client-side just uses it to render a title in the middle of the page an image with a link and a small sentence below the image. The server Action does something more: watches the file, and whenever a change occurs it uses the websocket to broadcast the invitation to update the json to all connected clients. Here the data will be consumed by the worker and then by the handler.
    - client handler: `/server/js/handlers/jsonObserver.js`
    - server Action: `/serverws/actions/jsonObserver.js`

- **script**  
The serverws Action for this is pretty similar to the _datajson_ sample. There is a simple watch task on a file (`/serverws/js/lib/sync_script.js`). What is different here, is the client handler function: it just injects the script. So, it is possible, for example, to inject a script that can do quite a lot on all clients. If you uncomment the correct lines and simply save the file, then the injected script will inject a rude, ignorant assertion tester that will _run on all clients_ a couple of tests, checking that exactly _n_ anchors are in the DOM and that a _canvas_ tag is rendered. The title will show the outcome. In case of errors the browser will display the assertion messages in the console. Moreover every client will send back to the server some informations about the test and the browser environment. 
    - client handler: `/server/js/handlers/script.js`
    - server Action: `/serverws/actions/script.js`

- **style**  
Again, a quite boring watch task on `/serverws/css/sync_style.css`, which runs on change will be injected and will change the style on all clients.  
    - client handler: `/server/js/handlers/style.js`
    - server Action: `/serverws/actions/style.js`

- **hundredRandom**  
The Action on the serverws regularly broadcasts a random number &isin; [0,100]. The client's handlers renders a live line chart adding one point each time it receives the value through the socket.  
    - client handler: `/server/js/handlers/randomPercentage.js`
    - server Action: `/serverws/actions/randomPercentage.js`  