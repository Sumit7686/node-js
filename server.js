const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const { isCelebrateError } = require("celebrate");

// Init Router
const env = require("./app/config/env");
const connect = require("./app/config/database");
const routes = require("./app/routes");

// define global variable
global.appRoot = path.resolve(__dirname);

// Routes initialization
app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
routes(app);

// API Health check
app.all("/api/health-check", (req, res) =>
  res.status(200).json({
    status: 200,
    message: `Working Fine - ENV: ${String(env.NODE_ENV)}`,
  })
);

app.get("/", async (req, res) => {
  return res.status(200).json({ status: true, message: "Hello | MyG_Backend" });
});

// Invalid Route
app.all("/api/*", (req, res) =>
  res.status(400).json({ status: 400, message: "Bad Request" })
);

let errorHandling = (err, req, res, next) => {
  let message = err.message;
  console.log("err::", err);
  if (isCelebrateError(err)) {
    message = "Invalid validation error";
    console.log("Joi validation err...", err);
    const errorBody = err.details.get("body");
    const errorParams = err.details.get("params");
    const errorQuery = err.details.get("query");

    const {
      details: [errorDetails],
    } = errorBody || errorParams || errorQuery;

    if (errorDetails?.message)
      message = errorDetails.message.replace(/['"]+/g, ""); // Remove double quotes

    return res.status(400).send({ status: false, statusCode: 400, message });
  } else if (MulterError) {
    return res.status(400).send({ status: false, statusCode: 400, message });
  } else {
    return next(err);
  }
};
app.use(errorHandling);

// start the server & connect to Mongo
connect(env.DB_CONNECTION_STRING)
  .then(async () => {
    console.log("Database Connected...");
  })
  .catch((e) => {
    console.log("e :::", e);
    if (e.name === "MongoParseError") {
      console.error(
        `\n\n${e.name}: Please set NODE_ENV to "production", "development", or "staging".\n\n`
      );
    } else if (e.name === "MongoNetworkError") {
      console.error(`\n\n${e.name}: Please start MongoDB...\n\n`);
    } else {
      console.log(e);
    }
  });

//Socket Code
const Http = require("http").createServer(app);
const socketConnection = require("./app/socket/socket");
const { MulterError } = require("multer");
socketConnection(Http);

module.exports = { Http };
