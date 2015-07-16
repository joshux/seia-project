var fs = require('fs');
var path = require('path');
var jade = require('jade');
var through = require('through2');
var layout = fs.readFileSync( path.join(__dirname , '../views/layout.jade') ).toString();
var index = fs.readFileSync( path.join(__dirname , '../views/index.jade') ).toString();
var login = fs.readFileSync( path.join(__dirname , '../views/login.jade') ).toString();
var signup = fs.readFileSync( path.join(__dirname , '../views/signup.jade') ).toString();
var createRoom = fs.readFileSync( path.join(__dirname , '../views/createRoom.jade') ).toString();

module.exports = function(mObj){
  
  mObj.GET.push(['/',function(req,res,next){
    var indexHTML = jade.render(layout, {bodyHTML:jade.render(index)});
    res.end(indexHTML);
    return;
  }]);
  mObj.GET.push(['/login',function(req,res,next){ 
    var loginHTML = jade.render(layout, {bodyHTML:jade.render(login)});
    res.end(loginHTML);
    return;
  }]);
  mObj.GET.push(['/signup',function(req,res,next){
    var signupHTML = jade.render(layout, {bodyHTML:jade.render(signup)});
    res.end(signupHTML);
    return;
  }]);
  mObj.GET.push(['/createRoom',function(req,res,next){
    var createRoomHTML = jade.render(layout, {bodyHTML:jade.render(createRoom)});
    res.end(createRoomHTML);
    return;
  }]);

  //POST
  mObj.POST.push(['/login', function(req,res,next){
    return;
  }]);
  mObj.POST.push(['/signup', function(req,res,next){
    req.pipe(through.obj(signupParser)).pipe(through.obj(authUser));
  }]);
};

function signupParser(chunk, enc, callback){
  var str = chunk.toString();
  var signupRegEx = /username=([a-zA-Z0-9_]*)&password([a-zA-Z0-9_]*)&repassword([a-zA-Z0-9_]*)/ //first user 0abc
  
  var signupObj = {
    username:'',
    passwordHash:''
  };
  this.push(signupObj);
  this.emit('parsed',signupObj);
  callback();
}

function authUser(chunk, enc, callback){
  console.log(chunk);
}
