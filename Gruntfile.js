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
        tasks: ['import','notify:done', 'uglify']
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
           collapseWhitespace: true
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
          sourcemap: 'none',
        },
        files: {
          'dist/css/concourse.css': 'src/scss/concourse.scss'
        }
      },
      min: {
        options: {
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
    =            IMPORT            =
    ==============================*/
    
    import: {
      options: {},
      dist: {
        files: {
          'dist/js/concourse.js' : 'src/js/concourse.js',
          'dist/concourse.ready.html' : 'src/concourse.html'
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
        duration: 1 
      }
    },
    notify: {
      done: {
        options: {
          title: 'Grunt - concourse',
          message: 'DONE!', 
        }
      }
    }
  });

  /*==================================
  =            LOAD TASKS            =
  ==================================*/
  
  
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-import');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-notify');
  grunt.task.run('notify_hooks');
  grunt.registerTask('default',['watch']);
};
