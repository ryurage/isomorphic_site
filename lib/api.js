var express = require('express')
  , _ = require('underscore')
  , httpProxy = require('http-proxy')
  , app = express()
  , Datastore = require('nedb')
  , databaseUrl = "nedb/user.db"
  , postId = 0
  , posts = [{
      id: ++postId,
      title: "How to build an isomorphic app.",
      author: "spike",
      body: "It's really not that hard!",
      created_at: "2013-11-05T13:56:15.034Z",
    }, {
      id: ++postId,
      title: "Why JavaScript is eating the world.",
      author: "spike",
      body: "It's the lingua franca of the web.",
      created_at: "2013-11-04T17:23:01.329Z",
    }]
;

module.exports = app;

//app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());

db = {};
db.users = new Datastore({ filename: databaseUrl, autoload: true });
var test = db.users.find({}, function (err, docs) {
  // docs is an array containing documents Mars, Earth, Jupiter
  // If no document is found, docs is equal to []
  //console.log(docs)
});


app.get('/posts.json', function(req, res) {
  res.send(posts);
});

app.post('/posts.json', function(req, res) {
  var post = req.body;
  if (!post.title || !post.author || !post.body) {
    res.send(400, {success: false, error: "Missing parameters."});
  } else {
    post.id = ++postId;
    post.created_at = new Date().toJSON();
    posts.push(post);
    res.send({success: true});
  }
});

app.get('/posts/:id.json', function(req, res) {
  var id = parseInt(req.params.id, 10)
    , post = _.find(posts, function(p) { return p.id === id });
  if (post) {
    res.send(post);
  } else {
    res.send(404, {error: 'Not found.'});
  }
});

app.get('/users.json', function(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  db.users.find({}, function(err, users) {
    if( err || !users) {
      console.log("No users found");
    } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            str='[';
            users.forEach( function(user) {
                    str = str + '{ "username" : "' + user.username + '", "userid" : "' + user._id + '"},' +'\n';
            });
            str = str.trim();
            str = str.substring(0,str.length-1);
            str = str + ']';
            res.end( str);
    }
  });
});


/**
 * On the client, we want to be able to just send API requests to the
 * main web server using a relative URL, so we proxy requests to the
 * API server here.
 */
var proxy = new httpProxy.RoutingProxy();

app.proxyMiddleware = function(apiPort) {
  return function(req, res, next) {
    proxy.proxyRequest(req, res, {
      host: 'localhost',
      port: apiPort
    });
  };
};
