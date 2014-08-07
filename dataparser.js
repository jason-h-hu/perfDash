// This class is used to reformat data from one form to another.

// This is a temporary solution. This is just to pgroup according to workload, then
// version, then parameters. This takes in all the data, and returns a dict with the
module.exports.packageData = function (data){
		// First sort by workload 
	var simulation_name = {}
	for (var i = 0; i < data.length; i++){
		var workload = data[i]["workload"]
		if (! (workload in simulation_name)){
			simulation_name[workload] = []
		}
		simulation_name[workload].push(data[i])
	}
	// console.log(simulation_name)

	// Then sort by version
	var git_versions = {}
	for (var workload in simulation_name){
		git_versions[workload] = {}
		for (var i = 0; i < simulation_name[workload].length; i++){
			console.log(simulation_name[workload][i])
			var gitversion = simulation_name[workload][i]["server_git_version"]
			if (! (gitversion in git_versions[workload])){
				git_versions[workload][gitversion] = []
			}
			git_versions[workload][gitversion].push(simulation_name[workload][i])
		}
		// return 
	}

	// Then sort by parameters (thread)
	var run = {}
	for (var workload in git_versions){
		run[workload] = {}
		for (var version in git_versions[workload]){
			run[workload][version] = {}
			for (var i = 0; i < git_versions[workload][version].length; i++){
				var threadcount = git_versions[workload][version][i]["threads"]
				if (!(threadcount in run[workload][version])){
					run[workload][version][threadcount] = []
				}
				run[workload][version][threadcount].push(git_versions[workload][version][i])
			}
		}
	}
	return run
}
module.exports.parseResults = function (collection) {

	var series = []
	var ids = []
	var tempCategories = {}
	var index = 0
	var nodes = {}
	var latency = {
		name: "latency",
		data: [],
		yAxis: 1,
		type: "spline"
	}

	var latencyStats = ["exhaust_avg_micros", "insert_avg_micros", "query_avg_micros", "remove_avg_micros", "update_avg_micros"]
	var throughputStats = ["exhaust_count", "insert_count", "query_count", "remove_count", "update_count"]

	for (var category in collection){
		var run = collection[category]
		for (var k in run){
			var model = run[k]
			for (var nodeName in model["totals"]){
				if (!(nodeName in nodes)){
					nodes[nodeName] = []
				}
			}
			var threadCount = String(model["threads"])
			var j = 0
			if (!(threadCount in tempCategories)){
				tempCategories[threadCount] = index;
				j = index
				for (var nodeName in model["totals"]){
					nodes[nodeName].push(0)
				}
				latency["data"].push(0)
				index ++;
			}
			else {
				j = tempCategories[threadCount]
			}
			for (var nodeName in model["totals"]){
				for (var i in throughputStats){
					nodes[nodeName][j] += model["totals"][nodeName][throughputStats[i]]		
				}
				for (var i in latencyStats){
					latency["data"][j] += model["totals"][nodeName][latencyStats[i]]		
				}
				nodes[nodeName][j] /= model["simulation_run_micros"]
			}
			ids.push(model["_id"])
		}
	}
	var categories = []
	var series = []
	for (var category in tempCategories){
		categories.push(category)
	}
	for (var nodeName in nodes){
		data = []
		for (var i in nodes[nodeName]){
			data.push(nodes[nodeName][i])
		}
		series.push({
			name: nodeName,
			type: "column",
			data: data
		})
	}
	series.push(latency)

	return {
		categories: categories,
		series: series,
		ids: ids
	}
}

