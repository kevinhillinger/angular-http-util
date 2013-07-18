'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
      builddir: 'build',
      pkg: grunt.file.readJSON('package.json'),      
      meta: {
          banner: '/**\n' + ' * <%= pkg.description %>\n' +
          ' * @author <%= pkg.author %>\n' +
          ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' * @link <%= pkg.homepage %>\n' +
          ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' + ' */\n'
      },
      src: {
          js: ['src/**/*.js']
      },
      
      test: { //unit & e2e goes here
        config: 'tests/config/karma.conf.js',
        unit: ['tests/unit/**/*.js']
      },
      
      clean: ['build/*'],
      
      jshint: {
        options: {
          jshintrc: 'jshintrc.json'
        },
        files: {
          src: ['Gruntfile.js', '<%= src.js %>']
        }
      },
      
      karma: {
        unit: {
          options: {
            configFile: '<%= test.config %>',
            'keepalive': true
          }
        }
      },
      
      concat: {
          build: {
              options: {
                  banner: "<%= meta.banner %>"
              },
              files: {
                  '<%= builddir %>/<%= pkg.name %>.js': ['<%= src.js %>']
              }
          }
      },
      
      uglify: {
          build: {
              options: {
                  banner: "<%= meta.banner %>"
              },
              files: {
                  '<%= builddir %>/<%= pkg.name %>.min.js': '<%= builddir %>/<%= pkg.name %>.js'
              }
          }
      },
      
      copy: {
          example: {
              files: [
                  { expand: true, src: ['<%= builddir %>/*'], dest: 'example/lib/', filter: 'isFile' }
              ]
          }
      }

    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // define tasks
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['clean', 'concat', 'uglify', 'copy:example']);
};