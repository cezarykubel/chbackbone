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

window.DetailsView = Backbone.View.extend({

    initialize: function () {
        window.postCollection = new PostCollection({postID: this.model.id});

        postCollection.on("sync", this.render, this);
    },

    render: function () {
        // Page Structure
        $(this.el).html(this.template(this.model.toJSON()));

        // Number of Tags
        var len = postCollection.length;

        // Posts 10 Tweets in Recent Tweets
        if(len > 0) {
            for(var z = 0; z < 10; z++) {
                $('#allPosts', this.el)
                    .append(new PostsDisplay({model: postCollection.at(z)}).render().el);

                postCollection.at(z).on('fetch', this.render, this);
            }
        }
        else
        {
            $('#allPosts', this.el).html("No tweets to display");
        }

        var lenTags = this.model.attributes.tags.length;

        for(var z = 0; z < lenTags; z++)

        // All Tags
        if(lenTags > 0) {
            for(var z = 0; z < lenTags; z++) {
                $('#allTags', this.el)
                    .append(new TagsDisplay({model: new Tags({name: this.model.attributes.tags[z]})}).render().el);

                postCollection.at(z).on('fetch', this.render, this);
            }
        }
        else
        {
            $('#allPosts', this.el).html("No tweets to display");
        }




        /* ~~~~~~~~~~~~~ */
        // Sentiment Bar //
        /* ~~~~~~~~~~~~~ */

        if(len > 0) {  

            var senPos = 0,
                senNeu = 0,
                senNeg = 0;

            var v1 = [];
            var allCats = [];
            var allCatsScores = [];

                postCollection.at(0).attributes.categoryScores.forEach(function (entry){
                    v1.push(entry.categoryName);
                    allCats.push(entry.categoryName);
                });

            $('#charts').append("<div id='senBar'></div>");

            $("#senBar").append("<p id='senTitle'><strong>Sentiment Analysis</strong></p>");

            for(var s = 0; s < postCollection.length; s++) {
                
                for(var z = 0; z < allCats.length; z++) {

                    if(allCatsScores[z] == undefined) {
                            allCatsScores[z] = 0;
                    }

                    if(postCollection.at(s).attributes.categoryScores.length > 0) {
                        allCatsScores[z] += Math.round(postCollection.at(s).attributes.categoryScores[z].score * 10 ) / 10;
                    }
                }
            }

            var totalCount = 0,
                totPercentage = 0;
            for(var z = 0; z < allCatsScores.length; z++) {
                totalCount += allCatsScores[z];
            }

            for(var z = 0; z < allCats.length; z++) {
                allCatsScores[z] /= totalCount;
                allCatsScores[z] = ((allCatsScores[z]) * 100).toFixed(2) + "%";
                $('#senBar').append("<div class='individualPiece' style='background-color: "+getColor(z)+";width: "+allCatsScores[z]+"'></div>");
            }
            $('#senBar').append("<div class='clearfix'></div>");

            for(var z = 0; z < allCats.length; z++) {
               
                $('#senBar').append("<li>"+allCats[z]+" - "+allCatsScores[z]+"</li>");
            }

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
        console.log(this.model);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});