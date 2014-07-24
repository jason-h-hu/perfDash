// This is the topmost class. This is in charge of defining and running the topmost view. This view, called DashView, is in charge of displaying the list of all the tests we're interested in, as well as displaying the large graph of its metrics. 

$(function(){


	var DashView = Backbone.View.extend({
		el: 'body',
		initialize: function(){
			jQuery.get( '/api/tests', function( data, textStatus, jqXHR ) {
				var tests = new Tests()

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

					// Pull out the names of all the different nodes. 
					// These might not actually matter
					for (var i = 0; i < curVersions.length; i++){
						for (var node in curVersions[i].totals){
							parsedVersions[node] = 0
						}
					}
					var categories = ["avg_insert", "avg_remove", "avg_query"]
					console.log(name)

					for (var node in parsedVersions){
						var series = {
								"name" : node,
								"data" : []
							}
						for (var k = 0; k < curVersions.length; k++){
							var throughput = 0
							for (var i = 0; i < categories.length; i++){
								throughput += curVersions[k]["totals"][node][categories[i]]
							}
							series["data"].push(throughput)
						}
						console.log(node)
						versions.add(new Version(series)) 
					}
					var test = new Test({
						"name": name,
						"versions": versions
					})
					tests.add(test);


					// var versionNames = ["insert", "remove"]
					// for (vn in versionNames){
					// 	var versionName = versionNames[vn] + "_doc"
					// 	var versionInfo = {
					// 		"name": versionName,
					// 		"data": [],
					// 	}
					// 	for (var i = 0; i < names[name].length; i++){
					// 		versionInfo["data"].push({
					// 			"name": names[name][i].threads,
					// 			"y": names[name][i]["totals"][versionName]["avg_" + versionNames[vn]]
					// 		})
					// 	}
					// 	versions.add(new Version(versionInfo)) 
					// }
					// var test = new Test({
					// 	"name": name,
					// 	"versions": versions
					// })
					// tests.add(test);
				}

				this.testsView = new TestsView({collection: tests})
			});
			// 	for (var name in names){
			// 		// console.log(name)
			// 		var versionNames = ["insert", "remove"]
			// 		for (vn in versionNames){
			// 			var versionName = versionNames[vn] + "_doc"
			// 			var versionInfo = {
			// 					"name": versionName,
			// 					"data": [],
			// 				}
			// 			for (var i = 0; i < names[name].length; i++){
			// 				versionInfo["data"].push({
			// 					"name": names[name][i].threads,
			// 					"y": names[name][i]["totals"][versionName]["avg_" + versionNames[vn]]
			// 				})
			// 			}
			// 			versions.add(new Version(versionInfo)) 
			// 		}
			// 		var test = new Test({
			// 			"name": name,
			// 			"versions": versions
			// 		})
			// 		tests.add(test);
			// 	}

			// 	this.testsView = new TestsView({collection: tests})
			// });
			// jQuery.get( '/api/tests', function( data, textStatus, jqXHR ) {
				// var tests = new Tests()
			// 	for (var j = 0; j < data.length; j++){		// This makes the tests
			// 		var versions = new Versions()
			// 		var vs = data[j]
			// 		for (var i = 0; i < vs.versions.length; i++){
			// 			var d = vs.versions[i]
			// 			versions.add(new Version(d))
			// 		}
			// 		versions.setLastSelected()
			// 		var test = new Test({
			// 			name: vs.name,
			// 			versions: versions
			// 		})
			// 		tests.add(test);
			// 	}
			// 	this.testsView = new TestsView({collection: tests})
			// });
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