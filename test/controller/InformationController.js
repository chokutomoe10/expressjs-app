const db = require('../database');

exports.services = async (req, res) => {
    db.execute(`SELECT service_code, service_name, service_icon, service_tariff FROM services`)
    .then(result => {
        res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: result[0]
        });
    }).catch(() => {
        res.status(400).json({
            status: 400,
            message: 'gagal',
            data: null
        });
    });
}

exports.banners = async (req, res) => {
    db.execute(`SELECT banner_name, banner_image, description FROM banners`)
    .then(result => {
        res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: result[0]
        });
    }).catch(() => {
        res.status(400).json({
            status: 400,
            message: 'gagal',
            data: null
        });
    });
}