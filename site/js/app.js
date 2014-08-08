// This is the topmost class. This is in charge of defining and running the topmost view. This view, called DashView, is in charge of displaying the list of all the tests we're interested in, as well as displaying the large graph of its metrics. 

$(function(){

	var DashView = Backbone.View.extend({
		el: 'body',
		model: new CompleteResults(),
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
			this.model.on("change:summary", this.updateMenu, this)
			this.model.get("versions").on("add", this.updateHeatmap, this)

			// This draws the main heatmap at the top, which shows the summary
			// of all versions of the code on all tests
			// this.results = new CompleteResults()
			// this.heatMap = new HeatMapView({model: completeResults})

			// This draws list of tests results--each corresponds to all
			// versions of the code run on one test. This is composed of two
			// ways of slicing the data--the default view is the aggregated
			// summary, and it can be toggled to display a more nuanced
			// this.testsView = new TestsView({collection: tests})
			// var workloads = new WorkloadsResults()
			// this.workloadView = new WorkloadsView({colle	ction: workloads})
			// jQuery.get( '/api/test/summary/', function( data, textStatus, jqXHR ) {
			// 	console.log(data)
			// 	for (var i = 0; i < data.length; i++){
			// 		tests.add(new Test({summary: data[i]}))
			// 	}
			// });

			// var workloadsResults = new WorkloadsResults()
			// workloadsResults.add(new WorkloadResult({tests: tests}))
			// this.results = new CompleteResults({versions: workloadsResults})

		},
		updateMenu: function(){
			this.workloadView = new WorkloadsView({collection: this.model.get("versions")})
		},
		updateHeatmap: function(){
			this.heatMapView = new HeatMapView({model: this.model})

		}
	});

	var dash = new DashView	
	dash.render()	

}());