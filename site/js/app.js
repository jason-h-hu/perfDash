// This is the topmost class. This is in charge of defining and running the topmost view. This view, called DashView, is in charge of displaying the list of all the tests we're interested in, as well as displaying the large graph of its metrics. 

$(function(){


	var DashView = Backbone.View.extend({
		el: 'body',
		initialize: function(){
			jQuery.get( '/api/tests', function( data, textStatus, jqXHR ) {
				var tests = new Tests()
				this.testsView = new TestsView({collection: tests})

				// First, get all the test names
				var names = {}
				for (var j = 0; j < data.length; j++){		// This makes the tests
					if (!( data[j]["simulation_name"] in names)){
						names[data[j]["simulation_name"]] = []
					}
					names[data[j]["simulation_name"]].push(data[j])
				}


				// Okay  now go through and reparse the data into our desired format
				for (var name in names){
					var versions = new Versions()
					var parsedVersions = {}
					var curVersions = names[name]
					var metadata = {}


					// Pull out the names of all the different nodes. 
					// These might not actually matter
					for (var i = 0; i < curVersions.length; i++){
						for (var node in curVersions[i].totals){
							parsedVersions[node] = 0
						}
					}
					var throughputCategories = ["insert_count", "remove_count", "query_count"]
					var latencyCategories = ["insert_avg_micros", "remove_avg_micros", "query_avg_micros"]

					// So we're trying to buld a struct that looks like: 
					// {
					// 	name: node 
					// 	data: [thread1, thread2, thread3 ...]
					// 	categories: ["thread1", "thread2" ...]
					// }
					// So we first loop over the node name, then we loop over
					// all the versions (aka the treads) and pull out the
					// appropriate data to append to our list, along the
					// way remember which categories we see so we generate that list
					for (var node in parsedVersions){
						var throughputSeries = {
							"name" : node,
							"data" : [],
							"categories": [],
							"type": "column",
						}
						var latencySeries = {
							"name" : node,
							"data" : [],
							"categories": [],
							"type": "spline",
							"yAxis": 1

						}
						var aggregateData = {
							"throughput": {},
							"latency": {},
							"totalTime": 0
						}
						for (var k = 0; k < curVersions.length; k++){
							var nameVersion = curVersions[k].threads + ""
							if (!(nameVersion in aggregateData)){
								aggregateData["throughput"][nameVersion] = 0
								aggregateData["latency"][nameVersion] = 0
							}
							for (var i = 0; i < throughputCategories.length; i++){
								aggregateData["throughput"][nameVersion] += curVersions[k]["totals"][node][throughputCategories[i]]/(curVersions[k].simulation_run_seconds)
							}
							for (var i = 0; i < latencyCategories.length; i++){
								aggregateData["latency"][nameVersion] += curVersions[k]["totals"][node][latencyCategories[i]]
								// aggregateData["latency"][nameVersion] += curVersions[k]["totals"][node][categories[i]]
							}
							metadata = curVersions[k]
							metadata.total = null
						}
						for (var key in aggregateData["throughput"]){
							throughputSeries["categories"].push(key)
							var t = (aggregateData["throughput"][key])
							throughputSeries["data"].push(t/curVersions.length)
						}
						for (var key in aggregateData["latency"]){
							latencySeries["categories"].push(key)
							var t = (aggregateData["latency"][key])
							latencySeries["data"].push(t/curVersions.length)
						}
						var series = {
							"throughput": throughputSeries, 
							"latency": latencySeries
						}
						var version = new Version({"series": series})
						console.log(version.get("server_host"))
						versions.add(version) 
					}
					metadata.name = name
					metadata.versions = versions
					var test = new Test(metadata)
					tests.add(test);
				}

			});
		},
		render: function() {
		},
		rerender: function() {
			this.testsView.render()
		}
	});
	var dash = new DashView	
	dash.render()	

}());