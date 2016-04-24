
var m = {top: 40, bottom: 40, left: 50, right: 50};
var w = 800;
var h = 500;

var svg = d3.select('body')
			.append('svg')
			.attr('width', w)
			.attr('height', h);

function create() {
	//Create scale
	var xScale = d3.scale.linear()
					.domain([0, d3.max(dataset, function(d) {
						return d.sleep;
					})])
					.range([m.left, w-m.right]);
	var yScale = d3.scale.linear()
					.domain([0, d3.max(dataset, function(d) {
						return d.life;
					})])
					.range([h-m.top, m.bottom]);
	//Create axes
	var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient('bottom'); 
	svg.append('g')
		.attr('class', 'axis')
		.attr('transform', 'translate(0, ' + (h - m.bottom) + ')')
		.call(xAxis); 

	var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient('left'); 
	svg.append('g')
		.attr('class', 'axis')
		.attr('transform', 'translate(' + m.left + ', 0)')
		.call(yAxis);

	//Add axis labels
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(' + (w/2) + ', ' + (h - m.bottom/10) + ')')
		.text('Hours of Sleep');

	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(' + (m.left/3) + ', ' + (h/2) + ')rotate(-90)')
		.text('Max Life Span (years)');

	//Add graph title
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('class', 'title')
		.attr('transform', 'translate(' + (m.left + w/2) + ', ' + (m.top/2) + ')')
		.text('Animals: Max Life Span vs. Hours of Sleep');

	//Add tooltip
	var tip = d3.tip()
		.attr('class', 'tool-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>Species:</strong> " + d.species + "<br/><strong>Predation scale:</strong> " + d.pred;
		})

	svg.call(tip);

	//Create points
	var pts = svg.selectAll('circle')
		.data(dataset)
		.enter()
		.append('circle')
		.attr('class', 'pts'); 

	pts.attr('cx', function(d) {
				return xScale(d.sleep); 
			})
		.attr('cy', function(d) {
				return yScale(d.life);
			})
		.attr('r', 4);

	//Add tool-tip animation
	pts.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	//Add labels
	// var lbl = svg.selectAll('text')
	// 	.data(dataset)
	// 	.enter()
	// 	.append('text')
	// lbl.text(function(d) {
	// 	return d.species;
	// })
	// .attr('x', function(d) {
	// 	return xScale(d.sleep) + 8;
	// })
	// .attr('y', function(d){
	// 	return yScale(d.life);
	// });

}


d3.csv('sleep_edt.csv', function(ani) {
		dataset = ani.map(function(d) {
		species = d.Species;
		sleep = +d.TotSleep;
		life = +d.MaxSpan;
		pred = d.Predator;
		return { "species": species, "sleep": sleep, "life": life, "pred": pred};
	})
	create();
});


