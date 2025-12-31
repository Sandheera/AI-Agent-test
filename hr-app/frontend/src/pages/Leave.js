import React, { useEffect, useState } from 'react';
import { Container, Button, Table, Form, Modal, Card, Row, Col, Alert } from 'react-bootstrap';
import { FaCalendarAlt, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { leaveService } from '../services/apiService';
import { toast } from 'react-toastify';

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    leaveType: 'Vacation',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [approvalData, setApprovalData] = useState({
    status: 'Approved',
    comments: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser && parsedUser.id) {
        fetchLeaveBalance(parsedUser.id);
      }
    }
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await leaveService.getAll(page, limit, status);
      setLeaves(response.data.data.leaves || []);
    } catch (err) {
      toast.error('Failed to fetch leave requests');
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveBalance = async (employeeId) => {
    try {
      const response = await leaveService.getBalance(employeeId);
      setBalance(response.data.data);
    } catch (err) {
      console.log('Error fetching balance');
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [page, limit, status]);

  const handleRequestLeave = async (e) => {
    e.preventDefault();
    try {
      // Calculate duration
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      await leaveService.request({
        employeeId: user.id,
        ...formData,
        duration,
      });
      toast.success('Leave request submitted');
      setShowModal(false);
      setFormData({
        leaveType: 'Vacation',
        startDate: '',
        endDate: '',
        reason: '',
      });
      fetchLeaves();
      if (user) fetchLeaveBalance(user._id);
    } catch (err) {
      toast.error('Failed to request leave');
    }
  };

  const handleApproveLeave = async () => {
    try {
      await leaveService.approve(selectedLeave._id, {
        ...approvalData,
        approvedBy: user.id,
      });
      toast.success('Leave approved');
      setShowApprovalModal(false);
      setApprovalData({ status: 'Approved', comments: '' });
      fetchLeaves();
    } catch (err) {
      toast.error('Failed to approve leave');
    }
  };

  const handleCancelLeave = async (id) => {
    if (window.confirm('Are you sure you want to cancel this leave?')) {
      try {
        await leaveService.cancel(id);
        toast.success('Leave cancelled');
        fetchLeaves();
      } catch (err) {
        toast.error('Failed to cancel leave');
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Leave Management</h2>

      {balance && (
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h5>Total Allowance</h5>
                <h3>{balance.totalAllowance} days</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <h5>Used</h5>
                <h3>{balance.used} days</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center bg-success text-white">
              <Card.Body>
                <h5>Remaining</h5>
                <h3>{balance.remaining} days</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <div className="mb-4">
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="me-2"
        >
          <FaCalendarAlt /> Request Leave
        </Button>

        <Form.Select
          style={{ width: '200px', display: 'inline-block' }}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </Form.Select>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id}>
              <td>{leave.employeeId?.firstName} {leave.employeeId?.lastName}</td>
              <td>{leave.leaveType}</td>
              <td>{new Date(leave.startDate).toLocaleDateString()}</td>
              <td>{new Date(leave.endDate).toLocaleDateString()}</td>
              <td>{leave.duration} days</td>
              <td>
                <span
                  className={`badge bg-${
                    leave.status === 'Approved'
                      ? 'success'
                      : leave.status === 'Rejected'
                      ? 'danger'
                      : 'warning'
                  }`}
                >
                  {leave.status}
                </span>
              </td>
              <td>
                {leave.status === 'Pending' && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        setSelectedLeave(leave);
                        setApprovalData({ status: 'Approved', comments: '' });
                        setShowApprovalModal(true);
                      }}
                      className="me-2"
                    >
                      <FaCheck />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelLeave(leave._id)}
                    >
                      <FaTrash />
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Request Leave Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRequestLeave}>
            <Form.Group className="mb-3">
              <Form.Label>Leave Type</Form.Label>
              <Form.Select
                value={formData.leaveType}
                onChange={(e) =>
                  setFormData({ ...formData, leaveType: e.target.value })
                }
              >
                <option>Vacation</option>
                <option>Sick</option>
                <option>Personal</option>
                <option>Maternity</option>
                <option>Paternity</option>
                <option>Unpaid</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Submit Request
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Approval Modal */}
      <Modal show={showApprovalModal} onHide={() => setShowApprovalModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Approve/Reject Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Decision</Form.Label>
            <Form.Select
              value={approvalData.status}
              onChange={(e) =>
                setApprovalData({ ...approvalData, status: e.target.value })
              }
            >
              <option value="Approved">Approve</option>
              <option value="Rejected">Reject</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={approvalData.comments}
              onChange={(e) =>
                setApprovalData({ ...approvalData, comments: e.target.value })
              }
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleApproveLeave}
            className="w-100"
          >
            Submit Decision
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Leave;
