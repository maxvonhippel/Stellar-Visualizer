// Initialize local variables to null
var data = null;
var graph3d = null;
var full_data = {};
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
			// Can change style selection later to be more directly informative
			// (a 4th dimension of some sort, maybe galactic age or something).
			var style = (id % 2 == 0) ? 
						sqrt(pow(x, 2) + pow(y, 2) + pow(z, 2)) : "#00ffff";
			style = parseInt(style);
			var data_row = {id:id, x:x, y:y, z:z, style:style};
			data.add(data_row);
			// i,RA,Dec,pm_RA,pm_Dec,prlx,V_rad,t,u,v,w
			full_data[id] = 
			{
				RA:parseInt(row_data.RA),
				Dec:parseInt(row_data.Dec),
				pm_RA:parseInt(row_data.pm_RA),
				pm_Dec:parseInt(row_data.pm_Dec),
				prlx:parseInt(row_data.prlx),
				V_rad:parseInt(row_data.V_rad),
				t:parseInt(row_data.t),
				u:x,
				v:y,
				w:z
			};
		},
		complete: function() 
		{ 
			container = document.getElementById('visualization');
    		graph3d = new vis.Graph3d(container, data, options); 
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
		.addEventListener('change', handle_file_select, false);

// ------------ TODO ------------------
/* 1. Need to make it so data contains all data not just x, y, z
 * 2. Would be great to make this more elegant, so that maybe we have 1
 * dataset for all the data and a second for just the x, y, z or something?
 * (Is that scaleable???)  Then we could just change the second based on the
 * first.
 * 3. Then comes all the UI stuff like showing a buffering indicator of some
 * sort, including axis labels, etc.
 */

function change_coordinates() 
{
	// i,RA,Dec,pm_RA,pm_Dec,prlx,V_rad,t,u,v,w
	if (data == null || data._data == null) return;
	UVW = !UVW;
	for (var line in data._data) {
		var cur_line = data._data[line];
		var cur_line_data = full_data[line];
		if (UVW == true)
		{
			cur_line.x = cur_line_data.u;
			cur_line.y = cur_line_data.v;
			cur_line.z = cur_line_data.w;
		}
		else
		{
			cur_line.x = cur_line_data.RA;
			cur_line.y = cur_line_data.Dec;
			cur_line.z = cur_line_data.V_rad;
		}
	}
	graph3d = new vis.Graph3d(container, data, options); 
	// if (this.selectedIndex == 0)
	// {
	// 	// UVW
	// 	console.log('Selected (U, V, W). \
	// 				 Sadly, axis switching is not done yet.');
	// 	console.log(data._data);

	// } 
	// else 
	// {
	// 	// Ecuatorial
	// 	console.log('Selected Ecuatorial. \
	// 				 Sadly, axis switching is not done yet.');
	// 	console.log(data._data);
	// }
}
document.getElementById('coordinatePicker')
		.addEventListener('change', change_coordinates);