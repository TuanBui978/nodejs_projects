const connect = require('../config/database');
const { validationResult } = require('express-validator');

const getIndustryList = (req, res) => {
    const query = 'SELECT * FROM INDUSTRY';
    connect.query(query, (error, results) => {
        if (error) {
            console.error('MySQL Error:', error);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        res.json(results);
    });
}

const createIndustry = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { industryName } = req.body;

    try {
        // Kiểm tra xem ngành nghề đã tồn tại chưa
        const [Industry] = await connect.promise().query('SELECT INDUSTRY_ID FROM INDUSTRY WHERE INDUSTRY_NAME = ?', [industryName]);

        if (Industry.length > 0) {
            return res.status(400).send({ error: 'Industry already exists' });
        }

        const insertQuery = 'INSERT INTO INDUSTRY (INDUSTRY_NAME) VALUES (?)';
        const [insertResult] = await connect.promise().query(insertQuery, [industryName]);

        if (insertResult.affectedRows > 0) {
            return res.status(201).send({ message: 'Industry created successfully' });
        } else {
            return res.status(500).send({ error: 'Failed to create industry' });
        }
    } catch (err) {
        console.error('Error creating industry:', err);
        return res.status(500).send({ error: 'Error creating industry', message: err.message });
    }
};

const updateIndustry = async (req, res) => {
    const id = req.query.id;
    const { industryName } = req.body;

    try {
        const result = await connect.promise().query('UPDATE INDUSTRY SET INDUSTRY_NAME = ? WHERE INDUSTRY_ID = ?', [industryName, id]);
        if (result[0].affectedRows === 0) {
            return res.status(404).send({ error: 'Industry not found' });

        }
        res.status(200).send({ message: 'Industry updated successfully' });

    } catch (err) {
        console.error('Error updating industry:', err);
        return res.status(500).send({ error: 'Error updating industry', message: err.message });
    }
}

const deleteIndustry = async (req, res) => {
    const id = req.query.id;

    try {
        const result = await connect.promise().query('DELETE FROM INDUSTRY WHERE INDUSTRY_ID = ?', [industryId]);
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ error: 'Industry not found' });
        }
        res.status(200).json({ message: 'Industry deleted successfully' });
    } catch (err) {
        console.error('Error deleting industry:', err);
        return res.status(500).json({ error: 'Error deleting industry', message: err.message });
    }
};

module.exports = {
    getIndustryList,
    createIndustry,
    updateIndustry,
    deleteIndustry
}