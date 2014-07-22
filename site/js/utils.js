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
	console.log(finalParseData)
	// console.log(blockheight*names.length)
	return jQuerySelection.highcharts({ 
		credits: { 	enabled: false },

		chart: {
			type: 'heatmap',
			// width: 600
			// marginTop: marginTop,
			// marginBottom: marginBottom,
			height: blockheight*names.length + marginTop + marginBottom
		},
		title : {
			// enabled: false,
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