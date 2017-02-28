#!/bin/bash -e

: ${OPENWEATHER_API_KEY:?"No OPENWEATHER_API_KEY environment variable set."}

function waitForOc {
  sleep 20
  oc logs -f $1 > oc.log 2>&1 &
  C=50
  while [ $C -gt 0 ]
  do
    grep "Push successful" oc.log
    if [ $? -eq 0 ]; then
      echo "${1} deployed."
      echo "" > oc.log
      C=0
    else
      echo -n "."
      C=$(( $C - 1 ))
    fi
    sleep 1
  done
}

oc cluster up
oc login -u developer -p developer

oc new-project node-msa-demo

echo "Starting forecast-service"
oc new-app bucharestgold/centos7-s2i-nodejs:latest~. OPENWEATHER_API_KEY=$OPENWEATHER_API_KEY --name=forecast-service --context-dir=forecast-service
# waitForOc "forecast-service"
oc expose svc/forecast-service

echo "Starting conditions-service"
oc new-app bucharestgold/centos7-s2i-nodejs:latest~. OPENWEATHER_API_KEY=$OPENWEATHER_API_KEY --name=conditions-service --context-dir=conditions-service
# waitForOc "conditions-service"
oc expose svc/conditions-service

echo "Starting frontend"
oc new-app bucharestgold/centos7-s2i-nodejs:latest~. OPENWEATHER_API_KEY=$OPENWEATHER_API_KEY --name=frontend --context-dir=frontend
# waitForOc "frontend"
oc expose svc/frontend

oc get routes | awk '{print $2}' | grep xip.io