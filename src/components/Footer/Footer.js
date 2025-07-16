import React from "react";
import { Container, Row, Col } from "react-bootstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer px-3 py-4 bg-light text-center text-lg-start shadow-sm">
        <Container fluid>
          <Row className="align-items-center justify-content-between">
            <Col md="6" className="text-md-start text-center mb-2 mb-md-0">
              <p className="mb-0 text-muted">
                © {new Date().getFullYear()} <strong>Peyrano</strong> — Made with ❤️ for chocolate lovers.
              </p>
            </Col>
            <Col md="6" className="text-md-end text-center">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted me-3">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted me-3">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted me-3">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </Col>
          </Row>
        </Container>
      </footer>
    );
  }
}

export default Footer;
