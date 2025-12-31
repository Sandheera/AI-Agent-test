const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { verifyToken, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job posting management
 */

/**
 * @swagger
 * /api/v1/jobs:
 *   get:
 *     summary: Get all job postings
 *     tags: [Jobs]
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
 *           enum: [Open, Closed, Filled, On Hold]
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get('/', jobController.getAllJobs);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   get:
 *     summary: Get single job posting
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job data
 */
router.get('/:id', jobController.getJob);

/**
 * @swagger
 * /api/v1/jobs:
 *   post:
 *     summary: Create new job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - department
 *               - location
 *               - salaryMin
 *               - salaryMax
 *               - postedBy
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               department:
 *                 type: string
 *               location:
 *                 type: string
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               experienceRequired:
 *                 type: number
 *               salaryMin:
 *                 type: number
 *               salaryMax:
 *                 type: number
 *               postedBy:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created
 */
router.post('/', verifyToken, authorize(['Admin', 'HR']), jobController.createJob);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   put:
 *     summary: Update job posting
 *     tags: [Jobs]
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
 *         description: Job updated
 */
router.put('/:id', verifyToken, authorize(['Admin', 'HR']), jobController.updateJob);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   delete:
 *     summary: Delete job posting
 *     tags: [Jobs]
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
 *         description: Job deleted
 */
router.delete('/:id', verifyToken, authorize(['Admin', 'HR']), jobController.deleteJob);

module.exports = router;
