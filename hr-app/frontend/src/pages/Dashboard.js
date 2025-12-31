import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { FaUsers, FaBriefcase, FaCalendarAlt, FaUserTie } from 'react-icons/fa';
import { authService } from '../services/apiService';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Please login first</Alert>
      </Container>
    );
  }

  const dashboardCards = [
    {
      title: 'Employees',
      icon: <FaUsers size={40} />,
      color: 'primary',
      link: '/employees',
      allowed: ['Admin', 'HR', 'Manager'],
    },
    {
      title: 'Jobs',
      icon: <FaBriefcase size={40} />,
      color: 'success',
      link: '/jobs',
      allowed: ['Admin', 'HR', 'Manager'],
    },
    {
      title: 'Leave Management',
      icon: <FaCalendarAlt size={40} />,
      color: 'info',
      link: '/leave',
      allowed: ['Admin', 'HR', 'Manager', 'Employee'],
    },
    {
      title: 'My Profile',
      icon: <FaUserTie size={40} />,
      color: 'warning',
      link: '/profile',
      allowed: ['Admin', 'HR', 'Manager', 'Employee'],
    },
  ];

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1>Welcome, {user.name}!</h1>
          <p className="text-muted">Role: <strong>{user.role}</strong></p>
        </div>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Row>
        {dashboardCards
          .filter((card) => card.allowed.includes(user.role))
          .map((card, index) => (
            <Col md={6} lg={3} key={index} className="mb-4">
              <Card
                className="h-100 shadow-sm hover-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(card.link)}
              >
                <Card.Body className="d-flex flex-column align-items-center text-center">
                  <div className={`text-${card.color} mb-3`}>
                    {card.icon}
                  </div>
                  <Card.Title>{card.title}</Card.Title>
                  <Button
                    variant={card.color}
                    size="sm"
                    className="mt-3"
                    onClick={() => navigate(card.link)}
                  >
                    Access
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default Dashboard;
