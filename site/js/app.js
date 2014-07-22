// This is the topmost class. This is in charge of defining and running the topmost view. This view, called DashView, is in charge of displaying the list of all the tests we're interested in, as well as displaying the large graph of its metrics. 

$(function(){

	var versions = new Versions()
	var tests = new Tests()

	var DashView = Backbone.View.extend({
		el: 'body',
		initialize: function(){
			var versions = new Versions()
			var tests = new Tests()
			jQuery.get( '/api/tests', function( data, textStatus, jqXHR ) {					
				var versions = new Versions()
				for (var j = 0; j < 1; j++){		// This makes the tests
					for (var i = 0; i < data.length; i++){
						var d = data[i]
						versions.add(new Version(d))
					}
					versions.setLastSelected()
					var test = new Test({versions: versions})
					tests.add(test);
				}
				new TestsView({collection: tests})
			});
		},
		render: function() {
			console.log("Rendering dash view")
		}
	});
	var dash = new DashView	
	dash.render()	
	windows.reload()

}());