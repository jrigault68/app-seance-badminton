const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
require("./middleware/google-auth");

const app = express();

const allowedOrigins = [
  "https://coach.csbw.fr",
  "http://localhost:5173",
  "http://localhost:5000",
  "https://api.csbw.fr"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Cas spécial pour les health checks Render (souvent sans origin)
    if (process.env.NODE_ENV === "production" && origin === undefined) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());

// Routes
app.use("/auth", require("./routes/auth"));



const port = process.env.PORT || 5000;
app.listen(port, () => console.log("API lancée sur http://localhost:" + port));
