const Job = require('../models/Job');

/**
 * @desc Get all jobs
 * @route GET /api/v1/jobs
 * @access Public
 */
exports.getAllJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, department } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (department) query.department = department;

    const jobs = await Job.find(query)
      .populate('postedBy', 'firstName lastName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ postDate: -1 });

    const total = await Job.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        jobs,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single job
 * @route GET /api/v1/jobs/:id
 * @access Public
 */
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'firstName lastName')
      .populate('candidates');

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { job }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create new job
 * @route POST /api/v1/jobs
 * @access Private
 */
exports.createJob = async (req, res, next) => {
  try {
    const job = new Job(req.body);
    await job.save();

    const populatedJob = await job.populate('postedBy', 'firstName lastName');

    res.status(201).json({
      status: 'success',
      message: 'Job created successfully',
      data: { job: populatedJob }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update job
 * @route PUT /api/v1/jobs/:id
 * @access Private
 */
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'firstName lastName');

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Job updated successfully',
      data: { job }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete job
 * @route DELETE /api/v1/jobs/:id
 * @access Private
 */
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
