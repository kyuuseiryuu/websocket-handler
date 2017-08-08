const Handler = require('./src/Handler');

function calcTotalUser(conn, keys) {
    Handler.broadcast(function (each) {
        each.sendText('Now online user have:' + keys.length);
    });
}
Handler.setEventListener('create', function (conn) {
    console.log('New connection: ' + conn.key);
    Handler.broadcast(function (each) {
        const msg = {
            sender: conn.key,
            msg: "I'm new here!",
        };
        each.send(JSON.stringify(msg));
    });
});
Handler.setEventListener('afterJoin', calcTotalUser);
Handler.setEventListener('afterQuit', calcTotalUser);
Handler.setEventListener('json', function (Message, who) {
    console.log(Message);
    Message.sender = who.key;
    Message.to = who.key;
    Handler.get(who.key, function (he) {
        he.send(JSON.stringify(Message));
    });
});
Handler.setEventListener('text', function (Message) {
    Handler.broadcast(function (each) {
        each.sendText(JSON.stringify(Message));
    });
});
Handler.listen(8001, function () {
    console.log('Server is running socket -> ws://localhost:8001');
    console.log('You can write JavaScript:\n-----------------------');
    console.log('ws = new WebSocket("ws://localhost:8001");');
    console.log('ws.onmessage = ({data}) => console.log(data);');
    console.log('ws.send("Hello World!");\n-----------------------\n\n');
});
