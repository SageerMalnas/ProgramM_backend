const express = require("express")
const dotenv= require('dotenv');
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));