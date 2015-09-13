//exmaple on how to use amqprpc
var amqp = require('amqp'),
    config = require('./config.json'),
    randomWords = require('random-words'),
    connection = amqp.createConnection(config);

var rpc = new (require('./amqprpc'))(connection,5000);

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
            .then(function (result) {
                console.log(result);
                connection.end();
            })
            .catch(function (e) {
                console.error('Failed to fulfill makeRequest within the specified timeout.', e);
                connection.end();
            } );

});
