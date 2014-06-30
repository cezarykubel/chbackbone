window.DetailsView = Backbone.View.extend({

    initialize: function () {
        window.postCollection = new PostCollection({postID: this.model.id});
        window.monitorResultsCollection = 
            new MonitorResultsCollection({postID: this.model.id});

        postCollection.on("sync", function() {
            monitorResultsCollection.on("sync", this.render, this);
        }, this);

    },

    render: function () {

        // Page Structure
        $(this.el).html(this.template(this.model.toJSON()));

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