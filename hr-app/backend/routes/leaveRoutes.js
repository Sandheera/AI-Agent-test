const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Leave
 *   description: Leave management endpoints
 */

/**
 * @swagger
 * /api/v1/leave:
 *   get:
 *     summary: Get all leave requests
 *     tags: [Leave]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Approved, Rejected, Cancelled]
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of leave requests
 */
router.get('/', leaveController.getAllLeaves);

/**
 * @swagger
 * /api/v1/leave/{id}:
 *   get:
 *     summary: Get single leave request
 *     tags: [Leave]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave request data
 */
router.get('/:id', leaveController.getLeave);

/**
 * @swagger
 * /api/v1/leave/balance/{employeeId}:
 *   get:
 *     summary: Get employee leave balance
 *     tags: [Leave]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave balance data
 */
router.get('/balance/:employeeId', leaveController.getLeaveBalance);

/**
 * @swagger
 * /api/v1/leave:
 *   post:
 *     summary: Request leave
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - leaveType
 *               - startDate
 *               - endDate
 *             properties:
 *               employeeId:
 *                 type: string
 *               leaveType:
 *                 type: string
 *                 enum: [Vacation, Sick, Personal, Maternity, Paternity, Unpaid]
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Leave request created
 */
router.post('/', verifyToken, leaveController.requestLeave);

/**
 * @swagger
 * /api/v1/leave/{id}/approve:
 *   put:
 *     summary: Approve or reject leave request
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - approvedBy
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Approved, Rejected]
 *               approvedBy:
 *                 type: string
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leave request updated
 */
router.put('/:id/approve', verifyToken, authorize(['Admin', 'HR', 'Manager']), leaveController.approveLeave);

/**
 * @swagger
 * /api/v1/leave/{id}:
 *   delete:
 *     summary: Cancel leave request
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leave request cancelled
 */
router.delete('/:id', verifyToken, leaveController.cancelLeave);

module.exports = router;
