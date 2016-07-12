const http = require('http'),
  dispatcher = require('httpdispatcher'),
  url = require('url'),
  pug = require('pug');

/**
 * serve up a json-ld feed and make its id's accessible
 * @param  {Object}  json    The json source
 * @param  {Url}     uri     The uri at which to serve
 * @param  {string}  title   The title of the datafeed
 * @return {Promise}         will return resolved when running
 */
function serve(json, uri, title) {
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

    function returnLinked(req, res, contentType) {
      res.writeHead(200, {
        'Content-Type': contentType
      });
      res.end(JSON.stringify(json));
    };

    // function returnTerms(req, res) {
    //   res.writeHead(200, {
    //     'Content-Type': 'text/html'
    //   });
    //   res.end(pug.renderFile('lib/terms.pug', {
    //     json
    //   }));
    // };

    // resolve requests to the json via `/data.jsonld` and `/data.json`
    dispatcher.onGet('/data.json', (req, res) => {
      returnLinked(req, res, 'application/json');
    });
    dispatcher.onGet('/data.jsonld', (req, res) => {
      returnLinked(req, res, 'application/ld+json');
    });

    // show all of the terms in a html link
    // dispatcher.onGet('/terms', returnTerms(req, res));

    // serve the index
    dispatcher.onGet('/', function(req, res) {
      const options = {};
      res.end(pug.renderFile('lib/index.pug', {
        options,
        title
      }));
    });

    // create a server
    let server = http.createServer(handleRequest);

    // start the server
    server.listen(port, function() {
      resolve(`Server listening on: ${url.format(uri)}`);
    });


  });
};

module.exports = serve;
