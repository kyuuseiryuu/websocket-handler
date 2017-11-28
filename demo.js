const Handler = require('./src/Handler');

// action mapping first
const actions = {
  b(Message, sender) {
    console.log({
      sender: sender.key,
      Message
    })
    Handler.broadcast((c) => {
      Handler.sendMessage('A broadcast message', c)
    })
    return true
  }
}
Handler.setActionMap(actions, 'type')

// JSON data early
Handler.setEventListener('onJson', (json, sender) => {
  console.log({ onJson: json, sender: sender.key })
})

// text data is last
Handler.setEventListener('onMessage', (text) => {
  Handler.broadcast((conn) => {
    Handler.sendMessage({
      code: 0,
      type: 'out',
      out_trade_no: text
    }, conn)
  })
})

Handler.listen(8001, function () {
    console.log('Server is running socket -> ws://localhost:8001');
    console.log('You can write JavaScript:\n-----------------------');
    console.log('ws = new WebSocket("ws://localhost:8001");');
    console.log('ws.onmessage = ({data}) => console.log(data);');
    console.log('ws.send("Hello World!");\n-----------------------\n\n');
});
