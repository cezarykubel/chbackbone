var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "about"             : "about",
        "monitors"          : "list",
        "details/:id"          : "details"
    },

    initialize: function () {
        window.monitorCollection = new MonitorCollection();
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
    },

    details: function (id) {
        if (!this.detailsView) {
            this.detailsView = new DetailsView({id:id});
        }
        $('#content').html(this.detailsView.el);
    }

});

utils.loadTemplate(
    [
        'HeaderView', 
        'HomeView', 
        'AboutView', 
        'MonitorListView',
        'MonitorListItemView',
        'DetailsView',
        'DetailsItemView'
    ], 
    function() {
    app = new AppRouter();
    Backbone.history.start();
});
