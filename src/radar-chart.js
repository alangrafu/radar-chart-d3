var RadarChart = {
  draw: function(id, d, options){
    var cfg = {
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
    total = d.length;
    cfg.maxValue = (Math.max.apply(Math,d.map(function(o){return o.value;})));
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    var g = d3.select(id).append("svg").attr("width", cfg.w).attr("height", cfg.h).append("g");

    var axis = g.selectAll(".axis").data(d).enter().append("g");
    axis.selectAll(".axis").data(d).enter().append("svg:line")
    .attr("x1", cfg.w/2)
    .attr("y1", cfg.h/2)
    .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
    .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
    .attr("class", "line");
    axis.selectAll(".axis").data(d).enter().append("text").attr("class", "legend")
    .text(function(d){return d.variable})
    .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-20*Math.sin(i*cfg.radians/total);})
    .attr("y", function(d, i){return cfg.h/2*(1-cfg.factorLegend*Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

    for(var j=0; j<cfg.levels; j++){
     var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
     g.selectAll(".levels").data(d).enter().append("svg:line")
     .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
     .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
     .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
     .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
     .attr("class", "line").attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");;

 }

 var testData = [

 ];
 g.selectAll(".nodes").data(d).enter().append("svg:circle").attr('r', 10).attr("alt", function(d){return d.value})
 .attr("cx", function(d, i){
    testData.push([
       cfg.w/2*(1-(d.value/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
       cfg.h/2*(1-(d.value/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
       ]);
    return cfg.w/2*(1-(d.value/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));})
 .attr("cy", function(d, i){return cfg.h/2*(1-(d.value/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));})
                                    .attr("class", "marker").attr("data-id", function(d){return d.variable});//.attr("transform", "translate(" + (cfg.w/2) + ", " + (cfg.h/2) + ")");;

                                    testData.push(testData[0]);


                                    g.selectAll("path.area")
    .data([testData])      // dimension of data should be 3D
    .enter().append("path")
    .style("fill", "steelblue").style("fill-opacity", .5)
    .attr("class", "area") // not the cause of your problem
    .attr("d", d3.svg.area());
}
}
