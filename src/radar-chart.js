var RadarChart = {
  chart: function() {
    // default config
    var cfg = {
      containerClass: 'radar-chart',
      radius: 5,
      w: 600,
      h: 600,
      factor: 0.95,
      factorLegend: 1,
      levels: 3,
      maxValue: 0,
      radians: 2 * Math.PI,
      color: d3.scale.category10()
    };

    function radar(selection) {
      selection.each(function(data) {
        var container = d3.select(this);

        var maxValue = Math.max(cfg.maxValue, d3.max(data, function(d) { 
          return d3.max(d, function(o){ return o.value; });
        }));

        var allAxis = data[0].map(function(i, j){ return i.axis; });
        var total = allAxis.length;
        var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);

        container.classed(cfg.containerClass, 1);

        // tmp until each selector only redraws necessary stuff
        container.selectAll('*').remove();

        var tooltip;
        function getPosition(i, range, factor, func){
          factor = typeof factor !== 'undefined' ? factor : 1;
          return range * (1 - factor * func(i * cfg.radians / total));
        }
        function getHorizontalPosition(i, range, factor){
          return getPosition(i, range, factor, Math.sin);
        }
        function getVerticalPosition(i, range, factor){
          return getPosition(i, range, factor, Math.cos);
        }

        d3.range(0, cfg.levels).forEach(function(level) {
          var levelFactor = radius * ((level + 1) / cfg.levels);

          container.selectAll(".level404").data(allAxis).enter().append("svg:line")
            .attr("x1", function(d, i){return getHorizontalPosition(i, levelFactor);})
            .attr("y1", function(d, i){return getVerticalPosition(i, levelFactor);})
            .attr("x2", function(d, i){return getHorizontalPosition(i+1, levelFactor);})
            .attr("y2", function(d, i){return getVerticalPosition(i+1, levelFactor);})
            .attr("class", "level").attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
        });

        series = 0;

        var axis = container.selectAll(".axis").data(allAxis).enter().append("g").attr("class", "axis");

        axis.append("line")
            .attr("x1", cfg.w/2)
            .attr("y1", cfg.h/2)
            .attr("x2", function(j, i){return getHorizontalPosition(i, cfg.w/2, cfg.factor);})
            .attr("y2", function(j, i){return getVerticalPosition(i, cfg.h/2, cfg.factor);});

        axis.append("text")
            .attr("class", function(d, i){
              var p = getHorizontalPosition(i, 0.5);
              
              return "legend " +
                ((p < 0.4) ? "left" : ((p > 0.6) ? "right" : "middle"));
            })
            .attr('dy', function(d, i) {
              var p = getVerticalPosition(i, 0.5);
              return ((p < 0.1) ? "1em" : ((p > 0.9) ? "0" : "0.5em"));
            })
            .text(function(d){return d;})
            .attr("x", function(d, i){return getHorizontalPosition(i, cfg.w / 2, cfg.factorLegend);})
            .attr("y", function(d, i){return getVerticalPosition(i, cfg.h / 2, cfg.factorLegend);});

     
        data.forEach(function(y, x){
          dataValues = [];
          container.selectAll(".nodes")
            .data(y, function(j, i){
              dataValues.push([
                getHorizontalPosition(i, cfg.w/2, (parseFloat(Math.max(j.value, 0))/maxValue)*cfg.factor),
                getVerticalPosition(i, cfg.h/2, (parseFloat(Math.max(j.value, 0))/maxValue)*cfg.factor)
              ]);
            });
          dataValues.push(dataValues[0]);
          // ToDo: refactor, this query relies on no element being found
          //       should be switched to an proper selectAll() && data()
          container.selectAll(".area404")
                         .data([dataValues])
                         .enter()
                         .append("polygon")
                         .attr("class", "area radar-chart-serie"+series)
                         .style("stroke", cfg.color(series))
                         .attr("points",function(d) {
                             var str="";
                             for(var pti=0;pti<d.length;pti++){
                                 str=str+d[pti][0]+","+d[pti][1]+" ";
                             }
                             return str;
                          })
                         .style("fill", function(j, i) { return cfg.color(series); })
                         .on('mouseover', function (d){
                            container.classed('focus', 1);
                            d3.select(this).classed('focused', 1);
                         })
                         .on('mouseout', function(){
                            container.classed('focus', 0);
                            d3.select(this).classed('focused', 0);
                         });
          series++;
        });
        series=0;


        data.forEach(function(y, x) {
          container.selectAll(".nodes")
            .data(y).enter()
            .append("svg:circle").attr("class", "radar-chart-serie"+series)
            .attr('r', cfg.radius)
            .attr("alt", function(j){ return Math.max(j.value, 0); })
            .attr("cx", function(j, i){
              dataValues.push([
                getHorizontalPosition(i, cfg.w/2, (parseFloat(Math.max(j.value, 0))/maxValue)*cfg.factor),
                getVerticalPosition(i, cfg.h/2, (parseFloat(Math.max(j.value, 0))/maxValue)*cfg.factor)
              ]);
              return getHorizontalPosition(i, cfg.w/2, (Math.max(j.value, 0)/maxValue)*cfg.factor);
            })
            .attr("cy", function(j, i){
              return getVerticalPosition(i, cfg.h/2, (Math.max(j.value, 0)/maxValue)*cfg.factor);
            })
            .attr("data-id", function(j){ return j.axis; })
            .style("fill", cfg.color(series))
            .on('mouseover', function (d){
                        newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                        newY =  parseFloat(d3.select(this).attr('cy')) - 5;
                        tooltip.attr('x', newX).attr('y', newY).text(d.value).classed('visible', 1);

                        z = "polygon."+d3.select(this).attr("class");
                        container.classed('focus', 1);
                        d3.select(z).classed('focused', 1);
                      })
            .on('mouseout', function(){
                        tooltip.classed('visible', 0);

                        z = "polygon."+d3.select(this).attr("class");
                        container.classed('focus', 0);
                        d3.select(z).classed('focused', 0);
                      })
            .append("svg:title")
            .text(function(j){ return Math.max(j.value, 0); });

          series++;
        });
        //Tooltip
        tooltip = container.append('text').attr('class', 'tooltip');






      });
    }

    radar.config = function(value) {
        if(!arguments.length) {
          return cfg;
        }
        if(arguments.length > 1) {
          cfg[arguments[0]] = arguments[1];
        }
        else {
          d3.entries(value || {}).forEach(function(option) {
            cfg[option.key] = option.value;
          });
        }
        return radar;
    };

    return radar;
  },
  draw: function(id, d, options) {
    var chart = RadarChart.chart().config(options);
    var cfg = chart.config();

    d3.select(id).select('svg').remove();
    d3.select(id)
      .append("svg")
      .attr("width", cfg.w)
      .attr("height", cfg.h)
      .datum(d)
      .call(chart);
  }
};
