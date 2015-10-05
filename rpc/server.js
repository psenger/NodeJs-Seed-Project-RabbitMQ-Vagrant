/**
 * Created by Philip A Senger
 */
var amqp = require('amqp'),
    config = require('./config.json'),
    util = require('util' );

var connection = amqp.createConnection(config);

connection.on('ready', function () {
    // console.log("listening on " + config.queue);

    connection.queue(config.queue, function (queue) {
        queue.subscribe(function (message, headers, deliveryInfo, m) {

            // ------
            util.log(util.format(deliveryInfo.routingKey, message));

            var wordCnt = ( message.msg ) ? message.msg.split(' ').length : 0;
            var characterCnt = ( message.msg ) ? message.msg.length : 0;
            var histogram = {};
            if ( message.msg ) {
                var car = message.msg.split('');
                for (var i = 0; i < car.length; i++) {
                    var c = car[i];
                    histogram[c] = histogram[c] ? 1 + histogram[c] : 1;
                }
            }
            var payload = {
                wordCnt:wordCnt,
                characterCnt:characterCnt,
                histogram:histogram
            };
            // ------

            //var timeoutID =  setTimeout(function(){ // simulate work being done for 3 seconds.
                connection.publish(m.replyTo, payload, {
                    contentType: 'application/json',
                    contentEncoding: 'utf-8',
                    correlationId: m.correlationId
                });
            //},3000);

        });
    });
});
