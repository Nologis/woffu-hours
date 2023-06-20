#!/usr/bin/env bash

WEBHOOK_URL="${WEBHOOK_URL}"
MESSAGE="${MESSAGE}"

if [ $1=='start' ]; then
    curl -X POST -H 'Content-type: application/json' --data '{"text":'${MESSAGE}'}' ${WEBHOOK_URL}
else
    curl -X POST -H 'Content-type: application/json' --data '{"text":'${MESSAGE}'}' ${WEBHOOK_URL}
fi



