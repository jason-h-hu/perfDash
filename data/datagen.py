#! /usr/bin/python

import json
import time
import random

def generateData(	latency=True, 
					throughput=True, 
					numSecs=60, 
					numTests=4, 
					output="data.json"):

	insertsPS = 10000.0
	updatesPS = 5000.0
	readsPS = 9000.0
	latencyMS = 50.0
	latencyMinMS = 5.0
	startTime = time.time()
	results = []
	for n in range(numTests):
		testResults = { 
			"name": "Test" + str(n),
			"startTime": startTime,
			"interval": 1 
		}
		if latency:
			latencies = []
			for i in range(numSecs):
				spike = 100 if (random.random() > 0.99) else 1
				latencies.append((latencyMinMS + latencyMS*random.random())*spike )
			testResults["latency"] = latencies
		if throughput:
			inserts = []
			updates = []
			reads = []
			for i in range(numSecs):
				spike = 100 if (random.random() > 0.99) else 1
				inserts.append(int(insertsPS*random.random() / spike))
				updates.append(int(updatesPS*random.random() / spike))
				reads.append(int(readsPS*random.random() / spike))
			testResults["inserts"] = inserts
			testResults["updates"] = updates
			testResults["reads"] = reads
		extra = []
		for i in range(numSecs):
			spike = 100 if (random.random() > 0.99) else 1
			extra.append((latencyMinMS + latencyMS*random.random())*spike )
		testResults["extra"] = extra
		results.append(testResults)
	with open(output, 'w+') as outfile:
		json.dump(results, outfile, indent=1)

if __name__ == '__main__':
	generateData()