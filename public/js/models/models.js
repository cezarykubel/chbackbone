window.Monitor = Backbone.Model.extend({
	urlRoot: "/monitors",
	idAttribute: "id",

	defaults: {
		id: '',
		name:'',
		description: '',
		type: '',
		enabled: '',
		resultsStart: '',
		resultsEnd: '',
		tags: []
	}
});

window.MonitorCollection = Backbone.Collection.extend({
	model: Monitor,
	url: "/api/monitor/list",
	initialize: function() {
		this.fetch();
	},
	parse: function(data){
		return data.monitors;
	}
})