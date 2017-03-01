#!/bin/bash -e

: ${OPENWEATHER_API_KEY:?"No OPENWEATHER_API_KEY environment variable set."}

oc cluster up
oc login -u developer -p developer

oc new-project node-msa-demo

echo "Creating forecast service build"
oc new-build --binary --name=forecast -l app=forecast

echo "Building forecast service"
cd forecast-service && npm install && cd ..
oc start-build forecast --from-dir=./forecast-service --follow

echo "Starting forecast service"
oc new-app forecast OPENWEATHER_API_KEY=$OPENWEATHER_API_KEY -l app=forecast
oc expose svc/forecast

echo "Creating conditions service build"
oc new-build --binary --name=conditions -l app=conditions

echo "Building conditions service"
cd conditions-service && npm install && cd ..
oc start-build conditions --from-dir=./conditions-service --follow

echo "Starting conditions service"
oc new-app conditions OPENWEATHER_API_KEY=$OPENWEATHER_API_KEY -l app=conditions
oc expose svc/conditions

echo "Creating frontend build"
oc new-build --binary --name=frontend -l app=frontend

echo "Building frontend"
cd frontend && npm install && cd ..
oc start-build frontend --from-dir=./frontend --follow

echo "Starting frontend"
oc new-app node-msa-demo/frontend -l app=frontend
oc expose svc/frontend

oc get routes

open https://127.0.0.1:8443/console