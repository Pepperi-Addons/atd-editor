const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
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
          minimize: true,
          minimizer: [
          new TerserPlugin({
            extractComments: false,
            terserOptions: {keep_fnames: /^.$/}
          })]
        },
        externals: {
        },
        plugins: [
        //   new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify('development')
        // }),
          new ModuleFederationPlugin({
            remotes: {},
            name: "atd_editor",
            filename: "atd_editor.js",
            exposes: {
            //   './Download': './projects/mfe1/src/app/download/download.component.ts',
            //   './Upload': './projects/mfe1/src/app/upload.component.ts',
            //   './Module': './projects/mfe1/src/app/download/download.component.ts'
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



