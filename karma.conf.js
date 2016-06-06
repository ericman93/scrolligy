/**
 * Created by Aryeh on 06/06/2016.
 */

module.exports = function(config) {
    config.set({
        basePath: '.',
        frameworks: [ 'jasmine' ],
        files: [
            'libs/angular/angular.js',
            'libs/angular-mocks/angular-mocks.js',
            'src/**/*.js',
            'test/**/*.js',
            'src/**/*.html'
        ],
        preprocessors: {
            'src/*.html': 'ng-html2js'
        },
        reporters: [ 'progress' ],
        colors: true,
        autoWatch: false,
        browsers: [ 'PhantomJS' ],
        singleRun: true,
        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor'
        ]
    });
};