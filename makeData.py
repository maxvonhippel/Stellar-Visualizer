import random
import csv
import uuid

thinDisk = {'u': [0, 20], 'v': [0, 20], 'w': [0, 10], 't': [0, 10]}
thickDisk = {'u': [0, 30], 'v': [-20, 30], 'w': [0, 30], 't': [9, 11]}
halo = {'u': [0, 50], 'v': [-200, 100], 'w': [0, 60], 't': [11, 13]}
populations = [thinDisk, thickDisk, halo]

def makeStar(type):
	i = uuid.uuid4()
	u = random.gauss(type['u'][0], type['u'][1])
	v = random.gauss(type['v'][0], type['v'][1])
	w = random.gauss(type['w'][0], type['w'][1])
	t = random.uniform(type['t'][0], type['t'][1])
	return i, u, v, w, t

def writeLines(stars, filename):
	with open(filename, 'w') as file:
		out = csv.writer(file)
		out.writerow(['id', 'u', 'v', 'w', 't'])
		for star in stars:
			out.writerow(star)

# make ten thousand random stars
stars = []
for i in range(20):
	population = random.choice(populations)
	star = makeStar(population)
	stars.append(star)

writeLines(stars, 'stars.csv')