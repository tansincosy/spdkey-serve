#!/usr/bin/env bash

source_file="$1"
target_file="$2"

curl -k -o "$source_file" >>"$target_file"

echo "Downloaded $source_file to $target_file"

exit $?
