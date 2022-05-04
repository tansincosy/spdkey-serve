#!/usr/bin/env bash
. ./scripts/common.sh

function main() {

    local file_name=tmp/program_result
    local all_xml=(tmp/program/*.xml)

    mkdir_if_not_exist "$file_name"

    dare_file=$(date +"%Y-%m-%d %H:%M:%S").xml
    log "INFO" "begin merge channel info to $dare_file"
    grep "<channel" -h "${all_xml[@]}" >>$file_name/"$dare_file"
    log "INFO" "merge success!!"
}

main
