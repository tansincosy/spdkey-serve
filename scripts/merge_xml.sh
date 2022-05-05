#!/bin/bash
. ./scripts/common.sh

target_file_path="$1"
function main() {

    local all_xml=(tmp/program/*.xml)
    mkdir_if_not_exist "$target_file_path"

    date_file=$(date +"%Y-%m-%d %H:%M:%S").xml
    log "INFO" "begin merge channel info to $date_file"
    grep "<channel" "${all_xml[@]}" >"$target_file_path/$date_file"
    log "INFO" "merge success!!"
    echo "$date_file"
}

main

exit 0
