const express = require('express');
const { handleUploads, handleGetPhotoes, handleDeletePhotos } = require('../controller/uploads');

const verifyToken = require('../middleware/auth');

const router = express.Router();



router.post('/uploads', verifyToken, handleUploads);
router.get('/photos',verifyToken, handleGetPhotoes);
router.delete('/photos/:id',verifyToken, handleDeletePhotos);
module.exports = router;
