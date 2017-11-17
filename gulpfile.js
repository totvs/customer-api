var gulp = require('gulp');
var apidoc = require('gulp-apidoc');

gulp.task('apidoc', function(done){
      apidoc({
        src: "routes/",
        dest: "doc/",
        config: "./"
      },done);
});