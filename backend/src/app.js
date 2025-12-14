const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const sweetRoutes = require("./routes/sweet.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

app.use(errorMiddleware);
module.exports = app;
