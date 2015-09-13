/**
 * Created by Philip A Senger
 */
var amqp = require('amqp'),
    config = require('./config.json'),
    randomWords = require('random-words'),
    connection = amqp.createConnection(config),
    Promise = require('bluebird');

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
            .then(function (result) {
                console.log(result);
                connection.end();
            })
            .catch(Promise.TimeoutError, function (e) {
                throw new Error("Failed to fulfill makeRequest within the specified timeout.");
            });

});