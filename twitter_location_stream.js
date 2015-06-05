var Twitter  = require("node-tweet-stream");
var Readable = require("stream").Readable;

require("util").inherits(TwitterLocationStream, Readable);

function translate(tweet) {
  if (!tweet.geo) return;

  var data = {
    text: tweet.text,
    lat: tweet.geo.coordinates[0],
    lng: tweet.geo.coordinates[1],
    screen_name: tweet.user.screen_name,
    name: tweet.user.name
  };

  return data;
}

module.exports = TwitterLocationStream;

function TwitterLocationStream(location, config, options) {
  Readable.call(this, options);

  var self    = this;
  this.ready  = false;
  this.client = new Twitter(config);

  this.client.location(location);

  this.client.on("tweet", function(tweet) {
    var translated = translate(tweet);

    if (translated && self.ready) {
      self.ready = self.push(JSON.stringify(translated));
    }
  });

  this.client.on("error", this.emit.bind(this, "error"));
}

TwitterLocationStream.prototype._read = function(size) {
  this.ready = true;
}

