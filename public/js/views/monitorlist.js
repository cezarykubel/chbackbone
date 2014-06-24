window.MonitorListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html("<ul class='thumbnails'></ul>");

        var len = monitorCollection.length;

        for(var i = 0; i < len; i++) {

            $('.thumbnails', this.el)
                .append(new MonitorListItemView({model: monitorCollection.at(i)})
                .render().el);
        }

        return this;
    }
});

window.MonitorListItemView = Backbone.View.extend({

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    template: _.template("<li class='thumbnail'><%= name %></li>"),

    render: function () {
        $(this.el).html(this.template(this.model.attributes));
        return this;
    }

});
