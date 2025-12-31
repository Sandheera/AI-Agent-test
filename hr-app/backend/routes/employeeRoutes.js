const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management endpoints
 */

/**
 * @swagger
 * /api/v1/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
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
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of employees
 */
router.get('/', employeeController.getAllEmployees);

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   get:
 *     summary: Get single employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee data
 *       404:
 *         description: Employee not found
 */
router.get('/:id', employeeController.getEmployee);

/**
 * @swagger
 * /api/v1/employees/search/{query}:
 *   get:
 *     summary: Search employees
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search/:query', employeeController.searchEmployees);

/**
 * @swagger
 * /api/v1/employees:
 *   post:
 *     summary: Create new employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - jobTitle
 *               - department
 *               - salary
 *               - hireDate
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *               department:
 *                 type: string
 *               salary:
 *                 type: number
 *               hireDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee created
 */
router.post('/', verifyToken, authorize(['Admin', 'HR']), employeeController.createEmployee);

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   put:
 *     summary: Update employee
 *     tags: [Employees]
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
 *     responses:
 *       200:
 *         description: Employee updated
 */
router.put('/:id', verifyToken, authorize(['Admin', 'HR']), employeeController.updateEmployee);

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   delete:
 *     summary: Delete employee
 *     tags: [Employees]
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
 *         description: Employee deleted
 */
router.delete('/:id', verifyToken, authorize(['Admin']), employeeController.deleteEmployee);

module.exports = router;
