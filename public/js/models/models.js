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
		tags: [],
		tagsDisplay: []
	},
	initialize: function() {
		var attr = this.attributes;
		// Format Date
		this.formatDateDisplay(attr.resultsStart, attr.resultsEnd);
		// Format Monitor Type (BUZZ -> Buzz)
		var typeOrig = attr.type;
		attr.typeDisplay = firstCharUpperCase(typeOrig);
		// Format Monitor Enabled (true -> True)
		var enabledOrig = (attr.enabled).toString();
		attr.enabledDisplay = firstCharUpperCase(enabledOrig);
		// Format Tags
		var divTags = attr.tags.map(function(d) {
			return "<li>" + d.name + "</li>";
		});
		attr.tagsDisplay = divTags;
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
		// Formats date
		// ex. July 1, 2014 at 12:00 AM
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
		// Format Author to remove ()
		this.attributes.authorDisplay = 
			this.formatAuthor(this.attributes.author);
		// Format Custom to Instagram, GooglePlus, etc.
		this.attributes.typeDisplay = 
			this.formatType(this.attributes.type, this.attributes.url);
	},
	formatAuthor: function(author) {
		// Formats author to remove ()
		// ex. (Crimson Hexagon) -> Crimson Hexagon
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
	},
	formatType: function(type, url) {
		// Formats when Type == Custom
		if(type != "Custom") {
			return type;
		}	
		else
		{
			var index = url.indexOf(".");
			var sub = url.substring(7, index);
			return firstCharUpperCase(sub);
		}
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
	allCategories: [], 		// Array of All Categories
	avgScores: [],			// Array of Average Scores
	perScores: [],			// Array of Percentages
	arrMentions: [],		// Array of Mentions
	totalScores: 0,			// Total Number of Scores
	numCategories: 0,		// Number of Categories
	defaultNightData: [],
	defaultDayData: [],
	arrSentimentBar: [],
	filter: "",
	checkedSources: [],
	initialize: function(options) {
		this.checkedSources = [
			"Twitter", "Facebook",    "Instagram",
	        "YouTube", "Google Plus", "Weibo",
	        "Reviews", "News",        "Comments",
	        "Blogs",   "Forums"
	    ];
	    this.postID = options.postID
		
	    var that = this;

		var filter = this.writeFilter();

		this.url = "/api/monitor/posts?id=" + this.postID
					+ "&filter=" + filter
					+ "&extendLimit=false";

		this.fetch();
		this.once("sync", function(){
			that.adjustData(that);
			postCollection.trigger("ready");
		});


	},
	rerender: function() {

		var filter = this.writeFilter();

		this.url = "/api/monitor/posts?id=" + this.postID
			+ "&filter=" + filter
			+ "&extendLimit=false";

		this.fetch();

		var that = this;
		this.once("sync", function(){

			var dur = 300;

			if(postCollection.length > 0 && this.checkedSources.length > 0) {
				$('#charts').show(dur);
				$('#allPosts').show(dur);
				$('.error').html("");
				that.adjustData(that);

			}
			else {
				$('#charts').hide(dur);
				$('#allPosts').hide(dur);
				$('.error').html("<strong>Warning:</strong> There was no data found.  Please re-adjust your filters or <a href='#'>contact Alex</a>.  Or both.");
			}

			postCollection.trigger("reready");
			
		});
		
	},
	adjustData: function(that) {

		if(postCollection.length > 0) {

			var singlePost = that.at(0);
			var	singleAttr = singlePost.attributes;

			var arrModels = that.models,
				arrScores = [0];

			// Store All Category Names
			that.allCategories = [];
			var categoryNames = singleAttr.categoryScores.map(function(d) {
				return d.categoryName;
			});
			that.allCategories = categoryNames;
			// End

			// Store Average Score
			arrModels.map(function(d,i) {
				d.attributes.categoryScores.map(function(d,i) {
					if(arrScores[i] == undefined) {
						arrScores[i] = 0;
					}
					arrScores[i] += d.score;
				});
			});
			that.avgScores = arrScores;
			// End

			// Fill Vars for Sentiment Analysis
			var indexOfPos = searchStringInArray("Positive", that.allCategories);
			var indexOfNeu = searchStringInArray("Neutral", that.allCategories);
			var indexOfNeg = searchStringInArray("Negative", that.allCategories);
			
			var posSen = that.avgScores[indexOfPos],
				neuSen = that.avgScores[indexOfNeu],
			 	negSen = that.avgScores[indexOfNeg];


			that.arrSentimentBar = [
				{type: "Positive", value: posSen},
				{type: "Neutral", value: neuSen},
				{type: "Negative", value: negSen}
			];
			//End

			// Store Total Scores
			var totalScores = that.avgScores.reduce(function(a,b){
				return a+b;
			});
			that.totalScores = totalScores;
			// End

			// Store Number of Categories
			that.numCategories = that.allCategories.length;
			// End

			// Store Score Percent
			var arrPercents = arrScores.map(function(d){
				return (d / totalScores) * 100;
			});
			that.perScores = arrPercents;
			// End

			// Store Initial Mentions
			var arrMentions = [];
			for(var i = 0; i < 5; i++) {
				arrMentions.push(new PostsDisplay({
	                model: postCollection.at(i)
	                }).render().el)
			}
			that.arrMentions = arrMentions;
			// End

			// Store Mention Times
			that.defaultDayData = [
	        { "time" : 12 , value : 0  },
	        { "time" : 1  , value : 0  },
	        { "time" : 2  , value : 0 },
	        { "time" : 3  , value : 0 },
	        { "time" : 4  , value : 0 },
	        { "time" : 5  , value : 0 },
	        { "time" : 6  , value : 0 },
	        { "time" : 7  , value : 0 },
	        { "time" : 8  , value : 0 },
	        { "time" : 9  , value : 0 },
	        { "time" : 10 , value : 0 },
	        { "time" : 11 , value : 0  }
	    	];

			that.defaultNightData = [
	        { "time" : 12 , value : 0  },
	        { "time" : 1  , value : 0  },
	        { "time" : 2  , value : 0 },
	        { "time" : 3  , value : 0 },
	        { "time" : 4  , value : 0 },
	        { "time" : 5  , value : 0 },
	        { "time" : 6  , value : 0 },
	        { "time" : 7  , value : 0 },
	        { "time" : 8  , value : 0 },
	        { "time" : 9  , value : 0 },
	        { "time" : 10 , value : 0 },
	        { "time" : 11 , value : 0  }
	    	];

			arrModels.map(function(d) {
				var date = new Date(d.attributes.date);
				var UTCHours = date.getUTCHours();
				if(UTCHours <= 11) {
	                that.defaultNightData[UTCHours].value += 1; 
	            }
	            else if(UTCHours > 11) {
	                UTCHours = UTCHours - 12;
	                that.defaultDayData[UTCHours].value += 1;
	            }
			});
			// End

		}
		
	},
	parse: function(data){
		return data.posts;
	},
	addSource: function(source) {
		this.checkedSources.push(source);
		this.rerender();
	},
	removeSource: function(source) {
		var indexToRm = this.checkedSources.indexOf(source);
        this.checkedSources.splice(indexToRm, 1);
		this.rerender();
        
	},
	changeFilter: function(newFilter) {
		this.filter = newFilter;
		this.writeFilter()
		this.rerender();
	},
	checkAllSources: function() {
		this.checkedSources = [
			"Twitter", "Facebook",    "Instagram",
	        "YouTube", "Google Plus", "Weibo",
	        "Reviews", "News",        "Comments",
	        "Blogs",   "Forums"
	    ];
	    this.rerender();
	},
	uncheckAllSources: function() {
		this.checkedSources = [];
	    this.rerender();
	},
	writeFilter: function(){
		var typeFilter = "";
	    for(var z = 0; z < this.checkedSources.length; z++) {
	        if(z == 0) {
	            typeFilter = "type:" + this.checkedSources[0];
	        }
	        else {
	            typeFilter += "," + this.checkedSources[z];
	        }
	    }

		if(this.filter == "") {
	        return typeFilter;
	    } else if(typeFilter == "") {
	        return this.filter;
	    } else if(this.filter != "" && typeFilter != ""){
	        return typeFilter + "|" + this.filter;
	    }
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
		this.url = "/api/monitor/results?id=" 
					+ options.postID;
		this.fetch();
	},
	parse: function(data){
		return data.results;
	}
});
function firstCharUpperCase(string) {
	return (string.charAt(0).toUpperCase() + string.slice(1).toLowerCase());
}
function searchStringInArray (str, strArray) {
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j].match(str)) return j;
    }
    return -1;
}
