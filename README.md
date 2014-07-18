perfDash
========

A dashboard to visualize Mongo performance tests

To run: 
1. Ensure you have node and npm installed 
2. Start a mongod instance, and then run datagen.py (if this is the first time)
3. Run "node server.js" from the root of the project
4. Open http://localhost:4711

About:
The architecture is done in backbone.js, the graphs are done with highstock, and the styling is done by bootstrap

Features to add:
1. Communication with an actual server and make HTTP requests, rather than just random, dynamic data
2. Heatmap to show the relative comparisons to previous tests
3. Loading new tests 
