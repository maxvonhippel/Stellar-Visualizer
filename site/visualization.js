Plotly.d3.csv('../stars.csv', function(err, rows) {
  function unpack(rows, key) {
    return rows.map(function(row) {
      return row[key];
    });
  }
  var data = [{
    x:unpack(rows, 'u'),
    y:unpack(rows, 'v'),
    z:unpack(rows, 'w'),
    mode: 'markers',
    marker: {
      color: String("\"" +
        d3.interpolateRdYlBu(unpack(rows, 't')/13).toString()
        + "\""),
      size: 2,
      line: {
        color: String("\"" +
          d3.interpolateRdYlBu(unpack(rows, 't')/13).toString()
          + "\""),
        width: 0.5
      },
      opacity: 0.8
    },
    type: 'scatter3d'
  }];
  var layout = {
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    }
  };
  Plotly.newPlot('chart', data, layout);
});
console.log('example of ', (11/13), d3.interpolateRdYlBu(11/13).toString());
