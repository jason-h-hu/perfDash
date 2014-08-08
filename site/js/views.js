// Right now this isn't working, because it can't properly
// create a graph in itself. I think the problem is that
// it's wrestling with the DOM, and it isn't properly bount
// to a div
var TestView = Backbone.View.extend({
	model: new Test(),
	initialize: function(){

	},
	render: function(){
		this.testGraph = buildTestPerformance(this.$el, this.model)
		return this
	},
	destroy: function(){
		this.remove();
		this.render();
	}
})

// See the template in index.html to understand what this
// is rendering.
var WorkloadView = Backbone.View.extend({
	model: new WorkloadResult(),
	expanded: false,
	events: {
		"click #removeTest" : "remove",
		"click #expandTest" : "toggleExpand"
	},
	className: "container-fluid testListItem123456 ",
	template: _.template($("#testListTemplate").html()),
	initialize: function(){

		// Anytime we change data we make sure we update ourself
		this.model.get("tests").on("change:summary", this.renderTestGraph, this)

		// Populating the metadata html table
		var metadataKeys = ["server_host", "server_version"]
		var metadataTemplate = _.template($("#testListMetadataTemplate").html())
		var model = this.model
		this.$el.html(this.template({
			name: this.model.get("name"),
		}));
		var metadata = ""
		metadataKeys.forEach(function(key){
			var v = model.get(key) ? model.get(key) : ""
			var html = metadataTemplate({
				key: key,
				value: v
			})
			metadata += html
		}, this);
		this.$(".table tbody").html(metadata)

		this.renderCharts()
	},
	render: function(){
		return this
	},

	// Drawing the main graph, which allows comparison between versions of code
	renderCharts: function(){
		var model = this.model
		this.versionGraph = buildVersionPerformance(this.$("#sim-version-view"),  this.model.get("summary"))			
	},

	// Drawoing the secondary graph, which allows a detailied examination of
	// a single version of the code. 
	// Right now it just grabs the last one in the list. 
	renderTestGraph: function(){
		var last = this.model.get("tests").at(0)
		if (last != null){
			console.log("trying to render testview")
			console.log(last.get("summary"))
			this.testGraph = buildTestPerformance(this.$("#sim-test-view"), last.get("summary"))
		}
	},

	// This controls the display of the menu based off clicks to the
	// "EXPAND" button. 
	toggleExpand: function(){
		var model = this.model
		if (this.expanded){
			this.testGraph.destroy()
		}
		else{
			// Once the model updates itself, the view will know
			// since it's subscribing to the model, and it'll draw itself
			this.model.fetchData()
		}
		this.expanded = ! this.expanded
	},
	destroy: function(){
		this.remove();
		this.render();
	}
});

// This visualizes the whole dashboard, essentially
var WorkloadsView = Backbone.View.extend({
	collection: new WorkloadsResults(),
	el: ("#testListBody"),
	initialize: function(){
		this.listenTo(this.collection, "add", this.createOnAdd);
		this.collection.forEach(function(test){
			this.createOnAdd(test)
		}, this)
		this.render()
	},
	render: function(){
	},
	createOnAdd: function(newTestView){
		var view = new WorkloadView({ model: newTestView });
		this.$el.append(view.render().el)
	}
});

// The visualizes the heatmap at the top--it more or less
// so is a wrapper for teh highcharts
var HeatMapView = Backbone.View.extend({
	el: ("#master-view"),
	initialize: function(){
		this.model.on("change:summary", this.updateHeatmap, this)
		this.renderCharts()
	},
	renderCharts: function(){
		this.heatmap = renderHeatmap(this.$el, this.model.get("summary"))
	},
	render: function(){
		return this
	},
	updateHeatmap: function(){
		this.heatmap.series[0].setData(summary.values);
		this.heatmap.xAxis[0].setCategories(summary.xLabels);
		this.heatmap.yAxis[0].setCategories(summary.yLabels);
	},
})