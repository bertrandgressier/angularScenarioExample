'use strict';

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        proxy: 'http://localhost:9002/'
    };

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {}

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            coffee: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            compass: {
                files: ['<%= yeoman.app %>/shared/css/{,*/}*.{scss,sass}'],
                tasks: ['compass']
            },
            livereload: {
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '{.tmp,<%= yeoman.app %>}/shared/css/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/shared/icon/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= yeoman.app %>/shared/picture/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['livereload']
            }
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9000,
                    middleware: function(connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            e2e: {
                options: {
                    port: 9001,
                    base: yeomanConfig.app
                }
            },
            e2eDist: {
                options: {
                    port: 9002,
                    hostname: 'localhost',
                    base: yeomanConfig.dist
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            },
            serverDist: {
                url: 'http://localhost:9002'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: [
                    'app/scripts/appInformation.js'
                ]
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js'
            ]
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true,
                autoWatch: false
            },
            e2e: {
                configFile: 'karma-e2e.conf.js',
                singleRun: true,
                autoWatch: false
            },
            e2eDist: {
                configFile: 'karma-e2e.conf.js',
                singleRun: true,
                autoWatch: false,
                port: 8082,
                runnerPort: 9102,
                proxies: { '/':'<%=yeoman.proxy%>' }
            }
        },
        coffee: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/scripts',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/scripts',
                    ext: '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/spec',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/spec',
                    ext: '.js'
                }]
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/shared/css',
                cssDir: '.tmp/styles',
                imagesDir: '<%= yeoman.app %>/shared/icon',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/shared/font',
                importPath: '<%= yeoman.app %>/components',
                relativeAssets: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        // config is overriden by usemin(Prepare) task
//        concat: {
//            dist: {
//                files: {
//                    '<%= yeoman.dist %>/scripts/scripts.js': [
//                        '.tmp/scripts/{,*/}*.js',
//                        '<%= yeoman.app %>/scripts/{,*/}*.js'
//                    ]
//                }
//            }
//        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            //css: ['<%= yeoman.dist %>/shared/css/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>'],
                basedir: '<%= yeoman.dist %>'
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/shared/icon',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/shared/icon'
                },{
                    expand: true,
                    cwd: '<%= yeoman.app %>/shared/picture',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/shared/picture'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/shared/css/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/shared/css/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: ['*.html'], //, 'views/*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>/scripts',
                    src: '*.js',
                    dest: '<%= yeoman.dist %>/scripts'
                }]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/scripts/scripts.js': [
                        '<%= yeoman.dist %>/scripts/scripts.js'
                    ]
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/shared/css/{,*/}*.css',
                        '<%= yeoman.dist %>/shared/picture/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '<%= yeoman.dist %>/shared/icon/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '<%= yeoman.dist %>/shared/font/*'
                    ]
                }
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'components/**/*',
                        'scripts/config.js',
                        'menu/**/*',
                        'views/**/*',
                        'i18n/**/*',
                        'shared/font/**/*',
                        'shared/icon/**/*',
                        'shared/css/**/*',
                        'shared/picture/**/*'
                    ]
                }]
            }
        },
        release: {
            options: {
                file: 'bower.json',
                npm: false,
                commitMessage: 'release netchandising <%= version %>',
                tagName: 'netchandising-<%= version %>'
            }
        },
        ngconstant: {
            dev: [
                {
                    dest: '<%= yeoman.app %>/scripts/appInformation.js',
                    name: 'appInformation',
                    constants: {
                        appInformation: grunt.file.readJSON('bower.json'),
                        buildDate: '<%= new Date().getTime() %>'
                    }
                }
            ]
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('server', [
        'clean:server',
        'ngconstant',
        'coffee:dist',
        'compass:server',
        'livereload-start',
        'connect:livereload',
        'open:server',
        'watch'
    ]);

    grunt.registerTask('serverDist', [
        'clean:server',
        'coffee:dist',
        'compass:server',
        //'livereload-start',
        'connect:e2eDist',
        'open:serverDist',
        'watch'
    ]);

    grunt.registerTask('test', [
        'clean:server',
        'coffee',
        'compass',
        'connect:test',
        'karma:unit',
        'connect:e2e',
        'karma:e2e'
    ]);

    grunt.registerTask('test-e2e',function() {
        var remote =  grunt.option('remote');
        if (remote == null) {
            grunt.task.run( [
                'clean:server',
                'connect:e2e',
                'karma:e2e'
            ]);
        } else {
            yeomanConfig.proxy= remote;
            grunt.log.writeln('launch e2e test with '+ remote);
            grunt.task.run( 'karma:e2eDist');
        }
    });

    grunt.registerTask('build', [
        'clean:dist',
        'jshint',
        'ngconstant',
        'test',
        'useminPrepare',
        'htmlmin',
        'concat',
        'copy',
        'ngmin',
        'usemin',
        'connect:e2eDist',
        'karma:e2eDist'
    ]);

    grunt.registerTask('default', ['build']);
};
