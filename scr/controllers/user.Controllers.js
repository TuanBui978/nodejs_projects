const connect = require('../config/database');

const { validationResult } = require('express-validator');

const createUser = async (req, res) => {
    const { name, email, password, retype_password, gender, date_of_birth } = req.body;

    if (password !== retype_password) {
        return res.status(400).json({ cod: "400", msg: 'Passwords do not match !' });
    }

    try {
        // Kiểm tra xem người dùng đã tồn tại hay chưa
        const checkUserQuery = 'SELECT * FROM USER WHERE email = ?';
        const [existingUser] = await connect.promise().query(checkUserQuery, [email]);

        if (existingUser.length > 0) {
            return res.status(409).json({ cod: "409", msg: 'User already exists !' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const insertUserQuery = 'INSERT INTO USER (NAME, EMAIL, PASSWORD, GENDER, DATE_OF_BIRTH, PRIVILEGE_ID, CREATE_AT) VALUES (?, ?, ?, ?, str_to_date(?, "%d-%m-%Y"), 0, NOW())';
        const [result] = await connect.promise().query(insertUserQuery, [name, email, hashedPassword, gender, date_of_birth]);

        res.status(201).json({ cod: "201", msg: 'Create user successfully !' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ cod: "500", msg: 'Failed to create user !' });
    }
};

const getUserList = async (req, res) => {
    try {
        const query = 'SELECT * FROM USER';
        const [userList] = await connect.promise().query(query);

        res.status(200).json(userList)
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Failed to get user list !');
    }

}

const updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const id = req.query.id;
    const { name, email, gender, dateOfBirth, avatar } = req.body;

    try {
        // Kiểm tra xem người dùng tồn tại hay không
        const Query = 'SELECT * FROM USER WHERE ID = ?';
        
        const [User] = await connect.promise().query(Query, [id]);

        if (User.length === 0) {
            return res.status(404).json({ cod: "404", msg: 'User not found !' });
        }
        // Cập nhật thông tin người dùng
        const updateUserQuery = 'UPDATE USER SET NAME = ?, EMAIL = ?, GENDER = ?, DATE_OF_BIRTH = str_to_date(?, "%Y-%m-%d"), AVATAR = ?, UPDATED_AT = NOW() WHERE ID = ?';
        await connect.promise().query(updateUserQuery, [name, email, gender, dateOfBirth, avatar, id ]);


        res.status(200).json({ cod: "200", msg: 'Update user successfully !' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ cod: "500", msg: 'Failed to update user !' });
    }
}

const deleteUser = async (req, res) => {
    const id = req.query.id;
    try {
        const result = await connect.promise().query('DELETE FROM USER WHERE ID = ?', [id]);

        if (result[0].affectedRows === 0) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).send({ error: 'Error deleting user', message: err.message });
    }
}

const getUserListByName = (req, res) => {
    const jobName = req.query.userName;

    const query = 'SELECT * FROM USER WHERE NAME LIKE ?';
    connect.query(query, [`%${jobName}%`], (error, results) => {
        if (error) {
            console.error('MySQL Error:', error);
            res.status(500).json({ error: 'Server Error' });
            return;
        }

        res.json(results);
    });
};

const toAdmin = (req, res) => {
    const id = req.query.id;
    try {
        const query = 'UPDATE USER SET PRIVILEGE_ID = 1, UPDATED_AT = NOW() WHERE ID = ?'
        connect.promise().query(query, [id]);
        res.status(200).json({ cod: "200", msg: 'Update user successfully !' });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    } 
}

const getUserById = (req, res) => {
    const id = req.query.id;

    const query = 'SELECT * FROM USER WHERE ID = ?';
    connect.query(query, [id], (error, results) => {
        if (error) {
            console.error('MySQL Error:', error);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        res.json(results[0]);
    });
}




module.exports = {
    createUser,
    getUserList,
    updateUser,
    deleteUser,
    getUserListByName,
    toAdmin, 
    getUserById
}