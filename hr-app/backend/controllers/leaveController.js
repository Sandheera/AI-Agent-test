const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

/**
 * @desc Get all leave requests
 * @route GET /api/v1/leave
 * @access Public
 */
exports.getAllLeaves = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, employeeId } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (employeeId) query.employeeId = employeeId;

    const leaves = await Leave.find(query)
      .populate('employeeId', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Leave.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        leaves,
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
 * @desc Get single leave request
 * @route GET /api/v1/leave/:id
 * @access Public
 */
exports.getLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('employeeId', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName');

    if (!leave) {
      return res.status(404).json({
        status: 'error',
        message: 'Leave request not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { leave }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Request leave
 * @route POST /api/v1/leave
 * @access Private
 */
exports.requestLeave = async (req, res, next) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();

    const populatedLeave = await leave.populate('employeeId', 'firstName lastName email');

    res.status(201).json({
      status: 'success',
      message: 'Leave request submitted successfully',
      data: { leave: populatedLeave }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Approve/Reject leave request
 * @route PUT /api/v1/leave/:id/approve
 * @access Private
 */
exports.approveLeave = async (req, res, next) => {
  try {
    const { status, approvedBy, comments } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Status must be Approved or Rejected'
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status,
        approvedBy,
        approvalDate: new Date(),
        comments
      },
      { new: true, runValidators: true }
    ).populate('employeeId', 'firstName lastName email')
     .populate('approvedBy', 'firstName lastName');

    if (!leave) {
      return res.status(404).json({
        status: 'error',
        message: 'Leave request not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Leave request ${status.toLowerCase()} successfully`,
      data: { leave }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get employee leave balance
 * @route GET /api/v1/leave/balance/:employeeId
 * @access Public
 */
exports.getLeaveBalance = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);

    const leaves = await Leave.find({
      employeeId: req.params.employeeId,
      status: 'Approved',
      startDate: { $gte: startOfYear, $lte: endOfYear }
    });

    const totalDays = leaves.reduce((sum, leave) => sum + leave.duration, 0);

    res.status(200).json({
      status: 'success',
      data: {
        employeeId: req.params.employeeId,
        year: currentYear,
        totalLeaveDays: totalDays,
        availableDays: 20 - totalDays, // Assuming 20 days annual leave
        leavesTaken: leaves
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Cancel leave request
 * @route DELETE /api/v1/leave/:id
 * @access Private
 */
exports.cancelLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled' },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({
        status: 'error',
        message: 'Leave request not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Leave request cancelled successfully',
      data: { leave }
    });
  } catch (error) {
    next(error);
  }
};
