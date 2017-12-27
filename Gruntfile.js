module.exports = function (grunt) {

    // -----------------------------------------------------------------------------------------------------------------
    // PLUGINS
    // ---

    var mstck = require('./bonzai/src/grunt/lib/helpers')(grunt),
        tasks = require('load-grunt-tasks')(grunt),
        time = require('time-grunt')(grunt),
        path = require('path');

    require('shipit-deploy')(grunt);
    require('shipit-shared')(grunt);

    // -----------------------------------------------------------------------------------------------------------------
    // CONFIGURATION
    // ---

    // Copy missing files if needed
    mstck.copyMissingFiles([
        {
            "file": "config/bonzai/application.json",
            "from": "bonzai/tpl/application.json.template",
            "replaceComments": true,
            "callBack": false
        },
        {
            "file": ".env",
            "from": "bonzai/tpl/.env.template",
            "replaceComments": true,
            "callBack": false
        }
    ]);

    // Load env file config
    require('dotenv').load();

    // Load json files
    var bonzaiPkg = grunt.file.readJSON('package.json'),
        bonzaiApp = grunt.file.readJSON('config/bonzai/application.json');

    // -----------------------------------------------------------------------------------------------------------------
    // APPLICATION
    // ---

    // Initialise app
    require("load-grunt-config")(grunt, {
        configPath: [
            path.join(process.cwd(), "bonzai/src/grunt/actions"),
            path.join(process.cwd(), "bonzai/src/grunt/tasks")
        ],
        overridePath: [
            path.join(process.cwd(), "config/bonzai/grunt/actions"),
            path.join(process.cwd(), "config/bonzai/grunt/tasks")
        ],
        init: true,
        data: {

            // Personal package config vars
            pkg: bonzaiPkg,

            // Application config vars
            app: bonzaiApp,

            // Extra config vars
            bonzai: {
                version: grunt.file.read('bonzai/VERSION'),
                project: {
                    slug: bonzaiPkg.name
                },
                isForked: bonzaiPkg.name !== 'wp-bonzai',
                env: process.env,
                themes: mstck.listThemes(bonzaiApp.webRoot + "/" + bonzaiApp.themes, bonzaiApp.themesPatterns)
            }

        },
        jitGrunt: {
            staticMappings: {}
        }
    });

};
