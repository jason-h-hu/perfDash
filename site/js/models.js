// This models a set of runs of a single version of
// code on multiple parameters. 
var Test = Backbone.Model.extend({
	defaults: function(){
		return {
			// id: "123abc", 
			name: "version 1.0",
			runs: {},
			version: "version 1.0",
			workload: "twitter",
			ip: "0.0.0.0",
			expanded: false,
			summary: {},
			ids: []
		}
	},
	initialize: function(){
	},
	fetchData: function(){
		if (!(this.get("summary").length > 0)){
			var id = "fillerID"
			var query = '/api/run/' + id
			var that = this
			jQuery.get(query, function( data, textStatus, jqXHR ) {
				that.set("runs", data)
			});
		}
	},
})

// A collection that just represents multiple iterations
// of a test--multiple versions of a piece of code, 
// on a single workload. Largely redundant.encapsulated
// by WorkloadResults
var Tests = Backbone.Collection.extend({
	model: Test
});

// This models multiple runs on a single test, for multiple
// versions of a piece of code
var WorkloadResult = Backbone.Model.extend({
	defaults: function(){
		return {
			// id: "123abc",
			name: "foo.java",
			workload: "twitter",
			tests: new Tests(),
			summary: {},
			ids: []
		}
	},
	initialize: function(){
		jQuery.get( '/api/test/summary/FILLERID', function( data, textStatus, jqXHR ) {
			for (var i = 0; i < data.length; i++){
				this.get("tests").add(new Test({summary: data[i]}))
			}
		}, this);
	}
});

var WorkloadsResults = Backbone.Collection.extend({
	model: WorkloadResult
})

var CompleteResults = Backbone.Model.extend({
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
	},
	fetchSummary: function(){
		var that = this
		console.log("fetch")
		jQuery.get("/api/heatmap/",  function( data, textStatus, jqXHR ){
			console.log(data)
			that.set("summary", data)
		});
	}
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