var http = require('https');

function  performRequest(endpoint,host,headers, method, data, success) {
    var dataString = JSON.stringify(data);
    
    var options = {
      host: host,
      path: endpoint,
      method: method,
      headers: headers
    };
  
    var req = http.request(options, function(res) {
      res.setEncoding('utf-8');
  
      var responseString = '';
  
      res.on('data', function(data) {
        responseString += data;
      });
  
      res.on('end', function() {
       var responseObject =  JSON.parse(responseString);
        success(responseObject);
      });
    });
    req.write(dataString);
    req.end();
  }

  var authHost = 'mcllzpmqql69yd9kvcz1n-mj1fqy.auth.marketingcloudapis.com';
  var authEndpoint = '/v2/token';
  var authData = {
    "grant_type": "client_credentials",
    "client_id": "process.env.clientId",
    "client_secret":"process.env.clientSecret"
  };
  var authHeaders = {
    'Content-Type': 'application/json'
  };
  var postMethod="POST";
exports.getToken = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    performRequest(authEndpoint,authHost,authHeaders, postMethod, authData, function(data) {
       var accesstoken = data.access_token;
        res.setHeader('Access-Control-Allow-Origin','*');
    res.send(200, 'Publish1' + accesstoken);
    console.log('Published1');
    });
    
};