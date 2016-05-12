#!/bin/bash
set -e
set -u
set -x

THISDIR="$(cd "$(dirname "$0")" && pwd)"
cd "$THISDIR"

name="rabbitmq-auth-backend-http";
prefix="eyeos-";
packageType="rpm";
dependencies="nodejs >= 0.8, eyeos-finish-installation";

#############################################
# Copy the package contents to its location #
#############################################

if [ -d "contents" ];then
	rm -rf contents
fi

# installing -> the code
mkdir -p contents/opt
cp -R ../src "contents/opt/$prefix$name"
cp -R ../node_modules "contents/opt/$prefix$name/"
#cp "../smoke-test.sh" "contents/opt/$prefix$name/"

# log files location
mkdir -p contents/var/log/eyeos/$name

if [ -e "$prefix$name.logrotate" ]
then
	mkdir -p "contents/etc/logrotate.d"
	cp "$prefix$name.logrotate" "contents/etc/logrotate.d/$prefix$name"
fi

# nginx config
# mkdir -p contents/etc/eyeos-services
# cp -R "$prefix$name.conf" contents/etc/eyeos-services/

# systemd service config file
mkdir -p contents/usr/lib/systemd/system/
cp -R "$prefix$name.service" contents/usr/lib/systemd/system/

# envars generation
echo "generating envars"
../node_modules/eyeos-builder-utils/generate_envars ../src/settings.js post-finish > contents/opt/$prefix$name/envars
cat contents/opt/$prefix$name/envars

# pre-finish and post-finish
if [ -e pre-finish ]
then
	cp pre-finish contents/opt/$prefix$name
fi

if [ -e post-finish ]
then
	cp post-finish contents/opt/$prefix$name
fi

###############
# Get version #
###############

versionJson="$(../node_modules/eyeos-builder-utils/extractJsonValue ../package.json version)"
if [ -f ../version.properties ];then
	versionGit="$(cat ../version.properties)"
else
	versionGit="$(git describe --all --long | cut -d "-" -f 3)"
fi
version="${versionJson}_${versionGit}"

##################
# Create package #
##################

if [ ! -d "log" ];then
	mkdir log
fi

url="$(../node_modules/eyeos-builder-utils/extractJsonValue ../package.json homepage)"
maintainer="$(../node_modules/eyeos-builder-utils/extractJsonValue ../package.json author)"
description="$(../node_modules/eyeos-builder-utils/extractJsonValue ../package.json description)"

fpm \
	-s dir \
	-t $packageType \
	-a all \
	--after-install scripts/after-install.sh \
	--before-install scripts/before-install.sh \
	--before-remove scripts/before-remove.sh \
	--after-remove scripts/after-remove.sh \
	--name "$prefix$name" \
	--version "$version" \
	--url "$url" \
	--maintainer "$maintainer" \
	--depends "$dependencies" \
	--description "$description" \
	 -C contents/ . 2>&1 | tee -a log/packetizer.log

rm -rf ../pkgs
mkdir ../pkgs
mv *.$packageType ../pkgs/
