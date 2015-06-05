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
                    bounds.northeast.lat].join(",");

    cb(null, location);
  }

  geocoder.geocode(location, onGeocode);
}

var configFilePath = require("path").
  join(process.env.HOME, "tweets_cli.json");

function createStream(location) {
  return new TwitterLocationStream(
    location,
    require(configFilePath)
  );
}

function checkForLocation() {
  if (process.argv.length > 2) return;

  var err = new Error("Must provide a location.")
  onError(err);
}

function checkForConfig() {
  if (require("fs").existsSync(configFilePath)) return;

  var msg = "Must provide a twitter config file at " + configFilePath;
  var err = new Error(msg);
  onError(err);
}

var start = module.exports = function() {

  checkForLocation();
  checkForConfig();

  geocode(process.argv[2], function(err, location) {
    if (err) return onError(err);

    var stream = createStream(location);

    stream.on("error", onError);

    stream.
      pipe(require("./decoder")).
      pipe(require("./sentiment")).
      pipe(require("./colorized")).
      pipe(process.stdout);
  });

}
