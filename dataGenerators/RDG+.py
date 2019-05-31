import random as rd

dataTypes = ["\"temperature\"", "\"humidity\"", "\"vibration\""]
acceptables = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
               '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27',
               '28', '29', '30']

string = "["

for month in acceptables[1:13]:
    for day in acceptables[1:31]:
        for hour in acceptables[0:24:2]:
            dataPoint = "{\n\t\"signature\": " + str(rd.randint(0, 10)) + ",\n"
            timeStamp = int('2019' + month + day + hour)
            dataPoint = dataPoint + "\t\"timeStamp\": " + str(timeStamp) + ",\n"
            dataPoint = dataPoint + "\t\"dataType\": " + \
                dataTypes[rd.randint(0, 2)] + ",\n"
            dataPoint = dataPoint + "\t\"dataValue\": " + \
                str(rd.randint(0, 100)) + "\n} , "
            string = string + dataPoint
            string = string.replace('\'','\"')

string = string[0:-2] + " ]"

f = open("randomData+.json", "w")
f.write(string)
f.close()
