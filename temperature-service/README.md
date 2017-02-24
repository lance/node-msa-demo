# Temperature Service

This is a simple Node.js microservice that will return current weather conditions in JSON format. Once the service is running, you can visit the `/weather/{q}` with your browser to see something like this.

```sh
$ curl localhost:8080/weather/28804
{ "coord": {
    "lon":-82.55,"lat":35.6
  },
  "weather": [{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"base": "stations",
  "main": {
    "temp":62.6,"pressure":1014,"humidity":67,"temp_min":62.6,"temp_max":62.6
  },
  "visibility": 16093,
  "wind": {
    "speed":8.05,"deg":140
  },
  "clouds": {
    "all":1
  },
  "dt": 1487951640,
  "sys": {
    "type":1,"id":1764,"message":0.011,"country":"US","sunrise":1487937912,"sunset":1487978505},"id":4453066,"name":"Asheville","cod":200
  }
```

The data comes from http://api.openweathermap.org and you will need an Open Weather Map API key to invoke the service.

## Running the service

### localhost

The service can be run standalone by simply invoking node.

```sh
$ OPENWEATHER_API_KEY=<your api key> node .
```

### docker

You can run this service as a docker container by using the [`s2i` tool](https://github.com/openshift/source-to-image) to create a docker image and then running it. Here we use the `bucharestgold/centos7-s2i-nodejs` base docker image to create our application image, named `temperature-service`.

```sh
$ s2i build . bucharestgold/centos7-s2i-nodejs temperature-service
$ docker run -it -p 8080:8080 -eOPENWEATHER_API_KEY=<your api key> temperature-service
```

### openshift container platform

This application works with the newest, and as yet unreleased version of openshift container platform. To run it in this environment, you can use the openshift command line tool, [`oc`](https://github.com/openshift/origin/releases/) to set up a cluster, or use the [Developer CDK](https://developers.redhat.com/products/cdk/overview/).

TODO: Write up the lengthy means by which this can be done.