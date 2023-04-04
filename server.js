const path = require("path");
const http = require("http");
const dotenv = require("dotenv");

const express = require("express");
const cors = require("cors");

const app = express();
dotenv.config();
app.use(cors());

const server = http.createServer(app);

app.use(express.static("build"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

server.listen(process.env.PORT, () => {
  console.log(`Server listening on PORT: ${process.env.PORT}`);
});
