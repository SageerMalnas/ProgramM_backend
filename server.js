const express = require("express")
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes')
const cors = require("cors");
bodyParser = require('body-parser');
dotenv.config();

const app = express();
// app.use(express.json());
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


connectDB();
app.use('/api/users', userRoutes);
app.use('/api/task',taskRoutes)
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
})

app.get('/', (req, res) => {
    res.send('Hello server');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// app.listen(process.env.PORT, () => {
//     console.log(`Server running on ${process.env.PORT}`)
//     mongoose.connect(process.env.MONGO_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         serverSelectionTimeoutMS: 30000, // 30 seconds
//         socketTimeoutMS: 45000,          // 45 seconds
//         family: 4
//     }).then(
//         console.log("database connected")
//     ).catch((err) => {
//         console.log(err);
//     })

//     mongoose.connection.on('connected', () => {
//         console.log('Mongoose connected to DB');
//     });

//     mongoose.connection.on('error', (err) => {
//         console.log('Mongoose connection error:', err.message);
//     });

//     mongoose.connection.on('disconnected', () => {
//         console.log('Mongoose disconnected from DB');
//     });

// })