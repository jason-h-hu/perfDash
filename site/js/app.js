// This is the topmost class. This is in charge of defining and running the topmost view. This view, called DashView, is in charge of displaying the list of all the tests we're interested in, as well as displaying the large graph of its metrics. 

$(function(){

	// Creating the Backbone.Collection to organize all our tests
	var menu = new TestMenu();

	// The topmost class

	var DashView = Backbone.View.extend({
		el: 'body',
		initialize: function(){
			jQuery.get( '/api/tests', function( data, textStatus, jqXHR ) {
				
				for (var i = 0; i < data.length; i++){
					var d = data[i]
					menu.add(new Test(d))
				}
				var menuView = new TestMenuView({collection: menu});	// views.js
				var heatMap = new TestHeatMap({collection: menu});
				var mainView = new TestMainView({collection: menu});
				var multiView2 = new TestMultiView2({collection: menu});
			});
		},
		render: function() {
			// $(window).resize() 	// <--------------------------------EW GROSS I DUNNO HOW TO GET AROUND THIS
		}
	});
	var dash = new DashView	

	
	

}());