require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("./logger");
const {NODE_ENV} = require("./config");
const bookmark_Router = require('./bookmarks/bookmark-router');

const app = express();
//const bookmarkRouter = express.Router()

const morganOption = NODE_ENV === "production"
  ? "tiny"
  : "common";

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());
console.log(bookmark_Router)
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})

app.use(bookmark_Router);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = {
      error: {
        message: "server error"
      }
    };
  } else {
    console.error(error);
    response = {
      message: error.message,
      error
    };
  }
  res.status(500).json(response);
});

const bodyParser = express.json();

module.exports = app;
