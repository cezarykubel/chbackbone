(function (){
    $.fn.chBaseChart = function( options ) {
        var settings = $.extend({
			data: [
                {date: '2014-07-01', volume1: 200, volume2: 300},
                {date: '2014-07-02', volume1: 400, volume2: 500},
                {date: '2014-07-03', volume1: 100, volume2: 600},
                {date: '2014-07-04', volume1: 500, volume2: 0},
            ],
			proportionData: [
                {date: '2014-07-01', volume1: 20, volume2: 80},
                {date: '2014-07-02', volume1: 40, volume2: 60},
                {date: '2014-07-03', volume1: 20, volume2: 80},
                {date: '2014-07-04', volume1: 100, volume2: 0},
            ],
			dataGroups: ['volume1', 'volume2']
        }, options );
		var chartType = "VOLUME";
		
		var formatPercent = function($chart) {
			$chart.find('.c3-axis-y g').each(function() {
				var $tick = $(this).find('text');
				$tick.text($tick.text() + "%");
				if ( $tick.text() === "110%" ) {
					$tick.hide();
				}
			});
		};
 
        return this.each(function() {
			var $chart = $(this), id = $chart.attr("id");
			var chart = c3.generate({
				data: {
					json: settings.data,
					keys: {
						x: 'date', // it's possible to specify 'x' when category axis
						value: settings.dataGroups,
					},
					type: 'bar',
					groups: [settings.dataGroups]
				},
				axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: '%b %e, %Y'
						}
					}
				},
				bindto: '#' + id,
				color: {
					pattern: ['#FFB600', '#57b6dd', '#8F72AA', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
				},
				padding: {
					right: '22'
				}
			});
			$('.chart-menu li a').on('click', function(e) {
				e.preventDefault();
				var $this = $(this), type = $this.attr('data-ch-switch');
				$this.closest('.chart-menu').find('a').removeClass("selected");
				$this.addClass("selected");
				if ( type === "bar" ) {
					chart.groups([settings.dataGroups]);
					chart.transform('bar');
					if ( chartType === "PERCENT" ) {
						formatPercent($chart);
					}
				}
				else if ( type === "line" ) {
					chart.groups([]);
					chart.transform('spline');
					if ( chartType === "PERCENT" ) {
						formatPercent($chart);
					}
				}
				else if ( type === "area" ) {
					chart.groups([settings.dataGroups]);
					chart.transform('area-spline');
					if ( chartType === "PERCENT" ) {
						formatPercent($chart);
					}
				}
				else if ( type === "proportion" ) {
					chart.unload([settings.dataGroups]);
					chart.load({
						json: settings.proportionData,
						keys: {
							x: 'date', // it's possible to specify 'x' when category axis
							value: settings.dataGroups,
						},
						groups: [
							settings.dataGroups
						]
					});
					chartType = "PERCENT";
					formatPercent($chart);
				}
				else if ( type === "volume" ) {
					chart.unload([settings.dataGroups]);
					chart.load({
						json: settings.data,
						keys: {
							x: 'date', // it's possible to specify 'x' when category axis
							value: settings.dataGroups,
						},
						groups: []
					});
					chartType = "VOLUME";
				}
			});
		});
	};
	
	$.fn.chSparkline = function( options ) {
        var settings = $.extend({
			data: [
                {date: '2014-07-01', volume1: 200, volume2: 300},
                {date: '2014-07-02', volume1: 400, volume2: 500},
                {date: '2014-07-03', volume1: 100, volume2: 600},
                {date: '2014-07-04', volume1: 500, volume2: 700},
            ],
			dataGroups: ['volume1', 'volume2'],
			colors: ['#57b6dd', '#333', '#8F72AA', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
			xaxis: true,
			gridlines: true,
			padding: '25'
        }, options );
 
        return this.each(function() {
			var $chart = $(this), id = $chart.attr("id"), chartFormat;
			var chart = c3.generate({
				data: {
					json: settings.data,
					keys: {
						x: 'date', // it's possible to specify 'x' when category axis
						value: settings.dataGroups,
					},
					types: {
						volume1: 'area-spline',
						volume2: 'spline'
					}
				},
				axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: '%b %e, %Y'
						},
						show: settings.xaxis
					},
					y : {
						tick: {
							format: function (d) { return ""; }
						}
					}
				},
				bindto: '#' + id,
				color: {
					pattern: settings.colors
				},
				point: {
					show: false
				},
				legend: {
					show: false
				},
				grid: {
					x: {
						show: settings.gridlines
					}
				},
				padding: {
					right: settings.padding
				}
			});
		});
	};

