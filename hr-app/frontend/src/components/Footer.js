import React from 'react';
import { Container, Row, Col, Text } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-5 py-4">
      <Container>
        <Row>
          <Col md={6}>
            <h5>HR Management System</h5>
            <p>Complete HR Management Solution</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p>&copy; 2024 HR Management System. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
