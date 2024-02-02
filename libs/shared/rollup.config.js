/* eslint-disable @typescript-eslint/no-var-requires */
import camelCase from 'lodash.camelcase';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
// import shim from 'rollup-plugin-shim';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

const libraryName = 'index';

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true, globals: {
      'class-validator': 'classValidator',
      'class-transformer': 'classTransformer',
      '@nestjs/swagger': 'swagger',
      'prop-types': 'PropTypes'
    } },
    { file: pkg.module, format: 'es', sourcemap: true, globals: {
      'class-validator': 'classValidator',
      'class-transformer': 'classTransformer',
      '@nestjs/swagger': 'swagger',
      'prop-types': 'PropTypes'
    }},
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['class-validator', 'class-transformer', '@nestjs/swagger'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    peerDepsExternal(),
    // Allow json resolution
    json(),
    // shim({
    //   '@nestjs/swagger': 'eval("require(\'@nestjs/swagger\');'
    // }),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve({ preferBuiltins: true, browser: true }),
    // Resolve source maps to the original source
    sourceMaps(),
  ],
};