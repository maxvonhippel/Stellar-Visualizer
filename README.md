# Stellar Visualizer

## Introduction

Stellar Visualizer:

1. Generates synthetic data in the style of Gaia data.
2. Visualizes data (synthetic or real) given in CSV format in 3D, with various interactive options for data exploration.

The folder structure is as follows:

`Generate`: Code relating to the generation of synthetic data

* `________/generate_synthetic_data.py`: `Python3` script which generates synthetic data

`Visualize`: Code relating to the visualization of data (synthetic or real)

* `________/index.html`: `HTML` boilerplate for visualization output
* `________/index.js`: `Javascript` code for interactivity of visualization output

## Getting started

Install the [Node Package Manager](http://npmjs.com/) (NPM) if you don't already have it.  Then, in the working directory, run:

````
npm install
````

From the working directory, in your Python interpreter of choice, to generate a synthetic data file, do the following:

````
from Generate.generate_synthetic_data import *
success = generate_n_data(1000, 'Visualize/data.csv')
print(success)
````

You can replace the path to write the file to (`Visualize/data.csv`) with whatever you want.  Likewise, you can change the `1000` parameter in the function call to be whatever integer `n` you want, in order to get back `n` many synthetically generated stars.

To use the Visualize tool, open the Visualize folder and then open [index.html](Visualize/index.html) in your browser of choice.  It is tested on and developed for Chrome, but should work on most modern browsers.  It's a bit bare-bones at the moment, but more functionality is coming.  You can find a sample CSV file at [`Visualize/data.csv`](Visualize/data.csv), which you can select with the "choose file" button, or you can make your own CSV file with the Generate code and use that.  Feel free to over-write the demo CSV file I provide you with; it is not a dependency for anything.

To use the Generate tool in MATLAB, `cd` in MATLAB into the Generate directory and then access the Generate functions by name using the MATLAb `py` module.  For example:

````
star_tuple = py.generate_synthetic_data.generate_uvw(py.generate_synthetic_data.thin_disk);
````

Note that for now this will remain a Pythonic variable.  I'll figure out later how to case these Python lists and tuples into native MATLAB types, and update the docs accordingly.

## Status

The synthetic data generation tool is basically complete, although I plan to improve it over time.  The only major missing feature at this point is MATLAB integration, which I'm working on.

The visualization tool is in progress and looks pretty cool, but a lot of work remains, in particular for:

1. Labeling of datapoints, with a table that will show information about a specific datapoint when you hover over or select it
2. Conic filtering of datapoints
3. More (as well as more sensible/deliberate) coordinate system options

## Citations

This project is made open-source and freely available under [BSD-3-Clause license](LICENSE).

This section will get cleaned up and made more science-y and formal and whatnot later.  For now, we only have one reference, [which is this](http://adsabs.harvard.edu/full/1987AJ.....93..864J).