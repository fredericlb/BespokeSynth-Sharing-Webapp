#!/bin/sh

set -e -u

rm -rf ./bespoke-patches-server/public/client
#cd bespoke-patches-server && npm install
#cd ..
cd bespoke-patches-client  && npm run build
cd ..
cp -rf bespoke-patches-client/build bespoke-patches-server/public/client