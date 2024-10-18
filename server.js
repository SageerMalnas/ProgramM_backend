const express = require("express")
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const cors = require("cors");
bodyParser = require('body-parser');
dotenv.config();

const app = express();
// app.use(express.json());
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

connectDB();
app.use('/api/users',userRoutes);
app.use((err,req,res,next) =>{
    res.status(500).json({message: err.message});
})

app.get('/', (req,res) =>{
    res.send('Hello server');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));