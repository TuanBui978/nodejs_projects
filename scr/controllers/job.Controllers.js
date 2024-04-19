const connect = require('../config/database');
require('dotenv').config();
const { validationResult } = require('express-validator');
const { searchCompany, createCompany } = require('./company.Controllers');
const axios = require('axios');
const PORT = process.env.PORT;

const getJobList = (req, res) => {
    const query = 'SELECT * FROM JOB';
    connect.query(query, (error, results) => {
        if (error) {
            console.error('MySQL Error:', error);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        res.json(results);
    });
}

const getJobListByIndustry = (req, res) => {
    const industry_id = req.query.industry_id;

    // Thực hiện truy vấn SQL để lấy tên ngành dựa trên industry_id
    const query = 'SELECT INDUSTRY_NAME FROM INDUSTRY WHERE INDUSTRY_ID = ?';
    connect.query(query, [industry_id], (error, results) => {
        if (error) {
            console.error('MySQL Error:', error);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        // Kiểm tra xem có kết quả từ truy vấn hay không
        if (results.length === 0) {
            res.status(404).json({ error: 'Industry not found' });
            return;
        }

        // Lấy tên ngành từ kết quả của truy vấn
        const industryName = results[0].INDUSTRY_NAME;

        // Sử dụng tên ngành để lấy danh sách công việc từ API
        const queryJobs = 'SELECT * FROM JOB WHERE INDUSTRY LIKE ?';
        connect.query(queryJobs, [`%${industryName}%`], (error, jobResults) => {
            if (error) {
                console.error('MySQL Error:', error);
                res.status(500).json({ error: 'Server Error' });
                return;
            }
            res.json(jobResults);
        });
    });
};

const getJobListByArea = (req, res) => {
    const area_id = req.query.area_id;

    // Thực hiện truy vấn SQL để lấy tên khu vực dựa trên area_id
    const query = 'SELECT AREA_NAME FROM AREA WHERE ID = ?';
    connect.query(query, [area_id], (error, results) => {
        if (error) {
            console.error('MySQL Error:', error);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        // Kiểm tra xem có kết quả từ truy vấn hay không
        if (results.length === 0) {
            res.status(404).json({ error: 'Area not found' });
            return;
        }

        // Lấy tên khu vực từ kết quả của truy vấn
        const areaName = results[0].AREA_NAME;

        // Sử dụng tên khu vực để lấy danh sách công việc từ API
        const queryJobs = 'SELECT * FROM JOB WHERE ENROLLMENT_LOCATION LIKE ?';
        connect.query(queryJobs, [`%${areaName}%`], (error, jobResults) => {
            if (error) {
                console.error('MySQL Error:', error);
                res.status(500).json({ error: 'Server Error' });
                return;
            }
            res.json(jobResults);
        });
    });
};

const getJobListByName = (req, res) => {
    const jobName = req.query.jobName;

    const query = 'SELECT * FROM JOB WHERE JOB_NAME LIKE ?';
    connect.query(query, [`%${jobName}%`], (error, results) => {
        if (error) {
            console.error('MySQL Error:', error);
            res.status(500).json({ error: 'Server Error' });
            return;
        }

        res.json(results);
    });
};

const createJob = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const jobData = req.body;
    const { COMPANY_NAME } = jobData;

    try {
        // Kiểm tra nếu công ty đã tồn tại
        const [Company] = await connect.promise().query('SELECT ID FROM COMPANY WHERE COMPANY_NAME = ?', [COMPANY_NAME]);
        if (Company && Company.length > 0) {
            const companyId = Company[0].ID;
            insertJob(companyId);
        } else {
            // Nếu không tồn tại, tạo mới công ty và thêm công việc
            const companyData = {
                companyName: COMPANY_NAME,
                location: jobData.LOCATION,
                staffSize: jobData.STAFF_SIZE,
                companyDescription: jobData.COMPANY_DESCRIPTION
            };
            const companyResponse = await axios.post(`http://localhost:${PORT}/company/create`, companyData);
            const companyId = companyResponse.data.companyId;
            insertJob(companyId);
        }
    } catch (err) {
        console.error('Error creating company:', err);
        return res.status(500).send({ error: 'Error creating company', message: err.message });
    }

    function insertJob(companyId) {

        jobData.COMPANY_ID = companyId;
        delete jobData.COMPANY_NAME;

        const insertQuery = `INSERT INTO JOB SET ?, POSTED_DATE = DATE_FORMAT(NOW(), '%d-%m-%Y %H:%i')`;

        connect.query(insertQuery, jobData, (err, result) => {
            if (err) {
                console.error('Error creating job:', err);
                return res.status(500).send({ error: 'Error creating job', message: err.message });
            }
            res.status(201).send({ message: 'Job created successfully', jobId: result.insertId });
        });
    }
};

const updateJob = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const id = req.query.id;
    const jobData = req.body;

    try {
        const result = await connect.promise().query(`UPDATE JOB SET ? WHERE JOB_ID = ?`, [jobData, id]);
        if (result[0].changedRows === 0) {
            return res.status(404).send({ error: 'Job not found' });
        }
        res.status(200).send({ message: 'Job updated successfully' });
    } catch (err) {
        console.error('Error updating job:', err);
        return res.status(500).send({ error: 'Error updating job', message: err.message });
    }
}

const deleteJob = async (req, res) => {
    const id = req.query.id;
    try {
        const result = await connect.promise().query(`DELETE FROM JOB WHERE JOB_ID = ?`, [id]);
        if (result[0].affectedRows === 0) {
            return res.status(404).send({ error: 'Job not found' });
        }
        res.status(200).send({ message: 'Job deleted successfully' });
    } catch (err) {
        console.error('Error delete job:', err);
        return res.status(500).send({ error: 'Error delete job', message: err.message });
    }
}

module.exports = {
    getJobList,
    getJobListByIndustry,
    getJobListByArea,
    getJobListByName,
    createJob,
    updateJob,
    deleteJob
}
