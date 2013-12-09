/**
 * Small wrapper around `superagent` module to make it easier to consume
 * the API the same way on client & server.
 */
var superagent = require('superagent')
  , isServer = typeof window === 'undefined'
  , apiPort = process.env.API_PORT || 3031
;

/**
 * Proxy each method to `superagent`, formatting the URL.
 */
['get', 'post', 'put', 'path', 'del'].forEach(function(method) {
  exports[method] = function(path) {
    var args = Array.prototype.slice.call(arguments, 1);
    superagent[method].apply(null, [formatUrl(path)].concat(args));
  };
});

function formatUrl(path) {
  var url;
  if (isServer) {
    // Prepend host and port of the API server to the path.
    url = 'http://localhost:' + apiPort + path;
  } else {
    // Prepend `/api` to relative URL, to proxy to API server.
    url = '/api' + path;
  }
  return url;
}
