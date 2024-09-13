// routes/user.js
const express = require('express');
const { signup, login, postNewPlan, getAllPlans, requestInterestWithdrawal, requestWithdrawal, requestKyc } = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/plan', authenticate, postNewPlan);
router.get('/plans', authenticate, getAllPlans);
router.get('/requestInterest', authenticate, requestInterestWithdrawal);
router.get('/requestAll', authenticate, requestWithdrawal);
router.post('/request-kyc', authenticate, requestKyc);

module.exports = router;
