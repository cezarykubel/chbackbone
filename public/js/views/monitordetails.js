window.DetailsView = Backbone.View.extend({


    filter: "",
    newFilter: "",
    typeFilter: "",
    curNav: "filArea",
    checkedSources: [],

    events: {
        'click li#genButton': 'genArea',
        'click li#filButton': 'filArea',
        'click li#statButton': 'statArea'
    },

    genArea: function() {
        $("#generalInformation").css("display", "block");
        $("#filter").css("display", "none");
        $("#monResults").css("display", "none");

        $("#genButton").addClass("active");
        $("#filButton").removeClass("active");
        $("#statButton").removeClass("active");

        this.curNav = "genArea";
    },

    filArea: function() {
        $("#generalInformation").css("display", "none");
        $("#filter").css("display", "block");
        $("#monResults").css("display", "none");

        $("#genButton").removeClass("active");
        $("#filButton").addClass("active");
        $("#statButton").removeClass("active");

        this.curNav = "filArea";
    },

    statArea: function() {
        $("#generalInformation").css("display", "none");
        $("#filter").css("display", "none");
        $("#monResults").css("display", "block");

        $("#genButton").removeClass("active");
        $("#filButton").removeClass("active");
        $("#statButton").addClass("active");

        this.curNav = "statArea";
    },

    initialize: function () {
        window.postCollection = new PostCollection({postID: this.model.id, filter: this.newFilter});
        window.monitorResultsCollection = 
            new MonitorResultsCollection({postID: this.model.id});

        postCollection.once("sync", function() { 
            monitorResultsCollection.once("sync", this.render, this);
        }, this);
        

    },

    render: function () {

        // Page Structure
        $(this.el).html(this.template(this.model.toJSON()));

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

        var typeFilter = "";

        for(var z = 0; z < this.checkedSources.length; z++) {
            
            if(z == 0) {
                typeFilter = "type: " + this.checkedSources[0];
            }
            else {
                typeFilter += "," + this.checkedSources[z];
            }

            this.typeFilter = typeFilter;
        }
        if(this.checkedSources.length == 0) {
            this.typeFilter = "";
        }

        // Keep current filter
        $("#filterText").text(this.newFilter + "|" + this.typeFilter);

        var that = this;
        

        $(".source").change(function() {
            if(this.checked) {

                that.checkedSources.push(this.value);

                var hasTypeFilter = that.filter.indexOf("type:");
                var hasOtherFilters = that.filter.indexOf("|");

                if(that.filter == "") {
                    // Has no filters
                    that.filter = "type:" + this.value;
                }
                else if(hasTypeFilter != -1 && hasOtherFilters == -1) {
                    // Has type filter but not other filters
                    that.filter += "," + this.value;
                }
                else if(that.filter != "" && hasTypeFilter == -1) {
                    // Has other filters but not type
                    that.filter += "|type:" + this.value;
                }
                else if(hasTypeFilter != -1 && hasOtherFilters != -1) {
                    // Has type and other filters
                    var first = that.filter.substr(0,(hasTypeFilter + 5));
                    var second = that.filter.substr((hasTypeFilter + 5), that.filter.length);
                    var set = first + this.value + "," + second;
                    that.filter = set;
                }
                else {
                    console.log("There was an error (213)");
                }
                
                window.postCollection = new PostCollection({postID: that.model.id, filter: this.newFilter});
                postCollection.on("sync", function() {
                    that.render();
                }, that);

            }
            else
            {

                var valLength = this.value.length;
                var indexOfVal = that.filter.indexOf(this.value);

                var first = "",
                    second = "";

                if(that.checkedSources.length > 0) {
                    if(this.value == that.checkedSources[0]) {
                        first = that.filter.substr(0, indexOfVal);
                        second = that.filter.substr((indexOfVal + valLength) + 1, that.filter.length);
                    } else {
                        first = that.filter.substr(0, indexOfVal - 1);
                        second = that.filter.substr((indexOfVal + valLength), that.filter.length);
                    }
                }
                
                that.filter = first + second;

                var indexToRemove = that.checkedSources.indexOf(this.value);
                that.checkedSources.splice(indexToRemove, 1);

                window.postCollection = new PostCollection({postID: that.model.id, filter: this.newFilter});
                postCollection.on("sync", function() {
                    that.render();
                }, that);
            }

            console.log(that.checkedSources);
        })

        for(var z = 0; z < this.checkedSources.length; z++) {
            for(var s = 0; s < 11; s++) {
                if($('.source')[s].value == this.checkedSources[z]) {
                    $('.source')[s].checked = "checked";
                }
            }
        }

        $("#filterButton").click(function() {
            var filterText = $("#filterText").val();
            window.postCollection = new PostCollection({postID: that.model.id, filter: filterText});
            postCollection.on("sync", function() {
                this.newFilter = filterText;
                that.render();
            }, that);
        });

        // Get Number of Posts
        var len = postCollection.length;

        // Loads Mentions if exist
        if(len > 0) {
            for(var z = 0; z < 5; z++) {
                $('#allPosts', this.el)
                    .append(new PostsDisplay({
                        model: postCollection.at(z)
                    }).render().el);
                postCollection.at(z).on('fetch', this.render, this);
            }
        }
        else {
            $('#allPosts', this.el).html("No mentions to display");
        }

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

        // Load Sentiment Analysis Bar
        if(len > 0) {  

            var allCats = [];           // Category Names
            var allCatsScores = [];     // Category Scores

            // Store all Category Names
            postCollection.at(0)
                .attributes
                .categoryScores
                .forEach(function (entry){
                    allCats.push(entry.categoryName);
                });

            // Displays Labels
            $('#charts')
                .append("<div id='senBar'></div>");
            $("#senBar")
                .append("<p id='senTitle'><strong>Sentiment Analysis</strong></p>");

            // Calculate Category Score Average
            for(var s = 0; s < len; s++) {
                for(var z = 0; z < allCats.length; z++) {
                    if(allCatsScores[z] == undefined) {
                            allCatsScores[z] = 0;
                    }
                    if(postCollection.at(s).attributes.categoryScores.length > 0) {
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

        // Load Monitor Volume
        if(this.model.attributes.type == "Buzz") {

            // Monitor Volume
            var lenMonitors = monitorResultsCollection.length;
            var totalPosts = 0;

            for(var z = 0; z < lenMonitors; z++) {
                totalPosts += monitorResultsCollection.models[z].attributes.numberOfDocuments;
            }

            $('#monResults').append("<h4>Monitor Results</h4><hr />");
            $('#monResults').append("<p><label><strong>Total Volume:</strong></label> "+addCommas(totalPosts)+"</p>");

        }

        // Load Tweet Times
        if(len > 0) {  

            var day_data = [
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
            ];

            var night_data = [
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
            ];

            for(var z = 0; z < len; z++) {
                var getTime = postCollection.models[z].attributes.date;
                getTime = new Date(getTime);
                getTime = getTime.getUTCHours();

                if(getTime <= 11) {
                    night_data[getTime].value += 1; 
                }
                else if(getTime > 11) {
                    getTime = getTime - 12;
                    day_data[getTime].value += 1;
                }
            }

            $('#charts').append("<p><strong>Tweet Times</strong></p>");
            $('#charts').append("<div id='timeChartDay' style='width: 50%; float:left'></div>");
            $('#charts').append("<div id='timeChartNight' style='width: 50%; float:right'></div>");
            $('#timeChartDay').chTimeChart({data: day_data});
            $('#timeChartNight').chTimeChart({day: false, data: night_data});
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