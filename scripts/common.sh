#!/usr/bin/env bash

# 日志组件
filname=$(basename "$0")
function log {
    log_level=$1
    log_message=$2
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] [$log_level] [$filname]- $log_message" >>logs/scirpts.log
}
