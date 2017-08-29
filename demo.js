const Handler = require('./src/Handler');

function calcTotalUser(conn, keys) {
    Handler.broadcast(function (each) {
        each.sendText('Now online user have:' + keys.length);
    });
}

const ActionMap = {
    MSG_TO(Message, conn) {
        Message.Data = { msg: 'OMG!'};
        Handler.sendMessage(Message, conn);
    },
    add({ a, b}, con) {
        Handler.sendMessage({
            result: a + b,
        }, con);
    },
    tellMeNow(data, conn) {
        Handler.broadcast(function (each) {
            Handler.sendMessage({
                action: 'alert',
                now: new Date().getTime(),
            }, each);
        });
    },
    call({ call, data }) {
        const msg = { action: call, data };
        Handler.broadcast(function (each) {
            Handler.sendMessage(msg, each);
        });
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
    Message.FORM = who.key;
    Message.TO = who.key;
    Handler.get(who.key, function (he) {
        he.send(JSON.stringify(Message));
    });
});

Handler.setEventListener('text', function (Message, sender) {
    Message.FROM = sender.key;
    Handler.broadcast(function (each) {
        each.sendText(JSON.stringify(Message));
    });
});

Handler.setActionMap(ActionMap, 'action');

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
