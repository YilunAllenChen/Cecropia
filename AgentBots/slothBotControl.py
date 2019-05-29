import json
from math import cos, sin
from time import sleep, time
import numpy as np
import serial


class SlothBotControl:
  def __init__(self):
    self.DT = 0.033
    self.t = 0
    self.start = 0
    self.ser = serial.Serial('/dev/ttyACM0', 500000, timeout=self.DT)
    self.ir = 0
    self.v = 0
    self.th = 0

  def receive_sensors(self):
    try:
      j_str = self.ser.read(1024)
      j_r = json.loads(j_str)
      self.ir = j_r['ir']
      self.ir = (np.array(self.ir) > 700).astype(int)
    except:
      print ('error decoding serial message')

  def send_actuators(self):
    self.th = list(np.array(self.th,dtype=int) + 90)
    j_str = {'v'  : self.v,
  	  'th' : self.th}
    j_s = json.dumps(j_str)
    self.ser.write(j_s)
  
  def update_times(self):
    self.start = time()
    self.t += self.DT
