/**
 * Created by Philip A Senger on 9/7/15.
 */
var uuid = require ( 'node-uuid' ),
    Promise = require('bluebird' ),
    curry = require ( 'curry' );

var _TIMEOUT = 2000; //time to wait for response in ms
var _CONTENT_TYPE = 'application/json';
var _CONTENT_ENCODING = 'utf-8';

var AmqpRpc = function AmqpRpc ( connection, timeout, contentType, encoding ) {

    this.connection = connection;
    this.timeout = timeout || _TIMEOUT;
    this.contentType = contentType || _CONTENT_TYPE;
    this.encoding = encoding || _CONTENT_ENCODING;

};

AmqpRpc.prototype.makeRequest = function makeRequest ( queue_name, content ) {
    var self = this;
    var correlationId = uuid.v4 ();
    return self.setupResponseQueue ( self.connection )
            .then ( function ( setup ) {
                var sub = new Promise ( function ( resolve, reject ) {
                                        var responseQueue = setup.responseQueue;
                                        var callBack = curry ( self.worker );
                                        responseQueue.subscribe ( callBack ( correlationId, resolve, reject ) );
                                    } );
                var pub = new Promise ( function ( resolve, reject ) {
                                        var responseQueue = setup.responseQueue;
                                        var connection = setup.connection;
                                        var payload = {
                                            correlationId: correlationId,
                                            contentType: self.contentType,
                                            contentEncoding: self.encoding,
                                            replyTo: responseQueue.name
                                        };
                                        connection.publish ( queue_name, content, payload );
                                        resolve ( true );
                                    } );
                return new Promise ( function ( resolve, reject ) {
                                        Promise.join ( sub, pub, function ( subResult, pubResult ) {
                                            resolve ( subResult );
                                        } );
                                    } )
                                    .cancellable()
                                    .timeout(1000);
                        //.catch(Promise.CancellationError, function(error) {
                        //    console.error( error );
                        //})
                        //.catch ( Promise.TimeoutError, function ( error ) {
                        //    console.log('Task ' + name + ' timed out', error);
                        //} );
    } );
};

AmqpRpc.prototype.worker = function worker ( correlationId, resolve, reject, message, headers, deliveryInfo, m ) {
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

module.exports = AmqpRpc;
