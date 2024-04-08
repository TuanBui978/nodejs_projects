const { check, validationResult } = require('express-validator');
const { getTuan, getImage, postRegisterUser, postLoginUser, test } = require('../controllers/homeController')
const { getJobList, getJobListByIndustry, getJobListByArea, getJobListByName } = require('../controllers/job.Controllers')
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
    check('password', 'password is too short').isLength({ min: 8 })],
    postLoginUser)

router.get('/jobs/jobList', getJobList)

router.get('/jobs/jobListByIndustry', getJobListByIndustry)

router.get('/jobs/jobListByArea', getJobListByArea)

router.get('/jobs/jobListByName', getJobListByName)

module.exports = router;
