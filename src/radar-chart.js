var RadarChart = {
  draw: function(id, d, options){
    var cfg = {
     radius: 7,
     w :600, 
     h: 600, 
     factor: 1, 
     factorLegend:.85,
     total: 4,
     levels: 4,
     maxValue: 1000,
     radians: 2 * Math.PI, 
     minDistance : 50,
   }
   if(options != undefined){
    for(var i in options){
      cfg[i] = options[i];
    }
  }
  cfg.maxValue = d3.max(d, function(i){return Math.max.apply(Math,i.map(function(o){return o.value;}))});
  var allAxis = (d[0].map(function(i, j){return i.axis}));
  total = allAxis.length;
  var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
  var g = d3.select(id).append("svg").attr("width", cfg.w).attr("height", cfg.h).append("g");

  for(var j=0; j<cfg.levels; j++){
   var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
   g.selectAll(".levels").data(allAxis).enter().append("svg:line")
   .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
   .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
   .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
   .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
   .attr("class", "line").style("stroke", "grey").style("stroke-width", "0.5px").attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");;

 }

 var color = d3.scale.category10();
 series = 0;
 for(x in d){
  dataValues = [];
  y = d[x];
  d3.select(id+" g").selectAll(".nodes")
  .data(y, function(j, i){
    dataValues.push([
      cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
      cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
      ]);
  });
  
  dataValues.push(dataValues[0]);
  d3.select(id+" g").selectAll(".area")
  .data([dataValues])
  .enter().append("path")
  .style("fill", function(j, i){return color(series)}).style("fill-opacity", .5)
  .attr("d", d3.svg.area());
  series++;
}
series=0;
for(x in d){
  y = d[x];


  d3.select(id+" g").selectAll(".nodes")
  .data(y).enter()
  .append("svg:circle")
  .attr('r', cfg.radius)
  .attr("alt", function(j){return Math.max(j.value, 0)})
  .attr("cx", function(j, i){
    dataValues.push([
      cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
      cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
      ]);
    return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
  })
  .attr("cy", function(j, i){
    return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
  })
  .attr("data-id", function(j){return j.axis})
  .style("fill", color(series)).style("fill-opacity", .9)
  .style("stroke", "black")    .append("svg:title").text(function(j){return Math.max(j.value, 0)})
  series++;
}
var axis = g.selectAll(".axis").data(allAxis).enter().append("g").attr("class", "axis");

axis.append("line")
.attr("x1", cfg.w/2)
.attr("y1", cfg.h/2)
.attr("x2", function(j, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
.attr("y2", function(j, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
.attr("class", "line").style("stroke", "grey").style("stroke-width", "1px");

axis.append("text").attr("class", "legend")
.text(function(d){return d}).style("font-family", "sans-serif").style("font-size", "12px").attr("transform", function(d, i){return "translate(0, -10)"})
.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-20*Math.sin(i*cfg.radians/total);})
.attr("y", function(d, i){return cfg.h/2*(1-cfg.factorLegend*Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

}
}