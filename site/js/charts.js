function scientificNotation(value){
	if (((""+value).length < 4) ){
		return value
	}

	var power = 0
	var mantissa = value
	if (mantissa == 0){
		return mantissa
	}
	while (true){
		if (mantissa > 10 || mantissa < -10){
			mantissa /= 10
			power ++
		}

		else if (mantissa < 1 && mantissa > -1){
			mantissa *= 10
			power --
		}
		else {
			break;
		}
	}
	if (power >= -2 || power <= 2){
		return (mantissa*(Math.pow(10, power)) + "").substring(0,  power + 3)
	}
	return (mantissa+"").substring(0, mantissa.indexOf(".") + 1) + "x10e" + power

}


// Model has the following fields:
// xLabels
// yLabels
// values
function renderHeatmap(jQuerySelection, model){
	var xLabel = (model.xLabels==null) ? [] : model.xLabels
	var yLabel = (model.yLabels==null) ? [] : model.yLabels

	return jQuerySelection.highcharts({
		credits: { 	enabled: false },
		chart: {
			type: 'heatmap',
			marginTop: 40,
			marginBottom: 80
		},
		title: {
			text: 'Operations/s for all versions on all tests'
		},
		xAxis: {
			categories: xLabel,
			title: {
				text: "Version"
			}
		},
		yAxis: {
			categories: yLabel,
			title: {
				text: "Test"
			}
		},
		colorAxis: {
			min: 0,
			minColor: '#FFFFFF',
			maxColor: Highcharts.getOptions().colors[0]
		},
		legend: { enabled: false },
		tooltip: {
			formatter: function () {
				return '<b> Version: ' + this.series.xAxis.categories[this.point.x] + '</b>, <br><b>Performance: ' + this.point.value + '</b>, <br><b>Test: ' + this.series.yAxis.categories[this.point.y] + '</b>';
			}
		},
		series: [{
			data: model.values,
			borderWidth: 1,
			dataLabels: {
				enabled: true,
				color: 'black',
				style: {
					textShadow: 'none',
					HcTextStroke: null
				}
			}
		}]
	}).highcharts()
}


function buildTestPerformance(jQuerySelection, model){
	var series = model.series
	for (var i = 0; i < series.length; i++){
		var s = series[i]
		if(s.name == "latency"){
			s.yAxis = 1
		}
	}
	var categories = model.categories
	return jQuerySelection.highcharts({ 
		credits: { 	enabled: false },
		chart: {
			height: 200,
			plotBackgroundColor: "#fafafa",
			type: "column"	
		},
		colors: ["#f1c40f", "#e67e22", "#e74c3c", "#f39c12", "#d35400", "#c0392b"],// Highcharts.getOptions().colors.slice(1),
		title : {
			text: "",
		},
		xAxis: {
			type: "category",
			categories: categories,
			title: {
				text: "threads"
			}
		},
		yAxis: [
			{
				title: {
					text: "Throughput (actions/sec)",
				},
				stackLabels: {
					enabled: true,
					formatter: function(){
						// return scientificNotation(this.total)
						return ("" + this.total).substring(0, ("" + this.total).indexOf(".") + 2)
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
					formatter: function(){
						return scientificNotation(this.value)

					}
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
	var series = model.series
	var axes = {}
	var index = 0
	var palette = [
					["#D2514F", "#CC8281", "#D25A40", "#C94B33", "#D28F82"],
					["#8BC1D2", "#A5B0C9", "#A5C1C9", "#68A5CC", "#54AECC"]
			]
	var swatch = {}
	// colors: ,

	for (var i = 0; i < series.length; i++){
		var s = series[i]
		var c = s.category
		if (!(c in axes)){
			axes[c] = index
			swatch[c] = palette.pop(0)
			index++
		}
		s["yAxis"] = axes[c]%2
		s["type"] = "spline"
		s["color"] = swatch[c].pop()
	}
	var categories = model.categories
	console.log(categories)
	var yAxis = []
	for (var c in axes){
		yAxis.push({
			plotLines: [{
				value: 0,
				width: 2,
			}],
			opposite: (axes[c]%2==1),
			title: {
				text: c
			}	
		})	
	}
	return jQuerySelection.highcharts({ 
		credits: { 	enabled: false },

		title : {
			text: '',
			align: "left"
		},
		chart: {
			plotBackgroundColor: "#fafafa",
		},
		xAxis: {
			type: "category",
			categories: categories,
			title: {
				text: "threads"
			}			
		},
		yAxis: yAxis,

		legend: {
			title: {
				text: "Version",
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

		series: series

	}).highcharts();
}