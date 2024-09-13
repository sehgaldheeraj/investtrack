// controllers/adminController.js
const Plan = require('../models/Plan');
const User = require('../models/User');

// Get all users controller
exports.getAllUsers = async (req, res) => {
   try {
       // Fetch all users except the one with the specific email
       const users = await User.find({ email: { $ne: 'mcxlivetraiding@gmail.com' } });
       res.send(users);
   } catch (err) {
       res.status(400).send(err);
   }
};

// Get pending plans controller
exports.getPendingPlans = async (req, res) => {
   const pendingPlans = await Plan.find({ approved: false });
   res.send(pendingPlans);
};
exports.getApprovedPlans = async (req, res) => {
   const approvedPlans = await Plan.find({ approved: true });
   res.send(approvedPlans);
};
// Approve a plan controller
exports.approvePlan = async (req, res) => {
   const { planId } = req.params;

   try {
      const plan = await Plan.findById(planId);
      if (!plan) return res.status(404).send('Plan not found');

      plan.approved = true;
      plan.planStartDate = new Date();
      plan.planEndDate = new Date(Date.now() + plan.planDuration * 24 * 60 * 60 * 1000);

      await plan.save();
      res.send('Plan Approved');
   } catch (err) {
      res.status(400).send(err);
   }
};

// Withdraw interest controller
exports.withdrawInterest = async (req, res) => {
   const { planId } = req.params;

   try {
      const plan = await Plan.findById(planId);
      if (plan.withdrawalOfInterest) {
         plan.totalAmountWithdrawn += plan.amountToWithdraw;
         plan.withdrawnArray.push({
            withdrawAmt: plan.amountToWithdraw,
            withdrawDate: new Date(),
            withdrawalRequested: true,
            withdrawalProcessed: true
         })
         plan.amountToWithdraw = 0;
         plan.withdrawalOfInterest = false;

         await plan.save();
         res.send('Interest Credited');
      } else {
         res.status(400).send('No interest withdrawal request found');
      }
   } catch (err) {
      res.status(400).send(err);
   }
};

exports.withdrawAll = async (req, res) => {
   const { planId } = req.params;

   try {
      const plan = await Plan.findById(planId);
      if (plan.withdrawal && (plan.planEndDate < new Date())) {
         plan.withdrawalDone = true;
         plan.withdrawal = false;
         await plan.save();
         res.send('Whole Amount Credited');
      } else {
         res.status(400).json({message: 'No amount withdrawal request found or Maturity is not yet reached.'});
      }
   } catch (err) {
      res.status(400).json({message: err.message});
   }
}
