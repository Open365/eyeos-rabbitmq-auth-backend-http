#!/bin/bash
set -e
set -u

usage() {
	if [ "$*" ]
	then
		ERROR="ERROR: $*"
	else
		ERROR=""
	fi

	cat <<USAGE
Usage: $0 -h

   -h                       show this help and exit.

$ERROR
USAGE
}
if [ "$#" -eq 1 ] && [ "$1" = "-h" -o "$1" = "--help" ]
then
	usage
	exit 0
fi

do_unit_tests() {
	echo "RUNNING UNIT TESTS"
	echo "=================="
	grunt test
}

do_unit_tests
