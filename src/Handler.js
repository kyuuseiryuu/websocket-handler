const ws = require("nodejs-websocket");


const tryToParseJson = (str) => {
  try {
    return JSON.parse(str)
  } catch (e) {}
}

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
const events = {
  create () {},
  error () {},
  close () {},
  onJson () {},
  onMessage () {},
  beforeJoin () {},
  afterJoin () {},
  beforeQuit () {},
  afterQuit () {}
};

let actionKey = 'SYS_ACTION';

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
  const action = Message[actionKey];
  if (!action) {
    return false;
  }
  if (actionMap.hasOwnProperty(action)) {
    return actionMap[action](Message, conn);
  }
  return false;
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
  events.beforeJoin(conn, getAllConnectionsKey());
  connections[conn.key] = conn;
  events.afterJoin(conn, getAllConnectionsKey());
}

/**
 *
 * @param conn This connection will delete from connections.
 */
function quitConnections(conn) {
  events.beforeQuit(conn, getAllConnectionsKey());
  delete connections[conn.key];
  events.afterQuit(conn, getAllConnectionsKey());
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


function setActionMap(map, defaultActionKey = 'SYS_ACTION') {
  actionKey = defaultActionKey;
  actionMap = map;
}

/**
 *
 * @param actionName string
 * @param callback function(Message, connection)
 */
function setAction(actionName, callback) {
  actionMap[actionName] = callback;
}

/**
 *
 * @type {Server} WebSocket Server
 */
const server = ws.createServer(function (conn) {

  events.create(conn);
  joinConnections(conn);


  conn.on("text", function (str) {
    let Message = tryToParseJson(str);
    let jumpEvent = false
    if (Message) {
      jumpEvent = requestMapping(Message, conn);
    }
    if (jumpEvent) return
    if (Message) { events.onJson(Message, conn); }
    events.onMessage(str, conn);
  });

  conn.on("close", function () {
    quitConnections(conn);
    events.close(conn);
  });

  conn.on('error', function (conn) {
    quitConnections(conn);
    events.error(conn);
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