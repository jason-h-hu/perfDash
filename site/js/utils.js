// This is supposed to be a place for all my utility, general-purpose functions. That being said, this is mainly for things that I don't really need: functions that are temporary, for generating random data, etc. 

// This is used to generate the small graphs in the list of tests. Honestly it's mainly a wrapper for the dict-structure used to define the test
// This takes in an instance of the Test model we wish to visualize, and a string that's the name of the field we want to show
function generateListChart(model, field){
	var hchartformat = {
		credits: { 	enabled: false },
		chart : {
			height: 100,
			width: 400, 	// <--------------------------------------------EW HARDCODED
			backgroundColor: "rgba(0, 0, 0, 0.0)",
			plotBackgroundColor: "rgba(0, 0, 0, 0.0)",
			type: "column",
		},
		plotOptions: {
			column: {
				borderWidth: 0,
				groupPadding: 0,
				groupZPadding: 0,
				pointPadding: 0

			}
		},
		title: {
			text: "",
			enabled: false,
			align: "left"
		},
		legend: {	enabled: false },	
		rangeSelector : {
			selected : 1,
			inputEnabled: $('#container').width() > 480
		},
		xAxis: {
			minorTickLength: 0,
			tickLength: 0,
			type: "datetime"
		},
		yAxis: {	title: {	text: "" }},
		series : [{
			name : '',
			data: model.get(field),
			pointStart: model.get("startTime") ,
			pointInterval: model.get("interval")
		}]
	}
	return hchartformat;
}

// This is used to convert all the data stored in the model into data used by the view. This probably will change a lot
// This takes in an instance of the model that we wish to extract and visualize on the big screen
function parseData(model){
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
            "type": 'line'
		}
		parsedData.push(entry)
	})
	return parsedData
}

function parseMultiData(jQuerySelection, collection){
	var blockheight = 20
	var marginTop = 40
	var marginBottom = 40
	var fields = ["insert", "update", "read"]
	var parsedData = []
	var names = []
	collection.each(function(model){
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
	// console.log(blockheight*names.length)
	return $("." + jQuerySelection).highcharts({ 
		credits: { 	enabled: false },

		chart: {
			type: 'heatmap',
			marginTop: marginTop,
			marginBottom: marginBottom,
			// height: blockheight*names.length + marginTop + marginBottom
		},
		title : {
			text: "Throughput",
			align: "left"
		},
		xAxis: {
			type: "datetime"
		},

		yAxis: {
			categories: names,
			title: null,
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
				},
				style: {
					fontSize:'20px'
				}
			}
		},
		colorAxis: {
			minColor: '#FFFFFF',
			maxColor: '#7cb5ec' // Highcharts.getOptions().colors[0] // 7cb5ec
		},

		legend: {
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

function parseMultiData2(jQuerySelection, collection){

	var fields = ["insert", "update", "read"]
	var parsedData = []
	collection.each(function(model){
		var editedData = []
		fields.forEach(function(field){
			var data = model.get(field)
			for (var i = 0; i < data.length; i++){
				var v = data[i]["y"] ? data[i]["y"] : data[i]
				editedData[i] = (editedData[i] != null) ? editedData[i] : 0
				editedData[i] += v
			}
		})
		var entry = {
			"name"			: model.get("name"),
			"pointStart"	: model.get("startTime") ,
			"pointInterval"	: model.get("interval"),
			"type"			: 'spline',
			"data" 			: editedData	
		}
		parsedData.push(entry)
	});
	return new Highcharts.StockChart({ 
		credits: { 	enabled: false },

		chart : {
			renderTo: jQuerySelection
		},
		title : {
			text: "Throughput"
		},
		rangeSelector: {
			enabled: false
		},
		plotOptions: {
			series: {
				compare: 'percent'
			}
		},
		tooltip: {
			pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
			valueDecimals: 2
		},
		colors: ['#f7a35c', '#8085e9', '#f15c80', '#e4d354'],

		series: parsedData

	});

}

// This generates the big, flashy chart. This should only be called once, during initialization. To actually edit the graph, call the TestMainView's method, displayTest and pass in the test you want to now show
// This takes in a jQuery selection (e.g. $(#graph), this.$el) and the Test model you want to visualize
function createMainChart(jQuerySelection, model){

	var parsedData = parseData(model)
	return new Highcharts.StockChart({ 
		credits: { 	enabled: false },

		chart : {
			renderTo: jQuerySelection
		},
		title : {
			text: model.get("title"),
			align: "left"
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
		colors: ['#f7a35c', '#8085e9', '#f15c80', '#e4d354'],

		series: parsedData

	});
}

function createMultiChart(jQuerySelection, model){

}