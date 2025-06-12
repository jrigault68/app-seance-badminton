const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./middleware/google-auth");


const app = express();
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());


require("dotenv").config();


app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("API lancée sur http://localhost:" + port));
