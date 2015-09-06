/**
 * Created by Philip A Senger on 24/06/15.
 */

"use strict";

var amqp = require('amqp'),
    config = require('./config.json'),
    connection = amqp.createConnection(config);

/**
 * Random Number between two numbers, low (inclusive) and high (inclusive)
 *
 * @param low
 * @param high
 * @returns {number}
 */
function randomNumber(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

/**
 * Send a Message
 *
 * @param connection
 * @param queue_name
 * @param payload
 */
function sendMessage(connection, queue_name, payload) {
    console.log('Sending a message: ' + payload.name);

    var encoded_payload = JSON.stringify(payload);

    connection.queue( queue_name, { durable: true, autoDelete : true }, function (queue) {
        console.log('Queue ' + queue.name + ' is open');

        queue.publish( queue_name, encoded_payload, {}, function(){
            console.log('published ', arguments );
        });

    } );

}

//connection.addListener('ready', function onReady() {
//    var count = 0;
//    // setInterval(function () {
//        var sample = {
//            name: 'My hovercraft is full of eels ' + count,
//            time: randomNumber(1000, 4000)
//        };
//        sendMessage(connection, config.queue, sample);
//        count += 1;
//   //  }, 2000);
//    console.log('done');
//});


// Wait for connection to become established.
connection.on('ready', function () {
    // Use the default 'amq.topic' exchange
    connection.queue('my-queue', function (q) {
        // Catch all messages
        q.bind('#');

        // Receive messages
        q.subscribe(function (message) {
            // Print messages to stdout
            console.log(message);
        });
    });
});