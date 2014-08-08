		perfDash
		========

		TABLE OF CONTENTS: 
		1. Background
		2. Architecture
		3. Features to add
		4. Bugs
		5. Glossary


		1. BACKGROUND
		-----------------------------------------------------------------------------
		This is a dashboard to visualize test results for MongoDB--it was built
		with the harness of MongoSim in mind, but theoretically should be able to 
		accomodate anything that fulfills a specific schema. 

		The backend is built using node.js, with the frontend built using
		backbone.js, highcharts, and boostrap.css. 
		-----------------------------------------------------------------------------

		2. ARCHITECTURE
		-----------------------------------------------------------------------------
		I.	Frontend
			The frontend is largely organized according to backbone.js's MV pattern. 
			Models help maintain the data and logic of the dashboard, with the views
			subscribing to the models' changes and edits. Both models and views 
			are also hierarchical--the topmost model and views generally know how 
			to make themselves, and their children, who then know how to make their 
			children, etc. Warning: This leads to some convoluted code at times where
			you might have to go down a very, very long rabbithole. See the section
			"Models" for more information. 

			Models generally have two fields that hold their data: summary, and a 
			collection. The summary is an associative array that is populated at 
			initialization with data from the backend by calling fetchSummary(). 
			This is the immediate aggregated data of the model--generally, this is 
			also what the model's subscribing views need to use to render themselves. 
			The collections aren't  populated until the user queries for information
			--e.g. clicking "EXPAND", at which point each model calls its method 
			fetchData() using a list of IDs to query the backend for more information 
			on all its respective children, initializing  them and storing them in the 
			collection. Usually at this point the subscribing views realize there's been 
			an update to the model's internal representation, and then udpates itself 
			by querying for that new information and drawing new views or updating itself. 
			
NOTE! ->	This functionality isn't currently coded up. Right now, all the
			GET requests to the backend don't make use of the IDs passed in, since 
			the data in the backend isn't organized as such. For example, WorkloadResult
			model doesnt get its own summary and data, since it doesn't know enough about
			itself to do so--instead, its parent Model, CompleteResult, does a query
			for everything, and for each of the resultant sets of data, creates a 
			WorkloadResult and passes it the respective data. 

			A. MODELS:
			The models are organized as such: Test is the most atomic, serving as 
			our lowest level of organization. They're aggregated into WorkloadResult 
			which is then aggregated into CompleteResult.

			1. 	A Test models a series of runs on a single version of code--for example, 
				running version 2.3.2 over test A, with a thread count of 1, 2, 4, and 
				8. Right now, its summary is defined as:
				{
					categories: [c1, c2, c3 ... cn],
					series: [
						{
							data: [v1, v2 ... vn],
							name: group1
						},
						{
							data: [v1, v2 ... vn],
							name: group2
						}
					],
					metadata : ...
				}

				e.g.
				{
					categories: ["1 thread", "2 thread", "4 thread"],
					series: [
						{
							data: [100, 110, 200],
							name: "throughput"
						},
						{
							data: [300, 192, 115],
							name: "latency"
						}
					],
				}

				Finally, there's an additional field called "runs". This was supposed
				to hold models of Run, which would have modeled a single test run on a
				single version on a single piece of code on a single parameter. This
				however proved unnecessary since we never used this level of resolution, 
				so that model was scrapped. 

			2. 	WorkloadResult models the aggregated results of a workload over multiple
				versions of a piece of code. e.g. Running a twitter test over versions 1,
				2, and 3 of a test (thus aggregating 3 Test models as well).

				Its summary is defined as:
				{
					name: name,
					categories: [c1, c2, c3 ... cn],
					series: [
						{
							data: [v1, v2 ... vn],
							name: version,
							category: group1
						},
						{
							data: [v1, v2 ... vn],
							name: version
							category: group2
						}
					],
					metadata : ...
				}

				e.g.
				{
					name: "twitter",
					categories: ["1 thread", "2 thread", "4 thread"],
					series: [
						{
							data: [100, 110, 200],
							name: "version 1.0",
							category: "latency"
						},
						{
							data: [300, 192, 115],
							name: "version 1.0",
							category: "throughput"
						},
						{
							data: [100, 110, 200],
							name: "version 2.0",
							category: "latency"
						},
						...
					],
				}

			3. 	CompleteResult model exactly that--the aggregated summary of all the
				tests over all versions of code. 

				Its summary is modeled as a heatmap:
				{
					values: [
						[x0, y0, v1],
						[x1, y0, v2],
						[x2, y0, v3],
						[x1, y1, v4],
						...
					],
					xLabels: [cx1, cx2 ...],
					yLabels: [cy1, cy2 ...],
				}
				where each triplet in values is a coordinate and the value, and
				xLabels and yLabels provide the categories for the x and y axes, 
				respectively.


			B. VIEWS
			For each model, there's a corresponding view to render it. Furthermore
			there are some additional views to help manage collections of models. 
			Many of the nested views make use of their render method--render updates
			its html, and then returns itself to the caller. Thus, when a parent
			wants to render everything, it calls its own render, and then the 
			render of its children, appending the returned html into its approrpiate 
			area. 
			
			Most of the views should be self-explanatory, if one has a familiarity
			with backbone.js. 

			C. CHARTS
			The functions used to make the charts are just calls to the highcharts
			library. See their documentation for more information. The important
			two parameters that these functions take in are a JQuery selection, 
			into which you want to draw the chart, and the associative array that
			describes the data. 

											******

		II.	Backend
			The backend is currently just a basic express application--its purpose
			is to have the REST API to serve all the data from the MongoDB server.

