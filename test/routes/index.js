const express = require('express');
const {registration, login, profile, profileUpdate, profileImage} = require('../controller/UserController');
const { topup, balance, transaction, history, transactionHistory } = require('../controller/TransactionController');
const { banners, services } = require('../controller/InformationController');
const authenticate = require('../middlewares/auth');
const upload = require('../middlewares/uploadImage');

const router = express.Router();

//user
router.post('/registration', registration);
router.post('/login', login);
router.get('/profile', authenticate, profile);
router.put('/profile/update', authenticate, profileUpdate);
router.put('/profile/image', authenticate, upload("file"), profileImage);

//transaction
router.get('/balance', authenticate, balance);
router.post('/topup', authenticate, topup);
router.post('/transaction', authenticate, transaction);
router.get('/transaction/history', authenticate, transactionHistory);

//information
router.get('/banner', authenticate, banners);
router.get('/services', authenticate, services);

module.exports = router;