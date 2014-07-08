// Label and Div Variables
var timeChartLabels = 
    "<p><strong>Hourly Breakdown</strong></p> " 
    + "<div id='timeChartDay' style='width: 50%; float:left'></div>"
    + "<div id='timeChartNight' style='width: 50%; float:right'></div>";

// Views
window.DetailsView = Backbone.View.extend({

    filter: "",             // Final Filter being passed to Collection
    newFilter: "",          // Custom Filter Box
    typeFilter: "",         // Sources Filter
    curNav: "genArea",      // Starts at General Information
    checkedSources: [],     // Sources Tracker
    events: {
        'click li#genButton': 'genArea',
        'click li#filButton': 'filArea',
        'click li#statButton': 'statArea'
    },
    initialize: function () {

        var url = document.URL,
            index = url.indexOf("#details/"),
            viewId = url.substr(index + 9, url.length);
        
        window.postCollection = new PostCollection({
            postID: viewId, 
            filter: this.filter
        });

        window.monitorResultsCollection = new MonitorResultsCollection({
                postID: viewId
        });

        postCollection.on("ready", function() {
            this.checkedSources = [];
            this.initRender();
        }, this);
    },
    initRender: function() {

        // Page Structure
        $(this.el).html(this.template(this.model.toJSON()));

        // Render Correct Menu
        this.genArea();
        
        // Render Inital Mentions
        this.initRenderMentions();

        console.log(postCollection.defaultDayData);

        // Render Chart
        $('#charts').append(timeChartLabels);
        $('#timeChartDay').chTimeChart({
            data: postCollection.defaultDayData
        });
        $('#timeChartNight').chTimeChart({
            day: false, 
            data: postCollection.defaultNightData
        });
        // End

        // Renders Rest of Page
        this.render();

        // Render Sentiment Bar
        this.renderSentimentBar();

        // When a source is clicked, run:
        var that = this;
        $(".source").change(function() {

            // Array of Checked Sources
            var arrSources = that.checkedSources;

            if(this.checked) { 
                arrSources.push(this.value);
            } 
            else
            {
                var indexToRm = arrSources.indexOf(this.value);
                arrSources.splice(indexToRm, 1);
            }

            // Generates Type Filter, Complete Filter, and rerenders
            genTypeFilter(that);
            writeFilter(that.newFilter, that.typeFilter, that);
            rerender(that);
        })
        // End

        // Generate Tags
        var modelAttr = this.model.attributes;
        var lenTags = modelAttr.tags.length;

        $('#allTags').append(modelAttr.tagsDisplay);

        if(lenTags == 0) {
            $('#allTags', this.el).html("No tags to display");
        }
        // End

        // When custom filter added
        $("#filterButton").click(function() {
            that.newFilter = $("#filterText").val();
            writeFilter(that.newFilter, that.typeFilter, that);
            rerender(that);
        });

        // Select All Checkboxes
        $("#selectAllSources").click(function() {
            var ind = 0;
            for(var s = 0; s < 11; s++) {
                ind = that.checkedSources.indexOf($('.source')[s].value);
                if(ind == -1) {
                    that.checkedSources.push($('.source')[s].value);
                }
            }
            writeFilter(that.newFilter, that.typeFilter, that);
            rerender(that);
        });

        // Deselect All Checkboxes
        $("#deselectAllSources").click(function() {
            that.checkedSources = [];
            that.typeFilter = "";
            writeFilter(that.newFilter, that.typeFilter, that);
            rerender(that);
        });

        $('#mentionsButton').click(function() {
            that.renderMentions();
        })


    },
    mentionsCounter: 0,
    initRenderMentions: function() {

        // Clear Mentions Space
        $('#mentions').html("");

        // Render Mentions
        if(this.hasPosts) {
            var counter = this.mentionsCounter;
            for(var z = counter; z < (counter + 5); z++) {
                $('#mentions', this.el)
                    .append(new PostsDisplay({
                        model: postCollection.at(z)
                    }).render().el);
                postCollection.at(z).on('fetch', this.render, this);
            }
            $("#mentions").scrollTop(100000);
        } else {
            $('#mentions', this.el).html("No mentions to display")
        }
        this.mentionsCounter = 0;
    },
    hasPosts: function() {
        if(postCollection.length > 0) {
            return true;
        }
        return false;
    },
    renderSentimentBar: function() {

        if(this.hasPosts) {
            // Displays Labels
            $('#charts')
                .append("<div id='senBar'></div>");
            $("#senBar")
                .append("<p id='senTitle'><strong>Sentiment Analysis</strong></p>");
            // Display Bars
            for(var z = 0; z < postCollection.numCategories; z++) {
                $('#senBar')
                    .append("<div class='individualPiece' style='background-color: "+getColor(z)+";width: "+postCollection.perScores[z]+"%';></div>");
            }
            $('#senBar').append("<div class='clearfix'></div><br />");
            // Display Legend
            for(var z = 0; z < postCollection.numCategories; z++) {
                $('#senBar').append("<small><label class='chart'><div class='square' style='background: "+getColor(z)+"'></div><b>"+postCollection.allCategories[z]+"</b></label>"+postCollection.perScores[z].toFixed(2)+"%</small><div class='clearfix'></div>");
            }
        }
    },
    adjustTweetTimesChart: function(val) {

        var data = [];
        var getSVG = "";

        if(val == 0) {
            data = postCollection.defaultDayData;
            getSVG = d3.select("#timeChartDay");
        }
        else if(val == 1) {
            data = postCollection.defaultNightData;
            getSVG = d3.select("#timeChartNight");
        }

        var maxVal = 0;
        for(var z = 0; z < data.length; z++) {
            if(data[z].value >= maxVal) {
                maxVal = data[z].value;
            }
        }

        var width = 100,
            inRad = width / 8,
            radius = (width / 2) - inRad - 12,
            scale = radius / maxVal;

        var paths = getSVG.selectAll("path")
                        .data(data)
                        .transition()
                        .duration(750)
                        .style("fill", function(d) {
                            return getColors(false, d.value, maxVal);
                        })
                        .attr("d", function(d) {
                            return makeArc(d.value,inRad, 0, width, scale, maxVal);
                        })
                        .attr("d", function(d) {
                            return makeArc(d.value,inRad, 1, width, scale, maxVal);
                        });
            


        // End Tweet Time Adjust

    },
    renderMentions: function() {

        // Loads Mentions if exist
        var len = postCollection.length;
        if(len > 0) {
            for(var z = this.mentionsCounter + 5; z < (this.mentionsCounter + 10); z++) {
                $('#mentions', this.el)
                    .append(new PostsDisplay({
                        model: postCollection.at(z)
                    }).render().el);
                postCollection.at(z).on('fetch', this.render, this);
            }
            this.mentionsCounter += 5;
            $("#mentions").scrollTop(100000);
        }
    },
    render: function () {

        this.adjustTweetTimesChart(0);
        this.adjustTweetTimesChart(1);

        // Keep current filter
        $("#filterText").text(this.newFilter);

        // Reset Button
        $("#clearFilter").click(function() {
            that.newFilter = "";
            writeFilter(that.newFilter, that.typeFilter, that);
            rerender(that);
        });

        // Checks Checkboxes
        for(var z = 0; z < this.checkedSources.length; z++) {
            for(var s = 0; s < 11; s++) {
                if($('.source')[s].value == this.checkedSources[z]) {
                    $('.source')[s].checked = "checked";
                }
            }
        }

        // Show tooltip
        $('#filters').popover({
            html:true,
            title: 'Possible Filters'
        });

        return this;
    },
    genArea: function() {
        // Display General Information Tab
        $("#generalInformation").css("display", "block");
        $("#filter").css("display", "none");
        $("#monResults").css("display", "none");

        $("#genButton").addClass("active");
        $("#filButton").removeClass("active");
        $("#statButton").removeClass("active");

        this.curNav = "genArea";
    },
    filArea: function() {
        // Display Filter Tab
        $("#generalInformation").css("display", "none");
        $("#filter").css("display", "block");
        $("#monResults").css("display", "none");

        $("#genButton").removeClass("active");
        $("#filButton").addClass("active");
        $("#statButton").removeClass("active");

        this.curNav = "filArea";
    }
});

