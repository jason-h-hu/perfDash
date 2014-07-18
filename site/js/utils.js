// This is supposed to be a place for all my utility, general-purpose functions. That being said, this is mainly for things that I don't really need: functions that are temporary, for generating random data, etc. 

// Generates a random list of numbers, with occasional spikes in performance
function genRand(){
	var results = []
	var t = 0
	for (var i = 0; i < 100; i++){
		var spike = (Math.random() > 0.99) ? 5 : 1;
		results.push(Math.random()*10*spike);
	}
	return results;
}

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
			enabled: false
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

// This generates the big, flashy chart. This should only be called once, during initialization. To actually edit the graph, call the TestMainView's method, displayTest and pass in the test you want to now show
// This takes in a jQuery selection (e.g. $(#graph), this.$el) and the Test model you want to visualize
function createMainChart(jQuerySelection, model){

	var parsedData = parseData(model)
	return new Highcharts.StockChart({ 

		chart : {
			renderTo: jQuerySelection
		},
		title : {
			text: model.get("title")
		},
		rangeSelector: {
			inputEnabled: $('.perfdash-graphs').width() > 480,
			selected: 4
		},

		yAxis: {
			labels: {
				formatter: function() {
					return (this.value > 0 ? '+' : '') + this.value + '%';
				}
			},
			plotLines: [{
				value: 0,
				width: 2,
				color: 'silver'
			}]
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
