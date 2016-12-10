#!/usr/bin/env python
#leading-data-hackathon/py/towerDistanceCalc.py
# import modules used here -- sys is a very standard one
import sys
import json
from math import radians, cos, sin, asin, sqrt


#read from file
def readFile(fileName, typeOfLocation):
  f = open(fileName, 'r')
  json_string = f.read()
  parsed_json = json.loads(json_string)
  
  fullList = []
  listElement = []
  i = 0

  if typeOfLocation == 'Tower' :
    while i < len(parsed_json['features']):
      listElement = []
      listElement = getTowerLocation(parsed_json['features'][i])
      if len(listElement) > 0:
        fullList.append(listElement)
      i = i + 1
  else:
    while i < len(parsed_json['data']['features']):
      listElement = []
      listElement = getUserLocation(parsed_json['data']['features'][i])
      if len(listElement) > 0 and listElement[2] != '':
        fullList.append(listElement)
      i = i + 1

  f.close
  return fullList

def getTowerLocation(features):
  towerData = []
  if features['properties']['type'] != "relation":
    towerData.append(features['properties']['id'])
    towerData.append(features['properties']['lat'])
    towerData.append(features['properties']['lon'])
  return towerData

def getUserLocation(features):
  UserData = []
  UserData.append(features['properties']['unstable']['id'])
  UserData.append(features['properties']['unstable']['timestamp'])
  UserData.append(features['geometry']['coordinates'][1])
  UserData.append(features['geometry']['coordinates'][0])
  return UserData


def haversine(lon1, lat1, lon2, lat2):
  """
  Calculate the great circle distance between two points 
  on the earth (specified in decimal degrees)
  """
  # convert decimal degrees to radians 
  lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
  # haversine formula 
  dlon = lon2 - lon1 
  dlat = lat2 - lat1 
  a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
  c = 2 * asin(sqrt(a)) 
  km = 6367 * c
  return km

# Gather our code in a main() function
def main():
  listTower = readFile('leading-data-hackathon/app/telekom_towers.geo.json', 'Tower')
  listUser = readFile('leading-data-hackathon/app/telekom_crm_msc_weekly.json', 'User')
  #print listUser[131]

  f = open('leading-data-hackathon/app/distance.json','w')
  # compare
  #print listTower[0]
  #print listUser[0]
  
  f.write('{'+ '\n') 
  f.write('"type": "geojson",'+ '\n')
  f.write('   "data": {'+ '\n')
  f.write('      "type": "FeatureCollection",'+ '\n')
  f.write('      "features": ['+ '\n')
  
  #print listUser[131][0],listUser[131][1],
  #print listUser[131][3],listUser[131][2]
  i = 0
  #print len(listUser)
  while i < len(listUser): # user
    j = 0
    minDistance = 10000.0
    userID = ''
    userTimeStamp = ''
    towerID = ''
    while j < len(listTower): # tower
      #print ("list:" + str(i) + str(listUser[i][3]),str(listUser[i][2]) +"Tower"+str(listTower[j][2]),str(listTower[j][1]))
      #print listUser[i][0],listUser[i][1],listTower[j][0]
      distance = haversine(listUser[i][3],listUser[i][2],listTower[j][2],listTower[j][1])
      
      if distance < minDistance:
        minDistance = distance
        userID = listUser[i][0]
        userTimeStamp = listUser[i][1]
        towerID = listTower[j][0]

      j = j+1
    
    f.write('            {'+ '\n')
    f.write('               "properties": {'+ '\n')
    f.write('                   "timestamp":"'+userTimeStamp+'" ,'+ '\n')
    f.write('                   "id":"'+ str(userID)+'" ,'+ '\n')
    f.write('                   "TowerId":"'+ str(towerID)+'" ,'+ '\n')
    f.write('                   "distance":' + str(minDistance) + ' ,'+ '\n')
    f.write('                }'+ '\n')
    f.write('            },'+ '\n')
    
    i = i+1

  f.write('  ]') 
  f.write('}') 
  # python will convert \n to os.linesep
  f.close() # you can omit in most cases as the destructor will call it

# Standard boilerplate to call the main() function to begin
# the program.
if __name__ == '__main__':
    main()
