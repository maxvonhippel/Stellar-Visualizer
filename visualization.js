Plotly.d3.csv('http://mxvh.pl/stellarVisualization/stars.csv', function(err, rows) {
  function unpack(rows, key) {
    return rows.map(function(row) {
      return row[key];
    });
  }
  var data = [{
    // id:unpack(rows, 'id'),
    x:unpack(rows, 'u'),
    y:unpack(rows, 'v'),
    z:unpack(rows, 'w'),
    mode: 'markers',
    marker: {
    size: unpack(rows, 't'),
    line: {
      color: 'rgba(217, 217, 217, 0.14)',
      width: 0.5
    },
    opacity: 0.8
  },
  type: 'scatter3d'
}];
var layout = {margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0
  }};
Plotly.newPlot('chart', data, layout);
});