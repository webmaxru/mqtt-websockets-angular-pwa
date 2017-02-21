var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://mbroker.forgerocklabs.net/')

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var base64 = require('base-64');
var http = require('http');

var cors = require('cors');
app.use(cors());
app.options('*', cors());
var bodyParser = require('body-parser');

const webPush = require('web-push');
let pushSubscription;

// The GCM API key is AIzaSyDNlm9R_w_0FDGjSM1fzyx5I5JnJBXACqU
webPush.setVapidDetails(
    'mailto:salnikov@gmail.com',
    'BHe82datFpiOOT0k3D4pieGt1GU-xx8brPjBj0b22gvmwl-HLD1vBOP1AxlDKtwYUQiS9S-SDVGYe_TdZrYJLw8',
    's-zBxZ1Kl_Y1Ac8_uBjwIjtLtG6qlJKOX5trtbanAhc'
);

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.post("/subscription", function(req, res, next) {

    if (req.body.action === 'subscribe') {
        pushSubscription = req.body.subscription;

        console.log('subscription called with ' + pushSubscription)

    } else {
        throw new Error('Unsupported action');
    }

    res.send({
        text: 'Sending push in 5',
        status: "200"
    });
});

function sendNotification(payload) {

    if (pushSubscription) {
        console.log('sendNotification with ', payload)

        webPush.sendNotification(pushSubscription, payload)
            .then(function(response) {
                if (response) {
                    console.log("PUSH RESPONSE: ", response);
                } else {
                    console.log("PUSH SENT");
                }
            })
            .catch(function(err) {
                console.error("PUSH ERR: " + err);
            });
    } else {
      console.log('No push subscription found')
    }


}

client.on('connect', function() {
    console.log('Broker connected');
    client.subscribe('#')
})

client.on('message', function(topic, message) {

    console.log('Message from broker received')
    console.log('Topic:' + topic.toString())
    console.log('Message:' + message.toString())

    var messageContent = {
        topic: topic.toString(),
        message: message.toString()
    }

    // Sending to client
    io.emit('deviceMessage', messageContent);

    sendNotification(JSON.stringify(messageContent))
})

io.on('connection', function(socket) {

    console.log('Client connected');

    socket.on('disconnect', function() {
        console.log('Client disconnected');
    });

    socket.on('deviceMessage', (messageContent) => {

        console.log('Message from client received')
        console.log('Topic:' + messageContent.topic)
        console.log('Message:' + messageContent.message)

        // Sending to client
        io.emit('deviceMessage', {
            topic: messageContent.topic,
            message: messageContent.message
        });

        // Sending to broker
        client.publish(messageContent.topic, messageContent.message)

    });

});

server.listen(3001, function() {
    console.log('Example app listening on port 3001!')
})
