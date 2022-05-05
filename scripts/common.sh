#!/bin/bash

# 日志组件
filname=$(basename "$0")

logFile=logs/scirpts.log
function log {
    log_level=$1
    log_message=$2
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] [$log_level] [$filname]- $log_message" >>"$logFile"

}

function mkdir_if_not_exist {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
        log "INFO" "create $1 success!"
    fi
}
