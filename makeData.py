import random
import csv
import uuid

thinDisk = {'u': [0, 20], 'v': [0, 20], 'w': [0, 10], 't': [0, 10]}
thickDisk = {'u': [0, 30], 'v': [-20, 30], 'w': [0, 30], 't': [9, 11]}
halo = {'u': [0, 50], 'v': [-200, 100], 'w': [0, 60], 't': [11, 13]}
populations = [thinDisk, thickDisk, halo]

def uvw_to_equatorial(star):
	# input star is 5-tuple of form (i, u, v, w, t)
	# RA is uniform [0, 360] with modulo 360
	RA = random.uniform(0,360)
	RA = RA if RA != 360 else 0
	# Dec is uniform [-90, 90]
	Dec = random.uniform(-90,90)
	# Later on, Dec may change to a more sophistocated
	# model.
	# From u, v, w we will get:
	# pm_RA
	# pm_Dec
	# V_rad
	# We will return the following n-tuple:
	# (i, RA, Dec, pm_RA, pm_Dec, V_rad, t)

def equatorial_to_uvw(star):
	# star = (i, RA, Dec, pm_RA, pm_Dec, V_rad, t)
	# returns: (i, u, v, w, t)

def generate_equatorial(assumptions):
	# takes some set of assumptions
	# returns an equatorial star


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
for i in range(20000):
	population = random.choice(populations)
	star = makeStar(population)
	stars.append(star)

writeLines(stars, 'stars.csv')