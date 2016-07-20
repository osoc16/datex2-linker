const http = require('http');
const url = require('url');
const path = require('path');
const dispatcher = require('httpdispatcher');
const pug = require('pug');
const parse = require('datex2-linker-api');

/**
 * serve up a json-ld feed and make its id's accessible
 * @param  {string}  source  The datex2 source url
 * @param  {Url}     uri     The uri at which to serve
 * @param  {string}  title   The title of the datafeed
 * @return {Promise}         Will return resolved when running
 */
function serve(source, uri, title, silent) {
  // 1. set up a server at the current `port`
  // 2. return the json at `/data.json` and `/data.json-ld` with correct MIME-type
  // 4. make `/` available

  return new Promise((resolve, reject) => {
    // handle a request
    function handleRequest(request, response) {
      try {
        // log the request on console
        if (!silent) {
          console.log(request.url);
        }
        // Dispatch
        dispatcher.dispatch(request, response);
      } catch (err) {
        console.error(err);
      }
    }

    /**
     * Return linked data from a datex2 url
     * @see                         https://github.com/osoc16/datex2-linker-api
     * @param  {object} req         The request object
     * @param  {object} res         The request result given back
     * @param  {string} contentType A valid MIME content type to serve as
     */
    function returnLinked(req, res, contentType) {
      res.writeHead(200, {
        'Content-Type': contentType
      });
      // href is available at the jsonld
      parse(source, url.format(uri) + 'data.jsonld').then(result => {
        res.end(JSON.stringify(result));
      }).catch(err => {
        reject(err);
      });
    }

    // resolve requests to the json via `/data.jsonld` and `/data.json`
    dispatcher.onGet('/data.json', (req, res) => {
      returnLinked(req, res, 'application/json');
    });
    dispatcher.onGet('/data.jsonld', (req, res) => {
      returnLinked(req, res, 'application/ld+json');
    });

    // serve the index
    dispatcher.onGet('/', function (req, res) {
      const options = {};
      res.end(pug.renderFile(path.join(__dirname, '/../lib/index.pug'), {
        options,
        title
      }));
    });

    // create a server
    let server = http.createServer(handleRequest);

    // start the server
    server.listen(uri.port, function () {
      resolve(`Server listening on: ${url.format(uri)}`);
    });
  });
}

module.exports = serve;
