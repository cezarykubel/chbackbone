window.MonitorListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());

        var len = monitorCollection.length;
        
        for(var i = 0; i < len; i++) {
            $('#allMonitors', this.el)
                .append(new MonitorListItemView({model: monitorCollection.at(i)}).render().el);
        }

        return this;
    }
});

window.MonitorListItemView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        this.setElement(this.template(this.model.toJSON()));
        return this;
    }

});
