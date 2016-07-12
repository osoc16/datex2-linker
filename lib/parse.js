const got = require('got');
const xml2js = require('xml2js');

/**
 * the json-ld context used for all of the terms
 * todo: make sure that every possible term is available here
 * report to https://github.com/OpenTransport/linked-datex2
 * @type {String}
 */
const context = 'http://vocab.datex.org/terms#';

/**
 * Parse a xml datex2 feed into a json-ld feed
 * @param  {string} source  a valid URL that goes to an xml datex2 feed
 * @param  {string} baseuri the baseuri that contains each identifier (as a hash)
 * @return {Promise}        will return the json-ld once parsing has completed
 */
function parse(source, baseuri) {

  return new Promise((resolve, reject) => {
    let graph = [];

    // get the requested source datafeed
    got(source).then(response => {

      // options for parsing the xml
      parser = new xml2js.Parser({
        mergeAttrs: true,
        tagNameProcessors: [xml2js.processors.stripPrefix],
        attrNameProcessors: [xml2js.processors.stripPrefix],
        valueProcessors: [xml2js.processors.parseNumbers],
        attrValueProcessors: [xml2js.processors.parseNumbers],
      });

      // parse the body of the request as xml to json with options
      parser.parseString(response.body, (err, result) => {
        if (err) {
          reject('error while parsing xml.\n ${JSON.stringify(err)}');
        }

        // A datex2 feed always contains a d2LogicalModel and a `payloadPublication`.
        // Inside that there should be an array that contains each of the unique
        // items, or that is nested inside a `genericPayloadExtension`>`nameOfExtension`>
        // `*Status`>`*Reference`(which has an id).
        for (let situation of result['d2LogicalModel']['payloadPublication'][0]['situation']) {

          // todo: get every `id` child and make them into `@id` with `baseuri`
          // problem: `id` can be infinitely nested.

          // get every unique item into the `@graph` as an array
          graph.push(situation);
        }
      });

      // todo: make this into a Promise
      resolve({
        '@context': context,
        '@graph': graph
      });

    }).catch(err => {
      reject('error while getting url.\n ${JSON.stringify(err)}');
    });
  });

};

module.exports = parse;
