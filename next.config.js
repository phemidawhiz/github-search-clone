/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

console.log('************************************');
console.log(`Building For: ${process.env.NODE_ENV}`);
console.log('************************************');

const path = require('path');
// Webpack plugins
const webpack = require('webpack');

// Next Plugins
const withPlugins = require('next-compose-plugins');
const sass = require('@zeit/next-sass');
const css = require('@zeit/next-css');
const offline = require('next-offline');

const nextConfig = {
  distDir: 'build',
  poweredByHeader: false,

  /**
   * Custom webpack configuration for Next
   */
  webpack(config) {
    // Allow Next to resolve Typescript custom paths
    config.resolve.modules.unshift(__dirname);

    // Setup aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      assets: path.resolve(__dirname, 'src/assets/'),
      components: path.resolve(__dirname, 'src/components/'),
      containers: path.resolve(__dirname, 'src/containers/'),
      api: path.resolve(__dirname, 'src/api/'),
      config: path.resolve(__dirname, 'src/config/'),
      contexts: path.resolve(__dirname, 'src/contexts/'),
      lib: path.resolve(__dirname, 'src/lib/'),
      queries: path.resolve(__dirname, 'src/queries/'),
      services: path.resolve(__dirname, 'src/services/'),
      styles: path.resolve(__dirname, 'src/styles/'),
      utils: path.resolve(__dirname, 'src/utils/'),
    };

    // SVG Loader
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });
    // File loader
    config.module.rules.push({
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'static/images',
            publicPath: '/_next/static/images',
          },
        },
      ],
    });

    config.plugins.push(
      new webpack.EnvironmentPlugin(process.env),
      );
      
      return config;
    },
    workboxOpts: {
    clientsClaim: true,
    runtimeCaching: [
      {
        handler: 'cacheFirst',
        options: {
          cacheName: 'images',
        },
        urlPattern: /(http[s]?:\/\/.*\.(?:png|webp|jpg|jpeg|svg))/,
      },
      {
        handler: 'cacheFirst',
        options: {
          cacheName: 'fonts',
        },
        urlPattern: /\.(?:woff|woff2|otf|ttf)$/,
      },
      {
        handler: 'networkFirst',
        options: {
          cacheName: 'scripts',
        },
        urlPattern: /\.(?:js|jsx)$/,
      },
      {
        handler: 'networkFirst',
        options: {
          cacheableResponse: {
            statuses: [0, 200],
          },
          cacheName: 'offlineCache',
        },
        urlPattern: /http[s]?:\/\/.*/,
      },
    ],
    skipWaiting: true,
    swDest: 'service-worker.js',
  },
};

module.exports = withPlugins([
  [css],
  [
    sass,
    {
      cssLoaderOptions: {
        localIdentName: '[local]___[hash:base64:5]',
      },
      cssModules: true,
      sassLoaderOptions: {
        includePaths: [path.resolve('./src/styles')],
      },
    },
  ],
  offline,
], nextConfig);
