/**
 * Created by psenger on 10/5/15.
 */
var amqp = require('amqp'),
    config = require('./config.json');

var connection = amqp.createConnection(config);

// Wait for connection to become established.
connection.on('ready', function () {
    // Use the default 'amq.topic' exchange
    connection.queue( config.queue , function (q) {
        // Catch all messages
        q.bind('topic.funny.*');

        // Receive messages
        q.subscribe(function (message) {
            // Print messages to stdout
            console.log(message);
        });
    });
});