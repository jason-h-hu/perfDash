// This is the topmost class. This is in charge of defining and running the topmost view. This view, called DashView, is in charge of displaying the list of all the tests we're interested in, as well as displaying the large graph of its metrics. 

$(function(){

	var DashView = Backbone.View.extend({
		el: 'body',
		events: {
			"click #url-button": "drawDashboard",
		},
		initialize: function(){
			this.drawDashboard()
		},
		render: function() {
		},
		rerender: function() {
			this.testsView.render()
		},
		drawDashboard: function(){

			// This draws the main heatmap at the top, which shows the summary
			// of all versions of the code on all tests
			var completeResults = new CompleteResults()
			this.heatMap = new HeatMapView({model: completeResults})

			// This draws list of tests results--each corresponds to all
			// versions of the code run on one test. This is composed of two
			// ways of slicing the data--the default view is the aggregated
			// summary, and it can be toggled to display a more nuanced
			var tests = new Tests()
			this.testsView = new TestsView({collection: tests})
			jQuery.get( '/api/test/summary/fillerID', function( data, textStatus, jqXHR ) {
				console.log(data)
				for (var i = 0; i < data.length; i++){
					tests.add(new Test({summary: data[i]}))
				}
			});

			var workloadsResults = new WorkloadsResults()
			workloadsResults.add(new WorkloadResult({tests: tests}))
			this.results = new CompleteResults({versions: workloadsResults})

		}
	});

	var dash = new DashView	
	dash.render()	

}());