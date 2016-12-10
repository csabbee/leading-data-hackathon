#!/usr/bin/env python
#leading-data-hackathon/py/shopCsvToJSON.py
# import modules used here -- sys is a very standard one
import sys
import csv
from math import radians, cos, sin, asin, sqrt

#read from file
def readFile(fileName):
  with open(fileName) as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    csvFileContent= []
    rowSep = []
    lat = []
    lon = []
    shopType = []
    branchName = []
    for row in readCSV:
        print row
        csvFileContent = row.split(";")
        
  return csvFileContent

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
  listTower = readFile('leading-data-hackathon/py/shop.csv')
  print listTower

  
# Standard boilerplate to call the main() function to begin
# the program.
if __name__ == '__main__':
    main()
