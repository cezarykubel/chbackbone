window.DetailsView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        console.log(this.posts);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});