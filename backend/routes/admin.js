// routes/admin.js
const express = require('express');
const { getAllUsers, getPendingPlans, approvePlan, withdrawInterest, getApprovedPlans, withdrawAll } = require('../controllers/adminController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

router.get('/users', authenticate, getAllUsers);
router.get('/pending-plans', authenticate, getPendingPlans);
router.get('/approved-plans', authenticate, getApprovedPlans);
router.patch('/approve-plan/:planId', authenticate, approvePlan);
router.patch('/withdraw-interest/:planId', authenticate, withdrawInterest);
router.patch('/withdraw-all/:planId', authenticate, withdrawAll);
module.exports = router;
