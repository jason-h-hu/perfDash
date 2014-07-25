
function buildHeatMap(jQuerySelection, collection){
	var blockheight = 20
	var marginTop = 20
	var marginBottom = 40
	var fields = ["insert", "update", "read"]
	var parsedData = []
	var names = []
	// var model = collection.getSelected()
	collection.each(function(model){				// <-----warning! Only selecting the first model
		var editedData = []
		names.push(model.get("name"))
		fields.forEach(function(field){
			var data = model.get(field)
			for (var i = 0; i < data.length; i++){
				var v = data[i]["y"] ? data[i]["y"] : data[i]
				editedData[i] = editedData[i] ? editedData[i] : 0
				editedData[i] += v
			}
		})
		var entry = {
			"name"			: model.	get("name"),
			"pointStart"	: model.get("startTime") ,
			"pointInterval"	: model.get("interval"),
			"type"			: 'spline',
			"data" 			: editedData	
		}
		parsedData.push(editedData)
	});
	finalParseData = []
	for (var i = 0; i < parsedData.length; i++){
		for (var j = 0; j < parsedData[i].length; j++){
			finalParseData.push([j, i, parsedData[i][j]])
		}
	}
	return jQuerySelection.highcharts({ 
		credits: { 	enabled: false },

		chart: {
			type: 'heatmap',
			height: blockheight*names.length + marginTop + marginBottom
		},
		title : {
			text: "",
			align: "left"
		},
		xAxis: {
			type: "datetime"
		},

		yAxis: {
			categories: names,
			title: "Version",
			labels: {
				formatter: function () {
					var curSelection = collection.getSelected()
					if (curSelection.length > 0){
						curSelection = curSelection[0].get("name")
						if (curSelection === this.value) {
						    return '<span style="fill: ' + Highcharts.getOptions().colors[0] + '; font-weight: bold">' + this.value + '</span>';
						}
					}
					return this.value;
				}
			}
		},
	
		colorAxis: {
			minColor: '#FFFFFF',
			maxColor: '#7cb5ec' // Highcharts.getOptions().colors[0] // 7cb5ec
		},

		legend: {
			enabled: false,
			align: 'right',
			layout: 'vertical',
			margin: 0,
			verticalAlign: 'top',
			y: 25,
			// symbolHeight: 320
		},
		series: [{
			data: finalParseData
		}]

    }).highcharts()
}

function buildTestPerformance(jQuerySelection, collection){
	var series = []
	var latency = null
	var categories = []
	collection.forEach(function(model){
		var latencyAndthroughput = model.get("series")
		var throughput = latencyAndthroughput["throughput"]
		categories = (throughput.categories)
		series.push(throughput)
		if (latency == null){
			latency = latencyAndthroughput["latency"]
			latency["name"] = "latency"
		}
		else{
			for (var i = 0; i < latency.data.length; i++){
				latency.data[i] += latencyAndthroughput["latency"]["data"][i]
			}
		}
	})
	// console.log(latency)
	series.push(latency)

	return jQuerySelection.highcharts({ 
		credits: { 	enabled: false },
		chart: {
			height: 200,
			plotBackgroundColor: "#fafafa",
			// type: "column"
		},
		colors: ["#f1c40f", "#e67e22", "#e74c3c", "#f39c12", "#d35400", "#c0392b"],// Highcharts.getOptions().colors.slice(1),

		title : {
			text: "",
		},
		xAxis: {
			type: "category",
			categories: categories
		},
		yAxis: [
			{
				title: {
					text: "Throughput (actions/sec)",
				},
				stackLabels: {
					enabled: true,
					formatter: function(){
						return (this.total + "").split(".")[0]
					}
				},
				labels: {
					style: {
						fontWeight: 'bold',
					},
				},

			},
			{
				title: {
					text: "Latency (ms/action)",
					style: {
						color: Highcharts.getOptions().colors[0]
					}
				},
				labels: {
					enabled: true,
					style: {
						fontWeight: 'bold',
						color: Highcharts.getOptions().colors[0]
					},
				},
				style: {
					color: Highcharts.getOptions().colors[0]
				},
				opposite: true,
			}
		],

		plotOptions: {
			column: {
				stacking: 'normal',
				dataLabels: {
					enabled: false,
				},
			},
			spline: {
				color: Highcharts.getOptions().colors[0]				
			}
		},
		legend: {
			title: {
				text: "sim node",
				style: {
					fontSize: 18
				}
			},
			align: 'left',
			layout: "vertical",	
			verticalAlign: 'top',
			itemMarginTop: 12,
			padding: 0,
			marginTop: 0
		},
		tooltip: {
			pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
			valueDecimals: 2
		},

		series: series

	}).highcharts();
}

function buildVersionPerformance(jQuerySelection, model){
	var fields = ["latency", "insert", "update", "read"]
	var parsedData = []
	fields.forEach(function(field){
		var data = model.get(field)
		var editedData = []
		for (var i = 0; i < data.length; i++){
			var v = data[i]["y"] ? data[i]["y"] : data[i]
			editedData.push({
				"y" : v,
				"x" : model.get("startTime") + i*model.get("interval")
			})
		}
		var entry = { 
			"name" : field,
			"data" : editedData,
            "pointStart": model.get("startTime") ,
            "pointInterval": model.get("interval"),
            "type": 'column'
		}
		parsedData.push(entry)
	})
	return jQuerySelection.highcharts('StockChart', { 
		credits: { 	enabled: false },

		title : {
			text: '',
			align: "left"
		},
		chart: {
			plotBackgroundColor: "#fafafa"
		},
		rangeSelector: {
			enabled: false
		},
		plotOptions: {
			series: {
				compare: 'percent'
			}
		},
		yAxis: {
			plotLines: [{
				value: 0,
				width: 2,
				color: 'silver'
			}],
			align: "left",
		},

		tooltip: {
			pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
			valueDecimals: 2
		},

		series: parsedData

	}).highcharts();
}