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
import numpy as np
import scipy.linalg as slin
from math import cos, sin, radians

# ------------------------- Assumptions -------------------------

# These are the hypothetical parameters of the distributions
# of the data (See generate_uvw).
thin_disk  = {'u': [0,     20],
			  'v': [0,     20],
			  'w': [0,     10],
			  't': [0,     10]}
thick_disk = {'u': [0,     30],
			  'v': [-20,   30],
			  'w': [0,     30],
			  't': [9,     11]}
halo 	   = {'u': [0,     50],
			  'v': [-200, 100],
			  'w': [0,     60],
			  't': [11,    13]}

# These are the hypothetical populations of the data.
populations = [thin_disk, thick_disk, halo]

# Constants employed in conversion furmulae
# Hypothetically, we will be using these to determine the T matrix, but that
# formulation has still not been brought into the actual code-base
# (as you can see, T constants are all still hard-valued.)
k = 4.74057
# Right Ascension of North Galactic Pole, in degrees
RA_NGP = 192.25
# Declination of North Galactic Pole, in degrees
Dec_NGP = 27.4
# Position angle of North Galactic Pole, in degrees, relative to the great
# semicircle passing through the North Galactic Pole and the zero Galactic
# longitude
theta_o = 123.0

cos_theta_o = cos(radians(theta_o))
sin_theta_o = sin(radians(theta_o))
cos_Dec_NGP = cos(radians(Dec_NGP))
sin_Dec_NGP = sin(radians(Dec_NGP))
sin_RA_NGP  = sin(radians(RA_NGP))
cos_RA_NGP  = cos(radians(RA_NGP))

T = (np.matrix([[cos_theta_o,  sin_theta_o,            0], 
	 		   [ sin_theta_o, -cos_theta_o,            0],
	 		   [           0, 			 0,            1]]) * 
	np.matrix([[-sin_Dec_NGP,            0,  cos_Dec_NGP], 
			   [           0,           -1,            0],
			   [ cos_Dec_NGP,            0,  sin_Dec_NGP]]) * 
	np.matrix([[  cos_RA_NGP,   sin_RA_NGP,            0], 
			   [  sin_RA_NGP,  -cos_RA_NGP,            0],
			   [		   0, 			 0, 		   1]]))

# T should yield: np.matrix([[-0.06699, -0.87276, -0.48354],
# 			   				 [ 0.49273, -0.45035,  0.74458],
# 			 			     [-0.86760, -0.18837,  0.46020]])


# Second transformation matrix, based on RA and Dec, used in equatorial_to_uvw
# as well as in uvw_to_equatorial
def A(RA, Dec):
	return np.matrix([[cos(RA) * cos(Dec),   -sin(RA),   -cos(RA) * sin(Dec)],
				      [sin(RA) * cos(Dec),    cos(RA),   -sin(RA) * sin(Dec)],
				      [          sin(Dec), 		    0, 		        cos(Dec)]])


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
	(i, u, v, w, t) = star
	# RA - Right Ascension, the longitude-like coordinate on the celestial sphere
	# RA is uniform [0, 360] with modulo 360
	RA = random.uniform(0, 360)
	RA = RA if RA != 360 else 0
	# Dec - Declination, the latitude-like coordinate on the celestial sphere
	# Dec is uniform [-90, 90]
	# When I get a chance need to update this to be cos dec distribution
	Dec = random.uniform(-90, 90)
	# From u, v, w we will get:
	conversion = slin.inv(T) * slin.inv(A(RA,Dec)) * np.matrix([[u],[v],[w]])
	# pm_RA - proper motion in RA, corrected for Dec, in arcsec/yr
	pm_RA_over_prlx = conversion.item(1) / k
	# pm_Dec - proper motion in Dec, in arcsec/yr
	pm_Dec_over_prlx = conversion.item(2) / k
	# prlx - Parallax in arcsec.  This is a nuisance variable for this
	# visualization, therefore we generate an arbitrary/nominal value here.
	prlx = 100
	# Now that we have a prlx value, we can get pm_RA and pm_Dec
	pm_RA = pm_RA_over_prlx * prlx
	pm_Dec = pm_Dec_over_prlx * prlx
	# V_rad - Gaussian distribution is good enough for now.  This value is in
	# km / sec.  We will likely update with better approximation in the future.
	V_rad = random.gauss(0, 50)
	return (i, RA, Dec, pm_RA, pm_Dec, prlx, V_rad, t)

# equatorial_to_uvw
# ---------------------------------------------------
# Transforms a star in equatorial to uvw, filling in
# unknown values when necesarry based on assumptions
# explained in the code.  (Not entirely deterministic.)
#
# Reference: http://adsabs.harvard.edu/full/1987AJ.....93..864J
#
# Input:
# 	star = (i, RA, Dec, pm_RA, pm_Dec, prlx, V_rad, t)
# Output:
# star = (i, u, v, w, t)
def equatorial_to_uvw(star):
	(i, RA, Dec, pm_RA, pm_Dec, prlx, V_rad, t) = star
	B = T * A(RA, Dec)
	# Need to determine RV ------ TODO ------
	# For now use throwaway value of 100
	RV = 100
	(u, v, w) = B * np.matrix([[RV],
							  [k * pm_RA / prlx],
							  [k * pm_Dec / prlx]])
	# Unpack singleton matrices to scalars
	u = u.item(0)
	v = v.item(0)
	w = w.item(0)
	return (i, u, v, w, t)

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
	# i - UUID.  Simulates the steller id in the Gaia data. (Unpacked)
	i = int(uuid.uuid4())
	# u, v, and w are galactic velocities
	u = random.gauss(type['u'][0], type['u'][1])
	v = random.gauss(type['v'][0], type['v'][1])
	w = random.gauss(type['w'][0], type['w'][1])
	# t - Galactic age
	t = random.uniform(type['t'][0], type['t'][1])
	return (i, u, v, w, t)

# write_lines
# ---------------------------------------------------
# Writes a long list of generated stars in CSV format to
# a file, which is the input to the visualization code.
# Formatted as follows:
# i, RA, Dec, pm_RA, pm_Dec, prlx, V_rad, t, u, v, w
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
	try:
		with open(filename, 'w') as file:
			out = csv.writer(file)
			# Write the header of the CSV file
			out.writerow(['i', 'RA', 'Dec', 'pm_RA', 'pm_Dec', 'prlx', 'V_rad', \
						  't', 'u', 'v', 'w'])
			for star in stars:
				out.writerow(star)
	except Exception as ex:
		return ex
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
	try:
		stars = []
		for i in range(n):
			population = random.choice(populations)
			star = makeStar(population)
			stars.append(star)
		return write_lines(stars, filename) # (*)
	except Exception as ex:
		return ex # (**)
	# No need to return True here, because no matter what we returned
	# already at locations (*) or (**) in the code above