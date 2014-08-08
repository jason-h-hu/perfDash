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
			initialization with data from the backend. This is the immediate 
			aggregated data of the model--generally, this is also what the model's 
			subscribing views need to use to render themselves. The collections 
			aren't  populated until the user queries for information--e.g. clicking 
			"EXPAND", at which point each model uses a list of IDs to query the 
			backend for more information on all its respective children, initializing 
			them and storing them in the collection. Usually at this point the 
			subscribing views realize there's been an update to the model's internal 
			representation, and then udpates itself by querying for that new 
			information and drawing new views or updating itself. 
			
NOTE! ->	This functionality isn't currently coded up. Right now, all the
			GET requests to the backend don't make use of the IDs passed in, since 
			the data in the backend isn't organized as such. 

			A. MODELS:
			The models are organized as such: Test is the most atomic, serving as 
			our lowest level of organization. They're aggregated into WorkloadResult 
			which is then aggregated into CompleteResult.

			1. 	A Test models a series of runs on a single version of code--for 
				example, running version 2.3.2 over test A, with a thread 
				count of 1, 2, 4, and 8. Right now, its summary is defined as:
				{
					categories: [c1, c2, c3 ... cn]
				}

			2. 	Workload 
			

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

