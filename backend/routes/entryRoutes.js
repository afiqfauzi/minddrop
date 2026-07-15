const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {createEntry, getEntries} = require('../controllers/entryController');

//apply the guard (authMiddleware) to these routes
router.post('/', authMiddleware, createEntry);
router.get('/', authMiddleware, getEntries);

module.exports = router;