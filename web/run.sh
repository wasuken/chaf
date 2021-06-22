#!/bin/sh

set -e

cd /app

yarn
yarn run build

bundle install
bundle exec ruby server.rb -o 0.0.0.0
