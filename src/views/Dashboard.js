import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Badge } from "react-bootstrap";
import { FaSolarPanel } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import DatePicker from "./dateP";
import SolarGeneratorPieChart from "./solarGenPiChart";
import MachineActivityChart from "./MachineActivityChart";
import { fetchSolarEnergyById } from "functions/solarService";

function Dashboard() {
  const [energy, setEnergy] = useState(null);
  const [dateToCheck, setDateToCheck] = useState(new Date());
  console.log("Selected date from calendar:", dateToCheck);

  const loadEnergy = async () => {
    const result = await fetchSolarEnergyById(12);
    setEnergy(result);
  };

  useEffect(() => {
    loadEnergy();
  }, []);

  // Glass card style
  const glassCardStyle = {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)", // for Safari
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
    borderRadius: "1rem",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    color: "#222",
  };

  return (
    <Container fluid>
      <Row>
        <Col lg="12">
          <Card className="card-stats" style={glassCardStyle}>
            <Card.Body>
              <Row className="mb-4 g-0">
                <Col xs={12}>
                  <Card
                    className="shadow-sm border-0 overflow-hidden"
                    style={{
                      ...glassCardStyle,
                      background:
                        "rgba(255, 255, 255, 0.12)", // slightly darker for inner card
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <Card.Body className="p-3 p-md-4">
                      <Row className="g-3 align-items-center">
                        <Col xs="auto">
                          <div
                            style={{
                              width: "4.5rem",
                              height: "4.5rem",
                              background:
                                "linear-gradient(135deg, rgba(255,214,0,0.25) 0%, rgba(255,214,0,0.1) 100%)",
                              borderRadius: "0.75rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 2px 8px rgba(255,214,0,0.3)",
                            }}
                          >
                            <FaSolarPanel
                              size={32}
                              style={{ color: "var(--bs-warning)" }}
                            />
                          </div>
                        </Col>
                        <Col>
                          <div className="d-flex flex-column">
                            <span
                              className="small mb-1"
                              style={{ color: "#555" }}
                            >
                              SOLAR PRODUCTION
                            </span>
                            <div className="d-flex align-items-baseline">
                              <h3
                                className="mb-0 me-2"
                                style={{ fontWeight: "600", color: "#111" }}
                              >
                                {typeof energy === "number" ? (
                                  energy
                                ) : (
                                  <Spinner
                                    animation="border"
                                    size="sm"
                                    role="status"
                                  >
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </Spinner>
                                )}
                              </h3>
                              <span
                                style={{
                                  fontSize: "0.9rem",
                                  color: "#444",
                                  fontWeight: "500",
                                }}
                              >
                                kWh
                              </span>
                            </div>
                            <div className="mt-2">
                              <Badge
                                pill
                                bg="warning"
                                text="dark"
                                className="py-1 px-2"
                                style={{
                                  fontWeight: "500",
                                  background: "rgba(255,214,0,0.2)",
                                  border: "1px solid rgba(255,214,0,0.3)",
                                  color: "#4a3e00",
                                }}
                              >
                                <FiSun className="me-1" /> Renewable
                              </Badge>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer
              style={{ background: "rgba(255,255,255,0.1)", borderTop: "1px solid rgba(255,255,255,0.2)" }}
            >
              <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />
              <div
                className="stats d-flex align-items-center cursor-pointer"
                onClick={loadEnergy}
                style={{ color: "#222" }}
              >
                <i className="fas fa-redo mr-1"></i>
                Update Now
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md="8">
          <Card className="shadow-sm" style={{ ...glassCardStyle, minHeight: "518px" }}>
            <Card.Header style={{ background: "rgba(255,255,255,0.15)", borderBottom: "1px solid rgba(255,255,255,0.25)" }}>
              <Card.Title as="h4" style={{ color: "#111" }}>
                Machine Activity
              </Card.Title>
              <p className="card-category" style={{ color: "#555" }}>
                ({dateToCheck.toDateString()})
              </p>
            </Card.Header>
            <Card.Body>
              <MachineActivityChart date={dateToCheck} />
            </Card.Body>
           
          </Card>
        </Col>

        <Col md="4">
          <Card className="shadow-sm" style={glassCardStyle}>
            <Card.Header style={{ background: "rgba(255,255,255,0.15)", borderBottom: "1px solid rgba(255,255,255,0.25)" }}>
              <h4 className="card-category mb-0" style={{ color: "#111" }}>
                Solar vs Generator Working Hours
              </h4>
            </Card.Header>
            <Card.Body>
              <div className="mb-1 text-center">
                <h6 className="mb-1" style={{ color: "#555" }}>
                  ({dateToCheck.toDateString()})
                </h6>
                <SolarGeneratorPieChart date={dateToCheck} />
              </div>

              <div className="legend d-flex justify-content-center align-items-center gap-3 mb-4" style={{ color: "#444" }}>
                <span>
                  <i className="fas fa-circle text-info me-1"></i> Solar
                </span>
                <span>
                  <i className="fas fa-circle text-danger me-1"></i> Generator
                </span>
              </div>

              <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />

              <div className="stats d-flex justify-content-center" style={{ color: "#555" }}>
                <DatePicker selectedDate={dateToCheck} onChange={setDateToCheck} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
