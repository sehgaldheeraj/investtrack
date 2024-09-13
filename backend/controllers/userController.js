// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Plan = require('../models/Plan');

// Signup controller
exports.signup = async (req, res) => {
   const { fullName, email, password, phone } = req.body;

   try {
       // Check if email already exists
       const emailExists = await User.findOne({ email });
       if (emailExists) return res.status(400).json({ message: 'Email already exists' });

       // Check if phone already exists
       const phoneExists = await User.findOne({ phone });
       if (phoneExists) return res.status(400).json({ message: 'Phone already exists' });

       // Hash the password
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);

       // Create a new user
       const user = new User({ fullName, email, password: hashedPassword, phone });

       // Save the user
       const savedUser = await user.save();
       res.json({ userId: savedUser._id });

   } catch (err) {
       // Send a specific error message if the operation fails
       res.status(400).json({ message: 'Error while signing up. Please try again.' });
   }
};


// Login controller
exports.login = async (req, res) => {
   const { phone, password } = req.body;
   const secret = process.env.TOKEN_SECRET;
    const user = await User.findOne({ phone });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email, phone: user.phone }, secret, { expiresIn: '1h' });
    res.status(200).json({ user, token });
};

// Post new plan controller
exports.postNewPlan = async (req, res) => {
   try{   
      const { amount} = req.body;
   const user = await User.findById(req.user.userId);

   const planCount = await Plan.countDocuments({ fullName: user.fullName });
   const planTitle = `Investment${planCount + 1}`;
   const queryDate = new Date();
   const plan = new Plan({
      fullName: user.fullName,
      phone: user.phone,
      amountInvested: amount,
      queryDate: queryDate,
      planTitle
   });


      const savedPlan = await plan.save();
      res.status(201).send({savedPlan: savedPlan, message: 'Investment Request Recieved.'});
   } catch (err) {
      res.status(400).send(err);
   }
};

// Get all plans by user controller
exports.getAllPlans = async (req, res) => {
   
   const plans = await Plan.find({ phone: req.user.phone });
   
   res.send(plans);
};
//const Investment = require('../models/investment'); // Import your Investment model

exports.requestInterestWithdrawal = async (req, res) => {
    try {
        const planName = req.query.name;

        if (!planName) {
            return res.status(400).json({ message: 'Plan name is required' });
        }

        // Find the investment plan by its name
        const investment = await Plan.findOne({ planTitle: planName });

        if (!investment) {
            return res.status(404).json({ message: 'Investment plan not found' });
        }

        // Update the withdrawalOfInterest field
        investment.withdrawalOfInterest = true;

        // Save the updated investment back to the database
        await investment.save();

        res.status(200).json({ message: 'Interest withdrawal request updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while processing the request' });
    }
};

exports.requestWithdrawal = async (req, res) => {
   try {
      const planName = req.query.name;

      if (!planName) {
          return res.status(400).json({ message: 'Plan name is required' });
      }

      // Find the investment plan by its name
      const investment = await Plan.findOne({ planTitle: planName });

      if (!investment) {
          return res.status(404).json({ message: 'Investment plan not found' });
      }

      // Update the withdrawalOfInterest field
      investment.withdrawal = true;

      // Save the updated investment back to the database
      await investment.save();

      res.status(200).json({ message: 'Withdrawal request updated successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while processing the request' });
  }
}

// Update the requestKyc endpoint to handle the KYC details

exports.requestKyc = async (req, res) => {
    const { adhaarNo, panNo, accNo, ifscCode} = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) return res.status(404).send('User not found.');

    user.kycRequested = true;
    user.adhaarNo = adhaarNo;
    user.panNo = panNo;
    user.accNo = accNo;
    user.ifscCode = ifscCode;

    try {
        await user.save();
        res.send('Request for KYC initiated.');
    } catch (err) {
        res.status(400).send(err);
    }
};

