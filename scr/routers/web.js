const { check, validationResult, body } = require('express-validator');
const { getTuan, getImage, postRegisterUser, postLoginUser, test } = require('../controllers/homeController')
const { getJobList, getJobListByIndustry, getJobListByArea, getJobListByName, createJob, updateJob, deleteJob, getJobListByCompany, getJobListById} = require('../controllers/job.Controllers')
const { getCompanyList, searchCompany, createCompany, updateCompany, deleteCompany, getCompanyById } = require('../controllers/company.Controllers')
const { getIndustryList, updateIndustry, deleteIndustry, createIndustry } = require('../controllers/industry.Controllers')
const { getUserList, createUser, updateUser, deleteUser, getUserListByName, toAdmin } = require('../controllers/user.Controllers');
const { getAreaList, createArea, updateArea, deleteArea } = require('../controllers/area.Controllers');
const { createCV, updateCV, deleteCV, getCVById, uploadCV, getFile } = require('../controllers/cv.Controllers');
const { createUserJob, deleteUserJob, findUserJob, getApplyList, getUserListByJob } = require('../controllers/userjob.Controllers');
const multer = require('multer');
const appRoot = require('app-root-path')

const express = require('express');
const { selectFields } = require('express-validator/src/field-selection');  


const router = express.Router();

const PDFFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(pdf)$/)) {
        req.fileValidationError = 'Only PDF files are allowed!';
        return cb(new Error('Only PDF files are allowed!'), false);
    }
    if (/[^\u0000-\u00ff]/.test(file.originalname)) {
        return cb(new Error('Path have unicode!'), false);
    }
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, appRoot.path + '\\scr\\public\\image');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});

let upload = multer({storage: storage, fileFilter: PDFFilter});

router.get('/cv/my-cv', getFile);
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

router.get('/job/job-list-by-id', getJobListById);

router.post('/job/create', createJob);

router.put('/job/update', updateJob)

router.delete('/job/delete', deleteJob);

router.post('/company/create', [
    body('companyName').isString().notEmpty(),
    body('companyLocation').isString().notEmpty(),
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

router.get('/area/area-list', getAreaList);

router.post('/area/create', [
    body('AreaName').isString().notEmpty()
], createArea);

router.put('/area/update', updateArea);

router.delete('/area/delete', deleteArea);


router.post('/user/my-cv/create', [
    body('Name').isString().notEmpty(),
    body('date_of_birth').isDate().notEmpty(),
    body('gender').isString().notEmpty(),
    body('address').isString().notEmpty(),
    body('city').isString().notEmpty(),
    body('phone_number').isMobilePhone().notEmpty(),
    body('linkedin_link').isURL(),
    body('github_link').isURL(),
    body('self_introduction').isString().notEmpty(),
    body('experience').isString().notEmpty(),
    body('skills').isString().notEmpty(),
    body('education').isString().notEmpty(),
    body('language_skills').isString(),
    body('certificates').isString()
], createCV);

router.get('/user/my-cv/getCV', getCVById);

router.put('/user/my-cv/update', [
    body('Name').isString().notEmpty(),
    body('date_of_birth').isDate().notEmpty(),
    body('gender').isString().notEmpty(),
    body('address').isString().notEmpty(),
    body('city').isString().notEmpty(),
    body('phone_number').isMobilePhone().notEmpty(),
    body('linkedin_link').isURL(),
    body('github_link').isURL(),
    body('self_introduction').isString().notEmpty(),
    body('experience').isString().notEmpty(),
    body('skills').isString().notEmpty(),
    body('education').isString().notEmpty(),
    body('language_skills').isString(),
    body('certificates').isString()
], updateCV);

router.delete('/user/my-cv/delete', deleteCV);

router.post('/user/user-job/create', createUserJob);

router.delete('/user/user-job/delete', deleteUserJob);

router.get('/user/user-job/my-apply-job', findUserJob);

router.get('/user/user-job/my-apply-job-list', getApplyList);

router.get('/user/search', getUserListByName);

router.put('/user/to-admin', toAdmin);

router.post('/cv/upload', upload.single('file'), uploadCV);

router.get('/job/apply-list', getUserListByJob);


module.exports = router;
