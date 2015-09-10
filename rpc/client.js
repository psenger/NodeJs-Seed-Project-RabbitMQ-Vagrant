//exmaple on how to use amqprpc
var amqp = require('amqp'),
    config = require('./config.json'),
    randomWords = require('random-words'),
    connection = amqp.createConnection(config);

var rpc = new (require('./amqprpc'))(connection);

connection.once("ready", function () {
    console.log("ready");

        var body = {
            msg: randomWords({
                min: 10,
                max: 100,
                join: ' '
            })
        };

        rpc.makeRequest( config.queue, body )
            //.timeout(100)
            .then(function (result) {
                console.log(result);
                connection.end();
            })
            .catch(TimeoutError, function (e) {
                throw new Error("Failed to fulfill makeRequest within the specified timeout.");
            });

});