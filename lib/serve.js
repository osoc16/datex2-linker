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
function serve(json, uri, title, silent) {
  // 1. set up a server at the current `port`
  // 2. return the json at `/data.json` and `/data.json-ld` with correct MIME-type
  // 4. make `/` available

  const hostname = uri.hostname,
    port = uri.port;

  return new Promise((resolve, reject) => {

    // handle a request
    function handleRequest(request, response) {
      try {
        //log the request on console
        if (!silent) console.log(request.url);
        //Dispatch
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
    // show all of the terms in a html link
    // dispatcher.onGet('/terms', returnTerms(req, res));

    // resolve requests to the json via `/data.jsonld` and `/data.json`
    dispatcher.onGet('/data.json', (req, res) => {
      returnLinked(req, res, 'application/json');
    });
    dispatcher.onGet('/data.jsonld', (req, res) => {
      returnLinked(req, res, 'application/ld+json');
    });

    // serve the index
    dispatcher.onGet('/', function(req, res) {
      const options = {};
      // todo: make this work in tests (file path relative to where it started)
      res.end(pug.renderFile(__dirname + '/../lib/index.pug', {
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
