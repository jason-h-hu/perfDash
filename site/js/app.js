// This is the topmost class. This is in charge of defining and 
// running the topmost view. This view, called DashView, is in 
// charge of creating all main heatmap, which summarizes all the
// data, as well as creates the dashboard showing specifics on 
// individual sets of tests. 

$(function(){

	var DashView = Backbone.View.extend({
		el: 'body',
		model: new CompleteResult(),
		events: {
			"click #url-button": "drawDashboard",
		},
		initialize: function(){
			this.model.on("change:summary", this.updateMenu, this)
			this.model.get("versions").on("add", this.updateHeatmap, this)
		},
		render: function() {
		},
		rerender: function() {
			this.testsView.render()
		},
		drawDashboard: function(){
			this.updateMenu()
			this.updateHeatmap()
		},
		updateMenu: function(){
			this.workloadView = new WorkloadsView({collection: this.model.get("versions")})
		},
		updateHeatmap: function(){
			this.heatMapView = new HeatMapView({model: this.model})

		}
	});

	var dash = new DashView	

}());