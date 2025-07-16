import React, { useState } from "react";
import { useHistory } from "react-router-dom"; // React Router v5
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner
} from "react-bootstrap";
import { FaUserCog, FaLock, FaIndustry } from "react-icons/fa";

function Login() {
  const history = useHistory();
  const [credentials, setCredentials] = useState({ id: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    localStorage.setItem("isAuthenticated", "false");

    try {
      const res = await fetch("http://localhost:8081/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: credentials.id,
          password: credentials.password,
        }),
      });

     const data = await res.json();
     console.log(data)

  if (!res.ok) throw new Error(data.message || 'Login failed');

  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.id);
  localStorage.setItem("role", data.role); 
  localStorage.setItem("isAuthenticated", "true");
  history.push("/admin/dashboard");

      history.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(255,255,255,0.3), rgba(255,255,255,0.3)), url('/login.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Row className="justify-content-center w-100 gx-0">
        <Col md={8} lg={6} xl={5} className="px-0">
          <Card
            className="border-0 shadow"
            style={{
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              borderTop: "4px solid #5D4037",
            }}
          >
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <div
                  className="mb-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#5D4037",
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaIndustry className="text-white" size={24} />
                </div>
                <h3 className="fw-bold mb-2" style={{ color: "#5D4037" }}>
                  PEYRANO CHOCOLATE FACTORY
                </h3>
                <hr
                  className="mx-auto my-3"
                  style={{ width: "80px", borderTop: "2px solid #D7CCC8" }}
                />
              </div>

              {error && (
                <Alert
                  variant="danger"
                  className="text-center py-2 mb-4"
                  style={{
                    fontSize: "0.9rem",
                    backgroundColor: "#EF9A9A",
                    borderColor: "#EF9A9A",
                    color: "#5D4037",
                  }}
                >
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-4">
                  <Form.Label
                    className="fw-medium small text-uppercase"
                    style={{ color: "#5D4037" }}
                  >
                    Operator ID
                  </Form.Label>
                  <div className="input-group">
                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: "#D7CCC8",
                        borderColor: "#D7CCC8",
                      }}
                    >
                      <FaUserCog style={{ color: "#5D4037" }} />
                    </span>
                    <Form.Control
                      type="text"
                      name="id"
                      value={credentials.id}
                      onChange={handleChange}
                      required
                      className="py-2"
                      placeholder="Enter operator ID"
                      style={{
                        fontSize: "0.95rem",
                        borderColor: "#D7CCC8",
                        backgroundColor: "#f5f5f5",
                      }}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label
                    className="fw-medium small text-uppercase"
                    style={{ color: "#5D4037" }}
                  >
                    Security Key
                  </Form.Label>
                  <div className="input-group">
                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: "#D7CCC8",
                        borderColor: "#D7CCC8",
                      }}
                    >
                      <FaLock style={{ color: "#5D4037" }} />
                    </span>
                    <Form.Control
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                      className="py-2"
                      placeholder="Enter security key"
                      style={{
                        fontSize: "0.95rem",
                        borderColor: "#D7CCC8",
                        backgroundColor: "#f5f5f5",
                      }}
                    />
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-center mb-3">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="fw-semibold py-2 d-flex justify-content-center align-items-center"
                    style={{
                      backgroundColor: "#5D4037",
                      borderColor: "#5D4037",
                      fontSize: "1rem",
                      gap: "0.5rem",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      "LOGIN"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
