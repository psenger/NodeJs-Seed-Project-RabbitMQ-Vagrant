/**
 * Created by philip senger on 24/06/15.
 */
"use strict";
var amqp = require('amqp'),
    randomWords = require('random-words'),
    sleep = require('sleep'),
    config = require('./config.json'),
    connection = amqp.createConnection(config);

/**
 * Random Number between two numbers, low (inclusive) and high (inclusive)
 *
 * @param low
 * @param high
 * @returns {number}
 */
function randomNumber (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

connection.on('ready', function () {
    // The direct exchange is pretty simple: if the routing key matches,
    // then the message is delivered to the corresponding queue.
    var exchange_options = {
        type: 'fanout',
        confirm: true,
        passive: false,
        autoDelete: false,
        durable: true
    };
    var publish_options = {
        contentType: 'application/json',
        contentEncoding: 'UTF-8'
    };
    console.log('connection ready');
    connection.exchange(config.exchange, exchange_options, function (exchange) {
        console.log( config.exchange + ' ready');
        connection.queue(config.queue, function(queue) {
            console.log( config.queue + ' ready');
            queue.on('queueBindOk', function() {
                console.log('bind successful');
            });
            queue.bind(exchange, "*");

            /**
             * this is designed to run every 3 seconds.
             */
            var interval = setInterval(function(){

                // build payload with some random words.
                var payload =  {
                    words: randomWords( { min: 50, max: 100, join: ' ' } )
                };
                var body = JSON.stringify(payload);

                console.log('Sending a message');

                exchange.publish("message.text", body, publish_options , function(error){
                    /**
                     * called if the exchange is in confirm mode, the value sent will be true or false,
                     * this is the presence of a error so true, means an error occurred and false,
                     * means the publish was successful
                     **/
                    if ( error ) {
                        console.error(error);
                    }
                });

                // sleep from 1 to 10 seconds.
                sleep.sleep( randomNumber(1,10) );

            }, ( 1000 * 3 ) );

        });
    });
    // console.log('destroy');
    // connection.destroy();
});
connection.on('error', function(e) {
   console.log('error ' + JSON.stringify(e,'\t',4));
});
connection.on('close', function(e) {
    console.log('close ' + JSON.stringify(e,'\t',4));
});