window.PostsDisplay = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}

function getColor(index) {
    var radcolor = ["#cf2229","#f48436","#ffd900","#c32635",
                    "#ffc130", "#fff100","#57b6dd","#439dc0",
                    "#1b75bb","#10698B"];
    return radcolor[index];
}

function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function writeFilter(newFilter, typeFilter, that) {
    if(newFilter == "") {
        that.filter = typeFilter;
    } else if(typeFilter == "") {
        that.filter = newFilter;
    } else if(newFilter != "" && typeFilter != ""){
        that.filter = typeFilter + "|" + newFilter;
    }
}

function genTypeFilter(that) {
    var typeFilter = "";
    for(var z = 0; z < that.checkedSources.length; z++) {
        if(z == 0) {
            typeFilter = "type:" + that.checkedSources[0];
        }
        else {
            typeFilter += "," + that.checkedSources[z];
        }
        that.typeFilter = typeFilter;
    }
    if(that.checkedSources.length == 0) {
        that.typeFilter = "";
    }
}
function rerender(that) {
    window.postCollection = new PostCollection({
        postID: that.model.id, 
        filter: that.filter
    });
    postCollection.on("sync", function() {

        var len = postCollection.length;

        if(len > 0) {
            //that.loadTweetTimes();
            that.render();
            that.initRenderMentions();
            $('#mentionsButton').css("display", "block");
        }
        else {
            $('#mentions', that.el).html("No mentions to display");
            $('#mentionsButton').css("display", "none");
        }

    }, that);
}

