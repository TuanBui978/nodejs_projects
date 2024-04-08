const connect = require('../config/database');
const bcrypt = require('bcrypt');
const { json } = require('express');
const { check, validationResult } = require('express-validator');

const getTuan = (req, res) => {
    res.send('Tuan');
}

const getImage = (req, res) => {
    res.render();
}

const test = (req, res) => {
    connect.query("select * from USER", (err, results) =>{
        if (err) {
            console.log(err.message);
        }
        else {
            res.json(results)
        }
    });
}

const postRegisterUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array().at(0) });
    }
    
    const { name, email, password, retype_password, gender, date_of_birth } = req.body;
    // Kiểm tra xem người dùng đã tồn tại hay chưa
    const checkUserQuery = 'SELECT * FROM USER WHERE email = ?';
    connect.query(checkUserQuery, [email], (err, results) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ cod: "500", msg: 'Failed to register user !' });
        }

        // Nếu đã tồn tại người dùng có cùng email trong cơ sở dữ liệu
        if (results.length > 0) {
            return res.status(409).json({ cod: "409", msg: 'User already exists !' });
        }

        // Nếu không có người dùng nào cùng email tồn tại, tiến hành đăng ký
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ cod: "500", msg: 'Failed to register user 2 !' });
            }

            const insertUserQuery = 'INSERT INTO USER (NAME, EMAIL, PASSWORD, GENDER, DATE_OF_BIRTH, PRIVILEGE_ID, CREATE_AT) VALUES (?, ?, ?, ?, str_to_date(?, "%d-%m-%Y"),0, NOW())';
            connect.query(insertUserQuery, [name, email, hashedPassword, gender, date_of_birth], (err, result) => {
                if (err) {
                    console.log(err.message);
                    return res.status(500).json({ cod: "500", msg: 'Failed to register user !' });
                }
                res.status(201).json({ cod: "201", msg: 'User registered successfully !' });
            });
        });
    });

}

const postLoginUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array().at(0) });
    }

    const { email, password } = req.body;



    // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
    const getUserQuery = 'SELECT * FROM USER WHERE EMAIL = ?';
    connect.query(getUserQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: 'Failed to authenticate user !' });
        }

        if (results.length === 0) {
            return res.status(401).json({ msg: 'User not found !' });
        }

        const user = results[0];

        // So sánh mật khẩu đã hash với mật khẩu người dùng cung cấp
        bcrypt.compare(password, user.PASSWORD, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ msg: 'Failed to authenticate user !' });
            }

            if (!isMatch) {
                return res.status(401).json({ msg: 'Invalid email or password !' });
            }else
                res.status(200).json(user);
        });
    });
}

module.exports = {
    getTuan,
    getImage,
    postRegisterUser,
    postLoginUser,
    test
}