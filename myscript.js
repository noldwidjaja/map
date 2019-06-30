
/* JavaScript goes here. */
var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
centered,
bordercolor = "#fff",
borderwidth = 0.5,
pink = "#DF5286",
blue = "#81C4FF";

console.log(width, height);

var projection = d3.geo.equirectangular()
.scale(1750)
.rotate([-118, 2.5])
.translate([width / 2, height / 2]);

var path = d3.geo.path()
.projection(projection);

var svg = d3.select("#map")
.attr("width", width)
.attr("height", height);

svg.append("rect")
.attr("class", "background")
.attr("width", width)
.attr("height", height)
.on("click", clicked);

var g = svg.append("g");

// d3.json("pemilu.json", function(error, data){
//   console.log(data.NAME_01);
// });
// 
var pemilu = d3.map();

d3.json("pemilu.json", function(d){
  d.forEach(function(key){
    var result = [];
    pemilu.set(key.NAME_01, [key.P01, key.P02]);
  })
});

function getColor(d){
  console.log(d);
  return blue;
}

d3.json("indonesia.json", function(error, us) {
  if (error) throw error;

  g.append("g")
  .attr("id", "subunits")
  .selectAll("path")
  .data(topojson.feature(us, us.objects.IDN_adm_2_kabkota).features)
  .enter().append("path")
  .attr("fill", function(d) {
    console.log(d.properties.NAME_1);
    var key = d.properties.NAME_1,
    S01 = pemilu.get(key)[0],
    S02 = pemilu.get(key)[1],
    color = "";
    (S01 < S02) ? color = pink : color = blue;
    return color;
  })
  .attr("d", path)
  .on("click", clicked);

  g.append("path")
  .datum(topojson.mesh(us, us.objects.IDN_adm_2_kabkota, function(a, b) { return a !== b; }))
  .attr("id", "state-borders")
  .attr("d", path);
});

function provinceInfo(region) {
  return region.properties.NAME_1 + ", " + region.properties.NAME_2;
}

function clicked(d) {
  var x, y, k;

  if(d) {
    console.log(d.properties);
    document.getElementById('area-name').innerHTML = "Indonesia, " + provinceInfo(d);
  } else {
    document.getElementById('area-name').innerHTML = "Indonesia";
  }

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
  .classed("active", centered && function(d) { return d === centered; });

  g.transition()
  .duration(750)
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
  .style("stroke-width", 1.5 / k + "px");
}

function doDate()
{
  var now = new Date();

  // var str = now.format("YYYY-MM-DDTHH:mm:ss");
  var str = now.toDateString() + ' ' + now.toLocaleTimeString();
  document.getElementById("todaysDate").innerHTML = str;
}

setInterval(doDate, 1000);