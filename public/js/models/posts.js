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
	id: 0,
	url: "/api/monitor/posts?id=" + this.id,
	initialize: function() {
		this.fetch();
	},
	parse: function(data){
		return data.posts;
	}
})