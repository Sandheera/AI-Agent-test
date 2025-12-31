const request = require('supertest');
const app = require('../server');
const Employee = require('../models/Employee');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Employee Routes', () => {
  let token;
  let employeeId;
  let adminToken;
  let hrToken;

  beforeAll(async () => {
    // Create test admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'Admin'
    });
    adminToken = jwt.sign({ id: admin._id, role: 'Admin' }, process.env.JWT_SECRET);

    // Create test HR user
    const hr = await User.create({
      name: 'HR User',
      email: 'hr@test.com',
      password: 'hr123',
      role: 'HR'
    });
    hrToken = jwt.sign({ id: hr._id, role: 'HR' }, process.env.JWT_SECRET);

    // Create test employee user
    const employee = await User.create({
      name: 'Employee User',
      email: 'employee@test.com',
      password: 'emp123',
      role: 'Employee'
    });
    token = jwt.sign({ id: employee._id, role: 'Employee' }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await Employee.deleteMany({});
    await User.deleteMany({});
  });

  describe('GET /api/v1/employees', () => {
    it('should get all employees', async () => {
      await Employee.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        phone: '1234567890',
        jobTitle: 'Developer',
        department: 'IT',
        salary: 50000,
        hireDate: new Date()
      });

      const res = await request(app)
        .get('/api/v1/employees');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/v1/employees')
        .query({ page: 1, limit: 10 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
    });

    it('should filter by department', async () => {
      const res = await request(app)
        .get('/api/v1/employees')
        .query({ department: 'IT' });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/employees/:id', () => {
    let testEmployeeId;

    beforeAll(async () => {
      const emp = await Employee.create({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@test.com',
        phone: '9876543210',
        jobTitle: 'Manager',
        department: 'HR',
        salary: 60000,
        hireDate: new Date()
      });
      testEmployeeId = emp._id;
    });

    it('should get single employee', async () => {
      const res = await request(app)
        .get(`/api/v1/employees/${testEmployeeId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data._id).toBe(testEmployeeId.toString());
    });

    it('should return 404 for non-existent employee', async () => {
      const res = await request(app)
        .get('/api/v1/employees/507f1f77bcf86cd799439011');

      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/v1/employees/search/:query', () => {
    it('should search employees by name', async () => {
      const res = await request(app)
        .get('/api/v1/employees/search/John');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/employees', () => {
    it('should create employee with HR token', async () => {
      const res = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${hrToken}`)
        .send({
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike@test.com',
          phone: '5555555555',
          jobTitle: 'Analyst',
          department: 'Finance',
          salary: 55000,
          hireDate: new Date()
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.firstName).toBe('Mike');
      employeeId = res.body.data._id;
    });

    it('should deny access without authorization', async () => {
      const res = await request(app)
        .post('/api/v1/employees')
        .send({
          firstName: 'Unauthorized',
          lastName: 'User',
          email: 'unauth@test.com',
          phone: '0000000000',
          jobTitle: 'Dev',
          department: 'IT',
          salary: 40000,
          hireDate: new Date()
        });

      expect(res.statusCode).toBe(401);
    });

    it('should deny access for Employee role', async () => {
      const res = await request(app)
        .post('/api/v1/employees')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Unauthorized',
          lastName: 'User',
          email: 'unauth@test.com',
          phone: '0000000000',
          jobTitle: 'Dev',
          department: 'IT',
          salary: 40000,
          hireDate: new Date()
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('PUT /api/v1/employees/:id', () => {
    it('should update employee with HR token', async () => {
      const res = await request(app)
        .put(`/api/v1/employees/${employeeId}`)
        .set('Authorization', `Bearer ${hrToken}`)
        .send({
          jobTitle: 'Senior Analyst'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.jobTitle).toBe('Senior Analyst');
    });
  });

  describe('DELETE /api/v1/employees/:id', () => {
    let deleteEmployeeId;

    beforeAll(async () => {
      const emp = await Employee.create({
        firstName: 'Delete',
        lastName: 'Me',
        email: 'delete@test.com',
        phone: '1111111111',
        jobTitle: 'Temp',
        department: 'Temp',
        salary: 30000,
        hireDate: new Date()
      });
      deleteEmployeeId = emp._id;
    });

    it('should delete employee with Admin token', async () => {
      const res = await request(app)
        .delete(`/api/v1/employees/${deleteEmployeeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('should deny delete for non-Admin', async () => {
      const emp = await Employee.create({
        firstName: 'Cannot',
        lastName: 'Delete',
        email: 'nodelete@test.com',
        phone: '2222222222',
        jobTitle: 'Perm',
        department: 'Perm',
        salary: 35000,
        hireDate: new Date()
      });

      const res = await request(app)
        .delete(`/api/v1/employees/${emp._id}`)
        .set('Authorization', `Bearer ${hrToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});
