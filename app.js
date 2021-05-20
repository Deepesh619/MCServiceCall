var express     = require('express');
//var bodyParser  = require('body-parser');
var http        = require('http');
//var path        = require('path');
var activity    = require('./routes/activity');

var app = express();

// Configure Express
app.set('port', process.env.PORT || 3000);
//app.use(bodyParser.raw({type: 'application/jwt'}));

//app.use(express.static(path.join(__dirname, 'public')));
// Custom Hello World Activity Routes
app.get('/MCService/getToken/', activity.getToken );

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
//module.exports.app = app;