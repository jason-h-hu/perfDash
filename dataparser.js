// This class is used to reformat data from one form to another.

module.exports.packageDataVersions = function (data){
		// First sort by workload 
	var simulation_name = {}
	for (var i = 0; i < data.length; i++){
		var workload = data[i]["workload"]
		if (! (workload in simulation_name)){
			simulation_name[workload] = []
		}
		simulation_name[workload].push(data[i])
	}

	// Then sort by version
	var git_versions = {}
	for (var workload in simulation_name){
		git_versions[workload] = {}
		for (var i = 0; i < simulation_name[workload].length; i++){
			var gitversion = simulation_name[workload][i]["server_git_version"]
			if (! (gitversion in git_versions[workload])){
				git_versions[workload][gitversion] = []
			}
			git_versions[workload][gitversion].push(simulation_name[workload][i])
		}
		// return 
	}
	return git_versions
}

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

	// Then sort by version
	var git_versions = {}
	for (var workload in simulation_name){
		git_versions[workload] = {}
		for (var i = 0; i < simulation_name[workload].length; i++){
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
				var threadcount = git_versions[workload][version][i]["attributes"][0]["nThreads"]
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
			var stats = model["summary"]["nodes"]
			for (var i = 0; i < stats.length; i++){
				var curNode = stats[i]
				for (var nodeName in curNode){
					if (!(nodeName in nodes)){
						nodes[nodeName] = []
					}
				}
			}
			var threadCount = String(model["attributes"][0]["nThreads"])
			var j = 0
			if (!(threadCount in tempCategories)){
				tempCategories[threadCount] = index;
				j = index
				for (var i = 0; i < stats.length; i++){
					var curNode = stats[i]
					for (var nodeName in curNode){
						nodes[nodeName].push(0)
					}
				}
				latency["data"].push(0)
				index ++;
			}
			else {
				j = tempCategories[threadCount]
			}
			for (var i = 0; i < stats.length; i++){
				var curNode = stats[i]
				for (var nodeName in curNode){
					var nodeStats = curNode[nodeName]
					for (var l in throughputStats){
						nodes[nodeName][j] += nodeStats[throughputStats[l]]		
					}
					for (var l in latencyStats){
						latency["data"][j] += nodeStats[latencyStats[l]]		
					}
					nodes[nodeName][j] /= (model["run_nanos"]/1000)
				}
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
		console.log(nodeName)
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
		ids: ids,
		server_git_version: model.server_git_version,
		_id: model._id,
		workload: model.workload,
		group_uid: model.group_uid,
		harness: model.harness,
		name: model.server_git_version
	}
}

module.exports.parseTestResults = function (collection) {

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
			var stats = model["summary"]["nodes"]
			for (var i = 0; i < stats.length; i++){
				var curNode = stats[i]
				for (var nodeName in curNode){
					if (!(nodeName in nodes)){
						nodes[nodeName] = []
					}
				}
			}
			var threadCount = String(model["attributes"][0]["nThreads"])
			var j = 0
			if (!(threadCount in tempCategories)){
				tempCategories[threadCount] = index;
				j = index
				for (var i = 0; i < stats.length; i++){
					var curNode = stats[i]
					for (var nodeName in curNode){
						nodes[nodeName].push(0)
					}
				}
				latency["data"].push(0)
				index ++;
			}
			else {
				j = tempCategories[threadCount]
			}
			for (var i = 0; i < stats.length; i++){
				var curNode = stats[i]
				for (var nodeName in curNode){
					var nodeStats = curNode[nodeName]
					for (var l in throughputStats){
						nodes[nodeName][j] += nodeStats[throughputStats[l]]		
					}	
					for (var l in latencyStats){
						latency["data"][j] += nodeStats[latencyStats[l]]		
					}
					nodes[nodeName][j] /= (model["run_nanos"]/1000)
				}
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
		ids: ids,
		server_git_version: model.server_git_version,
		_id: model._id,
		workload: model.workload,
		group_uid: model.group_uid,
		harness: model.harness,
		name: model.server_git_version
	}
}

module.exports.parseResultsVersions = function (collection) {
	var latencyStats = ["exhaust_avg_micros", "insert_avg_micros", "query_avg_micros", "remove_avg_micros", "update_avg_micros"]
	var throughputStats = ["exhaust_count", "insert_count", "query_count", "remove_count", "update_count"]

	var returnStruct = []
	var index = 0
	var categories = []

	var labels = {}
    for (var gitversion in collection){
        var runs = collection[gitversion]
		for (var i = 0; i < runs.length; i++){
			var model = runs[i]
			var threadcount = String(model["attributes"][0]["nThreads"])
			if (!(threadcount in labels)){
				labels[threadcount] = index
				index++
			}
		}
	}
	for (var c in labels){
		categories.push(c)
	}
    for (var gitversion in collection){
        var runs = collection[gitversion]
		var series = []
		for (var c in labels){
			series.push(0)
		}

		for (var i = 0; i < runs.length; i++){
			var model = runs[i]
			var threadcount = String(model["attributes"][0]["nThreads"])
			var j = labels[threadcount]
			var stats = model["summary"]["nodes"]
			for (var k = 0; k < stats.length; k++){
				var curNode = stats[k]
				for (var nodeName in curNode){
					var nodeStats = curNode[nodeName]
					for (var l in latencyStats){
						series[j] += nodeStats[latencyStats[l]]		
					}
				}
			}
		}
		returnStruct.push({
			data: series,
			name: gitversion
			// server_git_version: model.server_git_version,
			// _id: model._id,
			// workload: model.workload,
			// group_uid: model.group_uid,
			// harness: model.harness,
			// name: model.server_git_version
				
		})
    }


	return {
		series: returnStruct,
		categories: categories
	}
}

