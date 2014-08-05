// This is the topmost class. This is in charge of defining and running the topmost view. This view, called DashView, is in charge of displaying the list of all the tests we're interested in, as well as displaying the large graph of its metrics. 

$(function(){

	var DashView = Backbone.View.extend({
		el: 'body',
		initialize: function(){
			var tests = new Tests()
			jQuery.get( '/api/results', function( data, textStatus, jqXHR ) {
				for (var i in data){
					tests.add(new Test(data[i]));
				}
			});
			this.testsView = new TestsView({collection: tests})
		},
		render: function() {
		},
		rerender: function() {
			this.testsView.render()
		}
	});
	var dash = new DashView	
	dash.render()	

}());