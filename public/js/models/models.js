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
});

window.Post = Backbone.Model.extend({
	defaults: {
		url: '',
		data:'',
		author: '',
		title: '',
		location: '',
		language: '',
		type: '',
		categoryScores: [],
		authorKlout: 0,
		authorPosts: 0,
		authorsFollowing: 0,
		authorsFollowers: 0,
		authorGender: ''
	}
});

window.PostCollection = Backbone.Collection.extend({
	model: Post,
	postID: 0,
	url: "/api/monitor/posts?id=" + this.postID,
	initialize: function() {
		console.log(this.url);
		this.fetch();
	},
	parse: function(data){
		
		return data.posts;
	}
})