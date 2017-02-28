# forecast Service

This is a simple Node.js microservice that will return current weather forecasts in JSON format. Once the service is running, you can visit the `/forecast/{q}` with your browser.

The data comes from http://api.openweathermap.org and you will need an Open Weather Map API key to invoke the service.

## Running the service

### localhost

The service can be run standalone by simply invoking node.

```sh
$ OPENWEATHER_API_KEY=<your api key> node .
```
Browse to `http://localhost:8080/forecast/28804`.

### Docker

You can run this service as a docker container by using the [`s2i` tool](https://github.com/openshift/source-to-image) to create a docker image and then running it. Here we use the `bucharestgold/centos7-s2i-nodejs` base docker image to create our application image, named `forecast-service`.

```sh
$ s2i build . bucharestgold/centos7-s2i-nodejs forecast-service
$ docker run -it -p 8080:8080 -eOPENWEATHER_API_KEY=<your api key> forecast-service
```

Browse to `http://localhost:8080/forecast/28804`.

### OpenShift Container Platform

This application works with the latest version of OpenShift Container Platform. To run it in this environment, you can use the openshift command line tool, [`oc`](https://github.com/openshift/origin/releases/) to set up a cluster, or use the [Developer CDK](https://developers.redhat.com/products/cdk/overview/).

Setting up the CDK environment is beyond the scope of this README. The simplest method of getting the Container Platform running is to just run `oc cluster up`.

Assuming you have the latest OpenShift Container Platform running, you can run the app from the parent directory, `node-msa-demo` by issuing the following command.

```sh
$ oc new-app bucharestgold/centos7-s2i-nodejs:7.6.0~. OPENWEATHER_API_KEY=<your api key> --name=forecast-service --context-dir=forecast-service
$ oc expose svc/forecast-service
```

Browse to `http://<generated-url>/forecast/28804`.