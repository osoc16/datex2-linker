const http = require('http'),
  dispatcher = require('httpdispatcher'),
  url = require('url');

/**
 * serve up a json-ld feed and make its id's accessible
 * @param  {Object}  json    The json source
 * @param  {Url}     uri     The uri at which to serve
 * @return {Promise}         will return resolved when running
 */
function serve(json, uri) {
  // 1. set up a server at the current `port`
  // 2. return the json at `/data.json` and `/data.json-ld` with correct MIME-type
  // 3. find URIs in the json
  // 4. make `/terms` available
  // 5. make the parent of that URI accessible as a hash on `/terms`

  const hostname = uri.hostname,
    port = uri.port;

  return new Promise((resolve, reject) => {

    // handle a request
    function handleRequest(request, response) {
      try {
        //log the request on console
        console.log(request.url);
        //Dispatqch
        dispatcher.dispatch(request, response);
      } catch (err) {
        console.error(err);
      }
    }

    //For all your static (js/css/images/etc.) set the directory name (relative path).
    // dispatcher.setStatic('src');

    function returnLinked(req, res) {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify(json));
    };

    function returnTerms(req, res) {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end('<h1>Nice</h1>');
    };

    // resolve requests to the json via `/data.jsonld` and `/data.json`
    dispatcher.onGet('/data.json', returnLinked);
    dispatcher.onGet('/data.jsonld', returnLinked);

    dispatcher.onGet('/terms', returnTerms);

    //A sample POST request
    // dispatcher.onPost("/post1", function(req, res) {
    //   res.writeHead(200, {
    //     'Content-Type': 'text/plain'
    //   });
    //   res.end('Got Post Data');
    // });

    // create a server
    let server = http.createServer(handleRequest);

    // start the server
    server.listen(port, function() {
      resolve(`Server listening on: ${url.format(uri)}`);
    });


  });
};

module.exports = serve;
