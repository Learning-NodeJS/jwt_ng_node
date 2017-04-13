var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.set('debug', true);

var User = require('./models/User.js');
//var jwt = require('./services/jwt.js');
var jwt = require('jwt-simple');

var passport = require('passport');
var passportLocalStrategy = require('passport-local').Strategy;
var request =  require('request');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(passport.initialize());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
})

var strategyOptions = {
  usernameField: 'email'
}

var loginStrategy =new passportLocalStrategy(strategyOptions, function (username, password, done) {
  var searchUser = {
    email: username
  };
  User.findOne(searchUser, function (err, user) {
    if (err) return done(err);
    if(!user) return done(null, false,{
      message: 'wrong email/password'
    });
    user.comparePassword(password, function (err, isMatch) {
      if(err) return done(null, false,{  message: 'wrong email/password'});
      if(!isMatch) return done(null, false, {
        message: 'wrong email/password'
      });
      return done(null, user);
    });
  })

});

var registerStrategy = new passportLocalStrategy(strategyOptions,function(email, password, done) {
  var searchUser = {
    email: email
  };
  User.findOne(searchUser, function (err, user) {
    if (err) return done(err);
    if(user) return done(null, false,{
      message: 'email already exists'
    });

    var newUser = new User({
      email: email,
      password: password
    });
    newUser.save(function(error) {
      console.log(JSON.stringify(newUser));
      done(null, newUser);
    });
  });
});

passport.use('local-register', registerStrategy);
passport.use('local-login', loginStrategy);

app.post('/register', passport.authenticate('local-register'),function(req, res){
  console.log(req.body);
  createSendToken(req.user, res);
  /*Manual way of registration
  var user = req.body;
  var newUser = new User({
    email: user.email,
    password: user.password
  });
  newUser.save(function(error) {
    if(error){
      res.status(500).json(error);
    }else{
      createSendToken(newUser, res);
    }
  });*/
});

app.post('/login',passport.authenticate('local-login'), function (req, res, next) {
  createSendToken(req.user, res);
  /* another way to do passport authenticate somehow notworking
  console.log(JSON.stringify(req.user));
  passport.authenticate('local', function (err, user){
    console.log('authenticate callback 1');
    if(err) next(err);
    req.login(user, function (err) {
      if(err) next(err);
      createSendToken(user, res);
    })(req, res, next);
  });*/
  /* without passport authenticate
  var requser = req.body;
  var searchUser = {
    email:requser.email
  };
  User.findOne(searchUser, function (err, user) {
    if (err) throw err;
    if(!user)
      res.status(401).send({message: 'wrong email/password'});
    user.comparePassword(requser.password, function (err, isMatch) {
      if(err) throw err;
      if(!isMatch)
        return res.status(401).send({message: 'wrong email/password'});
      createSendToken(user, res) ;
    });
  })*/
})

function createSendToken(user, res) {
  var payload = {
    sub: user.id
  }
  var secret = 'shh..';
  var token = jwt.encode(payload, secret);
  res.status(200).send({
    user:user.toJSON(),
    token: token
  });
}

var jobs = [
  'Cook','SuperHero','Unicorn Wisperer', 'Toast Inspector'
];

app.get('/jobs',function (req, res) {
  console.log(JSON.stringify(req.headers));
  if(!req.headers.authorization){
    return res.status(401).send({message:'You are not authorized!'});
  }

  var token = req.headers.authorization.split(' ')[1];
  var secret = 'shh..';
  var payload = jwt.decode(token, secret);
  if(!payload.sub){
    res.status(401).send({message:'Authentication Failed!'});
  }


  res.json(jobs);
})
//console.log(jwt.encode('hi','secret'));
app.post('/auth/google',function (req, res) {
  var url = 'https://accounts.google.com/o/oauth2/token';
  var googlePlusApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    code:req.body.code,
    grant_type: 'authorization_code',
    client_secret: 'ggDMqC3SoakKRULz9p_1DXJR'
  }
  console.log(req.body.code);
  request.post(url,{json:true, form: params}, function (err, res, token) {
    console.log(token);
    var accessToken = token.access_token;
    var headers = {
      Authorization : 'Bearer '+accessToken
    }
    request.get({
      url:googlePlusApiUrl,
      headers: headers,
      json: true
    },function (err, res, profile) {
          console.log(profile);
          User.findOne({googleId: profile.sub}, function (err, foundUser) {
            if(err) return next(err);
            if(foundUser && foundUser.googleId ) return createSendToken(foundUser, res);
            var newUser = new User();
            newUser.googleId = profile.sub;
            newUser.displayName = profile.name;
            newUser.save(function (err) {
              if(err) return next(err);
              return createSendToken(newUser, res);
            })
          })
    })
  });
});

var registsuccess = {
  "firstname": "Sambit",
  "lastname": "Mishra",
  "email": "sambit@gmail.com",
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhYmN4eXoiLCJpYXQiOjE0ODk4NTUyNDUsInN1YiI6ImFiY0BhYmMuY29tIiwiZXhwIjoxNDg5ODU1NTQ1fQ.6EnkSjQlxBwI0SY2x-byJ4gRwzhF5uTU172gJzd_9Pk"
}

app.post('/testresttemplate',function (req, res) {
  console.log(JSON.stringify(req.headers));
  if(!req.headers.authorization){
    return res.status(400).send({message:'You are not authorized!',type:'BAD Request'});
  }
  res.json(registsuccess);
});


mongoose.connect('mongodb://localhost/jwtngnode');

var server = app.listen(3000, function(){
  console.log('api listening on port number : 3000');
});
