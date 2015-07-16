var http = require('http');
var fs = require('fs');
var _ = require('lodash');

var routerMiddlewares = {
  GET: [
  ], 
  POST: [],
  PUT: [],
  DELETE: [],
};
var globalMiddlewares = [];
//populate middlewares
function cookie(req,res,next){
  return next();
}
function setUser(req,res,next){
  req.user = "guest";
  return next();
};
globalMiddlewares.push(cookie);
globalMiddlewares.push(setUser);

require('./routes/routes')(routerMiddlewares);
function defaultMiddleware(req,res,next){
  res.statusCode = 404;
  res.statusMessage = '404 not found';
  res.end('404 not found');
};
//end population
function matchUrl(route, url){
  if(route === url)
    return true;
  else
    return false;
}
var dispatcher = function(req,res){ 
  var gMiddlewares = globalMiddlewares.slice(0); 
  var rMiddlewares = null;
  var methodMiddlewares = null ;
  if(methodMiddlewares = routerMiddlewares[req.method]){
    var matchedRoute = _.find(methodMiddlewares, function(route){
      return matchUrl(route[0],req.url);
    });
  }
  if(matchedRoute){
    rMiddlewares = matchedRoute.slice(1); 
  } 
  rMiddlewares = rMiddlewares || [defaultMiddleware];
  var middlewares;
  function callNext(){
    if(gMiddlewares.length !== 0)
      middlewares = gMiddlewares;
    else if(rMiddlewares.length !== 0)
      middlewares = rMiddlewares;
    else
      return;
    var mw = middlewares.shift(); 
    mw(req,res,callNext);
  }
  callNext();
};
var server = http.createServer(dispatcher);
server.listen(3000);
