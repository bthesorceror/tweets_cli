var through = require("through");
var ansi    = require("simple-ansi");

var stream = through(
  function(data) {
    try {
      var obj = JSON.parse(data.toString("utf8"))

      var color;
      if (obj.sentiment.score < 0) {
        color = ansi.red;
      } else if (obj.sentiment.score > 0) {
        color = ansi.green;
      } else {
        color = ansi.blue;
      }

      var text = color + obj.text + ansi.reset + "\n";

      this.queue(text);
    } catch (e) {
      return;
    }
  }
);

module.exports = stream;
