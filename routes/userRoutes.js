const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const { getProfile, updateProfile, updateAvatar } = require('../controllers/userControllers');

router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);
router.post('/me/avatar', auth, upload.single('avatar'), updateAvatar);

module.exports = router;
