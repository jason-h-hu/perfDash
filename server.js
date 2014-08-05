// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ),     //Web framework
    path = require( 'path' ),           //Utilities for dealing with file paths
    dataparser = require( './dataparser.js'),   // Helper methods for parsing data
    mongodb = require( 'mongodb' ),
    mongoClient = mongodb.MongoClient;

//Create server
var app = express();

//Connect to database
mongoClient.connect("mongodb://zzyzx.local:27017/simulation", function(err, db){
    if (err){
        console.log("Couldn't connect to database, exiting out")
        return
    }
    console.log("Connected to database")

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

    // This shows all the workloads for all versions of code
    app.get( '/api/heatmap/:id', function( request, response ) {
        response.send("got a heatmap request for " + request.params.id)
        console.log("got a heatmap request for " + request.params.id)
    });

    // This shows the workloads for all versions of a code
    app.get( '/api/test/:id', function( request, response ) {
        response.send("got a test request for " + request.params.id)
        console.log("got a test request for " + request.params.id)
    });

    app.get( '/api/run/:id', function( request, response ) {
        response.send("got a run request for " + request.params.id)
        console.log("got a run request for " + request.params.id)
    });

    // This gets 
    app.get( '/api/results', function( request, response ) {
        db.collection("results").find().toArray(function(err, items) {
            if (err){
                console.log("Error with querying results")
            }
            else{
                response.send(dataparser.parseResults(items))   // Moved all parsing methods to dataparser.js
            }
        })
    });


    //Start server
    var port = 4711;
    app.listen( port, function() {
        console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
    });
})

//Schemas
// var Test = new mongoose.Schema({
//     _id: String,
//     timestamp: Date,
//     simulation_name: String,
//     threads: Number,
//     totals: {
//         insert_doc: {
//             avg_insert: Number,
//             avg_upadate: Number,
//             avg_remove: Number,
//             avg_query: Number,
//             avg_exhaust: Number
//         },
//         remove_doc: {
//             avg_insert: Number,
//             avg_upadate: Number,
//             avg_remove: Number,
//             avg_query: Number,
//             avg_exhaust: Number
//         }        
//     }

// });

//Models
// var TestModel = mongoose.model( 'Test', Test, "results");


