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
    },
    statArea: function() {
        // Display Monitor Statistics
        $("#generalInformation").css("display", "none");
        $("#filter").css("display", "none");
        $("#monResults").css("display", "block");

        $("#genButton").removeClass("active");
        $("#filButton").removeClass("active");
        $("#statButton").addClass("active");

        this.curNav = "statArea";
    },
    initialize: function () {
        window.postCollection = new PostCollection({
            postID: this.model.id, 
            filter: this.filter
        });
        window.monitorResultsCollection = new MonitorResultsCollection({
                postID: this.model.id
        });
        postCollection.on("sync", this.initRender, this);
        monitorResultsCollection.on("sync", this.initRender, this);

    },
    renderSentimentBar: function() {
        var len = postCollection.length;
        if(len > 0) {
            var allCats = [];           // Category Names
            var allCatsScores = [];     // Category Scores

            // Displays Labels
            $('#charts')
                .append("<div id='senBar'></div>");
            $("#senBar")
                .append("<p id='senTitle'><strong>Sentiment Analysis</strong></p>");

            // Store all Category Names
            postCollection.at(0)
                .attributes
                .categoryScores
                .forEach(function (entry){
                    allCats.push(entry.categoryName);
                });

            // Calculate Category Score Average
            for(var s = 0; s < len; s++) {
                for(var z = 0; z < allCats.length; z++) {
                    if(allCatsScores[z] == undefined) {
                            allCatsScores[z] = 0;
                    }
                    if(postCollection.at(s)
                        .attributes.categoryScores.length > 0) {
                            allCatsScores[z] += Math.round(postCollection.at(s)
                                                    .attributes
                                                    .categoryScores[z]
                                                    .score * 10 ) / 10;
                    }
                }
            }

            // Get total count of scores and percentages
            var totalCount = 0,
                totPercentage = 0;

            for(var z = 0; z < allCatsScores.length; z++) {
                totalCount += allCatsScores[z];
            }

            for(var z = 0; z < allCats.length; z++) {
                allCatsScores[z] /= totalCount;
                allCatsScores[z] = ((allCatsScores[z]) * 100);
                $('#senBar')
                    .append("<div class='individualPiece' style='background-color: "+getColor(z)+";width: "+allCatsScores[z]+"%';></div>");
            }
            $('#senBar').append("<div class='clearfix'></div><br />");

            // Add Legend
            for(var z = 0; z < allCats.length; z++) {
                $('#senBar').append("<small><label class='chart'><div class='square' style='background: "+getColor(z)+"'></div><b>"+allCats[z]+"</b></label>"+allCatsScores[z].toFixed(2)+"%</small><div class='clearfix'></div>");
            }

        } // End Sentiment Analysis Bar
    },
    defaultDayData :  
    [
        { "time" : 12 , value : 0  },
        { "time" : 1  , value : 0  },
        { "time" : 2  , value : 0 },
        { "time" : 3  , value : 0 },
        { "time" : 4  , value : 0 },
        { "time" : 5  , value : 0 },
        { "time" : 6  , value : 0 },
        { "time" : 7  , value : 0 },
        { "time" : 8  , value : 0 },
        { "time" : 9  , value : 0 },
        { "time" : 10 , value : 0 },
        { "time" : 11 , value : 0  }
    ],
    defaultNightData :  
    [
        { "time" : 12 , value : 0  },
        { "time" : 1  , value : 0  },
        { "time" : 2  , value : 0 },
        { "time" : 3  , value : 0 },
        { "time" : 4  , value : 0 },
        { "time" : 5  , value : 0 },
        { "time" : 6  , value : 0 },
        { "time" : 7  , value : 0 },
        { "time" : 8  , value : 0 },
        { "time" : 9  , value : 0 },
        { "time" : 10 , value : 0 },
        { "time" : 11 , value : 0  }
    ],
    loadTweetTimes: function() {
        console.log("Load Tweet Times");
        var len = postCollection.length;
        for(var z = 0; z < len; z++) {
            var getTime = postCollection.models[z].attributes.date;
            getTime = new Date(getTime);
            getTime = getTime.getUTCHours();
            if(getTime <= 11) {
                this.defaultNightData[getTime].value += 1; 
            }
            else if(getTime > 11) {
                getTime = getTime - 12;
                this.defaultDayData[getTime].value += 1;
            }
        }
    },
    mentionsCounter: 0,
    renderMentions: function() {
        // Loads Mentions if exist
        var len = postCollection.length;
        if(len > 0) {
            for(var z = this.mentionsCounter; z < (this.mentionsCounter + 5); z++) {
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
    initRender: function() {
        // Page Structure
        $(this.el).html(this.template(this.model.toJSON()));

        this.render();

        this.loadTweetTimes();

        // Render Chart
        $('#charts').append("<p><strong>Tweet Times</strong></p>");
        $('#charts').append("<div id='timeChartDay' style='width: 50%; float:left'></div>");
        $('#charts').append("<div id='timeChartNight' style='width: 50%; float:right'></div>");
        $('#timeChartDay').chTimeChart({data: this.defaultDayData});
        $('#timeChartNight').chTimeChart({day: false, data: this.defaultNightData});

        this.renderSentimentBar();

            

    },
    render: function () {

        // Load correct navigation page
        if(this.curNav == "genArea") {
            this.genArea();
        }
        else if(this.curNav == "filArea") {
            this.filArea();
        }
        else if(this.curNav == "statArea") {
            this.statArea();
        }

        // Keep current filter
        $("#filterText").text(this.newFilter);

        // Checks Checkboxes
        for(var z = 0; z < this.checkedSources.length; z++) {
            for(var s = 0; s < 11; s++) {
                if($('.source')[s].value == this.checkedSources[z]) {
                    $('.source')[s].checked = "checked";
                }
            }
        }

        //
        // Do stuff is something is pressed
        //

        var that = this;

        // When a source is clicked, run:
        $(".source").change(function() {
            if(this.checked) {
                that.checkedSources.push(this.value);
            }
            else
            {
                var indexToRemove = that.checkedSources.indexOf(this.value);
                that.checkedSources.splice(indexToRemove, 1);
            }

            // Generates Type Filter, Complete Filter, and rerenders
            genTypeFilter(that);
            writeFilter(that.newFilter, that.typeFilter, that);
            rerender(that);
        })

        // When custom filter added
        $("#filterButton").click(function() {
            that.newFilter = $("#filterText").val();
            writeFilter(that.newFilter, that.typeFilter, that);
            rerender(that);
        });

        // Reset Button
        $("#clearFilter").click(function() {
            that.newFilter = "";
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

        // Show tooltip
        $('#filters').popover({
            html:true,
            title: 'Possible Filters'
        });

        // Get Number of Posts
        var len = postCollection.length;

        // Load Mentions Default
        if(len > 0) {
            this.renderMentions();
        }
        else {
            $('#allPosts', this.el).html("No mentions to display");
        }
        
        $('#mentionsButton').click(function() {
            that.renderMentions();
        })

        // Gets Number of Tags
        var lenTags = this.model.attributes.tags.length;

        // Loads Tags if exist
        for(var z = 0; z < lenTags; z++) {
            for(var z = 0; z < lenTags; z++) {
                $('#allTags', this.el)
                    .append(new TagsDisplay({
                        model: new Tags({
                            name: this.model.attributes.tags[z]
                        })
                    }).render().el);
                postCollection.at(z).on('fetch', this.render, this);
            }
        }
        if(lenTags == 0) {
            $('#allTags', this.el).html("No tags to display");
        }

        // Load Monitor Volume
        if(this.model.attributes.type == "Buzz") {

            // Monitor Volume
            var lenMonitors = monitorResultsCollection.length;
            var totalPosts = 0;

            for(var z = 0; z < lenMonitors; z++) {
                totalPosts += monitorResultsCollection.models[z]
                                .attributes.numberOfDocuments;
            }

            $('#monResults').append("<h4>Monitor Results</h4><hr />");
            $('#monResults').append("<p><label><strong>Total Volume:</strong></label> "+addCommas(totalPosts)+"</p>");

        }

        return this;
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

window.TagsDisplay = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    template: _.template("<li><%= name.name %></li>"),

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
        that.render();
    }, that);
}