// config/security.js

module.exports = function(app) {
  // Add headers
  app.use(function(req, res, next) {
    var allowedOrigins = ["http://localhost:*"];
    var origin = req.headers.origin;

    //console.log("REQ HEADERS ORIGIN", req.headers.origin)

    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    // Request methods you wish to allow
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.header(
      "Access-Control-Allow-Headers",
      "accept, x-access-token, X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header("Access-Control-Allow-Credentials", false);

    //Return a 200 for preflight requests
    if ("OPTIONS" === req.method) {
      //console.log('OPTIONS method requested')
      res.send(200);
    } else {
      next();
    }
  });
};
