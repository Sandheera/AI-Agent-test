const request = require('supertest');
const app = require('../server');
const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Leave Routes', () => {
  let token;
  let managerToken;
  let employeeId;
  let managerId;
  let leaveId;

  beforeAll(async () => {
    // Create test employee
    const emp = await Employee.create({
      firstName: 'Test',
      lastName: 'Employee',
      email: 'testemp@test.com',
      phone: '1234567890',
      jobTitle: 'Developer',
      department: 'IT',
      salary: 50000,
      hireDate: new Date()
    });
    employeeId = emp._id;

    // Create employee user
    const empUser = await User.create({
      name: 'Test Employee',
      email: 'empu@test.com',
      password: 'emp123',
      role: 'Employee',
      employeeId: emp._id
    });
    token = jwt.sign({ id: empUser._id, role: 'Employee' }, process.env.JWT_SECRET);

    // Create test manager
    const mgr = await Employee.create({
      firstName: 'Manager',
      lastName: 'Test',
      email: 'mgr@test.com',
      phone: '0987654321',
      jobTitle: 'Manager',
      department: 'IT',
      salary: 70000,
      hireDate: new Date()
    });
    managerId = mgr._id;

    // Create manager user
    const mgrUser = await User.create({
      name: 'Manager Test',
      email: 'mgru@test.com',
      password: 'mgr123',
      role: 'Manager',
      employeeId: mgr._id
    });
    managerToken = jwt.sign({ id: mgrUser._id, role: 'Manager' }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await Leave.deleteMany({});
    await Employee.deleteMany({});
    await User.deleteMany({});
  });

  describe('GET /api/v1/leave', () => {
    it('should get all leave requests', async () => {
      const res = await request(app)
        .get('/api/v1/leave');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/v1/leave')
        .query({ page: 1, limit: 10 });

      expect(res.statusCode).toBe(200);
    });

    it('should filter by status', async () => {
      const res = await request(app)
        .get('/api/v1/leave')
        .query({ status: 'Pending' });

      expect(res.statusCode).toBe(200);
    });
  });

  describe('POST /api/v1/leave', () => {
    it('should request leave with valid token', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(tomorrow);
      nextWeek.setDate(nextWeek.getDate() + 5);

      const res = await request(app)
        .post('/api/v1/leave')
        .set('Authorization', `Bearer ${token}`)
        .send({
          employeeId: employeeId.toString(),
          leaveType: 'Vacation',
          startDate: tomorrow,
          endDate: nextWeek,
          reason: 'Summer vacation'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.status).toBe('Pending');
      leaveId = res.body.data._id;
    });

    it('should deny leave without token', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const res = await request(app)
        .post('/api/v1/leave')
        .send({
          employeeId: employeeId.toString(),
          leaveType: 'Sick',
          startDate: tomorrow,
          endDate: tomorrow,
          reason: 'Sick leave'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/v1/leave/:id', () => {
    it('should get single leave request', async () => {
      const res = await request(app)
        .get(`/api/v1/leave/${leaveId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data._id).toBe(leaveId.toString());
    });

    it('should return 404 for non-existent leave', async () => {
      const res = await request(app)
        .get('/api/v1/leave/507f1f77bcf86cd799439011');

      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/v1/leave/balance/:employeeId', () => {
    it('should get leave balance', async () => {
      const res = await request(app)
        .get(`/api/v1/leave/balance/${employeeId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('totalAllowance');
      expect(res.body.data).toHaveProperty('used');
      expect(res.body.data).toHaveProperty('remaining');
    });
  });

  describe('PUT /api/v1/leave/:id/approve', () => {
    it('should approve leave with Manager token', async () => {
      const res = await request(app)
        .put(`/api/v1/leave/${leaveId}/approve`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          status: 'Approved',
          approvedBy: managerId.toString(),
          comments: 'Approved'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('Approved');
    });

    it('should reject leave with Manager token', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 10);
      const nextDay = new Date(tomorrow);
      nextDay.setDate(nextDay.getDate() + 1);

      const leave = await Leave.create({
        employeeId,
        leaveType: 'Vacation',
        startDate: tomorrow,
        endDate: nextDay,
        reason: 'Test leave'
      });

      const res = await request(app)
        .put(`/api/v1/leave/${leave._id}/approve`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          status: 'Rejected',
          approvedBy: managerId.toString(),
          comments: 'Not approved'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('Rejected');
    });

    it('should deny approval without authorization', async () => {
      const res = await request(app)
        .put(`/api/v1/leave/${leaveId}/approve`)
        .send({
          status: 'Approved',
          approvedBy: managerId.toString()
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/v1/leave/:id', () => {
    it('should cancel leave request', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 15);
      const nextDay = new Date(tomorrow);
      nextDay.setDate(nextDay.getDate() + 1);

      const leave = await Leave.create({
        employeeId,
        leaveType: 'Vacation',
        startDate: tomorrow,
        endDate: nextDay,
        reason: 'Cancellable leave',
        status: 'Pending'
      });

      const res = await request(app)
        .delete(`/api/v1/leave/${leave._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });
  });
});
