const connect = require('../config/database');
const { validationResult } = require('express-validator');

const createCV = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userID = req.query.userID;
    const cvData = req.body;

    try {
        const insertQuery = 'INSERT INTO CV SET ?, USER_ID = ?';
        const result = await connect.promise().query(insertQuery, [cvData, userID]);

        if (result[0].affectedRows === 0) {
            return res.status(500).send({ error: 'Error creating CV', message: 'CV not created' });
        }

        res.status(201).send({ message: 'CV created successfully' });
    } catch (err) {
        console.error('Error creating CV:', err);
        res.status(500).send({ error: 'Error creating CV', message: err.message });
    }
};

const getCVById = async (req, res) => {
    const id = req.query.id;
    try {
        const query = "SELECT * FROM CV WHERE ID = ?";
        const [result] = await connect.promise().query(query, [id]);
        if (result.length == 0) {
            return res.status(404).send({ error: 'CV not found' });
        }
        res.status(200).send(result[0]);
    } catch (err) {
        console.error('Error fetching CV:', err);
        res.status(500).send({ error: 'Error fetching CV', message: err.message });
    }
};
const updateCV = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const ID = req.query.ID;
    const cvData = req.body;

    try {
        const userIDQuery = 'SELECT USER_ID FROM CV WHERE ID = ?';
        const [userIDRows] = await connect.promise().query(userIDQuery, [ID]);
        const userID = userIDRows[0].USER_ID;

        const updateQuery = 'UPDATE CV SET ? WHERE ID = ? AND USER_ID = ?';
        const [result] = await connect.promise().query(updateQuery, [cvData, ID, userID]);

        if (result.affectedRows === 0) {
            return res.status(500).send({ error: 'Error updating CV' });
        }

        res.status(200).send({ message: 'CV updated successfully' });
    } catch (err) {
        console.error('Error updating CV:', err);
        res.status(500).send({ error: 'Error updating CV', message: err.message });
    }
};

const deleteCV = async (req, res) => {
    const id = req.query.id;
    try {
        const [result] = await connect.promise().query(`DELETE FROM CV WHERE ID = ?`, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'CV not found' });
        }
        res.status(200).send({ message: 'CV deleted successfully' });
    } catch (err) {
        console.error('Error deleting CV:', err);
        return res.status(500).send({ error: 'Error deleting CV', message: err.message });
    }
}

module.exports = {
    createCV,
    getCVById,
    updateCV,
    deleteCV
};
