// Crimson Hexagon Node.js API Client
var Sieve = require('sievejs')
    config = require('./config');

var CH = function(){
    this.auth();
}

CH.prototype.auth = function(){

    var self = this;

    console.log('Attempting to authenticate...');

    // Authenticate!
    this.get('authenticate', { username : config.user, password : config.pass }, finish);

    function finish(obj){

        if (obj.auth && obj.expires){
            var expires = new Date(obj.expires) - new Date(),
                minutes = Math.round(expires / 1000 / 60);

            console.log('Successfully authenticated. Token expires in ' + minutes + ' minutes.');

            config.auth = "&auth=" + obj.auth; // TODO: Instead of overriding config, let's clone it to this.options

            // Automatically reauthenticate on expiration
            setTimeout(this.init, expires);
        } else {
            throw new Error('Couldn\'t authenticate: ' + obj.message );
        }
    }
}

// Get data from an endpoint
CH.prototype.get = function(endpoint, params, cb){

    var string = config.params,
        auth = config.auth || '',
        self = this;

    if (params){
        for (var param in params){
            string += '&' + param + '=' + params[param];
        }
    }

    var url = config.base + endpoint + string + auth;
    if (config.debug){
        console.log('Getting: ' + url);
    }

    new Sieve({
            url : url
        },
        {
            hooks : { onFinish : finish },
            timeout : 60
        }
    );

    function finish(response){

        var result = response[0];

        try {
           var obj = JSON.parse(result);
        } catch(e){
            throw new Error('Couldn\'t parse response: ' + response.result);
        }

        if (obj){
            cb.call(self, obj)
        }
    }
}

CH.prototype.wrap = function(req, res){
  console.log(req.url);
};

module.exports = new CH();
