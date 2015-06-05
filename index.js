var geocoder              = require("geocoder");
var TwitterLocationStream = require("./twitter_location_stream");

function onError(err) {
  console.error(err);
  process.exit(1);
}

function geocode(location, cb) {

  function onGeocode(err, data) {
    if (err) return cb(err);
    if (data.results.length == 0)
      return cb("No geocoding results.");

    var bounds = data.results[0].geometry.bounds;

    var location = [bounds.southwest.lng,
                    bounds.southwest.lat,
                    bounds.northeast.lng,
                    bounds.northeast.lat].join(",")

    cb(null, location);
  }

  geocoder.geocode(location, onGeocode);
}

function createStream(location, filePath) {
  return new TwitterLocationStream(location, require(filePath));
}

var configFilePath = require("path").
  join(process.env.HOME, "tweets_cli.json");

var start = module.exports = function() {

  if (process.argv.length < 3) {
    onError("Must provide a location.")
  }

  if (!require("fs").existsSync(configFilePath)) {
    onError("Must provide a twitter config file at " + configFilePath);
  }

  geocode(process.argv[2], function(err, location) {
    if (err) return onError(err);

    var stream = createStream(location, configFilePath);

    stream.on("error", onError);

    stream.
      pipe(require("./sentiment")).
      pipe(require("./colorized")).
      pipe(process.stdout);
  });

}
