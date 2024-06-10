const { path } = require('app-root-path');
const connect = require('../config/database');
const { validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('node:fs');


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
        const query = "SELECT * FROM CV WHERE USERID = ?";
        const [result] = await connect.promise().query(query, [id]);
        if (result.length == 0) {
            return res.status(404).send({ error: 'CV not found' });
        }
        res.status(200).json(result);
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
        const userIDQuery = 'SELECT PATH FROM CV WHERE ID = ?';
        const [pathRows] = await connect.promise().query(userIDQuery, [id]);
        if (pathRows.length == 0) {
            return res.status(400).send({error: "Not found"});
        }
        const path = pathRows[0].PATH;
        const isEnd = false;
        fs.unlink(path, (err)=>{
            if (err) {
                isEnd = true;
               return console.log(err);
            }
        });
        if (isEnd) return res.status(500).send({ error: 'fails on delete CV' });;
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

let upload = multer().single('file');

const uploadCV = async (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    // const userID = req.query.userID;
    // const file = req.body.file
    
   

    const id = req.query.id;
    const fileName = req.file.originalname;

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any


        try {
            const query = 'INSERT INTO CV (USERID, FILENAME, PATH) VALUES (?, ?, ?)';
            connect.query(query, [id, fileName,`${req.file.path}`]);
            res.status(200).send({message: 'Success' });
        } catch (err) {
            console.error('Error fetching CV:', err);
            return res.status(500).send({ error: 'Error fetching CV', message: err.message });
        }
        

        if (req.fileValidationError) {
            return res.status(500).send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.status(500).send({error: 'Please select an file to upload'});
        }
        else if (err instanceof multer.MulterError) {
            return res.status(500).send({error: err});
        }
        else if (err) {
            return res.status(500).send({error: err});
        }
        
        

        // Display uploaded image for user validation
        //res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
    });
};

const getFile = async (req, res) => {
    const ID = req.query.id;
    const userIDQuery = 'SELECT PATH FROM CV WHERE ID = ?';
    const [pathRows] = await connect.promise().query(userIDQuery, [ID]);
    if (pathRows.length == 0) {
        return res.status(400).send({error: "Not found"});
    }
    const path = pathRows[0].PATH;
    var tempFile=path;
    fs.readFile(tempFile, function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
    // res.download(path);
}




module.exports = {
    createCV,
    getCVById,
    updateCV,
    deleteCV,
    uploadCV,
    getFile
};
