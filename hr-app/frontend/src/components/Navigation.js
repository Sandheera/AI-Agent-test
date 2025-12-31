import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { authService } from '../services/apiService';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Don't show navbar on login/register pages
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/dashboard" className="fw-bold">
          HR Management System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            {['Admin', 'HR', 'Manager'].includes(user.role) && (
              <>
                <Nav.Link href="/employees">Employees</Nav.Link>
                <Nav.Link href="/jobs">Jobs</Nav.Link>
              </>
            )}
            <Nav.Link href="/leave">Leave</Nav.Link>
            <Nav.Link href="/profile">{user.name}</Nav.Link>
            <Nav.Link onClick={handleLogout} className="text-danger">
              <FaSignOutAlt /> Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
