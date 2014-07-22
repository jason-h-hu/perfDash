// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~MODELS.JS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Models are how we logically represent the test. 

// This should hold all the intormation about our tests, such as the data, metadata, name, etc. 
// Pass it in at initialization as a dict {}
var Test = Backbone.Model.extend({
	defaults: {
		name: "Test1",
		startTime: 0,
		interval: 1*60*60*1000,
		latency: [],		// utils.js
		insert: [],
		update: [],
		read: [],
		selected: false
	},
	initialize: function(){
	}
});

// This organizes all our tests into a collection
var TestMenu = Backbone.Collection.extend({
	model: Test,
	initialize: function(){
		this.on('add', this.setLastSelected, this)
	},
	getSelected: function(){
		return this.where({ selected: true })
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
				// item.click()
				// this.unselectAll()
				that.unselectAll()
				console.log("cliiiic")
				item.set({"selected": true})
			}
		})
	},
	comparator: 'order'
});
