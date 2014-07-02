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

		if(this.attributes.resultsStart == "") {
			this.attributes.resultsStartDisplay = "Not Avaliable";
			this.attributes.resultsEndDisplay = "Not Available";
		}
		else
		{
			this.attributes.resultsStartDisplay = formatDate(d);
			this.attributes.resultsEndDisplay = formatDate(d2);
		}

		this.attributes.type = typeOrig.charAt(0) + typeOrig.slice(1).toLowerCase();
		this.attributes.enabledDisplay = enabledOrig.charAt(0).toUpperCase() + enabledOrig.slice(1);
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
		authorDisplay: '',
		title: '',
		location: '',
		language: '',
		type: '',
		typeDisplay: '',
		categoryScores: [],
		authorKlout: 0,
		authorPosts: 0,
		authorsFollowing: 0,
		authorsFollowers: 0,
		authorGender: ''
	},

	initialize: function(){
		this.attributes.authorDisplay = formatAuthor(this.attributes.author);
		this.attributes.typeDisplay = formatType(this.attributes.type, this.attributes.url);
	}
});

window.Tags = Backbone.Model.extend({
	defaults: {
		name: ''
	}
});

window.PostCollection = Backbone.Collection.extend({
	model: Post,
	url: null,
	initialize: function(options) {
		this.postID = options.postID;
		console.log(options.filter);
		this.url = "/api/monitor/posts?id=" + options.postID + "&filter="+options.filter+"&extendLimit=true";
		this.fetch();
	},
	parse: function(data){
		return data.posts;
	}
});

window.MonitorResults = Backbone.Model.extend({
	defaults: {
		startDate: '',
		endDate: '',
		creationDate: '',
		numberOfDocuments: '',
		numberOfReleventDocuments: '',
		categories: [],
	}
});

window.MonitorResultsCollection = Backbone.Collection.extend({
	model: MonitorResults,
	url: null,
	initialize: function(options) {
		this.postID = options.postID;
		this.url = "/api/monitor/results?id=" + options.postID;
		this.fetch();
	},
	parse: function(data){
		return data.results;
	}
});

function formatDate(date) {

	var months = ["January", "February", "March", "April", 
				  "May", "June", "July", "August", "September", 
				  "October", "November", "December"];

	var hours = date.getUTCHours();
	var minutes = date.getUTCMinutes();
	var AMPM = "AM";
	if(hours > 12) {
		hours = hours - 12;
		AMPM = "PM";
	}
	if(minutes < 10) {
		minutes = "0" + minutes;
	}
	if(hours == 0) {
		hours = "12";
	}

	return months[date.getUTCMonth()] + " " + date.getUTCDate() + ", " 
			+ date.getUTCFullYear() + " at " + hours + ":" 
			+ minutes + " " + AMPM;
}

function formatAuthor(author) {
	var beg = author.indexOf("(");

	if(beg != -1) {
		beg = (author.indexOf("(") + 1);
		end = author.indexOf(")");
	}
	else{
		beg = 0;
		end = author.length - 1;
	}

	return author.substring(beg, end);	
}

function formatType(type, url) {
	if(type != "Custom") {
		return type;
	}	
	else
	{
		var index = url.indexOf(".");
		var sub = url.substring(7, index);
		return sub.charAt(0).toUpperCase() + sub.slice(1);
	}
}

