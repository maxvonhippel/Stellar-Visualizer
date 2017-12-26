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
* `________/index.js`: `Javascript` code for interactivity on visualization output

## Getting started

Install the [Node Package Manager](http://npmjs.com/) (NPM) if you don't already have it.  Then, in the working directory, run:

````
npm install
````

From the working directory, to generate a synthetic data file, do the following:

````
python
from Generate.generate_synthetic_data import *
success = generate_n_data(1000, 'Visualize/data.csv')
print(success)
````

You can replace the path to write the file to (`Visualize/data.csv`) with whatever you want.  Likewise, you can change the `1000` parameter in the function call to be whatever integer `n` you want, in order to get back `n` many synthetically generated stars.

To use the Visualize tool, open the Visualize folder and then open [index.html](Visualize/index.html) in your browser of choice.  It is tested on and developed for Chrome, but should work on most modern browsers.  It's a bit bare-bones at the moment, but more functionality is coming.

## Status

The synthetic data generation tool is *WIP*.  Once that is completed, I will begin working on the visualization code in Javascript and further documentation.

This project is made open-source and freely available under [BSD-3-Clause license](LICENSE).

## Citations

This section will get cleaned up and made more science-y and formal and whatnot later.  For now, we only have one reference, [which is this](http://adsabs.harvard.edu/full/1987AJ.....93..864J).