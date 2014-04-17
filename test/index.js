
var beatport = require('../');
var debug = require('debug')('beatport-csv-parser:test');
var assert = require('better-assert');
var recordParser = require('csv-record-parser');
var record = require('csv-record-parser-stream');
var through = require('through');
var csv = require('csv-parse');
var fs = require('fs');
var join = require('path').join;

describe('beatport', function() {
  it('date parser works', function(){
    var date = beatport.date('Beatport 2013 Q3 - 30 Sep 2013');
    date.getDate().should.eql(30);
    date.getMonth().should.eql(8);
    date.getFullYear().should.eql(2013);
  });

  var sheet = process.env.BEATPORT_SHEET || join(__dirname, 'beatport.csv');
  if (!fs.existsSync(sheet))
    return console.error(sheet + " beatport sheet not found in test for testing");

  it('record parser works', function(done){
    var parser = recordParser();

    fs.createReadStream(sheet)
    .pipe(csv())
    .pipe(record(beatport, parser))
    .pipe(through(function(rec){
      beatport.assert(rec, parser.header());
    }))
    .on('end', done);
  });
});
