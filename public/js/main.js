var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "about"             : "about"
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
