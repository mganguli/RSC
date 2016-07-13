#!/bin/bash
unset http_proxy
unset https_proxy

python plasma/plasma/cmd/api.py --config-file=plasma/etc/plasma.conf 

