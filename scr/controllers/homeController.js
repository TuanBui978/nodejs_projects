const connect = require('../config/database');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const getTuan = (req, res) => {
    res.send('Tuan');
}

const getImage = (req, res) => {
    res.render();
}

const postRegisterUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { email, password, privilege_id } = req.body;

    // Kiểm tra xem người dùng đã tồn tại hay chưa
    const checkUserQuery = 'SELECT * FROM user WHERE email = ?';
    connect.query(checkUserQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to register user 1 !' });
        }

        // Nếu đã tồn tại người dùng có cùng email trong cơ sở dữ liệu
        if (results.length > 0) {
            return res.status(409).json({ error: 'User already exists !' });
        }

        // Nếu không có người dùng nào cùng email tồn tại, tiến hành đăng ký
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to register user 2 !' });
            }

            const insertUserQuery = 'INSERT INTO user (EMAIL, PASSWORD, PRIVILEGE_ID, CREATE_AT) VALUES (?, ?, 0, NOW())';
            connect.query(insertUserQuery, [email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to register user 3 !' });
                }
                res.status(201).json({ message: 'User registered successfully !' });
            });
        });
    });

}

const postLoginUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
    const getUserQuery = 'SELECT * FROM user WHERE EMAIL = ?';
    connect.query(getUserQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate user !' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'User not found !' });
        }

        const user = results[0];

        // So sánh mật khẩu đã hash với mật khẩu người dùng cung cấp
        bcrypt.compare(password, user.PASSWORD, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to authenticate user !' });
            }

            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid email or password !' });
            }else
                res.status(200).json({ message: 'Login successful !'});
        });
    });
}

module.exports = {
    getTuan,
    getImage,
    postRegisterUser,
    postLoginUser
}