#!/usr/bin/env node

const url = require('url');
const open = require('opener');
const yargs = require('yargs');
const serve = require('./serve');

yargs // eslint-disable-line no-unused-expressions
  .usage('$0 <cmd> [args]')
  .boolean('silent')
  .describe('silent', 'runs without opening a browser and without output for every request')
  .command('serve', 'serve up a JSON-LD API from a datex2 feed', {
    source: {
      alias: 's',
      describe: 'A valid datex2 feed'
    },
    base: {
      alias: 'b',
      describe: 'baseuri for the created API'
    },
    port: {
      alias: 'p',
      describe: 'port on which the API is served',
      default: 80
    },
    title: {
      alias: 't',
      describe: 'the title of the datafeed',
      default: 'Datex2 Linked'
    }
  },
    function (argv) {
      // FIXME: get port inside the baseuri
      let uri = url.parse(argv.base);
      uri.port = argv.port;
      // this is a hack because somehow url.format doesn't apply new changes.
      uri = url.parse(uri.protocol + '//' + uri.hostname + ':' + uri.port);

      // serve that datafeed and create accessible URIs
      serve(argv.source, uri, argv.title, argv.silent).then(res => {
        console.log(`The feed is now accessible on ${uri.href}\n ${res}`);
        // open a browser to the index
        if (!argv.silent) {
          open(uri.href);
        }
      }).catch(err => {
        console.error(`There was an error serving the provided datafeed:\n ${err}`);
      });
    })
  .help('help')
  .alias('h', 'help')
  .argv;