function makeArc(d, inRad, outRadius, width, scale, maxVal){

    var tenPercent = maxVal / 10;

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
        return (d * scale) + inRad; }
    })
    .startAngle(toRadians(-45))
    .endAngle(toRadians(-15))();
}

function toRadians(ang) {
  return ang * (Math.PI / 180);
}

function toDegrees(ang) {
  return ang / (Math.PI / 180);
}


function getColors(num, val, maxVal) {
      colorScale = maxVal / 6,
      color = "";

  // Blue Scale
  if(num == 1) {

  switch(true) {
    case(val >= 0 && val < colorScale):
      color = "#c4c4c4";
      break;
    case(val >= colorScale && val < colorScale * 2):
      color = "#57b6dd";
      break;
    case(val >= colorScale *2 && val < colorScale * 3):
      color = "#439dc0";
      break;
    case(val >= colorScale *3 && val < colorScale * 4):
      color = "#10698B";
      break;
    case(val >= colorScale *4 && val < colorScale * 5):
      color = "#1b75bb";
      break;
    case(val >= colorScale *5 && val <= colorScale * 6):
      color = "#166fac";
      break;
  }
  return color;

  }
  else{

  switch(true) {
    case(val >= 0 && val < colorScale):
      color = "#e2e2e2";
      break;
    case(val >= colorScale && val < colorScale * 2):
      color = "#fff100";
      break;
    case(val >= colorScale *2 && val < colorScale * 3):
      color = "#ffd900";
      break;
    case(val >= colorScale *3 && val < colorScale * 4):
      color = "#ffc130";
      break;
    case(val >= colorScale *4 && val < colorScale * 5):
      color = "#f48436";
      break;
    case(val >= colorScale *5 && val <= colorScale * 6):
      color = "#c32635";
      break;
  }
  return color;
}
}