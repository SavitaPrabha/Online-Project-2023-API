
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const config_Server = require("./config/Server")

dotenv.config();

app.use(cors());
app.use(helmet());
const indexRouter = require("./routes/index");
const customerRouter = require("./routes/customers");
const courseCategoryRouter = require("./routes/courseCategory");
const courseRouter = require("./routes/courses");

require("./db/db");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/customers", customerRouter);
app.use("/category", courseCategoryRouter);
app.use("/courses", courseRouter);



// cors job

//require("./services/cronJob")

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports.handler = config_Server(app);