// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ), //Web framework
    path = require( 'path' ), //Utilities for dealing with file paths
    mongoose = require( 'mongoose' ); //MongoDB integration

//Create server
var app = express();

//Connect to database
mongoose.connect( 'mongodb://zzyzx.local:27017/simulation');
// mongoose.connect( 'mongodb://localhost/library_database');

//Schemas
var Test = new mongoose.Schema({
    _id: String,
    timestamp: Date,
    simulation_name: String,
    threads: Number,
    totals: {
        insert_doc: {
            avg_insert: Number,
            avg_upadate: Number,
            avg_remove: Number,
            avg_query: Number,
            avg_exhaust: Number
        },
        remove_doc: {
            avg_insert: Number,
            avg_upadate: Number,
            avg_remove: Number,
            avg_query: Number,
            avg_exhaust: Number
        }        
    }

});

//Models
var TestModel = mongoose.model( 'Test', Test, "results");

// Configure server
app.configure( function() {
    //parses request body and populates request.body
    app.use( express.bodyParser() );

    //checks request.body for HTTP method overrides
    app.use( express.methodOverride() );

    //perform route lookup based on url and HTTP method
    app.use( app.router );

    //Where to serve static content
    app.use( express.static( path.join( application_root, 'site') ) );

    //Show all errors in development
    app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));

});


// Routes
app.get( '/api', function( request, response ) {
    response.send( 'Library API is running' );
});


app.get( '/api/tests', function( request, response ) {
    return TestModel.find(function( err, test ) {
        if( !err ) {
            return response.send( test );
        } 
        else {
            return console.log( err );
        }
    });
});


//Start server
var port = 4711;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});

