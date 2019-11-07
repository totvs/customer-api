const gulp = require('gulp');
const apidoc = require('gulp-apidoc');

const doc = (done) => apidoc({
  src: "routes/",
  dest: "doc/",
  config: "./"
}, done);

doc.displayName = 'apidoc'

exports.default = doc;
