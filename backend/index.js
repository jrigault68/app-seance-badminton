const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("API lancée sur http://localhost:" + port));
