// Initialize local variables to null
var data = null;
var graph = null;

// Called when the Visualization API is loaded.
function drawVisualization(csv_file) {
	console.log(csv_file.name);
	var pow = Math.pow;
	// parse the csv
	var data = new vis.DataSet();
	var lines = Papa.parse(csv_file, {
		download: true,
		header: true,
		step: function(row) {
			var row_data = row.data[0];
			console.log("ROW.w ", row_data.w);
			data.add({id:row_data.i,
					  x:row_data.u,
					  y:row_data.v,
					  z:row_data.w,
					  style:"#00ffff"
					});
		},
		complete: function() { console.log("DONE"); }
	});
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
    var container = document.getElementById('visualization');
    var graph3d = new vis.Graph3d(container, data, options);
}