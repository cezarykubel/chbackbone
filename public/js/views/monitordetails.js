window.DetailsView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
        console.log(this.id);
        $('#monitorDetails', this.el)
            .append(new DetailsItemView({model: monitorCollection.get(this.id)})
            .render().el);
        
        return this;
    }

});

window.DetailsItemView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        console.log(this.model.toJSON());
        this.setElement(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change"        : "change"
    },

    change: function (event) {
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
    }


});