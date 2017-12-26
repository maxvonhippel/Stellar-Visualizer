// Initialize local variables to null
var data = null;
var graph3d = null;
var container = null;
var options = 
{
    width:  '600px',
    height: '600px',
    style: 'dot-color',
    showPerspective: true,
    showGrid: true,
    showShadow: false,
    keepAspectRatio: true,
    verticalRatio: 0.5
};
var UVW = true;

// Called when the Visualization API is loaded.
function draw_visualization(csv_file) 
{
	var pow = Math.pow;
	var sqrt = Math.sqrt;
	// parse the csv
	data = new vis.DataSet();
	var lines = Papa.parse(csv_file, 
	{
		download: true,
		header: true,
		step: function(row) 
		{
			var row_data = row.data[0];
			var id = parseInt(row_data.i);
			var x  = parseInt(row_data.u);
			var y  = parseInt(row_data.v);
			var z  = parseInt(row_data.w);
			var t = parseInt(row_data.t);	// use t for style
			data.add({
				id:id,
				RA:parseInt(row_data.RA),
				Dec:parseInt(row_data.Dec),
				pm_RA:parseInt(row_data.pm_RA),
				pm_Dec:parseInt(row_data.pm_Dec),
				prlx:parseInt(row_data.prlx),
				V_rad:parseInt(row_data.V_rad),
				t:t,
				u:x,
				v:y,
				w:z,
				x:x,
				y:y,
				z:z,
				style:parseInt(t),
			});
		},
		complete: function() 
		{ 
			container = document.getElementById('visualization');
    		graph3d = new vis.Graph3d(container, data, options); 
   			set_graph_options();
   			// these options *should* only need to be set once
   			graph3d.tooltip = true;
			graph3d.legendLabel = "Galactic Age";
    		console.log('done drawing');
    	}
	});
}

function handle_file_select(evt) 
{
  	var files = evt.target.files;
    // only select first one
    draw_visualization(files[0]);
}

document.getElementById('file')
		.addEventListener('change',
						  handle_file_select,
						  false);

// ------------ TODO ------------------
/* 1. Need to make it so data contains all data not just x, y, z
 * 2. Would be great to make this more elegant, so that maybe we have 1
 * dataset for all the data and a second for just the x, y, z or something?
 * (Is that scaleable???)  Then we could just change the second based on the
 * first.
 * 3. Then comes all the UI stuff like showing a buffering indicator of some
 * sort, including axis labels, etc.
 */

function set_graph_options()
{
	graph3d.xLabel = UVW ? "u" : "RA";
	graph3d.yLabel = UVW ? "v" : "Dec";
	graph3d.zLabel = UVW ? "w" : "V_rad";
}

function change_coordinates() 
{
	if (data == null || data._data == null) return;
	UVW = !UVW;
	for (var line in data._data) {
		var cur_line = data._data[line];
		if (UVW == true)
		{
			cur_line.x = cur_line.u;
			cur_line.y = cur_line.v;
			cur_line.z = cur_line.w;
		}
		else
		{
			cur_line.x = cur_line.RA;
			cur_line.y = cur_line.Dec;
			cur_line.z = cur_line.V_rad;
		}
	}
	graph3d.setData(data);
	set_graph_options();
	graph3d.redraw();
}

document.getElementById('coordinatePicker')
		.addEventListener('change',
						  change_coordinates);