#!/usr/bin/env bash

function main {
    if [ -e bundle ]; then
        echo "Please provide a valid bundle name"
        rm -rf bundle
    fi

    mkdir -p bundle

    cd ..

    yarn prisma generate

    yarn run build

    cp -r dist/* bundle
    cp prisma/schema.prisma bundle

}

function check_node_environment() {
    echo "$1" # arguments are accessible through $1, $2,...
}

function make_app_file() {
    echo "$1" # arguments are accessible through $1, $2,...
}

main
