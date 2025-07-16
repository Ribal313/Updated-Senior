import React, { useState } from "react";
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col
} from "react-bootstrap";
import { handleUserAddition, handlePasswordUpdate } from "functions/UserService";

function User() {
  const [firstName, setFName] = useState("");
  const [lastName, setLName] = useState("");
  const [city, setCity] = useState("");
  const [id, setId] = useState("");
  const [userPass, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [updateId, setUpdateId] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Validation error states
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddUser = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!id) newErrors.id = "ID is required.";
    if (!userPass) newErrors.userPass = "Password is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Please enter a valid email address.";
    if (!role) newErrors.role = "Please select a role.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // No errors, proceed to add user
      handleUserAddition(id, userPass, city, firstName, lastName, email, role);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(111,78,55,0.75), rgba(62,39,35,0.75)), url('/login.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: "40px 15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container style={{ maxWidth: "800px" }}>
        <Card
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: "15px",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            color: "#fff",
            padding: "20px",
          }}
        >
          <Card.Header style={{ backgroundColor: "transparent", borderBottom: "none" }}>
            <Card.Title
              as="h4"
              style={{ color: "white", fontWeight: "bold", letterSpacing: "0.05em" }}
            >
              Add User
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Form>
              <Row>
                <Col md="6">
                  <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label style={{ color: "#FFF8DC" }}>First Name</Form.Label>
                    <Form.Control
                      placeholder="Name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFName(e.target.value)}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.25)",
                        color: "#fff",
                        border: "none"
                      }}
                      isInvalid={!!errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label style={{ color: "#FFF8DC" }}>Last Name</Form.Label>
                    <Form.Control
                      placeholder="Last Name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLName(e.target.value)}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.25)",
                        color: "#fff",
                        border: "none"
                      }}
                      isInvalid={!!errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <Form.Group className="mb-3" controlId="id">
                    <Form.Label style={{ color: "#FFF8DC" }}>ID</Form.Label>
                    <Form.Control
                      placeholder="ID"
                      type="number"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.25)",
                        color: "#fff",
                        border: "none"
                      }}
                      isInvalid={!!errors.id}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.id}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="mb-3" controlId="userPass">
                    <Form.Label style={{ color: "#FFF8DC" }}>Password</Form.Label>
                    <Form.Control
                      placeholder="Password"
                      type="password"
                      value={userPass}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.25)",
                        color: "#fff",
                        border: "none"
                      }}
                      isInvalid={!!errors.userPass}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.userPass}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label style={{ color: "#FFF8DC" }}>Email</Form.Label>
                    <Form.Control
                      placeholder="Email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.25)",
                        color: "#fff",
                        border: "none"
                      }}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="mb-3" controlId="city">
                    <Form.Label style={{ color: "#FFF8DC" }}>City</Form.Label>
                    <Form.Control
                      placeholder="City"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.25)",
                        color: "#fff",
                        border: "none"
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <Form.Group className="mb-3" controlId="role">
                    <Form.Label style={{ color: "#FFF8DC" }}>Role</Form.Label>
                    <Form.Control
                      as="select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.25)",
                        color: role ? "#fff" : "#aaa",
                        border: "none"
                      }}
                      isInvalid={!!errors.role}
                    >
                      <option value="" style={{ color: "#000" }} disabled>Select role</option>
                      <option value="ADMIN" style={{ color: "#000" }}>Admin</option>
                      <option value="MANAGER" style={{ color: "#000" }}>Manager</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.role}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Button
                className="btn-fill pull-right mt-3"
                type="button"
                variant="warning"
                onClick={handleAddUser}
                style={{
                  fontWeight: "600",
                  letterSpacing: "0.05em",
                }}
              >
                Add User
              </Button>

              <hr style={{ borderColor: "rgba(255, 215, 0, 0.5)" }} />

              <h5 className="mt-4" style={{ color: "#FFD700" }}>Update User Password</h5>
              <Row>
                <Col md="6">
                  <Form.Group className="mb-3" controlId="updateId">
                    <Form.Label style={{ color: "#FFF8DC" }}>User ID</Form.Label>
                    <Form.Control
                      placeholder="Enter user ID"
                      type="number"
                      value={updateId}
                      onChange={(e) => setUpdateId(e.target.value)}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.25)",
                        color: "#fff",
                        border: "none"
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="mb-3" controlId="newPassword">
                    <Form.Label style={{ color: "#FFF8DC" }}>New Password</Form.Label>
                    <Form.Control
                      placeholder="Enter new password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.25)",
                        color: "#fff",
                        border: "none"
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button
                className="btn-fill pull-right mt-3"
                type="button"
                variant="outline-warning"
                onClick={() => handlePasswordUpdate(updateId, newPassword)}
                style={{
                  fontWeight: "600",
                  letterSpacing: "0.05em",
                }}
              >
                Update Password
              </Button>

              <div className="clearfix"></div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default User;
