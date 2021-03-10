const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const singleSpaAngularWebpack = require('single-spa-angular-webpack5/lib/webpack').default;
const { merge } = require('webpack-merge');
// const deps = require('./package.json').dependencies;
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (angularWebpackConfig, options) => {
    const mfConfig = {
        output: {
          uniqueName: "atdEditor"
        },
        optimization: {
          // Only needed to bypass a temporary bug
          runtimeChunk: false,
        //   minimize: true,
        //   minimizer: [
        //   new TerserPlugin({
        //     extractComments: false,
        //     terserOptions: {keep_fnames: /^.$/}
        //   })]
        },
        externals: {
        },
        plugins: [

          new ModuleFederationPlugin({
            remotes: {},
            name: "atd_editor",
            filename: "atd_editor.js",
            exposes: {
            },
            shared: {
              // ...deps,
              "@angular/core": { eager: true, singleton: true,  strictVersion: false  },
              "@angular/common": { eager: true,singleton: true,strictVersion: false   },
            }
          }),
        ],
      };
    const merged = merge(angularWebpackConfig, mfConfig);
    const singleSpaWebpackConfig = singleSpaAngularWebpack(merged, options);
    return singleSpaWebpackConfig;
};



