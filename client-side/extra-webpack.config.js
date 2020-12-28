const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
// const addon = require('../addon.config.json');

module.exports = (config, options) => {

    const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);
    // if (addon.Client.Mode === 'Standalone') {
        // return config;
    // }
    // else {
        return singleSpaWebpackConfig;
    // }

    // Feel free to modify this webpack config however you'd like to
};



