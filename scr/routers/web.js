const { check, validationResult } = require('express-validator');
const { getTuan, getImage, postRegisterUser, postLoginUser} = require('../controllers/homeController')

const express = require('express');

const router = express.Router();

router.get('/tuan', getTuan)
router.get('/abc', getImage)
router.post('/register', [
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 8 })
    ], postRegisterUser)
router.post('/login', [
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 8 })
], postLoginUser)
module.exports = router;
