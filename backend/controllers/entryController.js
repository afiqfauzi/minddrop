const Entry = require('../models/Entry');

//Create new entry
exports.createEntry = async (req, res) => {
    try{
        const {title, content, tags} = req.body;

        // use req.user.userId from authMiddleware
        const newEntry = await Entry.create({
            userId: req.user.userId,
            title,
            content,
            tags
        });

        res.status(201).json(newEntry);        
    } catch (error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

//get all entries for the logged-in user
exports.getEntries = async (req, res) => {
    try{
        const entries = await Entry.find({userId: req.user.userId});
        res.status(200).json(entries);
    } catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
};