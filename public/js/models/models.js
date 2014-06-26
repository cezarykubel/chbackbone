function formatDate(date) {
	var months = ["January", "February", "March", "April", 
				  "May", "June", "July", "August", "September", 
				  "October", "November", "December"];

	var hours = date.getHours();
	var minutes = date.getMinutes();
	var AMPM = "AM";
	if(hours > 12) {
		hours = hours - 12;
		AMPM = "PM";
	}
	if(minutes < 10) {
		minutes = "0" + minutes;
	}

	return months[date.getMonth()] + " " + date.getDate() + ", " 
			+ date.getFullYear() + " at " + hours + ":" 
			+ minutes + " " + AMPM;
}

window.Monitor = Backbone.Model.extend({
	urlRoot: "/monitors",
	idAttribute: "id",

	defaults: {
		id: '',
		name:'',
		description: '',
		type: '',
		enabled: '',
		enabledDisplay: '',
		resultsStart: '',
		resultsEnd: '',
		resultsStartDisplay: '',
		resultsEndDisplay: '',
		tags: []
	},
	initialize: function() {
		var d = new Date(this.attributes.resultsStart);
		var d2 = new Date(this.attributes.resultsEnd);
		var typeOrig = this.attributes.type;
		var enabledOrig = (this.attributes.enabled).toString();
		this.attributes.resultsStartDisplay = formatDate(d);
		this.attributes.resultsEndDisplay = formatDate(d2);
		this.attributes.type = typeOrig.charAt(0) + typeOrig.slice(1).toLowerCase();
		this.attributes.enabledDisplay = enabledOrig.charAt(0).toUpperCase() + enabledOrig.slice(1);
	}
});

window.MonitorCollection = Backbone.Collection.extend({
	model: Monitor,
	url: "/api/monitor/list",
	initialize: function() {
		console.log(this);
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
	url: null,
	initialize: function(options) {
		this.postID = options.postID;
		this.url = "/api/monitor/posts?id=" + options.postID;
		this.fetch();
	},
	parse: function(data){
		return data.posts;
	}
});
