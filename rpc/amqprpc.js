/**
 * Created by Philip A Senger on 9/7/15.
 */
var amqp = require ( 'amqp' ),
    uuid = require ( 'node-uuid' ),
    curry = require ( 'curry' );

var _TIMEOUT = 2000; //time to wait for response in ms
var _CONTENT_TYPE = 'application/json';
var _CONTENT_ENCODING = 'utf-8';

var AmqpRpc = function AmqpRpc ( connection, timeout, contentType, encoding ) {

    this.connection = connection;
    this.timeout = timeout || _TIMEOUT;
    this.contentType = contentType || _CONTENT_TYPE;
    this.encoding = encoding || _CONTENT_ENCODING;

    // object literal used to store requests waiting for responses.
    this.requests = {};

    // place holder for future queue.
    this.response_queue = false;
};

AmqpRpc.prototype.makeRequest = function makeRequest ( queue_name, content ) {
    var self = this;
    var correlationId = uuid.v4 ();

    return self.setupResponseQueue ( self.connection )
            .then ( function ( setup ) {
                var promises = [];
                promises.push( new Promise ( function ( resolve, reject ) {
                                    var responseQueue = setup.responseQueue;
                                    // subscribe to the response queue
                                    //  var callBack = curry ( self.worker );
                                    // responseQueue.subscribe ( callBack ( correlationId, resolve, reject ) );
                                    responseQueue.subscribe( function  ( message, headers, deliveryInfo, m ) {
                                        if ( m.correlationId === correlationId ) {
                                            //// retrieve the request entry
                                            //var entry = self.requests[ correlationId ];
                                            //// make sure we don't timeout by clearing it
                                            //// clearTimeout( entry.timeout );
                                            //// delete the entry from hash
                                            //delete self.requests[ correlationId ];
                                            //// callback, no err
                                            //entry.callback ( null, message );
                                            resolve( message );
                                        }
                                    } );
                                } ) );
                promises.push( new Promise ( function ( resolve, reject ) {
                                    var responseQueue = setup.responseQueue;
                                    var connection = setup.connection;
                                    var payload = {
                                        correlationId: correlationId,
                                        contentType: self.contentType,
                                        contentEncoding: self.encoding,
                                        replyTo: responseQueue.name
                                    };
                                    connection.publish ( queue_name, content, payload );
                                    resolve ();
                                } ) );

                return Promise
                    .all(promises)
                    //.cancellable()
                    .then ( function ( result ) {
                        return new Promise ( function ( resolve, reject ) {
                            resolve ( result[0] );
                        } );
                    } );
                    //.timeout ( self.timeout )
                    //.catch ( TimeoutError, function ( e ) {
                    //    throw new Error ( "Failed to fulfill makeRequest within the specified timeout." );
                    //} );

    } );
};

// AmqpRpc.prototype.worker = function worker ( correlationId, resolve, reject, message, headers, deliveryInfo, m ) {
AmqpRpc.prototype.worker = function worker ( message, headers, deliveryInfo, m ) {
    if ( m.correlationId === correlationId ) {
        resolve( message );
    }
};

AmqpRpc.prototype.setupResponseQueue = function ( connection ) {
    return new Promise ( function ( resolve, reject ) {
        connection.queue ( '', { exclusive: true }, function ( q ) {
            resolve ( { responseQueue: q, connection: connection } );
        } );
    } );
};

AmqpRpc.prototype.subscribe = function ( q ) {
    return new Promise ( function ( resolve, reject ) {
        //subscribe to messages
        q.subscribe ( function ( message, headers, deliveryInfo, m ) {
            //get the correlationId
            var correlationId = m.correlationId;
            //is it a response to a pending request
            if ( correlationId in self.requests ) {
                //retreive the request entry
                var entry = self.requests[ correlationId ];
                //make sure we don't timeout by clearing it
                clearTimeout ( entry.timeout );
                //delete the entry from hash
                delete self.requests[ correlationId ];
                //callback, no err
                entry.callback ( null, message );
            }
        } );
        return next ();
    } );
};

module.exports = AmqpRpc;

