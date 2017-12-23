# generate_synthetic_data.py
# 
# Generates synthetic data files which are used to prototype a
# data visualization system.  The synthetic files are rough
# estimates of the sort of data which we will get from Gaia.
#
# Authored August 24 2017 by Max von Hippel
# Last edited December 22 2017 by Max & Ted von Hippel

import random
import csv
import uuid

# ------------------------- Assumptions -------------------------

# These are the hypothetical parameters of the distributions
# of the data (See generate_uvw).
thin_disk  = {'u': [0,     20], \
			  'v': [0,     20], \
			  'w': [0,     10], \
			  't': [0,     10]}
thick_disk = {'u': [0,     30], \
			  'v': [-20,   30], \
			  'w': [0,     30], \
			  't': [9,     11]}
halo 	   = {'u': [0,     50], \
			  'v': [-200, 100], \
			  'w': [0,     60], \
			  't': [11,    13]}

# These are the hypothetical populations of the data.
populations = [thin_disk, thick_disk, halo]

# ------------------------- Methods -------------------------

# uvw_to_equatorial
# ---------------------------------------------------
# Transforms a star in uvw to equatorial, filling in
# unknown values when necesarry based on assumptions
# explained in the code.  (Not entirely deterministic.)
#
# Input:
# 	star = (i, u, v, w, t)
# Output:
#	star = i, RA, Dec, pm_RA, pm_Dec, prlx, V_rad, t)
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
	# Parallax is a nuisance variable for this visualization,
	# therefore we generate an arbitrary/nominal value here.
	prlx = 100
	# V_rad
	# We will return the following 8-tuple:
	# (i, RA, Dec, pm_RA, pm_Dec, prlx, V_rad, t)

# equatorial_to_uvw
# ---------------------------------------------------
# Transforms a star in equatorial to uvw, filling in
# unknown values when necesarry based on assumptions
# explained in the code.  (Not entirely deterministic.)
#
# Input:
# 	star = i, RA, Dec, pm_RA, pm_Dec, prlx, V_rad, t)
# Output:
# star = (i, u, v, w, t)
def equatorial_to_uvw(star):
	# Not yet implemented

# generate_uvw
# ---------------------------------------------------
# Generates a random star in uvw based on rough assumptions
# regarding general distribution of the galaxy.
# See Assumptions section of code near top for more clarity
# RE how this method works.
#
# Input:
# 	type = thin_disk, thick_disk, or halo
# Output:
#	star = (i, RA, Dec, pm_RA, pm_Dec, prlx, V_rad, t)
def generate_uvw(type):
	# u - UUID.  Simulates the steller id in the Gaia data.
	i = uuid.uuid4()
	u = random.gauss(type['u'][0], type['u'][1])
	v = random.gauss(type['v'][0], type['v'][1])
	w = random.gauss(type['w'][0], type['w'][1])
	# t - Stellar 
	t = random.uniform(type['t'][0], type['t'][1])
	return i, u, v, w, t

# write_lines
# ---------------------------------------------------
# Writes a long list of generated stars in CSV format to
# a file, which is the input to the visualization code.
#
# Input:
# 	stars 	 - a list of stars.  Each star is a fairly complicated
#			   tuple of the form:
#			   (i, RA, Dec, pm_RA, pm_Dec, prlx, V_rad, t, u, v, w)
#			   Essentially, a star is a concatenation of uvw and
#			   equatorial variables, because we might as well
#			   include everything in our CSV pre-processed so we can
#			   visualize whatever we want on-the-fly without any hefty
#			   intermediary computation.
#	filename - the filepath to write to.  Either absolute (begin with ~)
#			   or relative to this file (generate_synthetic_data.py) 
#			   should work.
# Output:
#	success  - True if file was successfully written, else Error object.
def write_lines(stars, filename):
	# TODO: add a try/catch, if error return the error.
	with open(filename, 'w') as file:
		out = csv.writer(file)
		# Write the header of the CSV file
		out.writerow(['i', 'RA', 'Dec', 'pm_RA', 'pm_Dec', 'prlx', 'V_rad', \
					  't', 'u', 'v', 'w'])
		for star in stars:
			out.writerow(star)
	# Presumably we are successful if we make it this far.
	return True

# generate_n_data
# ---------------------------------------------------
# Generates n-many synthetic stars and writes all the data
# to a file.
#
# Input:
# 	n 		 - how many synthetic stars to generate.
#	filename - the filepath to write to.  Either absolute (begin with ~)
#			   or relative to this file (generate_synthetic_data.py) 
#			   should work.
# Output:
#	success  - True if file was successfully written, else Error object.
def generate_n_data(n, filename):
	# TODO: add a try/catch, if error return the error.
	stars = []
	for i in range(n):
		population = random.choice(populations)
		star = makeStar(population)
		stars.append(star)
	writeLines(stars, filename)
	# Presumably we are successful if we make it this far.
	return True