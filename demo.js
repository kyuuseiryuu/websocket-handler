const Server = require('./src/Server');
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
Server.setEventListener('json', function (Message, who) {
    console.log(Message);
    Message.sender = who.key;
    Server.get(who.key, function (he) {
        he.send('hehehehe');
    });
});
Server.setEventListener('text', function (Message) {
    Server.broadcast(function (each) {
        each.sendText(JSON.stringify(Message));
    });
});
Server.listen(8001);
