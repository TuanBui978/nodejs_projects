const connect = require('../config/database');

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
        connect.query(queryJobs, [`${industryName}%`], (error, jobResults) => {
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
        connect.query(queryJobs, [`${areaName}%`], (error, jobResults) => {
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

module.exports = {
    getJobList,
    getJobListByIndustry,
    getJobListByArea,
    getJobListByName
}
