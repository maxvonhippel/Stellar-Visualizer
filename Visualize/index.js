// Initialize local variables to null
var data = null;
var graph3d = null;

// Called when the Visualization API is loaded.
function drawVisualization(csv_file) {
	var pow = Math.pow;
	var sqrt = Math.sqrt;
	// parse the csv
	data = new vis.DataSet();
	var options = {
        width:  '600px',
        height: '600px',
        style: 'dot-color',
        showPerspective: true,
        showGrid: true,
        showShadow: false,
        keepAspectRatio: true,
        verticalRatio: 0.5
    };
	var lines = Papa.parse(csv_file, {
		download: true,
		header: true,
		step: function(row) {
			var row_data = row.data[0];
			var id = parseInt(row_data.i);
			var x  = parseInt(row_data.u);
			var y  = parseInt(row_data.v);
			var z  = parseInt(row_data.w);
			// Can change style selection later to be more directly informative
			// (a 4th dimension of some sort, maybe galactic age or something).
			var style = (id % 2 == 0) ? 
						sqrt(pow(x, 2) + pow(y, 2) + pow(z, 2)) : "#00ffff";
			style = parseInt(style);
			var data_row = {id:id, x:x, y:y, z:z, style:style};
			data.add(data_row);
		},
		complete: function() { 
			var container = document.getElementById('visualization');
    		graph3d = new vis.Graph3d(container, data, options); 
    		console.log('done drawing');
    	}
	});
}

function handleFileSelect(evt) {
  	var files = evt.target.files;
    // only select first one
    drawVisualization(files[0]);
}
document.getElementById('file').addEventListener('change', 
  												 handleFileSelect, 
  												 false);