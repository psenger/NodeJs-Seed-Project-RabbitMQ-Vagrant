/**
 * Created by philipsenger on 24/06/15.
 */
"use strict";
var amqp = require('amqp');

var connection = amqp.createConnection({ host: 'localhost' });


/**
 * Random Number between two numbers, low (inclusive) and high (inclusive)
 * @param low
 * @param high
 * @returns {number}
 */
function randomNumber (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

/**
 * Send a Message
 * @param connection
 * @param queue_name
 * @param payload
 */
function sendMessage (connection, queue_name, payload) {
    console.log('Sending a message: ' + payload.name);
    var encoded_payload = JSON.stringify(payload);
    connection.publish(queue_name, encoded_payload);
}

connection.on('ready', function () {
    var count = 0;
    setInterval( function() {
        var sample = {
            name: 'My hovercraft is full of eels ' + count,
            time: randomNumber(1000,4000)
        };
        sendMessage(connection, "my_queue_name", sample );
        count += 1;
    }, 2000);
});
