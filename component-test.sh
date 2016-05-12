#!/bin/bash
set -x
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
Run the component tests.
Usage: $0 [-h|--help] [-i|--install] [-s|--smoke] [-r|--run-dependencies] [-p|--stop-dependencies]

Component tests script: Runs component tests, also can prepare the environment.
Options:
    [-i|--install]                      Install project dependencies (executes pre-requirements.sh).
    [-s|--smoke]                        Run only smoke tests.
    [-r|--run-dependencies]             Run runtime dependencies (RABBIT, MONGO, MYSQL...) before the tests.
    [-p|--stop-dependencies]            Stop runtime dependencies (RABBIT, MONGO, MYSQL...) after the tests.
    [-h|--help]                         Prints this help message.

$ERROR
USAGE
}

do_component_tests() {
	echo "RUNNING COMPONENT TESTS"
	echo "========================="
	find "$THISDIR"/src/component-test -name '*.test.js' \
		| xargs mocha --ui bdd
}

THISDIR="$(cd "$(dirname "$0")" && pwd)"

do_component_tests
