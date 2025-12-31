const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance', 'Operations']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  requiredSkills: [String],
  experienceRequired: {
    type: Number,
    default: 0,
    min: [0, 'Experience cannot be negative']
  },
  salaryMin: {
    type: Number,
    required: [true, 'Minimum salary is required']
  },
  salaryMax: {
    type: Number,
    required: [true, 'Maximum salary is required']
  },
  employmentType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Intern'],
    default: 'Full-Time'
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Filled', 'On Hold'],
    default: 'Open'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  candidates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  }],
  postDate: {
    type: Date,
    default: Date.now
  },
  closingDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Job', jobSchema);
