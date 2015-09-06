/**
 * Created by philip senger on 24/06/15.
 */
"use strict";
var amqp = require('amqp'),
    config = require('./config.json'),
    connection = amqp.createConnection(config);

connection.on('ready', function () {
    connection.queue(config.queue, function (q) {
        q.bind('#');
        // Receive messages
        q.subscribe(function (message) {
            console.log( message.words.split(' ').length );
        });
    });
});