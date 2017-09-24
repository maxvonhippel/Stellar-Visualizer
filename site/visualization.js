// Based on fiddle here: http://jsfiddle.net/joequant/fvSrq/
// Set up plot
var scatterPlot = new THREE.Object3D();
var mat = new THREE.PointsMaterial(
  {vertexColors: true, size: 1.5});
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
camera.position.z = 300;
// Set up view on current canvas context
function createTextCanvas(text, color, font, size)
{
  size = size || 24;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var fontStr = (size + 'px ') + (font || 'Arial');
  ctx.font = fontStr;
  var w = ctx.measureText(text).width;
  var h = Math.ceil(size);
  canvas.width = w;
  canvas.height = h;
  ctx.font = fontStr;
  ctx.fillStyle = color || 'black';
  ctx.fillText(text, 0, Math.ceil(size*0.8));
  return canvas;
}
// Build 2d text around chart
function createText2D(text, color, font, size, segW, segH)
{
  var canvas = createTextCanvas(text, color, font, size);
  var plane = new THREE.PlaneGeometry(canvas.width, canvas.height, segW, segH);
  var tex = new THREE.Texture(canvas);
  tex.needsUpdate = true;
  var planeMat = new THREE.MeshBasicMaterial({
    map: tex, color: 0xffffff, transparent: true
  });
  var mesh = new THREE.Mesh(plane, planeMat);
  mesh.scale.set(0.25, 0.25, 0.25);
  mesh.doubleSided = true;
  return mesh;
}
// Render onto page
var renderer = new THREE.WebGLRenderer({antialias: true});
var w = Math.min(document.body.clientWidth, 800);
renderer.setSize(w, w);
document.body.appendChild(renderer.domElement);
// Style the render
renderer.setClearColor(0xEEEEEE, 1);
// Position the camera
var camera = new THREE.PerspectiveCamera( 45, 1, 1, 10000 );
camera.position.z = 200;
camera.position.x = 0;
camera.position.y = 75;
// Set up scene
var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0xFFFFFF, 0.0035 );
// Set up scatter plot object and add to scene
var scatterPlot = new THREE.Object3D();
scene.add(scatterPlot);
// Set rotation and render scatter plot
scatterPlot.rotation.y = 0.5;
function v(x,y,z){ return new THREE.Vector3(x,y,z); }
// Draw boundaries geometry to scatter plot      
var lineGeo = new THREE.Geometry();
Papa.parse("http://mxvh.pl/stellarVisualization/stars.csv", {
  download: true,
  step: function(row) {
    console.log("Row:", row.data);
    lineGeo.vertices.push(v(row.data));
  },
  complete: function() {
    console.log("All done!");
  }
});
// Style the plot axes
var lineMat = new THREE.LineBasicMaterial({color: 0x808080, lineWidth: 1});
var line = new THREE.Line(lineGeo, lineMat);
line.type = THREE.Lines;
scatterPlot.add(line);

var titleX = createText2D('-U');
titleX.position.x = -60;
scatterPlot.add(titleX);

var titleX = createText2D('U');
titleX.position.x = 60;
scatterPlot.add(titleX);

var titleX = createText2D('-V');
titleX.position.y = -60;
scatterPlot.add(titleX);

var titleX = createText2D('V');
titleX.position.y = 60;
scatterPlot.add(titleX);

var titleX = createText2D('-W');
titleX.position.z = -60;
scatterPlot.add(titleX);

var titleX = createText2D('W');
titleX.position.z = 60;
scatterPlot.add(titleX);
// Get count of points and draw
// TODO HERE <-------- from CSV data
var pointCount = 10000;
var pointGeo = new THREE.Geometry();
for (var i=0; i<pointCount; i++) {
  var x = Math.random() * 100 - 50;
  var y = x*0.8+Math.random() * 20 - 10;
  var z = x*0.7+Math.random() * 30 - 15;
  pointGeo.vertices.push(new THREE.Vector3(x,y,z));
  pointGeo.colors.push(new THREE.Color().setHSL(
    (x+50)/100, (z+50)/100, (y+50)/100));
}
var points = new THREE.ParticleSystem(pointGeo, mat);
scatterPlot.add(points);
scene.add(scatterPlot);
// stylize again
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.0035);
renderer.render(scene, camera);
var paused = false;
var last = new Date().getTime();
var down = false;
var sx = 0, sy = 0;
window.onmousedown = function (ev)
{
  down = true; sx = ev.clientX; sy = ev.clientY;
};
window.onmouseup = function()
{ 
  down = false; 
};
window.onmousemove = function(ev)
{
  if (down) 
  {
    var dx = ev.clientX - sx;
    var dy = ev.clientY - sy;
    scatterPlot.rotation.y += dx*0.01;
    camera.position.y += dy;
    sx += dx;
    sy += dy;
  }
}
var animating = false;
window.ondblclick = function() { animating = !animating; };
function animate(t) 
{
  if (!paused) 
  {
    last = t;
    if (animating) 
    {
      var v = pointGeo.vertices;
      for (var i=0; i<v.length; i++) {
        var u = v[i];
        u.angle += u.speed * 0.01;
        u.position.x = Math.cos(u.angle)*u.radius;
        u.position.z = Math.sin(u.angle)*u.radius;
      }
      pointGeo.__dirtyVertices = true;
    }
    renderer.clear();
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  window.requestAnimationFrame(animate, renderer.domElement);
};
animate(new Date().getTime());
onmessage = function(ev) {
  paused = (ev.data == 'pause');
};
// Set up the slider
// var slider = document.getElementById('slider');
// noUiSlider.create(slider, {
//   start: [5, 10],
//   connect: true,
//   step: 0.5,
//   range: {
//     'min': 0,
//     'max': 13
//   },
//   pips: {
//     mode: 'steps',
//     stepped: true,
//     density: 4
//   },
//   tooltips: true
// });
// slider.noUiSlider.on('update', function(values, handle) {
//   console.log(data.marker);
// });