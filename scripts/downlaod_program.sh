#!/usr/bin/env bash

pread_download_urlStr=$1

urls="($(echo "$pread_download_urlStr" | tr ',' ' '))"

for xml_url in "${urls[@]}"; do
    echo "Downloading $xml_url"
    curl -k "$xml_url" >>tmp/program/$xml_url
    endFlag=$?
    if [ $endFlag -ne 0 ]; then
        echo "Download failed"
    fi
done
