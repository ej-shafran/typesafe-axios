#!/usr/bin/env bash

set -e

rm -Rf ./dist
tsc
cp ./README.md ./dist/README.md
cp ./package.json ./dist/package.json
sed -i 's/typesafe-axios-src/typesafe-axios/g' ./dist/package.json 
