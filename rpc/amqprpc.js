/**
 * Created by Philip A Senger on 9/7/15.
 */
var amqp = require('amqp'),
    uuid = require('node-uuid');

var _TIMEOUT=2000; //time to wait for response in ms
var _CONTENT_TYPE='application/json';
var _CONTENT_ENCODING='utf-8';

var AmqpRpc = function AmqpRpc ( connection, timeout, contentType, encoding ) {
    var self = this;

    this.connection = connection;
    this.timeout = timeout || _TIMEOUT;
    this.contentType = contentType || _CONTENT_TYPE;
    this.encoding = encoding || _CONTENT_ENCODING;

    // object literal used to store requests waiting for responses.
    this.requests = {};

    // place holder for future queue.
    this.response_queue = false;
};

AmqpRpc.prototype.makeRequest = function(queue_name, content, callback){
    var self = this;
    var correlationId = uuid.v4();

    //create a timeout for what should happen if we don't get a response
    var tId = setTimeout(function(corr_id){
        //if this ever gets called we didn't get a response in a
        //timely fashion
        callback(new Error("timeout " + corr_id));
        //delete the entry from hash
        delete self.requests[corr_id];
    }, self.timeout , correlationId);

    // create a request entry to store in a hash
    var entry = {
        callback:callback,
        timeout: tId //the id for the timeout so we can clear it
    };

    // put the entry in the hash so we can match the response later
    self.requests[correlationId]=entry;

    //make sure we have a response queue
    self.setupResponseQueue(function(){
        //put the request on a queue
        self.connection.publish(queue_name, content, {
            correlationId:correlationId,
            contentType:self.contentType,
            contentEncoding:self.encoding,
            replyTo:self.response_queue});
    });
};


AmqpRpc.prototype.setupResponseQueue = function(next){
    // don't mess around if we have a queue
    if(this.response_queue) {
        return next();
    }

    var self = this;
    //create the queue
    self.connection.queue('', {exclusive:true}, function(q){
        //store the name
        self.response_queue = q.name;
        //subscribe to messages
        q.subscribe(function(message, headers, deliveryInfo, m){
            //get the correlationId
            var correlationId = m.correlationId;
            //is it a response to a pending request
            if(correlationId in self.requests){
                //retreive the request entry
                var entry = self.requests[correlationId];
                //make sure we don't timeout by clearing it
                clearTimeout(entry.timeout);
                //delete the entry from hash
                delete self.requests[correlationId];
                //callback, no err
                entry.callback(null, message);
            }
        });
        return next();
    });
};

module.exports = AmqpRpc;