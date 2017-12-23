// For now, literally just copy-pasted the example from here:
// http://visjs.org/docs/graph3d/
// Once I have a bit of example data I'll begin working on really flushing this
// out with features etc & hooking it up to the CSV output.
// Additionally, if possible I intend to use JS 6 instead of 5.

var data = null;
var graph = null;

function custom(x, y) {
	return (Math.sin(x/50) * Math.cos(y/50) * 50 + 50);
}

// Called when the Visualization API is loaded.
function drawVisualization() {
// Create and populate a data table.
var data = new vis.DataSet();
// create some nice looking data with sin/cos
var steps = 50;  // number of datapoints will be steps*steps
var axisMax = 314;
var axisStep = axisMax / steps;
for (var x = 0; x < axisMax; x+=axisStep) {
  for (var y = 0; y < axisMax; y+=axisStep) {
    var value = custom(x, y);
    data.add({
      x: x,
      y: y,
      z: value,
      style: value
    });
  }
}

// specify options
var options = {
  width:  '600px',
  height: '600px',
  style: 'surface',
  showPerspective: true,
  showGrid: true,
  showShadow: false,
  keepAspectRatio: true,
  verticalRatio: 0.5
};

// create a graph3d
var container = document.getElementById('mygraph');
	graph3d = new vis.Graph3d(container, data, options);
}