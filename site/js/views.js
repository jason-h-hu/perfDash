// Creates the highchart linegraph of the 
// performance of all the tests
var TestPerformanceGraphView = Backbone.View.extend({
	collection: new Versions(),
	initialize: function(){
		this.chart = buildTestPerformance(this.$("#perfdash-test-view"), this.collection)
	}
});

// Creates the highchart line graph of the
// performance of a single run of a test 
var VersionPerformanceGraphView = Backbone.View.extend({
	collection: new Versions(),
	initialize: function(){
		this.chart = buildVersionPerformance(this.$("#perfdash-version-view"), this.collection.getSelected())
	}
});

// This visualizes a single test
var TestView = Backbone.View.extend({
	model: new Test(),
	className: "container-fluid testListItem123456",
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
		this.$(".table").html(metadata)

		this.renderCharts()
	},
	render: function(){
		return this
	},
	renderCharts: function(){
		var model = this.model
		console.log(this.$("#perfdash-heatmap"))
		this.heatmap = buildHeatMap(this.$("#perfdash-heatmap"), model.get("versions"))

		// this.heatmap = new HeatmapView({collection: model.get("versions")})
		// this.testGraph = new TestPerformanceGraphView({collection: model.get("versions")})
		// this.versionGraph = new VersionPerformanceGraphView({collection: model.get("versions")})

	}
});

// This visualizes the whole dashboard, essentially
var TestsView = Backbone.View.extend({
	collection: new Tests(),
	el: ("#testListBody"),
	initialize: function(){
		this.collection.forEach(function(test){
			console.log("Rendering test view")
			var view = new TestView({ model: test });
			console.log(view.render().el)
			this.$el.append(view.render().el)
		}, this)
		this.render()
	},
	render: function(){
		console.log("Rendering tests view")
	}
});