const { check, validationResult } = require('express-validator');
const { getTuan, getImage, postRegisterUser, postLoginUser, test} = require('../controllers/homeController')
const express = require('express');
const { selectFields } = require('express-validator/src/field-selection');

const router = express.Router();

router.get('/', test)
router.get('/tuan', getTuan)
router.get('/abc', getImage)

router.post('/register', [
    check('email', 'email is wrong type').isEmail(),
    check('password', 'password is too short').isLength({ min: 8 })], 
    postRegisterUser)

router.post('/login', [
    check('email', 'email is empty').notEmpty(),
    check('email', "email is wrong type").isEmail(),
    check('password', 'password is too short').isLength({min: 8})], 
    postLoginUser)
module.exports = router;
 