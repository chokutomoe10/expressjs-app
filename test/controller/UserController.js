const Validator = require('fastest-validator');
const db = require('../database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { registrationSchema, loginSchema, profileUpdateSchema } = require('../models/user');

const v = new Validator();

exports.registration = async (req, res) => {
    const validationResult = v.validate(req.body, registrationSchema);

    if (validationResult !== true) {
        if (validationResult[0].field == "email") {
            return res.status(400).json({
                status: 102,
                message: validationResult[0].message,
                data: null
            })    
        } else {
            return res.status(400).json({
                status: 400,
                message: validationResult[0].message,
                data: null
            })
        }
    }

    const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
    };

    const hashPassword = await bcrypt.hash(user.password, 10);

    db.execute(`INSERT INTO users (first_name, last_name, email, password) values (?,?,?,?)`, [user.first_name, user.last_name, user.email, hashPassword])
    .then(() => {
        res.status(200).json({
            status: 0,
            message: 'Registrasi berhasil silahkan login',
            data: null
        });
    }).catch(() => {
        res.status(400).json({
            status: 400,
            message: 'Registrasi gagal',
            data: null
        });
    });
}

exports.login = async (req, res) => {
    const validationResult = v.validate(req.body, loginSchema);

    if (validationResult !== true) {
        if (validationResult[0].field == "email") {
            return res.status(400).json({
                status: 102,
                message: validationResult[0].message,
                data: null
            })    
        } else {
            return res.status(400).json({
                status: 400,
                message: validationResult[0].message,
                data: null
            })
        }
    }

    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const checkEmail = await db.execute(`SELECT * FROM users WHERE email=?`, [user.email]);

    if (!checkEmail) {
        return res.status(401).json({
            status: 103,
            message: 'Email atau password salah',
            data: null
        })
    }

    const isPasswordValid = await bcrypt.compare(user.password, checkEmail[0][0].password);

    if (!isPasswordValid) {
        return res.status(401).json({
            status: 103,
            message: 'Email atau password salah',
            data: null
        })
    }

    const token = jwt.sign({ email: checkEmail[0][0].email}, "secretauth", {expiresIn: "12h"});

    return res.status(200).json({
        status: 0,
        message: 'Login sukses',
        data: {token}
    })
}

exports.profile = async (req, res) => {
    const emailUser = res.locals.loginSession.email;

    db.execute(`SELECT * FROM users WHERE email=?`, [emailUser])
    .then(result => {
        res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: {
                email: result[0][0].email,
                first_name: result[0][0].first_name,
                last_name: result[0][0].last_name,
                profile_image: result[0][0].profile_image,
            }
        });
    }).catch(() => {
        res.status(401).json({
            status: 108,
            message: 'Token tidak valid atau kadaluwarsa',
            data: null
        });
    });
}

exports.profileUpdate = async (req, res) => {
    const emailUser = res.locals.loginSession.email;

    const validationResult = v.validate(req.body, profileUpdateSchema);

    if (validationResult !== true) {
        return res.status(400).json({
            status: 400,
            message: validationResult[0].message,
            data: null
        })
    }

    const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
    };

    db.execute(`UPDATE users SET first_name=?, last_name=? WHERE email=?`, [user.first_name, user.last_name, emailUser])
    .then(() => {
        db.execute(`SELECT * FROM users WHERE email=?`, [emailUser])
        .then(result => {
            res.status(200).json({
                status: 0,
                message: 'Update Pofile berhasil',
                data: {
                    email: result[0][0].email,
                    first_name: result[0][0].first_name,
                    last_name: result[0][0].last_name,
                    profile_image: result[0][0].profile_image,
                }
            });
        }).catch(() => {
            res.status(400).json({
                status: 400,
                message: 'Update Profile gagal',
                data: null
            });
        });
    }).catch(() => {
        res.status(400).json({
            status: 400,
            message: 'Update Profile gagal',
            data: null
        });
    });
}

exports.profileImage = async (req, res) => {
    const emailUser = res.locals.loginSession.email;

    if (req.file) {
        db.execute(`UPDATE users SET profile_image=? WHERE email=?`, [req.file.filename, emailUser])
        .then(() => {
            db.execute(`SELECT * FROM users WHERE email=?`, [emailUser])
            .then(result => {
                res.status(200).json({
                    status: 0,
                    message: 'Update Profile Image berhasil',
                    data: {
                        email: result[0][0].email,
                        first_name: result[0][0].first_name,
                        last_name: result[0][0].last_name,
                        profile_image: result[0][0].profile_image,
                    }
                });
            }).catch(() => {
                return res.status(400).json({
                    status: 400,
                    message: 'Update Profile Image gagal',
                    data: null
                });
            });
        }).catch(() => {
            res.status(400).json({
                status: 400,
                message: 'Update Profile Image gagal',
                data: null
            });
        });
    }
}