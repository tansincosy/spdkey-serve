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

main
