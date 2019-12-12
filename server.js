const express = require("express");
const userRouter = require('./users/userRouter')
const server = express();
server.use(express.json())

//custom middleware
function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      "Origin"
    )}`
  );

  next();
}

server.use("/api/users", userRouter)
server.use(logger);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
