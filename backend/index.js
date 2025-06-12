const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
require("./middleware/google-auth");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://app-seance-badminton-3u1t.vercel.app",
  "https://app-seance-badminton-3u1t-*-gloumy68s-projects.vercel.app"
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
			console.log('origin : ', origin);
			if (!origin) return callback(null, true); // autorise Postman/local server
			if (allowedOrigins.includes(origin)) return callback(null, true);
			return callback(new Error("Not allowed by CORS"));
		  },
    credentials: false,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());

// Routes
app.use("/api/auth", require("./routes/auth"));

app.options("*", cors());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("API lancée sur http://localhost:" + port));
