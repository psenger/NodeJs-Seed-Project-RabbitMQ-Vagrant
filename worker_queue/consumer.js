/**
 * Created by Philip A Senger on 24/06/15.
 */
"use strict";

var amqp = require('amqp'),
    config = require('./config.json'),
    connection = amqp.createConnection(config);

/**
 * Message Receiver
 *
 * @param {JSON} message - Un parsed Json Data
 */
function messageReceiver(message) {
    // var encoded_payload = unescape(message.data);
    // var payload = JSON.parse(encoded_payload);
    var payload = JSON.parse(message.data);
    console.log('Received a message: ' + payload.name);
    setTimeout(function () {
        console.log('completed some work');
    }, payload.time);
}

/**
 * Message Subscriber - subscribed to a queue
 * @param {Connection.queue} queue - the queue we will be listening to.
 */
function messageSubscriber(queue) {
    queue.bind('#');
    queue.subscribe(messageReceiver);
}

connection.on('ready', function () {
    connection.queue(config.queue, { durable: false, autoDelete : true }, messageSubscriber );
});
