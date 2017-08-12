# websocket-handler


## Quick Start

* clone this repository
* run `npm i && npm start`
* now server is running...

## API

* `setEventListener(string: eventName, function: callback)`
* `broadcast(function: callback(connection))`
* array[] connectionsKey `getAllConnectionsKey()`
* `get(string: connectionKey, function: callback(Connection))`
* `listen(number: port, string: host, function: callback)`
* `setActionMap(actionMap)`
    ```js
    const actionMap = {
      actionName(Message, connection) {
        // Use Message and connection to do something
        const jumpEvent = true;
        return jumpEvent;
      },
    }
    ```
* `setAction(string: actionName, callback(Message, Connection: current connection))`
* `send(object|string: message, Connection: target connection)`
    > Not support binary data, if you want to send binary data you can use Connection object.

## Event Support

* `beforeJoin` new connection join manage before
* `afterJoin` new connection join manage after
* `beforeQuit` connection quit manage before
* `afterQuit`  connection quit manage after
* `create` when connection create
* `json` when connection receive a json string
    > when `json` event listener is undefined, will try to call `text` event listener.
* `text`  when connection receive a text
* `error` WebSocket event
* `close` WebSocket event

## Event Params

| Event | params |
| :---: | :---:  |
| beforeJoin/afterJoin | (connection, allConnectionsKey) |
| beforeQuit/afterQuit | (connection, allConnectionsKey) |
| create | (connection) |
| json | (Message, connection) |
| text | (Message, connection) |
| error | (WebSocketErrorEvent) |
| close | (connection) |

## Data Flow
1. The request will transform to JSON object,
2. If request transform failed will call `text` event and over.
3. If request has `SYS_ACTION` property, will try to map action
4. If action mapper return true to jump event then over this request
5. Else will call `json` event.


## License
## MIT
