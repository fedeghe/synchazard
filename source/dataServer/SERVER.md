### The events flow on the server

The server side of _Synchazard_ is composed by two main elements:
1) a wrapper object of the `ws` dependency that after starting the server allows to start one or more _Actions_. This is the file `dataServer/core/socketSrv.js`
2) the `Action` is a javascript class that basically setup a useful wrapper on those files that will define how the socket server should act when some events occur. Those events could be for example when something relevant happens on a db, when a client sends a message, a webhook call, anything observable programmatically. This file is the `dataServer/core/Action.js`

Both are not meant to be modified.

The juice are the files that I called _Actions_ that will be launched using a method offered by the `socketSrv`. Those actions will receive a brand new Action injected in the only method mandatory.
Then name of the methods, one to launch all implemented Actions (in the socketSrv) and the other to actually run the Actions is the same: `launch`.

---

## Finally, the hello world
As the tradition dictates, I created the simplest example I could imagine:
- the websocket server starts, launching a single Action.
- the client(s) show a button `next` and an empty container to be used  to show the first two Fibonacci numbers 0 and 1, but the values comes from the server state, after initialization, thus the values rendered depend on the server state and only at the beginning will be 0 and 1.
- when the page is loaded the client sends the _init_ request (this happens automatically).
- the server handles the requests sending a unicast message containing the two current Fib values.
- on the client the worker receives the reply to the init request and update to dom to show the current status.
- whenever the _next_ button is pressed the client sends a message through the websocket asking to calculate the next number and update (A, B) to (B, A + B).
- the server will handle the request, unpdate the pair and broadcast the new state.
- the client(s) worker receives the new pair forward to the right handler which updates the dom.
- the client that triggered the action will, thx to a parallel unicast message, render the numbers in red & bold.


To build that example simply run:

    npm run buildhello  

and then 

    npm run hello

Now open the browser at [http://localhost:4000/helloWorld.html](http://localhost:4000/helloWorld.html) with at least two different browsers and try it out.

In the project's root the two _server_ and _dataServer_ folders will contain the minimum code to implement the _hello world_ sample code.

