const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the withdrawal schema
const withdrawSchema = new Schema({
   withId: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
   withdrawAmt: { type: Number, required: true },
   withdrawDate: { type: Date, required: true },
   withdrawalRequested: { type: Boolean, default: false },
   withdrawalProcessed: { type: Boolean, default: false }
});

// Define the plan schema
const planSchema = new Schema({
   fullName: { type: String, required: true },
   phone: { type: Number, required: true },
   queryDate: { type: Date, default: Date.now },
   planTitle: { type: String, required: true },
   planStartDate: { type: Date },
   planEndDate: { type: Date },
   amountInvested: { type: Number, required: true },
   planInterestRate: { type: Number, default: 5 },
   planDuration: { type: Number, default: 700 }, // Duration in days
   withdrawal: { type: Boolean, default: false },
   withdrawalDone: { type: Boolean, default: false },
   approved: { type: Boolean, default: false },
   withdrawalOfInterest: { type: Boolean, default: false },
   withdrawnArray: [withdrawSchema],
   amountToWithdraw: { type: Number },
   totalAmountWithdrawn: { type: Number, default: 0 }
}, { collection: 'Plan' });

module.exports = mongoose.model('Plan', planSchema);


