var notAvailable = "Not Available",
	months =	["January",	"February",	"March",	"April", 
			  	 "May", 	"June", 	"July", 	"August", 
			  	 "September","October", "November", "December"];
window.Monitor = Backbone.Model.extend({
	urlRoot: "/monitors",
	idAttribute: "id",
	defaults: {
		id: '',
		name:'',
		description: '',
		type: '',
		typeDisplay: '',
		enabled: '',
		enabledDisplay: '',
		resultsStart: '',
		resultsEnd: '',
		resultsStartDisplay: '',
		resultsEndDisplay: '',
		tags: []
	},
	initialize: function() {
		// Format Date
		this.formatDateDisplay(this.attributes.resultsStart, 
								this.attributes.resultsEnd);
		// Format Monitor Type (BUZZ -> Buzz)
		var typeOrig = this.attributes.type;
		this.attributes.typeDisplay = typeOrig.charAt(0)
									 + typeOrig.slice(1).toLowerCase();
		// Format Monitor Enabled (true -> True)
		var enabledOrig = (this.attributes.enabled).toString();
		this.attributes.enabledDisplay = enabledOrig.charAt(0).toUpperCase()
										+ enabledOrig.slice(1);
	},
	formatDateDisplay: function(dateOne, dateTwo) {
		// Display "Not Avaliable" if no date set
		if(dateOne == "") {
			this.attributes.resultsStartDisplay,
			this.attributes.resultsEndDisplay = notAvailable;
		}
		else // Format Date Otherwise
		{
			this.attributes.resultsStartDisplay = 
				this.formatDate(new Date(dateOne));
			this.attributes.resultsEndDisplay = 
				this.formatDate(new Date(dateTwo));
		}
	},
	formatDate: function(date) {
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
		// Formats date
		// ex. July 1, 2014 at 12:00 AM
		return months[date.getUTCMonth()] 
				+ " " + date.getUTCDate() 
				+ ", " 
				+ date.getUTCFullYear() 
				+ " at " + hours + ":" 
				+ minutes + " " + AMPM;
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
		this.url = "/api/monitor/posts?id=" + options.postID + "&filter="+options.filter+"&extendLimit=false";
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

