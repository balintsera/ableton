/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const assert = require('assert');

const Ableton = require('../ableton.js');

const a = new Ableton('test/empty.als');

a.read(function(error, $) {
  assert.equal(error, null);
  assert.equal(typeof $, 'function');
  assert.equal($('ableton').find('creator').text(), 'Ableton Live 9.1.5');

  const liveset = $('liveset');
  const tracks = liveset.find('tracks');
  const midi = tracks.find('miditrack');
  const audio = tracks.find('audiotrack');

  const tempo = liveset.find('mastertrack tempo manual').find('value').text();

  assert.equal(tempo.length, 3);
  assert.equal(tempo, '120');

  assert.equal(midi.length, 2);
  assert.equal(audio.length, 2);

  return console.log('Tests passed');
});

let b = new Ableton('test/plugins.als', 'dom');

b.read(function(error, $) {
  assert.equal(error, null);
  assert.equal(typeof $, 'function');
  assert.equal($('ableton').attr('creator'), 'Ableton Live 9.1.7');

  const liveset = $('liveset');
  const tracks = liveset.find('tracks');
  const midi = tracks.find('miditrack');
  const audio = tracks.find('audiotrack');

  const tempo = parseInt(liveset.find('mastertrack tempo manual').attr('value'), 10);

  assert.equal(tempo, 125);

  assert.equal(midi.length, 2);
  assert.equal(audio.length, 0);

  return console.log('Tests passed');
});

b = new Ableton('test/plugins.als', 'js');

b.read(function(error, obj) {
  assert.equal(error, null);
  assert.equal(typeof obj, 'object');
  assert.equal(obj.Ableton.Creator[0], 'Ableton Live 9.1.7');

  return console.log('Tests passed');
});
