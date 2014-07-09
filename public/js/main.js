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
        if (!window.monitorCollection) {
            window.monitorCollection = new monitorCollection();
        }
        var that = this;

        if(!this.monitorListView) {

            that.monitorListView = new MonitorListView();

            monitorCollection.on("sync", function(){

                $('#content').html(that.monitorListView.el);
                that.headerView.selectMenuItem('list-menu');

            });

            $('#content').html(that.monitorListView.el);
            that.headerView.selectMenuItem('list-menu');

        }
        else {

            that.monitorListView = new MonitorListView();

            $('#content').html(that.monitorListView.el);
            that.headerView.selectMenuItem('list-menu');

        }
        
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    },

    details: function (id) {

        if (!window.monitorCollection) {
            window.monitorCollection = new monitorCollection();
        }
        var that = this;

        if(!this.monitorListView) {

            that.monitorListView = new MonitorListView();

            monitorCollection.on("sync", function(){

                var monitor = monitorCollection.get(id);
                $("#content").html(new DetailsView({
                    model: monitor
                }).el)

            });

            var monitor = monitorCollection.get(id);
            $("#content").html(new DetailsView({
                model: monitor
            }).el)

        }
        else {

            that.monitorListView = new MonitorListView();

            var monitor = monitorCollection.get(id);
            $("#content").html(new DetailsView({
                model: monitor
            }).el)

        }
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
        'PostsDisplay'
    ], 
    function() {
    app = new AppRouter();
    Backbone.history.start();
});
