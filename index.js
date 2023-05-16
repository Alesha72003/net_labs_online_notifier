const ApplyMiddleware = require("./middlewares");
const express = require("express");

const app = express();

console.log("Connect middlewares");
ApplyMiddleware(app);

app.listen(4100);
console.log("Listen 4100");