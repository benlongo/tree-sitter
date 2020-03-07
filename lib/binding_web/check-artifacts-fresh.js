#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

function list(dir) {
  return fs
    .readdirSync(path.join(__dirname, dir), 'utf8')
    .filter((p) => !p.startsWith('.'))
    .map((p) => path.join(dir, p));
}

function mtime(p) {
  return fs.statSync(path.join(__dirname, p)).mtime;
}

const wasmInputFiles = [
  '../../script/build-wasm',
  ...list('src/wasm'),
  ...list('../include/tree_sitter'),
  ...list('../src'),
];

function verifyFresh(inputs, outputs, scriptName) {
  const outputMtime = Math.min(...outputs.map(mtime));
  const changedFiles = inputs.filter((input) => mtime(input) > outputMtime);
  if (changedFiles.length > 0) {
    console.log(`File(s) '${changedFiles}' changed. Re-run '${scriptName}'`);
    process.exit(1);
  }
}

const wasmOutputFiles = ['build-wasm/tree-sitter-c.js', 'build-wasm/tree-sitter.wasm'];
verifyFresh(wasmInputFiles, wasmOutputFiles, 'script/build-wasm');

const jsInputFiles = [...list('build-wasm'), 'src/js/binding.js', 'src/ts/tree-sitter-web.d.ts', 'rollup.config.js'];
const jsOutputFiles = ['lib/tree-sitter.js', 'lib/tree-sitter.wasm', 'lib/tree-sitter-web.d.ts'];
verifyFresh(jsInputFiles, jsOutputFiles, 'npm run build');
