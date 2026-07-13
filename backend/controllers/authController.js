const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async(req, res) => {
    try{
        const {username, password} = req.body;

        //check if user already exist
        const userExists = await User.findOne({username});
        if(userExists){
            return res.status(400).json({message: 'Username is already taken'});
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user with hashed password
        const newUser = await User.create({
            username,
            password: hashedPassword
        });

        res.status(201).json({message: 'User registered successfully!'});        
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration', error: error.message});
    }
};

exports.login = async(req, res) => {
    try{
        const {username, password} = req.body;

        //find user by username
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        //compared entered password with hashed database password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Wrong password'});
        }

        //when user is legit, generate a jwt token valid for 1 day
        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {id: user._id, username: user.username}
        });
    } catch (error){
        res.status(500).json({message: 'Server error during login', error: error.message});
    }
};