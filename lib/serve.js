/**
 * serve up a json-ld feed and make its id's accessible
 * @param  {Object} json the json source
 * @param  {string} port The port at which to serve
 * @return {Promise}     will return resolved when running
 */
function serve(json, port) {
  // 1. set up a server at the current `port`
  // 2. return the json at `/data.json` and `/data.json-ld` with correct MIME-type
  // 3. find URIs in the json
  // 4. make `/terms` available
  // 5. make the parent of that URI accessible as a hash on `/terms`

  return new Promise((resolve, reject) => {
    resolve('yay, we\'re "serving" 🕶');
  });
};

module.exports = serve;
