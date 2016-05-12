#!/bin/bash
set -x
set -e
set -u

THISDIR="$(cd "$(dirname "$0")" && pwd)"
cd "$THISDIR"

# so all files inside the rpm have mode 0644
umask 022

npm install
builder/build.sh "$@"
