module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'sinon-chai'],
    browsers: ['PhantomJS'],
    reporters: ['mocha', 'live'],
    singleRun: false,
    files: [
      'src/**/*.spec.*'
    ],
    liveReporter: {
      'port': 8282,
      'wwwRoot': 'C:\\cyh\\hans\\karma-live-reporter\\build\\www'
    },
    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-phantomjs-launcher'),
      require('karma-mocha-reporter'),
      require('karma-sinon-chai'),
      require('karma-live-reporter')
    ]
  });
};
