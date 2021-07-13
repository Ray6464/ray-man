#!/usr/bin/env node

const fs = require('ray-fs');
const flags = require('ray-flags');
const {sucide} = require('sucide');
const path = require('path');
const fetch = require('node-fetch');

function packageNames() {
  fs.cd('docs');
  const names = fs.lsFile().value;
  fs.cd('..');
  return names;
}

async function getDocsFromGitHub(packageName) {
  const URL = `https://raw.githubusercontent.com/Ray6464/${packageName}/main/README.md`;
  const res = await fetch(URL);
  const data = await res.text();
  fs.write(path.join('docs', packageName), data);
  return data;
}

if (flags.v) { sucide("v1.0.1") }
else if (flags.d !== undefined) {
  const docsURI = path.join('docs', flags.d);
  if (fs.exists(docsURI).value) {
    const docs = fs.read(docsURI).value;
    sucide(docs);
  }
  else {
    console.log(`Updating Database for ${flags.d}!`);
    getDocsFromGitHub(flags.d).then(docs => {sucide(docs)});
  }
}
else if (flags.u) {
  console.log(`Updating Database!`);
  const packages = packageNames();
  packages.forEach(packageName => {
    getDocsFromGitHub(packageName).then(docs => { console.log(`${packageName} sucessfully updated!`) }); // also writes to docs files
  })
}
else if (flags.l) {
  packageNames().forEach(packageName => { console.log(packageName) });
}
else {
  sucide('No valid instruction provided!');
}

