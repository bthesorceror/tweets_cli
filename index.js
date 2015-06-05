var geocoder = require("geocoder");

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

if (process.argv.length < 3) {
  onError("Must provide a location.")
}

geocode(process.argv[2], function(err, location) {
  if (err) return onError(err);

  console.dir(location);
});
