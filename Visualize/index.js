// Initialize local variables to null
var data = null;
var graph = null;

// Called when the Visualization API is loaded.
function drawVisualization(csv_file) {
	var pow = Math.pow;
	// parse the csv
	var data = new vis.DataSet();
	var lines = Papa.parse(csv_file, {
		download: true,
		header: true,
		step: function(row) {
			var row_data = row.data[0];
			var i = row_data.i;
			var style = (i % 2 == 0) ? 
						sqrt(pow(x, 2) + pow(y, 2) + pow(z, 2)) : "#00ffff";
			var data_row = {id:parseInt(i),
					  		 x:parseInt(row_data.u),
					  		 y:parseInt(row_data.v),
					  		 z:parseInt(row_data.w),
					  		style:parseInt(style)};
			console.log(data_row);
			data.add(data_row);
		},
		complete: function() { 
			var container = document.getElementById('visualization');
    		var graph3d = new vis.Graph3d(container, data, options); 
    	}
	});
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
}

function handleFileSelect(evt) {
  	var files = evt.target.files;
    // only select first one
    drawVisualization(files[0]);
}
document.getElementById('file').addEventListener('change', 
  												 handleFileSelect, 
  												 false);