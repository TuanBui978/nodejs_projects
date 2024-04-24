const { check, validationResult, body } = require('express-validator');
const { getTuan, getImage, postRegisterUser, postLoginUser, test } = require('../controllers/homeController')
const { getJobList, getJobListByIndustry, getJobListByArea, getJobListByName, createJob, updateJob, deleteJob, getJobListByCompany } = require('../controllers/job.Controllers')
const { getCompanyList, searchCompany, createCompany, updateCompany, deleteCompany, getCompanyById } = require('../controllers/company.Controllers')
const { getIndustryList, updateIndustry, deleteIndustry, createIndustry } = require('../controllers/industry.Controllers')
const { getUserList, createUser, updateUser, deleteUser } = require('../controllers/user.Controllers');
const express = require('express');
const { selectFields } = require('express-validator/src/field-selection');  


const router = express.Router();

router.get('/', test)
router.get('/tuan', getTuan)
router.get('/abc', getImage)

router.post('/register', [
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 8 })
], postRegisterUser);

router.post('/login', [
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 8 })
], postLoginUser);

router.get('/user/user-list', getUserList);

router.post('/user/create', [
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 8 })
], createUser);

router.put('/user/update', [
    body('name').isString().notEmpty(),
    body('gender').isString().notEmpty(),
    body('dateOfBirth').isString().notEmpty(),
], updateUser);

router.delete('/user/delete', deleteUser);

router.get('/job/job-list', getJobList);

router.get('/job/job-list-by-industry', getJobListByIndustry);

router.get('/job/job-list-by-area', getJobListByArea);

router.get('/job/job-list-by-name', getJobListByName);

router.get('/job/job-list-by-company', getJobListByCompany);

router.post('/job/create', [
    body('jobName').isString().notEmpty(),
    body('industry').isString().notEmpty(),
    body('location').isString().notEmpty(),
    body('enrollmentLocation').isString().notEmpty(),
    body('salary').isString().notEmpty(),
    body('genderRequirement').isString().notEmpty(),
    body('numberOfRecruitment').isString().notEmpty(),
    body('ageRequirement').isString().notEmpty(),
    body('probationTime').isString().notEmpty(),
    body('workWay').isString().notEmpty(),
    body('experienceRequirement').isString().notEmpty(),
    body('degreeRequirement').isString().notEmpty(),
    body('benefits').isString().notEmpty(),
    body('jobDescription').isString().notEmpty(),
    body('jobRequirement').isString().notEmpty(),
    body('deadline').isDate().notEmpty()

], createJob);

router.put('/job/update', [
    body('jobName').isString().notEmpty(),
    body('industry').isString().notEmpty(),
    body('location').isString().notEmpty(),
    body('enrollmentLocation').isString().notEmpty(),
    body('salary').isString().notEmpty(),
    body('genderRequirement').isString().notEmpty(),
    body('numberOfRecruitment').isString().notEmpty(),
    body('ageRequirement').isString().notEmpty(),
    body('probationTime').isString().notEmpty(),
    body('workWay').isString().notEmpty(),
    body('experienceRequirement').isString().notEmpty(),
    body('degreeRequirement').isString().notEmpty(),
    body('benefits').isString().notEmpty(),
    body('jobDescription').isString().notEmpty(),
    body('jobRequirement').isString().notEmpty(),
    body('deadline').isDate().notEmpty()
], updateJob)

router.delete('/job/delete', deleteJob);

router.post('/company/create', [
    body('companyName').isString().notEmpty(),
    body('location').isString().notEmpty(),
    body('staffSize').isString().notEmpty(),
    body('companyDescription').isString().notEmpty()
], createCompany);

router.get('/company/company-list', getCompanyList);

router.get('/company/search', searchCompany);

router.put('/company/update', updateCompany);

router.delete('/company/delete', deleteCompany);

router.get('/industry/industry-list', getIndustryList);

router.post('/industry/create', [
    body('industryName').isString().notEmpty()
], createIndustry);

router.get('/company/id', getCompanyById);

router.put('/industry/update', updateIndustry);

router.delete('/industry/delete', deleteIndustry);


module.exports = router;

