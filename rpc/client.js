//exmaple on how to use amqprpc
var amqp = require('amqp'),
    config = require('./config.json'),
    randomWords = require('random-words'),
    connection = amqp.createConnection(config);

var rpc = new (require('./amqprpc'))(connection);

connection.on("ready", function () {
    console.log("ready");

    var outstanding = 0; //counter of outstanding requests

    //do a number of requests
    for (var i = 1; i <= 10; i += 1) {
        //we are about to make a request, increase counter
        outstanding += 1;
        rpc.makeRequest(config.queue, {
            msg: randomWords({
                min: 10,
                max: 100,
                join: ' '
            })
        }, function response(err, response) {
            if (err) {
                console.error(err);
            } else {
                console.log("response", response);
            }
            //reduce for each timeout or response
            outstanding -= 1;
            isAllDone();
        });
    }

    function isAllDone() {
        //if no more outstanding then close connection
        if (outstanding === 0) {
            connection.end();
        }
    }

});