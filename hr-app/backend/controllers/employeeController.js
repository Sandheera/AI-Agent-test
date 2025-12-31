const Employee = require('../models/Employee');

/**
 * @desc Get all employees
 * @route GET /api/v1/employees
 * @access Public
 */
exports.getAllEmployees = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, department, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (department) query.department = department;
    if (status) query.status = status;

    const employees = await Employee.find(query)
      .populate('managerId', 'firstName lastName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Employee.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        employees,
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
 * @desc Get single employee
 * @route GET /api/v1/employees/:id
 * @access Public
 */
exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('managerId', 'firstName lastName');

    if (!employee) {
      return res.status(404).json({
        status: 'error',
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { employee }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create new employee
 * @route POST /api/v1/employees
 * @access Private
 */
exports.createEmployee = async (req, res, next) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();

    const populatedEmployee = await employee.populate('managerId', 'firstName lastName');

    res.status(201).json({
      status: 'success',
      message: 'Employee created successfully',
      data: { employee: populatedEmployee }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update employee
 * @route PUT /api/v1/employees/:id
 * @access Private
 */
exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('managerId', 'firstName lastName');

    if (!employee) {
      return res.status(404).json({
        status: 'error',
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Employee updated successfully',
      data: { employee }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete employee
 * @route DELETE /api/v1/employees/:id
 * @access Private
 */
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        status: 'error',
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Search employees
 * @route GET /api/v1/employees/search/:query
 * @access Public
 */
exports.searchEmployees = async (req, res, next) => {
  try {
    const { query } = req.params;
    
    const employees = await Employee.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { jobTitle: { $regex: query, $options: 'i' } }
      ]
    }).populate('managerId', 'firstName lastName');

    res.status(200).json({
      status: 'success',
      data: { employees }
    });
  } catch (error) {
    next(error);
  }
};
