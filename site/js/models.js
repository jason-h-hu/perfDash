// This models a set of runs of a single version of
// code on multiple parameters. 
var Test = Backbone.Model.extend({
	defaults: function(){
		return {
			name: "twitter",
			runs: {},
			ip: "0.0.0.0",
			expanded: false,
			summary: {},
			ids: []
		}
	},
	initialize: function(){
		this.fetchSummary()
	},
	fetchSummary: function(){
		var that = this
		var query = '/api/test/' + that.get("name")
		console.log(query)
		jQuery.get( query, function( data, textStatus, jqXHR ) {
			that.set("summary", data)
		});
	},
	fetchData: function(){
	},
})

// A collection that just represents multiple iterations
// of a test--multiple versions of a piece of code, 
// on a single workload. Largely redundant.encapsulated
// by WorkloadResults
var Tests = Backbone.Collection.extend({
	model: Test,
	getLast: function(){
		if (this.length > 0){	
			return this.at(this.length-1)
		}
	},
});

// This models multiple runs on a single test, for multiple
// versions of a piece of code
var WorkloadResult = Backbone.Model.extend({
	defaults: function(){
		return {
			name: "twitter",
			workload: "twitter",
			tests: new Tests(),
			summary: {},
		}
	},
	initialize: function(){
		var summary = this.get("summary")
		this.set("name", summary.name)
		this.set("workload", summary.workload)
	},
	fetchSummary: function(){
	},
	fetchData: function(){
		console.log("fetched")
		var that = this
		this.get("tests").add(new Test({
			"name": that.get("name"),
			"workload": that.get("workload"),
		}))
	},
});

var WorkloadsResults = Backbone.Collection.extend({
	model: WorkloadResult
})

var CompleteResult = Backbone.Model.extend({
	defaults: function(){
		return {
			name: "foo.java",
			versions: new WorkloadsResults(),
			summary: {},
			ids: []
		}
	},
	initialize: function(){
		this.fetchSummary()
		this.fetchData()
	},
	fetchSummary: function(){
		var that = this
		jQuery.get("/api/heatmap/",  function( data, textStatus, jqXHR ){
			that.set("summary", data)
		});
	},
	fetchData: function(){
		console.log("adding")
		var that = this
		jQuery.get( "/api/versions/summary/", function( data, textStatus, jqXHR ) {
			for (var i = 0; i < data.length; i++){
				that.get("versions").add(new WorkloadResult({summary: data[i]}))				
			}
		});
	},
})



// // This is a collection of all the results 
// // of all the versions run on a test
// var Versions = Backbone.Collection.extend({
// 	model: Version,
// 	initialize: function(){
// 		this.on('add', this.setLastSelected, this)
// 	},
// 	getSelected: function(){
// 		var selected = this.where({ selected: true })
// 		if (selected.length > 0){
// 			return selected[0]
// 		}
// 		return this.last()
// 	},
// 	unselectAll: function(){
// 		this.each(function(item){
// 			item.set({selected: false})
// 		})
// 	},
// 	setLastSelected: function(){
// 		this.unselectAll()
// 		var lastEntry = this.last()

// 		if (lastEntry){
// 			if (!lastEntry.get("selected")){
// 				lastEntry.set({selected: true});
// 			}
// 		}
// 	},
// 	setSelected: function(name){
// 		var that = this
// 		this.each(function(item){
// 			if (item.get("name") == name){
// 				that.unselectAll()
// 				item.set({"selected": true})
// 			}
// 		})
// 	},
// 	comparator: 'order'	
// });