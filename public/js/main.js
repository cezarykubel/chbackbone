var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "about"             : "about",
        "monitors"          : "list"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

    list: function (id) {
        if (!this.monitorListView) {
            this.monitorListView = new MonitorListView();
        }
        $('#content').html(this.monitorListView.el);
        this.headerView.selectMenuItem('list-menu');
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HeaderView', 'HomeView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
