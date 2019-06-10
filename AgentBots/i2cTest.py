import random as rd
import requests
import smbus as smbus
import smbus2 as smbus
import datetime as dt

bus = smbus.SMBus(1)
address = 0x29
hostname = '192.168.137.1'


def range():
    range1 = bus.read_byte_data(address, 2)
    range2 = bus.read_byte_data(address, 3)
    range3 = (range1 << 8) + range2
    return range3


def lightlevel():
    light = bus.read_byte_data(address, 1)
    return light


while True:

    x = dt.datetime.now()
    dataSet = '['
    dataPoint = {
        'signature': 1,
        'timeStamp': int(x.strftime("%Y") + x.strftime("%m") + x.strftime("%d") + x.strftime("%H ")),
        'dataType': "temperature",
        'dataValue': range()
    }

    print(dataPoint)


    # dataSet = dataSet + str(dataPoint) + ',\n'
    # dataSet = dataSet[0:-2] + ']'
    # dataSet = dataSet.replace("\'", "\"")
    # r = requests.post('http://' + hostname + '/dataPost',
    #                   data=dataSet, headers={'content-type': 'application/json'})
    # pastebin_url = r.text
    # print('Temperature | Month: ' + month + " : " + pastebin_url)
