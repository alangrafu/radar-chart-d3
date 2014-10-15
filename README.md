## Radar Chart
A reusable radar chart implementation in D3.js. Styleable, configurable and transition enabled.

[![Radar Example](http://bl.ocks.org/tpreusse/raw/2bc99d74a461b8c0acb1/thumbnail.png)](http://bl.ocks.org/tpreusse/2bc99d74a461b8c0acb1)

## Usage

### Install
`bower install git@github.com:alangrafu/radar-chart-d3.git --save`

### Data structure
```
var data = [
  {
    className: 'germany', // optional can be used for styling
    axes: [
      {axis: "strength", value: 13}, 
      {axis: "intelligence", value: 6}, 
      {axis: "charisma", value: 5},  
      {axis: "dexterity", value: 9},  
      {axis: "luck", value: 2}
    ]
  },
  {
    className: 'argentina',
    axes: [
      {axis: "strength", value: 6}, 
      {axis: "intelligence", value: 7}, 
      {axis: "charisma", value: 10},  
      {axis: "dexterity", value: 13},  
      {axis: "luck", value: 9}
    ]
  }
];
```

### Simple single chart drawing
```html
<div class="chart-container"></div>
<script>
RadarChart.draw(".chart-container", data);
</script>
```

### D3.js reusable chart API
```javascript
var chart = RadarChart.chart();
var svg = d3.select('body').append('svg')
  .attr('width', 600)
  .attr('height', 800);

// darw one
svg.append('g').classed('focus', 1).datum(data).call(chart);

// draw many radars
var game = svg.selectAll('g.game').data(
  [
    data,
    data,
    data,
    data
  ]
);
game.enter().append('g').classed('game', 1);
game
  .attr('transform', function(d, i) { return 'translate(150,600)'; })
  .call(chart);
```

### Style with CSS
```css
.radar-chart .area {
  fill-opacity: 0.7;
}
.radar-chart.focus .area {
  fill-opacity: 0.3;
}
.radar-chart.focus .area.focused {
  fill-opacity: 0.9;
}
.area.germany, .germany .circle {
  fill: #FFD700;
  stroke: none;
}
.area.argentina, .argentina .circle {
  fill: #ADD8E6;
  stroke: none;
}
```

### Configure
```javascript
// retrieve config
chart.config();
// all options with default values
chart.config({
  containerClass: 'radar-chart', // target with css, default stylesheet targets .radar-chart
  w: 600,
  h: 600,
  factor: 0.95,
  factorLegend: 1,
  levels: 3,
  maxValue: 0,
  radians: 2 * Math.PI,
  color: d3.scale.category10(), // pass a noop (function() {}) to decide color via css
  axisLine: true,
  axisText: true,
  circles: true,
  radius: 5,
  axisJoin: function(d, i) {
    return d.className || i;
  },
  tooltip: function(d) {
    return d[0].value;
  },
  transitionDuration: 300
});
```

## Example

[![Example](https://rawgit.com/tpreusse/radar-chart-d3/master/example/demo.svg)](http://bl.ocks.org/tpreusse/2bc99d74a461b8c0acb1)
http://bl.ocks.org/tpreusse/2bc99d74a461b8c0acb1