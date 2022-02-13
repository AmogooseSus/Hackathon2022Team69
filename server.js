const cookieParser = require("cookie-parser");
//to protect against cross site forgery
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");

const csrfMiddleware = csrf({ cookie: true });

const PORT = 80;//process.env.PORT || 3000;
const app = express();

app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

//this thing was added by me (aka myself) so it correctly exports stuff in exports folder
// app.use(express.static(__dirname + "\\exports"))

app.use("/data",require("./APIs"))

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});


app.get("/", function (req, res) {
  res.render("index.html");
});

app.listen(PORT, "0.0.0.0", 511, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});