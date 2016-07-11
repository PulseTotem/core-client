module.exports = function (grunt) {
    'use strict';

    // load extern tasks
    grunt.loadNpmTasks('grunt-bumpup');

    // tasks
    grunt.initConfig({
      bumpup: 'package.json'
    });

}