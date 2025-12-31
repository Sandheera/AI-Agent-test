const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee ID is required']
  },
  leaveType: {
    type: String,
    enum: ['Vacation', 'Sick', 'Personal', 'Maternity', 'Paternity', 'Unpaid'],
    required: [true, 'Leave type is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  duration: {
    type: Number,
    required: true
  },
  reason: String,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    default: 'Pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  approvalDate: Date,
  comments: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

leaveSchema.pre('save', function(next) {
  // Calculate duration in days
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  this.duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Leave', leaveSchema);
