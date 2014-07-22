// This models the results of a specific 
// run of a test for a version of the code
var Version = Backbone.Model.extend({
	defaults: {
		name: "Version 1.0",
		date: 100000,
		startTime: 0,
		interval: 1*60*60*1000,
		latency: [],
		insert: [],
		update: [],
		read: [],
		selected: true
	}
});

// This is a collection of all the results 
// of all the versions run on a test
var Versions = Backbone.Collection.extend({
	model: Version,
	initialize: function(){
		this.on('add', this.setLastSelected, this)
	},
	getSelected: function(){
		var selected = this.where({ selected: true })
		if (selected.length > 0){
			return selected[0]
		}
		return this.last()
	},
	unselectAll: function(){
		this.each(function(item){
			item.set({selected: false})
		})
	},
	setLastSelected: function(){
		this.unselectAll()
		var lastEntry = this.last()

		if (lastEntry){
			if (!lastEntry.get("selected")){
				lastEntry.set({selected: true});
			}
		}
	},
	setSelected: function(name){
		var that = this
		this.each(function(item){
			if (item.get("name") == name){
				that.unselectAll()
				item.set({"selected": true})
			}
		})
	},
	comparator: 'order'	
});

// This is largely redundant to "Versions" but
// it also has a bit more metadata
var Test = Backbone.Model.extend({
	defaults: {
		name: "Default Test",
		versions: new Versions(),
		ip: "0.0.0.0",
		expanded: false
	}
});

// This collection models all the tests
var Tests = Backbone.Collection.extend({
	model: Test
});