

// Creates the highchart line graph of the
// performance of a single run of a test 
var VersionPerformanceGraphView = Backbone.View.extend({
	collection: new Versions(),
	initialize: function(){
		this.chart = buildVersionPerformance(this.$("#sim-version-view"), this.collection.getSelected())
	}
});

// This visualizes a single test
var TestView = Backbone.View.extend({
	model: new Test(),
	events: {
		// "mouseover" : "toggleRemoveButton",
		// "mouseout" : "toggleRemoveButton",
		"click #removeTest" : "remove",
		"click #expandTest" : "toggleExpand"
	},
	className: "container-fluid testListItem123456 ",
	template: _.template($("#testListTemplate").html()),
	initialize: function(){
		var metadataKeys = ["date", "ip"]
		var metadataTemplate = _.template($("#testListMetadataTemplate").html())
		var model = this.model
		this.$el.html(this.template({
			name: this.model.get("name"),
		}));
		var metadata = ""
		metadataKeys.forEach(function(key){
			var v = model.get("key") ? model.get("key") : "asdjfjslas"
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
	renderCharts: function(){
		var model = this.model
		// this.heatmap = new HeatmapView({collection: model.get("versions")})
		this.testGraph = buildTestPerformance(this.$("#sim-test-view"), model.get("versions"))
		// this.versionGraph = new VersionPerformanceGraphView({collection: model.get("versions")})
	},
	toggleExpand: function(){
		var model = this.model
		this.heatmap = buildHeatMap(this.$("#sim-heatmap"), model.get("versions"))
		this.versionGraph = buildVersionPerformance(this.$("#sim-version-view"),  model.get("versions").getSelected())

	}
	// destroy: function(){
	// 	console.log("EXTERMINATE")
	// 	this.remove();
	// 	this.render();
	// }
});

// This visualizes the whole dashboard, essentially
var TestsView = Backbone.View.extend({
	collection: new Tests(),
	el: ("#testListBody"),
	initialize: function(){
		console.log("Initializing TestsView")
		this.collection.forEach(function(test){
			var view = new TestView({ model: test });
			this.$el.append(view.render().el)
		}, this)
		this.render()
	},
	render: function(){
	}
});