const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
require("./middleware/google-auth");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());

// Routes
app.use("/api/auth", require("./routes/auth"));


const port = process.env.PORT || 5000;
app.listen(port, () => console.log("API lancée sur http://localhost:" + port));
