from slothBotControl import SlothBotControl
import numpy as np
from time import time, sleep
from sys import argv

# Class Instance
sc = SlothBotControl()

# Initialize Velocities & Theta Positions
state = 0
# set sc.th[0] to sc.th[4] - between 0 and 180
thetas = np.zeros(5)
# set sc.v[0] and sc.v[1] - between -255 and 255
servo_orientations = np.array([-1,1,-1,1],dtype=int)

# 0 forwards, 1 backwards
BACK_AND_FORTH = int(argv[1])

if BACK_AND_FORTH == 0:
    VEL_DC = 210 # >0 means forward
    turn_direction = -1 # Right is positive because motors need to turn left
elif BACK_AND_FORTH == 1:
    VEL_DC = -210
    turn_direction = +1

MID_SERVO_ANGLE_1 = 0
MID_SERVO_ANGLE_2 = 0

turn_timer = time()
waitTime = 2 # Wait 2 Seconds between switiching Cs

printing_counter = 0

while True:

    printing_counter += 1

    sc.receive_sensors()

    ir_readings = np.array(sc.ir)
  # sc.ir[0] to sc.ir[5] == 1 means there is something in the way, 0 othersize

  # CONTROL LOGIC
  # State 0: Going Straight
    if state == 0:
        thetas = np.zeros(5)
        vel = VEL_DC
    # Front IRs saw something
        if (vel > 0 and any(ir_readings[0:2] == 1)) or (vel < 0 and any(ir_readings[4:6] == 1)):
        #if (vel > 0 and (ir_readings[0] == 1)) or (vel < 0 and (ir_readings[5] == 1)):
            state = 1 # Turn Right
            print("Crossing Detected!")

  # State 1: Open Front C-s Opened
    elif state == 1:
        thetas = np.zeros(5)
        if vel > 0:
            thetas[0:2] = servo_orientations[0:2] * turn_direction * np.sign(vel) * 90 # Turn 
        elif vel < 0:
            thetas[2:4] = servo_orientations[2:4] * turn_direction * np.sign(vel) * 90 # Turn
        thetas[4] = turn_direction * np.sign(vel) * MID_SERVO_ANGLE_1 # Middle Servo 
        
        # Middle IRs Saw Something
        if any(ir_readings[2:4] == 1): 
          state = 2 # Waiting on Forward Cs to Close
          turn_timer = time()
          print("Forward C-s Successfully went through.")

  # State 2: Close Front C-s and Wait
    elif state == 2: 
        vel = np.sign(VEL_DC) * 1e-5
        thetas = np.zeros(5)
        thetas[4] = turn_direction * np.sign(vel) * MID_SERVO_ANGLE_2 # Middle Servo 
        # Front C-s had enough time to close
        if time() - turn_timer > waitTime: 
            state = 3
            print("Forward C-s are now closed. Opening back C-s...")
 
    # State 3: Back C-s Opened
    elif state == 3:
        vel = VEL_DC
        thetas = np.zeros(5)
        if vel > 0:
            thetas[2:4] = servo_orientations[2:4] * turn_direction * np.sign(vel) * 90 
        elif vel < 0:
            thetas[0:2] = servo_orientations[0:2] * turn_direction * np.sign(vel) * 90 
        thetas[4] = - turn_direction * np.sign(vel) * MID_SERVO_ANGLE_2 # Middle Servo  
        # Close Back C-s (TURN COMPLETED!)
        if (vel > 0 and any(ir_readings[4:6] == 1)) or (vel < 0 and any(ir_readings[0:2] == 1)):
        #if (vel > 0 and (ir_readings[4] == 1)) or (vel < 0 and (ir_readings[1] == 1)):
            state = 0
            print("Turn completed. Closing back C-s.")

  # if sc.v > 0 than sc.th[0] to sc.th[3] should be from front to back
  # otherwise back to front
  # sc.th[4] is the middle servo: 90 is straight
  # the other way around if we go backward

  # double-check to prevent front- and rear-body servos to be open at the same time
    if all(thetas != 0):
        print("DANGER: something went wrong, all C-s open!")
        if state == 1:
            thetas[2:4] = 0
            print("Closing the back two...")
        elif state == 3:
            thetas[0:2] = 0
        else:
            thetas = 0

    sc.th = list(thetas.astype(int))
    #sc.th = [90,-90,90,-90,0]
    #sc.th = [-90,90,-90,90,0]
    #sc.th = [0,0,0,90,0]
    sc.v = [int(vel)] * 2

    if printing_counter % 40 == 0:
      print("##########")
      print("State:", state)
      print("IR Readings:", ir_readings)
      print("Commanded Velocities:", sc.v)
      print("Commanded Thetas:", sc.th)

    sc.send_actuators()
    
    sleep(0.02)