NOTE! ->	Currently, a lot of the aggregating, filtering, and calculating is done
			by node and javascript--all the ad-hoc functions are tucked away in 
			dataparser.js. Ideally this file shouldn't exist, and all the aggregation
			should be done by Mongo, not node. 

			For each model, you can request the model by querying:

			/api/modelName/[summary or data]/:id

			Querying summary returns an associative array that describes the model. 

			Querying data returns a list of associative-arrays that describe
			the data itself--usually each of these can be used to describe the 
			constintuent models--for example because workloadResult is described
			by a collection of tests, the list resulting from /api/workloadResult/data/:id
			can be used to describe a collection of tests. 

			Finally, not all IDs are supported in the backend. 

		-----------------------------------------------------------------------------

		3. FEATURES TO ADD
		-----------------------------------------------------------------------------
		In no particular order: 
		1. 	Properly build a TestView--right now, the graphs representing a single 
			test are drawn directly in the WorkloadView, rather than WorkloadView
			delegating that properly to a TestView
		2. 	Have the dashboard be able to query different databases, using
			topbar menu. 
		3.	Always set the y-min as zero for the range.
		4.	Allow for error ranges in the charts.
		5.	Properly catalog the data in the backend with various IDs representing 
			the tests that each document belongs to. 
		6.	Proplerly allow models to fetchData and fetchSummary
		7. 	Allow for more precise selection of which version to display, when 
			clicking "EXPAND". Right now it picks the last in the list--give the user
			the ability to pick from time, githash, etc. or display multiple at once
		-----------------------------------------------------------------------------

		4. BUGS
		-----------------------------------------------------------------------------
		1.	The entire dashboard is having issues dynamically drawing the highcharts.
			The window needs to be manually resized to trigger a proper render.

		-----------------------------------------------------------------------------
		5. GLOSSARY
		-----------------------------------------------------------------------------
		Workload 	- 	A set of actions. e.g. Twitter workload
		Version 	- 	A specific version of a piece of code.
		Run 		- 	The results of running a version of code 
						through a test, e.g. A piece of code tested
						on two threads, on the twitter workload
		Test 		- 	The results of running a version of code on a 
						single multiple times with multiple 
						parameters. e.g. Version 2 of code tested on the 
						twitter workload with one, two, four, and  
						eight threads.
		Tests 		- 	The set of tests on a single workload for 
						a single version of the code. 
		WorkloadResults	- 	The set of tests on a single workload
							for multiple versions of a piece of code
		CompleteResults	-	The set of tests on multiple workloads 
							for multiple versions of a single piece of code
		-----------------------------------------------------------------------------

