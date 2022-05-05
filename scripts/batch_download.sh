#!/bin/bash

DIRECTORY=$(cd $(dirname $0) && pwd)

. ./$DIRECTORY/common.sh

pread_download_urlStr=$1

target_file_path=$2

urls="$(echo "$pread_download_urlStr" | tr ',' ' ')"

log "INFO" "begin call batch download"

for xml_url in $urls; do

    filename=$(basename "$xml_url")
    log "INFO" "begin download $filename"

    sh ./scripts/download.sh "$xml_url" "$target_file_path"/"$filename"
    endFlag=$?
    if [ $endFlag -ne 0 ]; then
        log "ERROR" "$xml_url download failed"
    fi
done

exit $?
