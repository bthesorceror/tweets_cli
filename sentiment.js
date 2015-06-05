var sentiment = require("sentiment");
var through   = require("through");

var stream = through(
  function(data) {
    try {
      var obj = JSON.parse(data.toString("utf8"))
      obj.sentiment = sentiment(obj.text);

      this.queue(JSON.stringify(obj));
    } catch (e) {
      return;
    }
  }
);

module.exports = stream;

