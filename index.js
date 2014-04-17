
var assert = require('better-assert');
var parseNumber = require('parse-number');
var moment = require('moment');
var debug = require('debug')('beatport-csv-parser');

var exports = module.exports = function BeatportParser(csv) {
  return {
      company: csv.col('company')
    , isrc: csv.col('isrc')
    , upc: csv.col('upc')
    , label: csv.col('label')
    , territory: csv.col('territory')
    , vendor: csv.col('vendor')
    , catalogueNumber: csv.col('catalogue number')
    , artist: csv.col('artist')
    , date: exports.date(csv.col('reference'))
    , track: csv.col('track')
    , mix: csv.col('mix')
    , remixer: csv.col('remixer')
    , copies: parseNumber(csv.col('copies'))
    , net: parseNumber(csv.col('artist net royalty ($ usd)'))
    , media: csv.col('media')
    , mediaId: csv.col('media id')
    , reference: csv.col('reference')
  }
};

var added = exports.addedFields = ['date'];

exports.date = function(str){
  str = str.split(' - ')[1]
  return moment(str, "DD MMM YYYY").toDate();
}

exports.assert = function(rec, header) {
  debug('beatport record %j', rec);

  assert(rec.company);
  assert(rec.isrc != null);
  assert(rec.upc != null);
  assert(rec.label);
  assert(rec.territory);
  assert(rec.vendor);
  assert(rec.catalogueNumber);
  assert(rec.artist);
  assert(rec.date instanceof Date);
  assert(rec.track != null);
  assert(rec.mix != null);
  assert(rec.remixer != null);
  assert(!isNaN(rec.copies));
  assert(!isNaN(rec.net));
  assert(rec.media);
  assert(rec.mediaId != null);
  assert(rec.reference);

  if (header) {
    var recKeys = Object.keys(rec);
    var headerKeyLen = header.length + added.length;
    debug("header lens: %s vs %s", recKeys.length, headerKeyLen);
    debug("headers %j %j", recKeys, header);
    assert(recKeys.length === headerKeyLen)
  }
};

