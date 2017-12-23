// Initialize local variables to null
var data = null;
var graph = null;

// Called when the Visualization API is loaded.
function drawVisualization() {
	// create the data table.
	// data = new vis.DataSet();
	var csv_file = "http://mxvh.pl/Stellar-Visualizer/Visualize/data.csv";
	var csv_data = Papa.parse(csv_file, {
		header: true,
		step: function(line) {
			// line = i, RA, Dec, pm_RA, pm_Dec, prlx, V_rad, t, u, v, w
			var new_line = {
				x:line[8],
				y:line[9],
				z:line[10],
				style: Math.sqrt(Math.pow(line[1], 2) +
					   Math.pow(line[2], 2) + 
					   Math.pow(line[3], 2)),
				id: line[0]
			};
			console.log("BANANA BANANA BANANA");
			console.log(new_line);
		// data.add(new_line);
		}
	});

	// // create some shortcuts to math functions
	// var sqrt = Math.sqrt;
	// var pow = Math.pow;
	// var random = Math.random;

	// // create the animation data
	// var imax = 100;
	// for (var i = 0; i < imax; i++) {
	// 	var x = pow(random(), 2);
	// 	var y = pow(random(), 2);
	// 	var z = pow(random(), 2);
	// 	var style = (i%2==0) ? sqrt(pow(x, 2) + pow(y, 2) + pow(z, 2)) : "#00ffff";

	// 	data.add({x:x,y:y,z:z,style:style});
	// }

	// specify options
	var options = {
		width:  '600px',
		height: '600px',
		style: 'dot-color',
		showPerspective: true,
		showGrid: true,
		keepAspectRatio: true,
		verticalRatio: 1.0,
		legendLabel: 'distance',
		cameraPosition: {
		  horizontal: -0.35,
		  vertical: 0.22,
		  distance: 1.8
		}
	};

	// create our graph
	// var container = document.getElementById('mygraph');
	// graph = new vis.Graph3d(container, data, options);
}