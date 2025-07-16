import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { fetchUserById } from "functions/UserService";

const Account = () => {
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  if (!userId || userId === "undefined") {
    setError("User not logged in");
    setLoading(false);
    return;
  }

  const getUserData = async () => {
    try {
      const data = await fetchUserById(userId);
      setUserData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  getUserData();
}, [userId]);

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/login.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2rem",
        color: "#fff",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "16px",
                color: "#fff",
              }}
              className="shadow-lg p-4"
            >
              <Card.Body>
                <h2 className="text-center mb-4">Account Information</h2>

                {loading && <div className="text-center">Loading user info...</div>}
                {error && <div className="text-danger text-center">Error: {error}</div>}
                {!loading && !error && userData && (
                  <div>
                    <p><strong>ID:</strong> {userData.id}</p>
                    <p><strong>Username:</strong> {userData.firstName}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Account;
