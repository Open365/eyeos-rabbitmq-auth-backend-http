#!/bin/bash
set -e
set -u
set -x

if [ "$(id -u)" -ne 0 ]
then
	echo "You need to be root to execute this." >&2
	exit 1
fi

yum -y install \
	cairo \
	cairo-devel \
	libjpeg-turbo \
	libjpeg-turbo-devel \
	giflib \
	giflib-devel \
	libpng \
	libpng-devel
npm install -g grunt-cli
