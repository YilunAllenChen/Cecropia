import random

dataTypes = ["\"temperature\"", "\"humidity\"", "\"vibration\""]

string = "["

for i in range(100):
    dataPoint = "{\n\t\"signature\": " + str(random.randint(1, 10)) + ",\n"
    dataPoint = dataPoint + "\t\"timeStamp\": " + str(random.randint(1, 3)) + ",\n"
    dataPoint = dataPoint + "\t\"dataType\": " + dataTypes[random.randint(0, 2)] + ",\n"
    dataPoint = dataPoint + "\t\"dataValue\": " + str(random.randint(10, 100)) + "\n}"
    if(i<99):
        dataPoint = dataPoint + ",\n"
    string = string + dataPoint

string = string + "]"

f = open("randomData.json", "w")
f.write(string)
f.close()
