import React, { useEffect, useState } from 'react';
import { Container, Button, Table, Form, Modal, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { jobService } from '../services/apiService';
import { toast } from 'react-toastify';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    location: '',
    requiredSkills: '',
    experienceRequired: '',
    salaryMin: '',
    salaryMax: '',
    employmentType: 'Full-Time',
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobService.getAll(page, limit, status);
      setJobs(response.data.data.jobs || []);
    } catch (err) {
      toast.error('Failed to fetch jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, limit, status]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.delete(id);
        toast.success('Job deleted successfully');
        fetchJobs();
      } catch (err) {
        toast.error('Failed to delete job');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const jobData = {
        ...formData,
        postedBy: user.id,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()),
        experienceRequired: parseInt(formData.experienceRequired),
        salaryMin: parseInt(formData.salaryMin),
        salaryMax: parseInt(formData.salaryMax),
      };

      if (editingJob) {
        await jobService.update(editingJob._id, jobData);
        toast.success('Job updated successfully');
      } else {
        await jobService.create(jobData);
        toast.success('Job created successfully');
      }
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        department: '',
        location: '',
        requiredSkills: '',
        experienceRequired: '',
        salaryMin: '',
        salaryMax: '',
        employmentType: 'Full-Time',
      });
      fetchJobs();
    } catch (err) {
      toast.error('Failed to save job');
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Job Postings</h2>
        <Button
          variant="primary"
          onClick={() => {
            setEditingJob(null);
            setShowModal(true);
          }}
        >
          <FaPlus /> Post Job
        </Button>
      </div>

      <Form.Group className="mb-4">
        <Form.Label>Filter by Status</Form.Label>
        <Form.Select value={status} onChange={(e) => {
          setStatus(e.target.value);
          setPage(1);
        }}>
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
          <option value="Filled">Filled</option>
          <option value="On Hold">On Hold</option>
        </Form.Select>
      </Form.Group>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Department</th>
            <th>Location</th>
            <th>Salary Range</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.title}</td>
              <td>{job.department}</td>
              <td>{job.location}</td>
              <td>${job.salaryMin} - ${job.salaryMax}</td>
              <td>{job.status}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => {
                    setEditingJob(job);
                    setFormData({
                      ...job,
                      requiredSkills: job.requiredSkills.join(', '),
                    });
                    setShowModal(true);
                  }}
                  className="me-2"
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(job._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingJob ? 'Edit Job' : 'Post New Job'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Control
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Required Skills (comma-separated)</Form.Label>
              <Form.Control
                value={formData.requiredSkills}
                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Experience Required (years)</Form.Label>
              <Form.Control
                type="number"
                value={formData.experienceRequired}
                onChange={(e) => setFormData({ ...formData, experienceRequired: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Salary Min</Form.Label>
              <Form.Control
                type="number"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Salary Max</Form.Label>
              <Form.Control
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Employment Type</Form.Label>
              <Form.Select
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              {editingJob ? 'Update' : 'Post'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Jobs;
