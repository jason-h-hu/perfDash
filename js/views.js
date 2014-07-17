// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VIEWS.JS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// This holds all the views that visualize the models, which represent the tests and their data

// This visualizes a single item in the menu which displays a quick summary of all the tests. This single view will show some textual information, as well as two summary bar charts
var TestMenuItemView = Backbone.View.extend({

	tagName: "tr",
	template: _.template($("#menu-row-template").html()),		// index.html
	events: {
		"click" : "click",
	},
	initialize: function(){
		this.model.bind('change:selected', this.renderHighlight, this);
		this.render();
	},
	render: function(){
		this.$el.html(this.template({
			text: this.model.get("title"),
			name: this.model.get("title").replace(/ /g,''),
		}));
		this.renderHighlight()
		this.renderChart()
		return this
	},
	renderChart: function(){
		this.$("#throughput" + this.model.get("title").replace(/ /g,'')).highcharts(generateListChart(this.model, "insert"))	// utils.js
		this.$("#latency" + this.model.get("title").replace(/ /g,'')).highcharts(generateListChart(this.model, "latency"))
	},
	click: function(){
		if (!this.model.get("selected")){
			var old=  this.model.get("selected")
			this.model.collection.unselectAll()
			this.model.set({selected: true});
		}
		this.trigger("newselected")
	},
	renderHighlight: function(){
		if (this.model.get("selected")){
			this.$el.addClass("info")
		}
		else{
			this.$el.removeClass("info")
		}
	},
});

// This visualizes the whole menu. It's large here to package all the items into a single table
var TestMenuView = Backbone.View.extend({
	collection: null,		// This will hold the collection that logically represents all teh tests
	el: $("tbody"),			// table defined in index.html
	events: {
	},
	initialize: function(){
		this.collection.each(function(item){
			var view = new TestMenuItemView({model: item});
            this.$el.append(view.render().el);
		}, this);
	},
	render: function(){
		return this;
	}
})

// This is the main graph that shows all the details about a specific test
var TestMainView = Backbone.View.extend({
	collection: null,
	events: {
	},
	initialize: function(){
		this.listenTo(this.collection, 'change:selected', this.render);	
		var currentTest = this.collection.getSelected()
		if (currentTest.length > 0){
			this.chart = createMainChart("perfdash-graphs", currentTest[0]);	// utils.js
		}
		this.render()
	},
	render: function(){
		var currentTest = this.collection.getSelected()
		if (currentTest.length > 0){
			currentTest = currentTest[0]
			this.displayTest(currentTest)
		}
	},
	displayTest: function(model){
		this.chart.setTitle({text: model.get("title")})
		var parsedData = parseData(model)					// utils.js
		for (var i = 0; i < this.chart.series.length; i++){
			if (parsedData[i] && this.chart.series[i]){
				this.chart.series[i].setData(parsedData[i]['data'], true, true, true)
			}
		}
		this.chart.redraw(true);
	}
});
