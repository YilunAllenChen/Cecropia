import random as rd
import requests

dataTypes = ["temperature", "humidity", "vibration"]
acceptables = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
               '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27',
               '28', '29', '30']

dataValueCache = 50



for month in acceptables[1:6]:
    f = open("randomDataPost.json", "w")
    dataSet = '['
    for day in acceptables[1:31]:
        
        for hour in acceptables[0:24:6]:
            for agent in range(10):
                dataPoint = {
                    "signature": agent,
                    "timeStamp": int('2019' + month + day + hour),
                    "dataType": dataTypes[1],
                    "dataValue": dataValueCache
                }
                if(dataValueCache > 100):
                    dataValueCache = dataValueCache + rd.randint(-3,1)
                elif(dataValueCache < 0):
                    dataValueCache = dataValueCache + rd.randint(-1,3)
                else:
                    dataValueCache = dataValueCache + rd.randint(-2,2)
                dataSet = dataSet + str(dataPoint) + ',\n'
    dataSet = dataSet[0:-2] + "]"
    dataSet = dataSet.replace('\'','\"')
    f.write(dataSet)
f.close()