$.fn.chTimeChart = function( options ) {
        var settings = $.extend({
        	day: true,
			data: [
			    { "time" : 12 , value : 6500  },
			    { "time" : 1  , value : 9200  },
			    { "time" : 2  , value : 18300 },
			    { "time" : 3  , value : 12600 },
			    { "time" : 4  , value : 16000 },
			    { "time" : 5  , value : 17200 },
			    { "time" : 6  , value : 25600 },
			    { "time" : 7  , value : 12400 },
			    { "time" : 8  , value : 26200 },
			    { "time" : 9  , value : 12200 },
			    { "time" : 10 , value : 16000 },
			    { "time" : 11 , value : 7400  }
			],
			
        }, options );

        var maxVal = d3.max(settings.data, function(d) { return d.value;} );

        function formatTime(time, ampm) {
  			return time + ampm;
		}

		function toRadians(ang) {
  			return ang * (Math.PI / 180);
		}

		function toDegrees(ang) {
  			return ang / (Math.PI / 180);
		}

		function makeArc(d, outRadius){
	  		var scale = radius / maxVal,
      		tenPercent = maxVal / 10;

  			return d3.svg.arc()
				.innerRadius(inRad)
				.outerRadius(function(){
			      	if(outRadius == 0) {
			    		return inRad;
			      	}
  					else if (tenPercent > d) {
    					return(inRad + 2);
  					}
  					else{
    					return (d * scale) + inRad; 
    				}
				})
				.startAngle(toRadians(-45))
				.endAngle(toRadians(-15))();
		}

		function getColors(day, val) {
  			var colorScale = maxVal / 6,
      		radcolor = "";

  			// Blue Scale
  			if(!day) {

			  switch(true) {
			    case(val >= 0 && val < colorScale):
			      radcolor = "#c4c4c4";
			      break;
			    case(val >= colorScale && val < colorScale * 2):
			      radcolor = "#57b6dd";
			      break;
			    case(val >= colorScale *2 && val < colorScale * 3):
			      radcolor = "#439dc0";
			      break;
			    case(val >= colorScale *3 && val < colorScale * 4):
			      radcolor = "#10698B";
			      break;
			    case(val >= colorScale *4 && val < colorScale * 5):
			      radcolor = "#1b75bb";
			      break;
			    case(val >= colorScale *5 && val <= colorScale * 6):
			      radcolor = "#166fac";
			      break;
			  	}
  				return radcolor;

  			}
  			else{

			  switch(true) {
			    case(val >= 0 && val < colorScale):
			      radcolor = "#e2e2e2";
			      break;
			    case(val >= colorScale && val < colorScale * 2):
			      radcolor = "#fff100";
			      break;
			    case(val >= colorScale *2 && val < colorScale * 3):
			      radcolor = "#ffd900";
			      break;
			    case(val >= colorScale *3 && val < colorScale * 4):
			      radcolor = "#ffc130";
			      break;
			    case(val >= colorScale *4 && val < colorScale * 5):
			      radcolor = "#f48436";
			      break;
			    case(val >= colorScale *5 && val <= colorScale * 6):
			      radcolor = "#c32635";
			      break;
			  }
			  return radcolor;
			}
		}

		function drawClockLabels() {

			svg.append("g")
			  .append("text")
			  .attr("class", "small-label")
			  .style("fill", "#b5b5b5")
			  .style("font-size", "4")
			  .attr("text-anchor", "middle")
			  .attr("y", "-" + ((width / 2) - padding + 3))
			  .text("12" + ampm);

			svg.append("g")
			  .append("text")
			  .attr("class", "small-label")
			  .style("fill", "#b5b5b5")
			  .style("font-size", "4")
			  .attr("text-anchor", "middle")
			  .attr("x", ((width / 2) - padding + 6))
			  .attr("y", "3")
			  .text("3" + ampm);

			svg.append("g")
			  .append("text")
			  .attr("class", "small-label")
			  .style("fill", "#b5b5b5")
			  .style("font-size", "4")
			  .attr("text-anchor", "middle")
			  .attr("y", ((width / 2) - padding + 6))
			  .text("6" + ampm);

			svg.append("g")
			  .append("text")
			  .attr("class", "small-label")
			  .style("fill", "#b5b5b5")
			  .style("font-size", "4")
			  .attr("text-anchor", "middle")
			  .attr("x", "-" + ((width / 2) - padding + 6))
			  .attr("y", "3")
			  .text("9" + ampm);

		}

		function drawClockOutline() {

			var points = 50;
			var radians = 2 * Math.PI;

			var angleCir = d3.scale.linear()
			    .domain([0, points-1])
			    .range([0, radians]);

			var lineCir = d3.svg.line.radial()
			    .interpolate("basis")
			    .tension(0)
			    .radius((width / 2) - padding)
			    .angle(function(d,i) {
			      return angleCir(i)
			    });

			svg.append("path").datum(d3.range(points))
			  .attr("class", "line")
			  .attr("d", lineCir)
			  .attr("transform", "translate(0,0)")
			  .attr("stroke", "#d1d1d1")
			  .attr("stroke-width", "0.2")
			  .attr("fill", "none");
		}

		var padding = 12,
	      	width = 100,
	     	height = width,
	     	inRad = width / 8,
	      	radius = (width / 2) - inRad - padding,
	      	perimeter = Math.PI * 2;

   		var scale = radius / maxVal;

			var arc = null,
      		clicked = false,
      		clickedVal = "",
      		formatValues = d3.format("s");

  			if(settings.day) {
  				var ampm = "AM";
  			}
  			else
  			{
  				var ampm = "PM";
  			}

      	var svg;
 
        return this.each(function() {
			var chart = $(this).attr("id");
			var chartWidth = $("#" + chart).width();
        	svg = d3.select("#" + chart).append("svg")
        		.attr("viewBox", "0 0 "+ width + " " + height)
		        .attr("preserveAspectRatio", "xMinYMin meet")
		        .attr("width", "100%")
		        .attr("height", chartWidth)
		          .append("g")
		            .attr("transform", "translate("
		              + ((width / 2)) +","
		              + ((height / 2)) +")");

		    svg.append("g")
			    .append("text")
			    .attr("class", "big-label")
			    .style("font-size", "6")
			    .style("letter-spacing", "-0.5")
			    .attr("text-anchor", "middle")
			    .attr("dy", "0")
			    .text("");

			svg.append("g")
			    .append("text")
			    .attr("class", "small-label")
			    .style("font-size", "4")
			    .style("letter-spacing", "-0.5")
			    .attr("text-anchor", "middle")
			    .attr("dy", "5")
			    .text("");

			var setBigLabel = d3.select("#" + chart).select(".big-label"),
      			setSmallLabel = d3.select("#" + chart).select(".small-label");

      		svg.selectAll("path")
   				.data(settings.data)
    			.enter().append("path")
      			.attr("d", function(d) {
          			return makeArc(d.value, 0);
      			})
      			.attr("clicked", "false")
      			.style("fill", function(d) {
        			return getColors(settings.day, d.value);
      			})
      			.style("cursor","pointer")
      			.attr('stroke', '#fff')
      			.attr('stroke-width', '0.5')
      			.attr("transform", function(d,i) {
        			return("rotate("+((i+1)*30)+")");
      			})
      			.on("mouseover", function(d) {
			        if(d3.select(this).attr("clicked") == "false") {
			          	d3.select(this).style("opacity", ".6");
			        }
        			setBigLabel.text(formatValues(d.value));
        			setSmallLabel.text("tweets");
      			})
      			.on("mouseout", function(d) {
			        if(d3.select(this).attr("clicked") != "true") {
			         	d3.select(this).style("opacity","1");
			         	setBigLabel.text("");
			         	setSmallLabel.text("");
			        }
			        if(clickedVal != "") {
			          	setSmallLabel.text("tweets");
			        }
        			setBigLabel.text(clickedVal);
      			})
      			.on("click", function(d,i) {
        			setBigLabel.text(formatValues(d.value));
        			svg.selectAll("path").style("opacity", "1")
          				.attr("clicked","false");
        			d3.select(this).style("opacity", "0.6")
          				.attr("clicked","true");
        			clickedVal = formatValues(d.value);
      			})
      			.transition()
      			.attr("d", function(d) {
          			return makeArc(d.value, 1);
      			})
      			.delay(300)
      			.duration(1000);

  			drawClockLabels();
  			drawClockOutline();
			
		});
	};

	$.fn.chCircularChart = function( options ) {
        var settings = $.extend({
        	type: "pie",			// pie or donut
        	color: "crimson",		// crimson or socialmedia
        	percent: true,			// true or false
        	labels: "in",			// in or out
			data: [
			    { source : "Facebook" , value : 6500  },
			    { source : "Twitter"  , value : 9200  },
			    { source : "Instagram"  , value : 18300 }
			],
			
        }, options);


        // Define Initial Structure Variables
		var padding = 0,
			inRad = 0,
			width = 100,
    		height = width,
    		radius = (width / 2) - 7,
    		label_radius = radius,
    		donut = d3.layout.pie(),
    		totalposts = 0,
    		textOffset = 7,
    		pathOffset = 5,
    		chart = $(this).attr("id"),
    		scaled = false;

    	/*----------------------------//
    	//  Make Settings Adjustments //	
    	//----------------------------*/

    	// Define Color Varients
        var crimsoncolors = d3.scale.ordinal()
			.range(["#cf2229", "#f48436", "#ffc130", "#ffd900", "#fff100"]);

		var darkcolors = d3.scale.ordinal()
			.range(["#57b6dd", "#439dc0", "#10698B", "#1b75bb", "#166fac"]);
    		
    	// Defines Pie or Donut Chart
    	if(settings.type == "donut") {
    		inRad = width / 8;
    	}

    	// Defines Label Settings
    	if(settings.labels == "out") {
    		radius = (width / 3) - 7;
    		label_radius = radius + 50;

    		if(settings.type == "donut") {
    			inRad = width / 6;
    			label_radius = radius + 35;
    		}
    	}

    	// Create variable for Total Number of Values
    	for(var x = 0; x < settings.data.length; x++) {
    		totalposts += settings.data[x].value;
    	}

		return this.each(function() {

			chartWidth = getDivWidth(chart);

			// Create tooltip div
			var tooltip = d3.select("body")
				.data([settings.data])
				.append("div")
				.style("position", "absolute")
				.attr("class", "tooltip")
				.style("z-index", "10")
				.style("visibility", "hidden")
				.text("");

			// Creates init chart structure
			var svg = d3.select("#" + chart)
  				.append("svg")
    			.data([settings.data])
   				.attr("viewBox", "0 0 "+ width + " " + height)
		        .attr("preserveAspectRatio", "xMinYMin meet")
		        .attr("width", "100%")
		        .attr("height", "100%");

			var arcs = svg.selectAll("g.arc")
    			.data(donut.value(function(d) { return d.value }))
  				.enter().append("svg:g")
    			.attr("class", "arc")
    			.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    		// Creates each piece of the chart
			arcs.append("svg:path")
    			.attr("fill", function(d, i) { return setColor(d,i); })
    			.attr("d", makeArc(inRad, inRad))
    			.attr("stroke", "#FFFFFF")
    			.attr("stroke-width", "1")
    			.style("cursor","pointer")
    			.on("mouseover", function(d) {

    				// Selects all of current path's inner text
    				d3.select(this.parentNode).selectAll("text")
    					.transition()
    					.duration(500)
						.attr("transform", function(d) {
							return "translate(" + makeArc(inRad, label_radius + textOffset).centroid(d) + ")"; 
						});

    				// Get current position of path
    				var getCurPath = d3.select(this).attr("d");

    				// Select This Path
    				d3.select(this).attr("d", getCurPath)
    					.transition()
    					.duration(300)
    					.attr("d", makeArc(inRad, radius + pathOffset));
    			
    				// If value < 8%, show tooltip
    				if((d.value / totalposts) <= 0.08) {
    					tooltip.style("visibility", "visible")
    						.text(d.data.source + " " + (formatNumber(d.value)));
    				}
    			})
    			.on("mousemove", function(d){
    				// Tooltip moves with cursor
    				if((d.value / totalposts) <= 0.08) {
    					tooltip.style("top", (event.pageY-10)+"px")
    						.style("left",(event.pageX+10)+"px");
    				}
    			})
    			.on("mouseout", function() {

    				// Gets current path
    				var getCurPath = d3.select(this).attr("d");

    				// Select This Path
    				d3.select(this).attr("d", getCurPath)
    					.transition()
    					.duration(300)
    					.attr("d", makeArc(inRad, radius));

    				// Gets currents transform attribute
    				var getCurTrans = d3.select(this).attr("transform");

    				// Select This Text
    				d3.select(this.parentNode).selectAll("text")
    					.transition().duration(500)
    					.attr("transform", function(d) {
    						return "translate(" + makeArc(inRad, label_radius).centroid(d) + ")"; 
    					})

    				tooltip.style("visibility", "hidden");
    			})
    			.transition()
    			.duration(750)
    			.attr("d", makeArc(inRad, radius));

    		// Shows Value on Chart
			arcs.append("svg:text")
    			.attr("transform", function(d) {return "translate(" + makeArc(inRad, label_radius).centroid(d) + ")"; })
    			.attr("text-anchor", "middle")
    			.style("cursor","pointer")
    			.attr("dy", function(d) {
        			return (d.endAngle + d.startAngle)/2 > Math.PI ?
            		"1em" : "-.35em";
    			})
    			.style("font-weight", "bold")
    			.style("fill", function(d, i) { return ColorLuminance(setColor(d,i), -.5); })
    			.style("font-size", "5")
    			.text(function(d, i) { 
    				return formatNumber(d.value); 
    			});

    		// Shows Labels of chart
    		arcs.append("svg:text")
    			.attr("transform", function(d) {return "translate(" + makeArc(inRad, label_radius).centroid(d) + ")"; })
    			.attr("text-anchor", "middle")
    			.style("cursor","pointer")
    			.attr("dy", function(d) {
        			return (d.endAngle + d.startAngle)/2 > Math.PI ?
            		"-0.3em" : "1em";
    			})
    			.style("font-size", function(d) {
    				if((settings.data.length > 4 || (d.value / totalposts) <= 0.1) && settings.labels == "in") {
    					return "3";
    				}
    				else{
    					return "4";
    				}
    			})
    			.style("fill", function(d, i) { return ColorLuminance(setColor(d,i), -0.5); })
    			.text(function(d,i) { 
    				return d.data.source; 
    			});

    		// Selects All Text of chart
    		arcs.selectAll("text")
    			.attr("opacity", function(d) {
    				if((d.value / totalposts) <= 0.08 || chartWidth <= 200) {
    					return "0";
    				}
    				else {
    					return "1";
    				}
    			})
    			.style("pointer-events", "none");

    		$( window ).resize(function() {

    			// Gets ID & width of current Chart
				thisChart = $(this).attr("id");
				chartWidth = getDivWidth(chart);

				// 212px is when the font gets distorted.  
				// Labels disappear at this point
				if(chartWidth <= 250 && chartWidth > 212) {
					d3.select("#" + chart).selectAll("text").attr("opacity", "1");
					d3.select("#" + chart).selectAll("path").on("mouseover.tooltip", null);

					if(settings.labels == "out") {
						d3.select("#" + chart).selectAll("text").style("font-size", "4");
					}
				}
				else if(chartWidth <= 212) {
					if(settings.labels == "out") {
						d3.select("#" + chart).selectAll("text").attr("opacity", "0");

						d3.select("#" + chart).selectAll("path")
						.on("mouseover.tooltip", function(d) {

		    				tooltip.style("visibility", "visible")
		    					.text(d.data.source + " " + (formatNumber(d.value)))

		    				// Get current position of path
		    				var getCurPath = d3.select(this).attr("d");

		    				// Select This Path
		    				d3.select(this).attr("d", getCurPath)
		    					.transition()
		    					.duration(300)
		    					.attr("d", makeArc(inRad, radius + pathOffset));
		    			})
		    			.on("mousemove", function(d){
		    					tooltip.style("top", (event.pageY-10)+"px")
		    						.style("left",(event.pageX+10)+"px");
		    			});
		    		}
		    	}
							
			});

  		});

		// Returns width of an element
		function getDivWidth(chart) {
    		return document.getElementById(chart).offsetWidth;
    	}
		
		// Sets the color of the chart
		function setColor(d,i) {
        	var radcolor = "";

        	if(settings.color == "crimson") {
				return crimsoncolors(i);
        	}
        	else if(settings.color == "socialmedia")
        	{
        		switch(true) {
			    case(d.data.source == "Instagram"):
			      radcolor = "#517fa4";
			      break;
			    case(d.data.source == "Facebook"):
			      radcolor = "#3b5998";
			      break;
			    case(d.data.source == "GooglePlus"):
			      radcolor = "#dd4b39";
			      break;
			    case(d.data.source == "YouTube"):
			      radcolor = "#bb0000";
			      break;
			    case(d.data.source == "Twitter"):
			      radcolor = "#00aced";
			      break;
			    case(d.data.source == "Reviews"):
			      radcolor = "#8ae278";
			      break;
			    case(d.data.source == "Weibo"):
			      radcolor = "#64BFDC";
			      break;
			 	default:
			 	  radcolor = crimsoncolors(i);
			 	  break;
			 	}
			 	return radcolor;
			}
			else
			{
				return "#ffffff";
			}
        }

        // Generates color code based on opacity
        function ColorLuminance(hex, lum) {
			hex = String(hex).replace(/[^0-9a-f]/gi, '');
			if (hex.length < 6) {
				hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
			}
			lum = lum || 0;

			var rgb = "#", c, i;
			for (i = 0; i < 3; i++) {
				c = parseInt(hex.substr(i*2,2), 16);
				c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
				rgb += ("00"+c).substr(c.length);
			}
			return rgb;
		}

		// Draws arc
		function makeArc(inRadius, outRadius) {
			return d3.svg.arc()
    			.innerRadius(inRadius)
    			.outerRadius(outRadius);
		}

		// Format any data value
		function formatNumber(val) {
    		if(settings.percent) {
    			formatNum = d3.format("%");
    			return formatNum(val / totalposts);
    		}
    		else {
    			formatNum = d3.format("s");
    			return formatNum(val);
    		}
		}

		function revFormatNumber(val) {
    		if(settings.percent) {
    			formatNum = d3.format("s");
    			return formatNum(val);
    		}
    		else {
    			formatNum = d3.format("%");
    			return formatNum(val / totalposts);
    		}
		}

	};

	$.fn.chOneBar = function( options ) {
        var settings = $.extend({
			data: [
                {type: 'Positive', value: 1556},
                {type: 'Neutral', value: 1256},
                {type: 'Negative', value: 5625}
            ]
        }, options );

        var totalVolume = 0,
        	chart = $(this).attr("id");

        for(var i = 0; i < settings.data.length; i++) {
        	totalVolume += settings.data[i].value;
        }

        return this.each(function() { 

        	var chartWidth = document.getElementById(chart).offsetWidth;
        	scale = chartWidth / totalVolume;

        	console.log(scale);

        	var posWidth = ((settings.data[0].value * scale) / chartWidth) * 100,
        		neuWidth = ((settings.data[1].value * scale) / chartWidth) * 100,
        		negWidth = ((settings.data[2].value * scale) / chartWidth) * 100;

        	// Bars 
        	$("#" + chart).append("<div class='chOneBarPositive'></div>");
        	$("#" + chart + " > .chOneBarPositive")
        		.css("width", posWidth + "%")
        		.mouseover(function() {
        			$( this ).parent().find(".chOneBarPositiveText")
        				.html("Positive <br /><br /><span>"+ 
        					formatNumber(settings.data[0].value) +
        					"<span style='font-size: 0.8em'> tweets</span></span>");
        		})
        		.mouseout(function() {
        			$( this ).parent().find(".chOneBarPositiveText")
        				.html("Positive <br /><br /><span>" + 
        					formatToPercent(posWidth) + "<span>%</span></span>");
        		});

        	$("#" + chart).append("<div class='chOneBarNeutral'></div>");
        	$("#" + chart + " > .chOneBarNeutral")
        		.css("width", (neuWidth - 2) + "%")
        		.mouseover(function() {
        			$( this ).parent().find(".chOneBarNeutralText")
        				.html("Neutral <br /><br /><span>"+ 
        					formatNumber(settings.data[1].value) +
        					"<span style='font-size: 0.8em'> tweets</span></span>");
        		})
        		.mouseout(function() {
        			$( this ).parent().find(".chOneBarNeutralText")
        				.html("Neutral <br /><br /><span>" + 
        					formatToPercent(neuWidth) + "<span>%</span></span>");
        		});
        	
        	$("#" + chart).append("<div class='chOneBarNegative'></div>");
        	$("#" + chart + " > .chOneBarNegative")
        		.css("width", negWidth + "%")
        		.mouseover(function() {
        			$( this ).parent().find(".chOneBarNegativeText")
        				.html("Negative <br /><br /><span>"+ 
        					formatNumber(settings.data[2].value) +
        					"<span style='font-size: 0.8em'> tweets</span></span>");
        		})
        		.mouseout(function() {
        			$( this ).parent().find(".chOneBarNegativeText")
        				.html("Negative <br /><br /><span>" + 
        					formatToPercent(negWidth) + "<span>%</span></span>");
        		});

        	// Text
        	$("#" + chart).append("<div class='chOneBarPositiveText'></div>");
        	$("#" + chart + " > .chOneBarPositiveText")
        		.html("Positive <br /><br /><span>" + 
        		formatToPercent(posWidth) + "<span>%</span></span>");

        	$("#" + chart).append("<div class='chOneBarNeutralText'></div>");
        	$("#" + chart + " > .chOneBarNeutralText")
        		.html("Neutral <br /><br /><span>" + 
        		formatToPercent(neuWidth) + "<span>%</span></span>");
        	
        	$("#" + chart).append("<div class='chOneBarNegativeText'></div>");
        	$("#" + chart + " > .chOneBarNegativeText")
        		.html("Negative <br /><br /><span>" + 
        		formatToPercent(negWidth) + "<span>%</span></span>");
			
        });

		function formatToPercent(val) {
			return val.toFixed(1);
		}

		function formatNumber(val) {
			return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

    };

}())









