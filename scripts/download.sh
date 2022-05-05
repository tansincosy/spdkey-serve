#!/usr/bin/env bash
. ./scripts/common.sh

# 地址
source_file="$1"
# 下载到的目录
target_file="$2"

# 文件目录
targetPath=$(dirname "$target_file")

mkdir_if_not_exist "$targetPath"

log "INFO" "source_file = $source_file target_file =$target_file"

curl -k "$source_file" >"$target_file"

result=$?

if [ $result -ne 0 ]; then
    log "ERROR" "curl download failed"
    exit 1
fi

log "INFO" "downloaded $source_file to $target_file result code $result"

exit $result
