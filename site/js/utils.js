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

function tempComparisonChart(jQuerySelection){
	return jQuerySelection.highcharts({
		credits: { 	
			enabled: false 
		},
		title: {
			text: 'Actions/ms for all versions on all tests (fake data)',
		},
		xAxis: {
			categories: ['1', '2', '4', '8', '16', '32', "64", "v1", "v2", "v3", "v4", "ec2"]
		},
		yAxis: {
			title: {
				text: 'actions/ms'
			}
		},
		legend: {
			layout: 'vertical',
			align: 'left',
			verticalAlign: 'top',
			borderWidth: 0
		},
		series: [
			{
				name: 'version 1',
				data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
			}, 
			{ 
				name: 'Rainfall error',
				type: 'arearange',
				lineWidth: 0,
		    	linkedTo: ':previous',// yAxis: 1,
				data: [[6, 7.75], [6.3, 7.2], [8.2, 10.8], [13.8, 15.4], [16, 18.8], [21, 22], [24.3, 25.7], [25.5, 27.5], [22.1, 24.6], [16.5, 19.5], [11.4, 14.7], [8, 10.5]],
		    	color: Highcharts.getOptions().colors[0],
		    	fillOpacity: 0.3,
				tooltip: {
					pointFormat: '(error range: {point.low}-{point.high} mm)<br/>'
				}
			},
			{
				name: 'version 2',
				data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
			}, 
			{
				name: 'version 3',
				data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
			},
			{
				name: 'version 4',
				data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
			}
		]
	}).highcharts()
}

function renderHeatmap(jQuerySelection, model){
	return jQuerySelection.highcharts({
		credits: { 	enabled: false },
		chart: {
			type: 'heatmap',
			marginTop: 40,
			marginBottom: 80
		},
		title: {
			text: 'Actions/ms for all versions on all tests (fake data)'
		},
		xAxis: {
			categories: model.xLabels,
			title: {
				text: "Version"
			}
		},
		yAxis: {
			categories: model.yLabels,
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
				return '<b>' + this.series.xAxis.categories[this.point.x] + '</b>, <br><b>' + this.point.value + '</b>, <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
			}
		},
		series: [{
			data: model.data,
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
	var categories = model.xCategories
	return jQuerySelection.highcharts({ 
		credits: { 	enabled: false },

		title : {
			text: '',
			align: "left"
		},
		chart: {
			plotBackgroundColor: "#fafafa",
			type: "spline"	
		},
		xAxis: {
			type: "category",
			categories: categories,
			title: {
				text: "threads"
			}			
		},
		yAxis: {
			plotLines: [{
				value: 0,
				width: 2,
				color: 'silver'
			}],
			align: "left",
			title: {
				text: "performance"
			}			
		},
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