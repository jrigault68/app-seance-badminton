const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
require("./middleware/google-auth");

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("origin : ", origin);
      const allowed = [
        "http://localhost:5173",
        "https://app-seance-badminton-3u1t.vercel.app"
      ];
      const isVercelPreview = /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (!origin || allowed.includes(origin) || isVercelPreview) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());

// Routes
app.use("/api/auth", require("./routes/auth"));


const port = process.env.PORT || 5000;
app.listen(port, () => console.log("API lancée sur http://localhost:" + port));
