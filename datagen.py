#! /usr/bin/python

import json
import time
import random
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client['library_database']
collection = db['tests']

def generateData(	latency=True, 
					throughput=True, 
					numSecs=100, 
					numTests=10, 
					output="data.json"):

	insertsPS = 120.0
	updatesPS = 150.0
	readsPS = 190.0
	latencyMS = 50.0
	latencyMinMS = 5.0
	startTime = time.time()
	results = []
	for n in range(numTests):
		testResults = { 
			"name": "commit" + str(n),
			"startTime": startTime,
			"interval": 1 
		}
		if latency:
			latencies = []
			current = 100
			for i in range(numSecs):
				spike = 1 #2 if (random.random() > 0.99) else 1
				sign = -1 if (random.random() > 0.5) else 1
				current += sign * latencyMS*random.random()
				latencies.append(current)
			testResults["latency"] = latencies
		if throughput:
			inserts = []
			updates = []
			reads = []
			insert = 100
			update = 100
			read = 100	
			for i in range(numSecs):
				spike = 1 #100 if (random.random() > 0.99) else 1
				sign = -1 if (random.random() > 0.5) else 1
				insert += sign*int(insertsPS*random.random())
				update += sign*int(updatesPS*random.random())
				read += sign*int(readsPS*random.random())
				inserts.append(insert)
				updates.append(update)
				reads.append(read)
			testResults["insert"] = inserts
			testResults["update"] = updates
			testResults["read"] = reads
		extra = []
		for i in range(numSecs):
			spike = 100 if (random.random() > 0.99) else 1
			extra.append((latencyMinMS + latencyMS*random.random())*spike )
		testResults["extra"] = extra
		results.append(testResults)
	# with open(output, 'w+') as outfile:
	# 	json.dump(results, outfile, indent=1)
	for result in results:
		collection_id = collection.insert(result)
	print collection_id

if __name__ == '__main__':
	generateData()