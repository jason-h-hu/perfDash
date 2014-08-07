// This visualizes a single test
var TestView = Backbone.View.extend({
	model: new Test(),
	expanded: false,
	events: {
		"click #removeTest" : "remove",
		"click #expandTest" : "toggleExpand"
	},
	className: "container-fluid testListItem123456 ",
	template: _.template($("#testListTemplate").html()),
	initialize: function(){
		this.model.on("change:runs", this.renderVersionChart, this)

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
	renderCharts: function(){
		var model = this.model
		this.testGraph = buildTestPerformance(this.$("#sim-test-view"), this.model.get("summary"))
		// this.heatmap = new HeatmapView({collection: model.get("versions")})
		// this.versionGraph = new VersionPerformanceGraphView({collection: model.get("versions")})
	},
	renderVersionChart: function(){
		console.log("!!!")
		this.versionGraph = buildVersionPerformance(this.$("#sim-version-view"),  this.model.get("runs"))			
	},
	toggleExpand: function(){
		var model = this.model
		if (this.expanded){
			// this.heatmap.destroy()
			this.renderVersionChart()
			this.versionGraph.destroy()
		}
		else{
			this.model.fetchData()
			// this.heatmap = tempHeatMap(this.$("#sim-heatmap"))
		}
		this.expanded = ! this.expanded
	},
	destroy: function(){
		this.remove();
		this.render();
	}
});

// This visualizes the whole dashboard, essentially
var TestsView = Backbone.View.extend({
	collection: new Tests(),
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
		var view = new TestView({ model: newTestView });
		this.$el.append(view.render().el)
	}
});

var VersionView = Backbone.View.extend({
	
})

var HeatMapView = Backbone.View.extend({
	el: ("#master-view"),
	// model: new CompleteResults(),
	initialize: function(){
		this.model.on("change:summary", this.updateHeatmap, this)
		this.renderCharts()
	},
	renderCharts: function(){
		this.heatmap = renderHeatmap(this.$el, this.model.get("summary"))
	},
	render: function(){
	},
	updateHeatmap: function(){
		var summary = this.model.get("summary")
		console.log("cccchhanges")
		console.log(summary)
		this.heatmap.series[0].setData(summary.values);
		this.heatmap.xAxis[0].setCategories(summary.xLabels);
		this.heatmap.yAxis[0].setCategories(summary.yLabels);
	}
})