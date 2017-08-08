# websocket-server

## API

* `setEventListener(string: eventName, function: callback)`
* `broadcast(function: callback(connection))`
* array[] connectionsKey `getAllConnectionsKey()`
* `get(string: connectionKey, function: callback(connect))`
* `listen(number: port, string: host, function: callback)`

## Event Support

* `beforeJoin` new connection join manage before
* `afterJoin` new connection join manage after
* `beforeQuit` connection quit manage before
* `afterQuit`  connection quit manage after
* `create` when connection create
* `json` when connection receive a json string
    > if have not this event listener, will try to call `text` event listener.
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

## License
## MIT
