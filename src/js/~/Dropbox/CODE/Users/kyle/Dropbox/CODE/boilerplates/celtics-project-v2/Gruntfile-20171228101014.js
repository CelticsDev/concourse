module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /*=============================
    =            WATCH            =
    =============================*/

    watch: {
      html: {
        files: ['src/project-name.html',
                'src/html/*.html'],
        tasks: ['htmlmin', 'import','notify:done']
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['browserify', 'notify:done', 'uglify']
      },
      css: {
        files: ['src/scss/*.scss',
                'src/scss/mixins/*.scss'],
        tasks: ['sass', 'import','notify:done']
      }
    },

    /*===================================
    =            MINIFY HTML            =
    ===================================*/

    htmlmin: {
       dist: {
         options: {
           gruntLogHeader: false,
           removeComments: true,
           collapseWhitespace: true
         },
         files: {
           'src/html/min/template.min.html': 'src/html/template.html' // CHANGE TEMPLATE NAME
         }
       }
     },

     /*====================================
     =            COMPILE SASS            =
     ====================================*/

    sass: {
      dist: {
        options: {
          gruntLogHeader: false,
          sourcemap: 'none',
        },
        files: {
          'dist/css/project-name.css': 'src/scss/project-name.scss'
        }
      },
      min: {
        options: {
          gruntLogHeader: false,
          sourcemap: 'none',
          style: 'compressed'
        },
        files: {
          'dist/css/project-name.min.css': 'src/scss/project-name.scss'
        }
      }
    },

    /*=========================================
    =            UGLIFY JAVASCRIPT            =
    =========================================*/

    uglify: {
      dist: {
        files: {
          'dist/js/project-name.min.js': 'dist/js/project-name.js'
        }
      }
    },

    /*==============================
    =            IMPORT            =
    ==============================*/

    import: {
      options: {},
      dist: {
        files: {
          gruntLogHeader: false,
          'dist/js/project-name.js' : 'src/js/project-name.js',
          'dist/project-name.ready.html' : 'src/project-name.html'
        }
      }
    },

    /*==================================
    =            browserify            =
    ==================================*/

    browserify: {
        dev: {
            src: [
                "src/js/project-name.js"
            ],
            dest: 'dist/js/project-name.js',
            options: {
                browserifyOptions: { debug: true },
                transform: [["babelify", { "presets": ["env"] }]],
            }
        }
    },

    /*==============================
    =            NOTIFY            =
    ==============================*/

    notify: {
      done: {
        options: {
          gruntLogHeader: false,
          title: 'Grunt - project-name',
          message: 'DONE!',
        }
      }
    }
  });

  /*==================================
  =            LOAD TASKS            =
  ==================================*/

  require('grunt-log-headers')(grunt);
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-import');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-notify');
  grunt.registerTask('default',['watch']);
};