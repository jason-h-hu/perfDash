perfDash
========

A dashboard to visualize Mongo performance tests

To run in Chrome: 
- Run a HTTP Server from the topmost directory, and then go to http://localhost:8000/src/
- I use the command:
    python -m SimpleHTTPServer
    
About:
The architecture is done in backbone.js, the graphs are done with highstock, and the styling is done by bootstrap

Features to add:
1. Communication with an actual server and make HTTP requests, rather than just random, dynamic data
2. Heatmap to show the relative comparisons to previous tests
3. Loading new tests 
