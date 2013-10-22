
/**
 * Module dependencies.
 */
var settings = require('./settings'); 
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var flash = require("connect-flash");

var app = express();
var MongoStore = require('connect-mongo')(express); 
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', { 
  layout: true 
});

app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser()); 
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.session({ 
secret: settings.cookieSecret, 
store: new MongoStore({ 
  	db: settings.db 
}) 
})); 

app.use(function(req,res,next){
	var err = req.flash('error');
  	res.locals.error = err.length ? err : null;
	var success = req.flash('success');
  	res.locals.success = err.success ? success : null;
  	res.locals.user=req.session.user;
    next();
});

app.use(app.router);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/u/:user', user.user); 
app.get('/post', routes.post); 
app.get('/users', user.list);
app.get('/reg', routes.reg); 
app.post('/reg', routes.doReg); 
app.get('/login', routes.login); 
app.post('/login', routes.doLogin); 
app.get('/logout', routes.logout); 

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
