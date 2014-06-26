function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}

window.DetailsView = Backbone.View.extend({

    initialize: function () {
        window.postCollection = new PostCollection({postID: this.model.id});

        postCollection.on("sync", this.render, this);
    },

    render: function () {
        // Page Structure
        $(this.el).html(this.template(this.model.toJSON()));

        // Number of Posts
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

        /* ~~~~~~~~~~~~~ */
        // Sentiment Bar //
        /* ~~~~~~~~~~~~~ */

        if(this.model.attributes.type == "Buzz") {

            $("#senBar").append("<p><strong>Sentiment Analysis</strong></p>");

            var senPos = 0,
                senNeu = 0,
                senNeg = 0;

            var v1 = [postCollection.at(0).attributes.categoryScores[0].categoryName,
                         postCollection.at(0).attributes.categoryScores[1].categoryName,
                         postCollection.at(0).attributes.categoryScores[2].categoryName];

            var senPosIndex = v1.indexOf("Basic Positive"),
                senNeuIndex = v1.indexOf("Basic Neutral"),
                senNegIndex = v1.indexOf("Basic Negative");

            console.log("senPosIndex: " + senPosIndex);
            console.log("senNeuIndex: " + senNeuIndex);
            console.log("senNegIndex: " + senNegIndex);

            console.log("senNeu: " + postCollection.at(0).attributes.categoryScores[senNeuIndex].score)

            for(var s = 0; s < len; s++) {

                senPos += postCollection.at(z).attributes.categoryScores[senPosIndex].score;
                senNeu += postCollection.at(z).attributes.categoryScores[senNeuIndex].score;
                senNeg += postCollection.at(z).attributes.categoryScores[senNegIndex].score;

            }

            senPos /= len;
            senNeu /= len;
            senNeg /= len;

            senPos = (senPos * 100).toFixed(1) + "%";
            senNeu = (senNeu * 100).toFixed(1) + "%";
            senNeg = (senNeg * 100).toFixed(1) + "%";


            $('#senBar').append("<div class='senPos' style='width: "+senPos+"'></div>");
            $('#senBar').append("<div class='senNeu' style='width: "+senNeu+"'></div>");
            $('#senBar').append("<div class='senNeg' style='width: "+senNeg+"'></div>");
            $('#senBar').append("<div class='clearfix'></div>");

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