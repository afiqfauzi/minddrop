const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes'); //import auth routes

const app = express();

//Global Security & Utility Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

//rate limiting
const limiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

//link auth routes to url path
app.use('/api/auth', authRoutes);

app.get('/', (req, res) =>{
    res.send('MindDrop API is running smoothly!');
});

//mongodb connection
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB successfully.'))
    .catch((err) => {
        console.error(' Database connection error:', err.message);
        process.exit(1);
    });

//test route
app.get('/test', (req, res) => {
    res.status(200).json({message: "API is up and running safely!"});
})

//start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})