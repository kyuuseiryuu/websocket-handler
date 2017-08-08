const Server = require('./src/Server');

function calcTotalUser(conn, keys) {
    Server.broadcast(function (each) {
        each.sendText('Now online user have:' + keys.length);
    });
}
Server.setEventListener('create', function (conn) {
    console.log('New connection: ' + conn.key);
    Server.broadcast(function (each) {
        const msg = {
            sender: conn.key,
            msg: "I'm new here!",
        };
        each.send(JSON.stringify(msg));
    });
});
Server.setEventListener('afterJoin', calcTotalUser);
Server.setEventListener('afterQuit', calcTotalUser);
Server.setEventListener('json', function (Message, who) {
    console.log(Message);
    Message.sender = who.key;
    Message.to = who.key;
    Server.get(who.key, function (he) {
        he.send(JSON.stringify(Message));
    });
});
Server.setEventListener('text', function (Message) {
    Server.broadcast(function (each) {
        each.sendText(JSON.stringify(Message));
    });
});
Server.listen(8001, function () {
    console.log('Server is running socket -> ws://localhost:8001');
    console.log('You can write JavaScript:\n-----------------------');
    console.log('ws = new WebSocket("ws://localhost:8001");');
    console.log('ws.onmessage = ({data}) => console.log(data);');
    console.log('ws.send("Hello World!");\n-----------------------\n\n');
});
