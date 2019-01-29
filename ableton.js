/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require('fs');
const zlib = require('zlib');
const concat = require('concat-stream');
const cheerio = require('cheerio');
const {Parser, Builder} = require('xml2js');

const fsError = function(callback, path) {
  const fn = function(error) {
    switch (error.code) {
      case 'ENOENT':
        return callback(new Error(`'${path}' does not exist`), null);
      case 'EISDIR':
        return callback(new Error(`'${path}' is a directory`), null);
      default:
        console.log(error);
        return callback(new Error('Unknown error'));
    }
  };

  return fn;
};

const unzipError = (callback, path) =>
  error => callback(new Error(`'${path}' is not a valid Ableton project`), null)
;

const onLoad = (callback, parseMode) =>
  function(xml) {
    switch (parseMode) {
      case 'xmlstring':
        return callback(null, xml);
      case 'dom':
        var dom = cheerio.load(xml);
        return callback(null, dom);
      case 'js':
        var parser = new Parser({mergeAttrs: true});
        return parser.parseString(xml, callback);
      default:
        throw new Error(`Invalid parse mode ${parseMode}.`);
    }
  }
;

// Class for reading and writing the Ableton Live project file format
class Ableton {
  constructor(path, parseMode) {
    this.path = path;
    if (parseMode == null) { parseMode = 'dom'; }
    this.parseMode = parseMode;
  }

  read(callback) {
    return fs.createReadStream(this.path).on('error', fsError(callback, this.path))
      .pipe(zlib.createGunzip()).on('error', unzipError(callback, this.path))
      .pipe(concat(onLoad(callback, this.parseMode)));
  }

  write(xml, callback) {
    if (!data) {
      callback(new Error('No data to write'));
      return;
    }

    global.path = this.path;

    return zlib.gzip(xml, function(error, data) {
      if (error) {
        return callback(error);
      } else {
        return fs.writeFile(path, data, error => callback(error));
      }
    });
  }
}

module.exports = Ableton;
