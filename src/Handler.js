const ws = require("nodejs-websocket");



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
 *  Default action map to solve action
 * @type {{ACTION_NOT_FOUND: (function(*=, *))}}
 */
let actionMap = {
    /**
     * @return {boolean} Jump to call event.
     */
    ACTION_NOT_FOUND(Message, conn) {
        Message.SYS_RESPONSE = 'ACTION_NOT_FOUND';
        conn.sendText(Message);
        return true;
    }
};

/**
 *
 * @param Message Must be a Object and have '_ACTION' property.
 * @param conn Current connection.
 */
function requestMapping(Message, conn) {
    const action = Message['SYS_ACTION'];
    if (!action) {
        return false;
    }
    if (actionMap.hasOwnProperty(action)) {
        return actionMap[action](Message, conn);
    } else {
        if (actionMap.hasOwnProperty('ACTION_NOT_FOUND')) {
            return actionMap['ACTION_NOT_FOUND'](Message, conn);
        }
        return false;
    }
}

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


function send(Message, conn) {
    if (typeof Message === 'string') {
        conn.sendText(Message);
    } else {
        conn.sendText(JSON.stringify(Message));
    }
}


/**
 *
 * @param key WebSocket event
 * @param callback event callback
 */
function setEventListener(key, callback) {
    events[key] = callback;
}


const setActionMap = (map) => {
    actionMap = map;
};

/**
 *
 * @param actionName string
 * @param callback function(Message, connection)
 */
const setAction = (actionName, callback) => {
    actionMap[actionName] = callback;
};

const server = ws.createServer(function (conn) {

    if (events['create']) {
        events['create'](conn);
    }
    joinConnections(conn);

    conn.on("text", function (str) {
        let Message;
        try {
            Message = JSON.parse(str);
            Message.SYS_MESSAGE_TYPE = 'JSON';
            const jumpEvent = requestMapping(Message, conn);
            if (jumpEvent) {
                return;
            }
            events['json'] ? events['json'](Message, conn) :
                events['text'] ? events['text'](Message, conn) : null;
        } catch (e) {
            // not JSON string
            Message = { SYS_RAW_TEXT: str };
            Message.SYS_MESSAGE_TYPE = 'TEXT';
            events['text'] ? events['text'](Message, conn) : null;
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
    sendMessage: send,
};