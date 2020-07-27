/** @format */

if (process.env.NODE_ENV === "production") {
  //환경 변수임.
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
