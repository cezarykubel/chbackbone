window.DetailsView = Backbone.View.extend({

    initialize: function () {
        window.postCollection = new PostCollection({postID: this.model.id});
        postCollection.on("sync", this.render, this);
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

