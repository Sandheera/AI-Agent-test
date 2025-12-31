import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { authService } from '../services/apiService';
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">User information not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">My Profile</h2>

      <Card className="shadow-sm">
        <Card.Body>
          <div className="mb-4">
            <h5>Personal Information</h5>
            <hr />
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Name</Form.Label>
                <Form.Control
                  type="text"
                  value={user.name}
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Email</Form.Label>
                <Form.Control
                  type="email"
                  value={user.email}
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Role</Form.Label>
                <Form.Control
                  type="text"
                  value={user.role}
                  disabled
                />
              </Form.Group>

              {user.employeeId && (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Employee ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={user.employeeId}
                    disabled
                  />
                </Form.Group>
              )}

              <Alert variant="info">
                For additional profile information, please contact HR department.
              </Alert>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
