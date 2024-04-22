const connect = require('../config/database');
const { validationResult } = require('express-validator');

const getAreaList = (req, res) => {
    const query = 'SELECT * FROM Area';
    connect.query(query, (error, results) => {
        if (error) {
            console.error('MySQL Error:', error);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        res.json(results);
    });
}

const createArea = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { AreaName } = req.body;

    try {
        // Kiểm tra xem ngành nghề đã tồn tại chưa
        const [Area] = await connect.promise().query('SELECT ID FROM Area WHERE AREA_NAME = ?', [AreaName]);

        if (Area.length > 0) {
            return res.status(400).send({ error: 'Area already exists' });
        }

        const insertQuery = 'INSERT INTO Area (AREA_NAME) VALUES (?)';
        const [insertResult] = await connect.promise().query(insertQuery, [AreaName]);

        if (insertResult.affectedRows > 0) {
            return res.status(201).send({ message: 'Area created successfully' });
        } else {
            return res.status(500).send({ error: 'Failed to create Area' });
        }
    } catch (err) {
        console.error('Error creating Area:', err);
        return res.status(500).send({ error: 'Error creating Area', message: err.message });
    }
};

const updateArea = async (req, res) => {
    const id = req.query.id;
    const { AreaName } = req.body;

    try {
        const result = await connect.promise().query('UPDATE Area SET AREA_NAME = ? WHERE ID = ?', [AreaName, id]);
        if (result[0].affectedRows === 0) {
            return res.status(404).send({ error: 'Area not found' });

        }
        res.status(200).send({ message: 'Area updated successfully' });

    } catch (err) {
        console.error('Error updating Area:', err);
        return res.status(500).send({ error: 'Error updating Area', message: err.message });
    }
}

const deleteArea = async (req, res) => {
    const id = req.query.id;

    try {
        const result = await connect.promise().query('DELETE FROM Area WHERE ID = ?', [id]);
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ error: 'Area not found' });
        }
        res.status(200).json({ message: 'Area deleted successfully' });
    } catch (err) {
        console.error('Error deleting Area:', err);
        return res.status(500).json({ error: 'Error deleting Area', message: err.message });
    }
};

module.exports = {
    getAreaList,
    createArea,
    updateArea,
    deleteArea
}