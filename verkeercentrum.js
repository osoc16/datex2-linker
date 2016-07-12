const fs = require('fs');
const got = require('got');
const xml2js = require('xml2js');

const url = 'http://www.verkeerscentrum.be/uitwisseling/datex2full';
const base = 'https://osoc16.github.io/mobylink/verkeerscentrum/terms/';
const outputFile = "_data/verkeercentrum.json";

const context = {
  // todo: prefix and use straight http://vocab.datex.org/terms
};

let graph = [];



got(url).then(response => {

  parser = new xml2js.Parser({
    mergeAttrs: true,
    tagNameProcessors: [xml2js.processors.stripPrefix],
    attrNameProcessors: [xml2js.processors.stripPrefix],
    valueProcessors: [xml2js.processors.parseNumbers],
    attrValueProcessors: [xml2js.processors.parseNumbers],
  });
  parser.parseString(response.body, function (err, result) {
    for (let situation of result['d2LogicalModel']['payloadPublication'][0]['situation']) {
      // for (let record of situation['ns2:situationRecord']) {
      //   types.push({
      //     situation: situation,
      //     record: record
      //   })
      // }
      graph.push(situation);
      // types.push({
      //   id: situation['ns2:situationRecord'],
      //   record: situation['ns2:situationRecord']
      // });
    }
  });

  // todo: clean up json generated (probably not too much)
  // todo: insert @id
  // todo: figure out context ()

  // for (let situation of data) {
  //   // make the id into a url
  //   space['@id'] = `${base}#${space.id}`;
  //   delete space.id;

  //   // make the parkingstatus conform
  //   if (space.parkingStatus.open) {
  //     space.parkingStatus.openingStatus = 'open';
  //   } else {
  //     space.parkingStatus.openingStatus = 'closed';
  //   }
  //   delete space.parkingStatus.open;

  //   // delete what isn't parseable
  //   delete space.suggestedFreeThreshold;
  //   delete space.suggestedFullThreshold;
  //   delete space.capacityRounding;

  //   // fix the time
  //   space.parkingStatus.lastModifiedDate = new Date(space.parkingStatus.lastModifiedDate).toISOString()

  //   // set the type
  //   // space['@type'] = '';

  //   graph.push(space);
  // };


  jsonld = {
    '@context': context,
    '@graph': graph
  };

  fs.writeFile(outputFile, JSON.stringify(jsonld), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The data was saved!");
  });
}).catch(err=>{
  console.warn(err)
});
