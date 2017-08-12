const Handler = require('./src/Handler');

function calcTotalUser(conn, keys) {
    Handler.broadcast(function (each) {
        each.sendText('Now online user have:' + keys.length);
    });
}

const ActionMap = {
  MSG_TO(Message, conn) {
    Handler.sendMessage(Message, conn);
  }
};

Handler.setEventListener('create', function (conn) {
    console.log('New connection: ' + conn.key);
    Handler.broadcast(function (each) {
        const msg = {
            sender: conn.key,
            msg: "I'm new here!",
        };
        Handler.sendMessage(msg, each);
    });
});

Handler.setEventListener('close', function (conn) {
   console.log('The connection: ' + conn.key + ' Quit...');
});

Handler.setEventListener('afterJoin', calcTotalUser);
Handler.setEventListener('afterQuit', calcTotalUser);

Handler.setEventListener('json', function (Message, who) {
    console.log('on json...');
    Message.sender = who.key;
    Message.to = who.key;
    Handler.get(who.key, function (he) {
        he.send(JSON.stringify(Message));
    });
});

Handler.setEventListener('text', function (Message, sender) {
    console.log('on text...');
    Message.from = sender.key;
    Handler.broadcast(function (each) {
        Message.to = each.key;
        each.sendText(JSON.stringify(Message));
    });
});

Handler.setActionMap(ActionMap);

Handler.setAction('FETCH_ONLINE', function (Message, conn) {
   const all = Handler.getAllConnectionsKey();
   Message.SYS_ACTION = 'FETCH_ONLINE';
   Message.all = all;
   Handler.sendMessage(Message, conn);
   return true;
});

Handler.listen(8001, function () {
    console.log('Server is running socket -> ws://localhost:8001');
    console.log('You can write JavaScript:\n-----------------------');
    console.log('ws = new WebSocket("ws://localhost:8001");');
    console.log('ws.onmessage = ({data}) => console.log(data);');
    console.log('ws.send("Hello World!");\n-----------------------\n\n');
});
