var Entities = require("html-entities").AllHtmlEntities;
var through  = require("through");

var entities = new Entities();

var stream = through(
  function(data) {
    try {
      var obj = JSON.parse(data.toString("utf8"))
      obj.text = entities.decode(obj.text);

      this.queue(JSON.stringify(obj));
    } catch (e) {
      console.dir(e);
      return;
    }
  }
);

module.exports = stream;

