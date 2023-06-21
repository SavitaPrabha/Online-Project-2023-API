const express = require("express");




const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});



module.exports = router;

function middleware(req, res, next) {
  let { reqId, ...body } = req.body;
  // Created promise from request body
  let descriptionPromise = JsonReader(body); // Asynchronous call returns a
  promise;
  // Sequential Step
  // 1. Create description from Body(JSON)
  // 2. Execute mathOperation function
  descriptionPromise
    .then((descriptionString) => {
      req.body.description = descriptionString;
      return runMathOperation(descriptionString); // Asynchronous call
      // returns a promise
    })
    .then((stdout, stderr) => {
      req.body.stdout = stdout.stdout;
      next();
    })
    .catch((err) => {
      let parseErr = {};
      parseErr["reqId"] = reqId;
      if (err.stdout[0] === "*") {
        err = err.stdout.slice(22);
        parseErr["errorMsg"] = err;
        res.status(450); //Math Error
        res.statusMessage = "MathError";
      } else {
        res.statusMessage = "ServerError";
        parseErr["errorMsg"] = err;
        res.status(500);
      }
      res.send(parseErr);
    });
}
