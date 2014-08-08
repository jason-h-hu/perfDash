// This models a set of runs of a single version of
// code on multiple parameters. 
var Test = Backbone.Model.extend({
	defaults: function(){
		return {
			name: "twitter",
			runs: {},
			summary: {},
		}
	},
	initialize: function(){
		this.fetchSummary()
	},
	// This makes a request for a summary of the data--e.g. 
	// the latency/throughput aggregates, over multiple threads
	fetchSummary: function(){
		var that = this
		var query = '/api/test/summary/' + that.get("name")
		jQuery.get( query, function( data, textStatus, jqXHR ) {
			that.set("summary", data)
		});
	},
	// This doesn't do anything because we have no lower 
	// resolution of data at the moment
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
	}
});

// This models multiple runs on a single test, for multiple
// versions of a piece of code
var WorkloadResult = Backbone.Model.extend({
	defaults: function(){
		return {
			name: "twitter",
			workload: "twitter",
			tests: new Tests(),
		}
	},
	initialize: function(){
		// Make a request to the backend if we don't have the
		// summary
		if (this.get("summary") == null){
			this.fetchSummary()
		}
		else{
			var summary = this.get("summary")
			this.set("name", summary.name)
			this.set("workload", summary.workload)
		}
	},
	// There are not working--right now ID is just filler, and
	// the resulting return values are filler anyway. Ideally
	// this should always be created with a unique identifier
	// such that the model can always fetch summaries and data
	fetchSummary: function(){

		var that = this
		var id = "fillerID"
		var query = "/api/workloadResult/summary/" + id
		jQuery.get(query,  function( data, textStatus, jqXHR ){
			that.set("summary", data)
			this.set("name", data.name)
			this.set("workload", data.workload)
		});

	},
	fetchData: function(){
		// More here
		var that = this
		var id = "fillerID"
		var query = "/api/workloadResult/data/" + id
		jQuery.get(query,  function( data, textStatus, jqXHR ){
			that.get("tests").add(new Test({			// NOTE! <------------------THIS IS FILLER DATA. 
				"name": that.get("name"),				//							IT SHOULD COME FROM THE DATABASE
				"workload": that.get("workload"),
			}))
			that.set("summary", data)
			that.set("name", data.name)
			that.set("workload", data.workload)
		});
	},
});

// This just lets us organize a collection of Workloads
var WorkloadsResults = Backbone.Collection.extend({
	model: WorkloadResult
})

// Our topmost model of data--this is pretty much the only
// case where our queries are working. 
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
	// Because we only have one CompleteResult, the
	// query just returns everythign and doesn't filter
	// on id
	// This gets the aggregate summary of all the data--this
	// is used to draw the heatmap
	fetchSummary: function(){
		var that = this
		var id = "fillerID"
		var query = "/api/completeResult/summary/" + id
		jQuery.get(query,  function( data, textStatus, jqXHR ){
			that.set("summary", data)
		});
	},
	// This gets all the individual summaries of teh WorkloadResult
	// that compose this model--each can be used to instantiate
	// and populate teh collection of WorkloadResult
	fetchData: function(){
		var that = this
		var id = "fillerID"
		var query = "/api/completeResult/data/" + id
		jQuery.get(query,  function( data, textStatus, jqXHR ){
			for (var i = 0; i < data.length; i++){
				that.get("versions").add(new WorkloadResult({summary: data[i]}))				
			}
		});
	},
})