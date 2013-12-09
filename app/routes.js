var apiClient = require('./api_client')
;

module.exports = function(match) {
  match('/', function(callback) {
    console.log('index');

    callback(null, 'index');
  });

  match('/posts', function(callback) {
    console.log('posts');

    apiClient.get('/posts.json', function(err, res) {
      if (err) return callback(err);

      var posts = res.body;
      callback(null, 'posts', {posts: posts});
    });
  });

  match('/posts/:id', function(id, callback) {
    console.log('post: ' + id);

    apiClient.get('/posts/' + id + '.json', function(err, res) {
      if (err) return callback(err);

      var post = res.body;
      callback(null, 'post', post);
    });
  });

  match('/users', function(callback) {
    console.log('users');

    apiClient.get('/users.json', function(err, res) {
      if (err) return callback(err);

      var users = res.body;
      callback(null, 'users', {users: users});
    });
  });
};
