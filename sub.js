/**
 * Created by philip senger on 24/06/15.
 */

"use strict";
var amqp = require('amqp');

var connection = amqp.createConnection({ host: '10.1.1.2' });

connection.on('ready', function () {
    connection.queue("my_queue_name", function(queue){
        queue.bind('#');
        queue.subscribe(function (message) {
            // var encoded_payload = unescape(message.data);
            // var payload = JSON.parse(encoded_payload);
            var payload = JSON.parse(message.data);
            console.log('Received a message: ' + payload.name);
            setTimeout(function() {
                console.log( 'completed some work' );
            }, payload.time );
        })
    })
});
