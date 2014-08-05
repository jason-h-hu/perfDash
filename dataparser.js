// This class is used to reformat data from one form to another.

// This is for the full list of results. This is currently a tad monstrous.
// The goal is to return a list, of the form:
// [
//     {
//         name: name of test      e.g. Twitter
//         data: [
//             {
//                 throughput : {
//                     name: name of node         e.g. Get feed/make user
//                     data: [list of values]
//                     categories: [the list of corresponding categories]      e.g "1 thread", "2 threads"
//                 },
//                 latency : {
//                     ""
//                 }
//             },
//             {
//                 ""
//             }
//         ]
//     },
//     {
//         ""
//     }
// ]
// WARNING! This is gross. It really is. If you want to change it, or understand what's going on,
// Just talk to Jason Hu instead. 
module.exports.parseResults = function (items) {
    

    var data = []   // The struct we ultimately return

    // First, get all the test names
    var names = {}
    for (var j = 0; j < items.length; j++){
        if (!( items[j]["simulation_name"] in names)){
            names[items[j]["simulation_name"]] = []
        }
        names[items[j]["simulation_name"]].push(items[j])
    }

    // Okay  now go through and reparse the items into our desired format
    for (var name in names){
        var parsedVersions = {}         // This holds all the reaggregated data for a test
        var curVersions = names[name]   // This is the data we're goign to manipulate

        // Pull out the names of all the different nodes. 
        // These might not actually matter
        for (var i = 0; i < curVersions.length; i++){
            for (var node in curVersions[i].totals){
                parsedVersions[node] = {}
            }
        }
        var throughputCategories = ["insert_count", "remove_count", "query_count"]
        var latencyCategories = ["insert_avg_micros", "remove_avg_micros", "query_avg_micros"]

        // So we're trying to buld a struct that looks like: 
        // {
        //  name: node 
        //  items: [thread1, thread2, thread3 ...]
        //  categories: ["thread1", "thread2" ...]
        // }
        // So we first loop over the node name, then we loop over
        // all the versions (aka the threads) and pull out the
        // appropriate items to append to our list. along the
        // way remember which categories we see
        var versions = []
        for (var node in parsedVersions){
            var throughputSeries = {
                "name" : node,
                "data" : [],
                "categories": [],
                "type": "column",       // This should be done on the front end!
            }
            var latencySeries = {
                "name" : node,
                "data" : [],
                "categories": [],
                "type": "spline",
                "yAxis": 1          // This should be done on the fron tend

            }

            // This is used to calculate some statistics. 
            // The struct itself won't make it into the final return struct
            var aggregateitems = {
                "throughput": {},
                "latency": {},
                "totalTime": 0
            }

            // Calculating the averages/aggregates of all our stats
            for (var k = 0; k < curVersions.length; k++){
                var nameVersion = curVersions[k].threads + ""
                if (!(nameVersion in aggregateitems)){
                    aggregateitems["throughput"][nameVersion] = 0
                    aggregateitems["latency"][nameVersion] = 0
                }
                for (var i = 0; i < throughputCategories.length; i++){
                    aggregateitems["throughput"][nameVersion] += curVersions[k]["totals"][node][throughputCategories[i]]/(curVersions[k].simulation_run_seconds)
                }
                for (var i = 0; i < latencyCategories.length; i++){
                    aggregateitems["latency"][nameVersion] += curVersions[k]["totals"][node][latencyCategories[i]]
                }
            }

            // Populating our return struct with the calculated averages
            for (var key in aggregateitems["throughput"]){
                throughputSeries["categories"].push(key)
                var t = (aggregateitems["throughput"][key])
                throughputSeries["data"].push(t/curVersions.length)
            }
            for (var key in aggregateitems["latency"]){
                latencySeries["categories"].push(key)
                var t = (aggregateitems["latency"][key])
                latencySeries["data"].push(t/curVersions.length)
            }
            versions.push({
                "throughput": throughputSeries, 
                "latency": latencySeries
            }) 
        }
        data.push({
            "name" :    name,
            "data" :    versions
        })
    }
    return data
}