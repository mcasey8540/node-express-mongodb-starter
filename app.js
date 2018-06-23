// server.js (Node Configuration)

require("dotenv").config();

// set up ======================================================================
var express = require("express");
var request = require("request");
var app = express(); // create our app w/ express
const Promise = require("bluebird");
var mongoose = require("mongoose"); // mongoose for mongodb
var port = process.env.PORT || 8080; // set the port
var morgan = require("morgan"); // log requests to the console (express4)
var bodyParser = require("body-parser"); // pull information from HTML POST (express4)
var methodOverride = require("method-override"); // simulate DELETE and PUT (express4)

// Use bluebird as mongoose promise library
mongoose.Promise = Promise;

// promisify mongoose
Promise.promisifyAll(mongoose);
// configuration ===============================================================

Promise.config({
  cancellation: true
});

require("./config/security.js")(app); // request header settings
app.use(express.static(__dirname + "/public")); // set the static files location /public/img will be /img for users
app.use(morgan("dev")); // log every request to the console
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
app.use(methodOverride());

// health check API
app.get("/", function(req, res) {
  res.json({ message: "Welcome to Express API Server" });
});

// NON API routes ======================================================================

// get an instance of the router for middleware routes
// require('./app/routes/api-routes.js')(app);

// API routes ======================================================================
// require('./app/routes/api/password-reset-questions/password-reset-questions-routes.js')(app);

app.use(function(err, req, res, next) {
  if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "mocha_test") {
    console.log("STACK", err.stack);
    return res.status(err.status || 500).json({
      title: err.title,
      message: err.message,
      success: false,
      stack: err.stack
    });
  } else {
    console.log("STACK", err.stack);
    return res.status(err.status || 500).json({
      title: err.title,
      message: err.message,
      success: false
    });
  }
});

let dbUri = process.env.DATABASE_URI;
if (process.env.NODE_ENV == "test") {
  dbUri = process.env.DATABASE_URI_TEST;
}

// MongoDB.
mongoose
  .connect(dbUri)
  .then(connection => {
    console.log("Connected to MongoDB");
    listen();
  })
  .catch(error => {
    console.log("Error", error.message);
  });

function listen() {
  app.listen(port);
  console.log("Express app started on port " + port);
}

module.exports = {
  app: app
};
