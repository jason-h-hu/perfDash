// Module dependencies.
var application_root = __dirname,
    db_uri = "mongodb://zzyzx.local:27017/simulation"
    express = require( 'express' ),     //Web framework
    path = require( 'path' ),           //Utilities for dealing with file paths
    dataparser = require( './dataparser.js'),   // Helper methods for parsing data
    mongodb = require( 'mongodb' ),
    mongoClient = mongodb.MongoClient;

//Create server
var app = express();

//Connect to database
mongoClient.connect(db_uri, function(err, db){
    if (err) {
        console.log("Couldn't connect to database at " + db_uri + ".  exiting.");
        return;
    }
    console.log("Connected to database at " + db_uri);

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

    // Request the summary of everything--used for generating CompleteResult
    app.get('/api/completeResult/summary/:id', function(request, response){
        var cells = {};

        function getThroughput(doc) {
            var totalTime = doc.run_seconds;
            if (doc.summary.all_nodes.hasOwnProperty("op_count")) {
                return doc.summary.all_nodes.op_count / totalTime;
            } else {
                var totalOps = 0;
                doc.summary.nodes.forEach(function (node) {
                    totalOps += node[Object.keys(node)].op_count;
                });
                return totalOps / totalTime;
            }
        }
        // build the list of workloads (y axis)
        db.collection("results", function(err, col) {
            // sort
            col.find({}, {sort: {"server_version": 1}}).toArray(function(err, docs) {
                var maxThroughput = 0;
                var minThroughput = 9007199254740992; // max num
                var xLabels = new Array();
                var yLabels = new Array();
                docs.forEach(function(doc) {
                    if (!cells.hasOwnProperty(doc.server_version)) {
                        cells[doc.server_version] = {};
                        cells[doc.server_version][doc.workload] = new Array();
                        xLabels.push(doc.server_version);
                        yLabels.push(doc.workload);
                    } else {
                        if (!cells[doc.server_version].hasOwnProperty(doc.workload)) {
                            cells[doc.server_version][doc.workload] = new Array();
                            yLabels.push(doc.workload);
                        }
                    }
                    cells[doc.server_version][doc.workload].push(getThroughput(doc));
                    if (getThroughput(doc) > maxThroughput)
                        maxThroughput = getThroughput(doc);
                    if (getThroughput(doc) < minThroughput)
                        minThroughput = getThroughput(doc);
                });

                // deduplicate labes from multiple runs
                yLabels = yLabels.filter(function(elem, pos) {
                    return yLabels.indexOf(elem) == pos;
                });

                var values = new Array(); // 2d array (x: version y: server)
                var xPos = 0;
                for (x in cells) {
                    Object.keys(cells[x]).forEach(function(y) {
                        var totalThroughput = 0;
                        var totalRuns = 0;
                        cells[x][y].forEach(function(t) {
                            totalThroughput += t;
                            totalRuns++;
                        });
                        var avgThroughput = totalThroughput / totalRuns;
                        values.push([xPos, yLabels.indexOf(y), avgThroughput]);
                    });
                    xPos++;
                }

                response.send({
                                min_throughput: minThroughput,
                                max_throughput: maxThroughput,
                                xLabels: xLabels,
                                yLabels: yLabels,
                                // cells: cells,
                                values: values
                              });
            });
        });
    })

    // Request unaggregated data--used for generating WorkloadResult, in Complete Result
    app.get('/api/completeResult/data/:id', function(request, response){

        // THIS IS BROKEN. RIGHT NOW IT SHOULD ONLY RETURN THE DESIRED
        // ID--instead it returns everything. 
        db.collection("results").find().toArray(function(err, items) {
            if (err){
                console.log("Error with querying results")
            }
            else{
                var data = dataparser.packageDataVersions(items)
                var results = []
                for (var workload in data){
                    var versions = data[workload]
                    var result = dataparser.parseResultsVersions(versions)
                    result.name = workload
                    results.push(result)
                }

                response.send(results)  
            }
        })        
    })

    app.get('/api/workloadResult/summary/:id', function(request, response){
        return 
    })

    app.get('/api/workloadResult/data/:id', function(request, response){
        response.send( {
            "name": "FILLERNAME",
            "workload": "twitter"
        })
    })

    // This gets the same thing as above, but filtered such that it's just 
    // for a desired workload. e.g. Twitter
    // For the given test, this should show the aggregate summary of all its
    // runs. This can either be an average, running average of the previous n
    // runs, or just the last run
    // This should follow the schema: 
    // {
    //     ids: [id1, id2, id3 ... idm],               
    //     categories: [c1, c2, c3 ... cn],            
    //     series: [{
    //                 name: node1,
    //                 data: [v1, v2, v3 ... vn]
    //             },
    //             {
    //                 name: node2,
    //                 data: [v1, v2, v3 ... vn]
    //             }
    //             ...
    //             {
    //                 name: latency,
    //             }],
    //     server_git_version: the version of teh code,
    //     workload: the test, e.g. twitter,
    //     harness: the source, e.g. mongo sim,
    //     name: what you want to call the test
    // }
    // Where m is the number of runs, and id is the id of a run, and n is the
    // number of categories, such as "1 thread", "2 threads", etc. 
    // The ID is the ID of the "completeResult" we want, which, in this case
    // is everything
    app.get( '/api/test/summary/:workload', function( request, response ) {
        console.log("got a test request " + request.params.workload)
        db.collection("results").find().toArray(function(err, items) {
            if (err){
                console.log("Error with querying results")
            }
            else{
                var data = dataparser.packageData(items)
                var results = []
                var versions = data[request.params.workload]
                for (var gitversion in versions){
                    var runs = versions[gitversion]
                    results.push(dataparser.parseTestResults(runs, request.workload))
                }

                response.send(results[0])  
            }
        })
    });


    app.get('/api/test/data/:id', function(request, response){
        console.log("got a run request for " + request.params.id)
        var fakeData = {
            series: [{
                name: "version1",
                data: [5, 8, 12, 17, 21]
            },
            {
                name: "version2",
                data: [6, 9.5, 14, 19, 23]
            },
            {
                name: "version1",
                data: [9, 10, 13, 20, 23.25]
            },
            {
                name: "version1",
                data: [10, 15, 16, 17, 17]
            }],
            xCategories: ["1", "2", "4", "8", "16"]
        }
        response.send(fakeData)
    })



    //Start server
    var port = 4711;
    app.listen( port, function() {
        console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
    });
})

