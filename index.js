const express = require("express");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const dotenv = require("dotenv");
const path = require('path');
const authRoutes = require("./route/user");
const uploadRoute = require('./route/uploads')
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8000;

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRoutes);
app.use('/api', uploadRoute);

app.get("/", (req, res)=>{
  app.send('server chal rha h sab mast h')
})

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

