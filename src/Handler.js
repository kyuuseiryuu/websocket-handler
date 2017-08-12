const ws = require("nodejs-websocket");


/**
 *
 * @param Message Must be a Object and have '_ACTION' property.
 */
const requestMapping = {
    actionMap: {
        ACTION_NOT_FOUND: (Message, conn) => {
            Message._RESPONSE = 'ACTION_NOT_FOUND';
            conn.sendText(Message);
        },
    },
    mapping: (Message, conn) => {
        const action = Message['_ACTION'];
        if (!action) {
            return;
        }
        if (this.actionMap.hasOwnProperty(action)) {
            this.actionMap[action](Message, conn);
        } else {
            this.actionMap['ACTION_NOT_FOUND'](Message, conn);
        }
    }
};
/**
 * {
 *   connectionKey: connection,
 * }
 * @type {{}} Store all keep live connection.
 */
const connections = {};

/**
 * {
 *   eventKey: callback function
 * }
 * @type {{}}
 */
const events = {};
/**
 *
 * @param callback function(connection)
 */
function broadcast(callback) {
    for(const conn in connections) {
        callback(connections[conn]);
    }
}

/**
 *
 * @param conn This connection will join to connections.
 */
function joinConnections(conn) {
    events['beforeJoin'] ? events['beforeJoin'](conn, getAllConnectionsKey()) : null;
    connections[conn.key] = conn;
    events['afterJoin'] ? events['afterJoin'](conn, getAllConnectionsKey()) : null;
}

/**
 *
 * @param conn This connection will delete from connections.
 */
function quitConnections(conn) {
    events['beforeQuit'] ? events['beforeQuit'](conn, getAllConnectionsKey()) : null;
    delete connections[conn.key];
    events['afterQuit'] ? events['afterQuit'](conn, getAllConnectionsKey()) : null;
}

/**
 *
 * @returns {Array} connections
 */
function getAllConnectionsKey() {
    return Object.keys(connections);
}

/**
 *
 * @param connectionKey connection key
 * @param callback function(connect)
 */
function get(connectionKey, callback) {
    callback(connections[connectionKey]);
}


/**
 *
 * @param key WebSocket event
 * @param callback event callback
 */
function setEventListener(key, callback) {
    events[key] = callback;
}

/**
 *
 * @param actionName string
 * @param callback function(Message, connection)
 */
function setAction(actionName, callback) {
    requestMapping.actionMap[actionName] = callback;
}

function setActionMap(actionMap) {
    requestMapping.actionMap = actionMap;
}

// Scream server example: "hi" -> "HI!!!"
const server = ws.createServer(function (conn) {

    if (events['create']) {
        events['create'](conn);
    }
    joinConnections(conn);

    conn.on("text", function (str) {
        let Message;
        try {
            Message = JSON.parse(str);
            Message._MESSAGE_TYPE = 'JSON';
            events['json'] ? events['json'](Message, conn) :
                events['text'] ? events['text'](Message, conn) : null;
            requestMapping.mapping(Message, conn);
        } catch (e) {
            // not JSON string
            Message = { _RAW_TEXT: str };
            Message._MESSAGE_TYPE = 'TEXT';
            events['text'] ? events['text'](Message, conn) : null;
            requestMapping.mapping(Message, conn);
        }
    });

    conn.on("close", function () {
        quitConnections(conn);
        events['close'] ? events['close'](conn) : null;
    });

    conn.on('error', function (conn) {
        events['error'] ? events['error'](conn) : null;
    });
});

/**
 *
 * @param port
 * @param host
 * @param callback
 */
function listen(port, host, callback) {
   server.listen(port, host, callback);
}

module.exports = {
    broadcast: broadcast,
    getAllConnectionsKey: getAllConnectionsKey,
    get: get,
    setEventListener: setEventListener,
    listen: listen,
    setActionMap: setActionMap,
    setAction: setAction,
};