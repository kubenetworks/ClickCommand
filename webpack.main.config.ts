import path from 'path';
import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';

export const isDev = Boolean(process.env.DEV);

console.log('main dev', isDev);

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  devtool: isDev ? 'eval-source-map' : undefined,
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
};
