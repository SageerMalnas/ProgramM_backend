const express = require("express")
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');


dotenv.config();

const app = express();
app.use(express.json());

connectDB();
app.use('/api/auth',authRoutes);
app.use((err,req,res,next) =>{
    res.status(500).json({message: err.message});
})

app.get('/', (req,res) =>{
    res.send('Hello server');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));