function genRand(){
	var results = []
	var t = 0
	for (var i = 0; i < 50; i++){
		results.push(Math.random()*10);
	}
	return results;
}

function buildTable(){

	var hchartformat = {
		credits: {
			enabled: false
		},
		chart : {
			width: $(Document).width()/3,
			height: 100,
			backgroundColor: "rgba(0, 0, 0, 0.0)",
			plotBackgroundColor: "rgba(0, 0, 0, 0.0)",
			type: "column",
			// margin: [0, 0, 0, 0],
			// spacing: [0, 0, 0, 0]
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
		legend: {
			enabled: false
		},	
		rangeSelector : {
			selected : 1,
			inputEnabled: $('#container').width() > 480
		},
		xAxis: {
			// labels: {
				// enabled: false
			// },		
			minorTickLength: 0,
			tickLength: 0,
			type: "datetime"
		},
		yAxis: {
			labels: {
				// enabled: false
			},
			title: {
				text: ""
			}
		},
		// navigator: {
		// 	enabled: false
		// },
		// rangeSelector: {
		// 	enabled: false
		// },
		// scrollbar: {
		// 	enabled: false	
		// },
		series : [{
			name : 'Test3',
			data : genRand(),
			tooltip: {
				valueDecimals: 2
			},
            pointStart: Date.UTC(2010, 0, 1),
            pointInterval: 3600 * 1000 // one hour
		}]
	}
	$("tbody tr td:nth-child(2) ").each(function(i){ 
		$(this).highcharts(hchartformat);
		$(window).resize();
	});
	$("tbody tr td:nth-child(3) ").each(function(i){ 
		hchartformat["colors"] = ['#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1']
		$(this).highcharts(hchartformat);
	});	
}

function buildMain(){
	var seriesOptions = [],
		yAxisOptions = [],
		seriesCounter = 0,
		names = ['MSFT', 'AAPL', 'GOOG'],
		colors = ['#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1']

	$.each(names, function(i, name) {

		$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename='+ name.toLowerCase() +'-c.json&callback=?',	function(data) {

			seriesOptions[i] = {
				name: name,
				data: data
			};

			// As we're loading the data asynchronously, we don't know what order it will arrive. So
			// we keep a counter and create the chart when all the data is loaded.
			seriesCounter++;

			if (seriesCounter == names.length) {
				createChart();
			}
		});
	});



	// create the chart when all data is loaded
	function createChart(DOMElement) {

		// ex. $('.perfdash-graphs')
		DOMElement.highcharts('StockChart', {

			title : {
				text: "TEST3"
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
		    colors: ['#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
		    series: seriesOptions
		});
	}

}