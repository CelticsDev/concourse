module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /*=============================
    =            WATCH            =
    =============================*/

    watch: {
      html: {
        files: ['src/concourse.html',
                'src/html/*.html'],
        tasks: ['htmlmin', 'import','notify:done']
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['browserify', 'import', 'notify:done','eslint']
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
           removeComments: true,
           collapseWhitespace: true,
           gruntLogHeader: false,
         },
         files: {
           'src/html/min/_player-wrap.min.html': 'src/html/_player-wrap.html' // CHANGE TEMPLATE NAME
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
          'dist/css/concourse.css': 'src/scss/concourse.scss'
        }
      },
      min: {
        options: {
          gruntLogHeader: false,
          sourcemap: 'none',
          style: 'compressed'
        },
        files: {
          'dist/css/concourse.min.css': 'src/scss/concourse.scss'
        }
      }
    },

    /*=========================================
    =            UGLIFY JAVASCRIPT            =
    =========================================*/

    uglify: {
      dist: {
        files: {
          'dist/js/concourse.min.js': 'dist/js/concourse.js'
        }
      }
    },

    /*==============================
    =            ESLINT            =
    ==============================*/

    eslint: {
      options: {
        configFile: 'src/js/eslint.json',
      },
      target: ['src/js/*.js']
    },

    /*==============================
    =            IMPORT            =
    ==============================*/

    import: {
      options: {
        gruntLogHeader: false
      },
      dist: {
        files: {
          'dist/concourse.ready.html' : 'src/concourse.html'
        }
      }
    },

    /*==================================
    =            BROWSERIFY            =
    ==================================*/

    browserify: {
        dev: {
            src: [
                "src/js/concourse.js"
            ],
            dest: 'dist/js/concourse.js',
            options: {
                browserifyOptions: { debug: true },
                transform: [["babelify", { "presets": ["env"] }]],
            }
        }
    },

    /*==============================
    =            NOTIFY            =
    ==============================*/

    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5,
        title: "concourse",
        success: false,
        duration: 1,
      }
    },
    notify: {
      done: {
        options: {
          gruntLogHeader: false,
          title: 'Grunt - concourse',
          message: 'DONE!',
        }
      }
    }
  });

  /*==================================
  =            LOAD TASKS            =
  ==================================*/

  require('grunt-log-headers')(grunt);
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-import');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-notify');
  grunt.registerTask('default',['watch']);
};
