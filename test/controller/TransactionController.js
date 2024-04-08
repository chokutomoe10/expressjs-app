const Validator = require('fastest-validator');
const db = require('../database');
const { topupSchema, transactionSchema } = require('../models/transaction');

const v = new Validator();

const randomNumber = Math.floor(Math.random() * 10000);
const digits = randomNumber.toString().padStart(4, '0');

exports.balance = async (req, res) => {
    const emailUser = res.locals.loginSession.email;

    db.execute(`SELECT * FROM users WHERE email=?`, [emailUser])
    .then(result => {
        res.status(200).json({
            status: 0,
            message: 'Get Balance Berhasil',
            data: {balance: result[0][0].balance}
        });
    }).catch(() => {
        res.status(400).json({
            status: 400,
            message: 'Get Balance gagal',
            data: null
        });
    });
}

exports.topup = async (req, res) => {
    const emailUser = res.locals.loginSession.email;

    const validationResult = v.validate(req.body, topupSchema);

    if (validationResult !== true) {
        return res.status(400).json({
            status: 102,
            message: 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
            data: null
        })
    }

    const topup = {
        top_up_amount: req.body.top_up_amount
    };

    const user = await db.execute(`SELECT * FROM users WHERE email=?`, [emailUser]);

    const balance = user[0][0].balance + topup.top_up_amount;

    const invoice_number = "INV" + Date.now() + '-' + `${digits}`;

    await db.execute(`INSERT INTO transactions (user_id, description, total_amount, invoice_number, transaction_type) values (?,?,?,?,?)`, [user[0][0].id, "Top Up balance", topup.top_up_amount, invoice_number, "TOPUP"])

    db.execute(`UPDATE users SET balance=? WHERE email=?`, [balance, emailUser])
    .then(() => {
        res.status(200).json({
            status: 0,
            message: 'Top Up Balance berhasil',
            data: {balance}
        });
    }).catch(() => {
        res.status(400).json({
            status: 400,
            message: 'Top Up Balance gagal',
            data: null
        });
    });
}

exports.transaction = async (req, res) => {
    const emailUser = res.locals.loginSession.email;
    const data = req.body;

    const validationResult = v.validate(data, transactionSchema);

    if (validationResult !== true) {
        return res.status(400).json({
            status: 400,
            message: 'Parameter kode servis harus dalam format string',
            data: null
        })
    }

    const service = await db.execute(`SELECT * FROM services WHERE service_code=?`, [data.service_code]);

    if (service[0].length === 0) {
        return res.status(400).json({
            status: 102,
            message: 'Service atau Layanan tidak ditemukan',
            data: null
        });
    }

    const price = service[0][0].service_tariff;

    const user = await db.execute(`SELECT * FROM users WHERE email=?`, [emailUser]);

    const balance = user[0][0].balance;

    const invoice_number = "INV" + Date.now() + '-' + `${digits}`;

    if (balance >= price) {
        await db.execute(`INSERT INTO transactions (user_id, service_id, total_amount, description, invoice_number, transaction_type) values (?,?,?,?,?,?)`, [user[0][0].id, service[0][0].id, price, service[0][0].service_name, invoice_number, "PAYMENT"])

        const total = balance - price;

        db.execute(`UPDATE users SET balance=? WHERE email=?`, [total, emailUser])
        .then(() => {
            db.execute(`SELECT * FROM transactions WHERE invoice_number=?`, [invoice_number])
            .then(result => {
                res.status(200).json({
                    status: 0,
                    message: 'Transaksi berhasil',
                    data: {
                        invoice_number,
                        service_code: service[0][0].service_code,
                        service_name: service[0][0].service_name,
                        transaction_type: result[0][0].transaction_type,
                        total_amount: result[0][0].total_amount,
                        created_on: result[0][0].created_on,
                    }
                });
            }).catch(() => {
                return res.status(400).json({
                    status: 400,
                    message: 'Transaksi gagal',
                    data: null
                });
            });
        }).catch(() => {
            return res.status(400).json({
                status: 400,
                message: 'Transaksi gagal',
                data: null
            });
        });
    } else {
        res.status(400).json({
            status: 400,
            message: 'Balance/saldo tidak mencukupi',
            data: null
        });
    }
}

exports.transactionHistory = async (req, res) => {
    const emailUser = res.locals.loginSession.email;

    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);

    const user = await db.execute(`SELECT * FROM users WHERE email=?`, [emailUser]);

    if (req.query.limit) {
        db.execute(`SELECT invoice_number, transaction_type, description, total_amount, created_on FROM transactions WHERE user_id=? ORDER BY created_on DESC LIMIT ? OFFSET ?`, [user[0][0].id, limit, offset])
        .then(result => {
            res.status(200).json({
                status: 0,
                message: 'Get History Berhasil',
                data: {
                    offset,
                    limit,
                    records: result[0]
                }
            });
        }).catch(() => {
            return res.status(400).json({
                status: 400,
                message: 'Get History gagal',
                data: null
            });
        });
    } else {
        db.execute(`SELECT invoice_number, transaction_type, description, total_amount, created_on FROM transactions WHERE user_id=? ORDER BY created_on DESC`, [user[0][0].id])
        .then(result => {
            res.status(200).json({
                status: 0,
                message: 'Get History Berhasil',
                data: {
                    offset,
                    limit,
                    records: result[0]
                }
            });
        }).catch(() => {
            res.status(400).json({
                status: 400,
                message: 'Get History gagal',
                data: null
            });
        });
    }
}