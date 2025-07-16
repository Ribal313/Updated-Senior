import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Row, Col, Card, Button, ListGroup, Spinner,
  Alert, ProgressBar, Badge, OverlayTrigger, Tooltip
} from 'react-bootstrap';

const MACHINE_MAX_POWER = 100; // Max power (kW)
const ENERGY_COST_PER_KWH = 2; // Cost per kWh in $

const MachineDetail = () => {
  const { name } = useParams();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [mode, setMode] = useState(() => localStorage.getItem("machineMode") || "MANUAL");

  const fetchMachineData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8081/api/machines/machineName?machineName=${encodeURIComponent(name)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMachine(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachineData();
  }, [name]);

  useEffect(() => {
    const syncMode = () => {
      const storedMode = localStorage.getItem("machineMode");
      if (storedMode !== mode) {
        setMode(storedMode || "MANUAL");
      }
    };

    syncMode();
    window.addEventListener("storage", syncMode);
    window.addEventListener("focus", syncMode);

    return () => {
      window.removeEventListener("storage", syncMode);
      window.removeEventListener("focus", syncMode);
    };
  }, [mode]);

  const toggleMachineStatus = async () => {
    if (!machine || mode === 'AUTOMATIC') return;
    setActionLoading(true);
    setError(null);
    const action = machine.status === 'ON' ? 'off' : 'on';

    try {
      const response = await fetch(`http://localhost:8081/api/machine/${name}/${action}`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to send control command');

      try {
        const updatedMachine = await response.json();
        setMachine(updatedMachine);
      } catch {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await fetchMachineData();
      }

      setShowAlert(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const calculateEfficiency = () => {
    if (!machine) return 0;
    let eff = Math.round(((MACHINE_MAX_POWER - machine.energyConsumption) / MACHINE_MAX_POWER) * 100);
    return Math.max(0, Math.min(100, eff));
  };

  const calculateCost = () => {
    if (!machine) return 0;
    return (machine.energyQuantity * ENERGY_COST_PER_KWH * 100).toFixed(2);
  };

  const uptime = '24h 7m';
  const currentLoadPercent = machine && machine.energyConsumption
    ? Math.round((machine.energyConsumption / MACHINE_MAX_POWER) * 100)
    : 0;

  const efficiency = calculateEfficiency();
  const efficiencyVariant = efficiency >= 70 ? 'success' : efficiency >= 40 ? 'warning' : 'danger';
  const consumptionVariant = machine && machine.energyConsumption < 50 ? 'success' : 'danger';

  // --- Styles ---
  const containerStyle = {
    minHeight: '100vh',
    backgroundImage: `url('/machiness.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    color: 'white',
    padding: '2rem 1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    // Add dark overlay
    overflowX: 'hidden',
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    zIndex: -1,
  };

  const cardStyle = {
    backgroundColor: 'rgba(20, 20, 20, 0.6)', // dark transparent for glass effect
    color: 'white',
    borderRadius: '15px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  };

  const titleStyle = {
    textShadow: '1px 1px 6px rgba(0, 0, 0, 0.7)',
  };

  const badgeStyle = {
    fontWeight: '600',
    fontSize: '0.9rem',
  };

  if (loading) {
    return (
      <div style={{ ...containerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={overlayStyle}></div>
        <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }} />
      </div>
    );
  }

  if (error) {
    return (
      <Container style={{ ...containerStyle }}>
        <div style={overlayStyle}></div>
        <Alert variant="danger" className="shadow" style={cardStyle}>
          <Alert.Heading>Error Loading Machine</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (!machine) {
    return (
      <Container style={{ ...containerStyle }}>
        <div style={overlayStyle}></div>
        <Alert variant="warning" className="shadow" style={cardStyle}>
          <Alert.Heading>Machine Not Found</Alert.Heading>
          <p>No machine with name "{name}" was found in the system.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>

      <Container>
        {showAlert && (
          <Alert
            variant={machine.status === 'ON' ? 'success' : 'warning'}
            dismissible
            onClose={() => setShowAlert(false)}
            className="shadow"
            style={cardStyle}
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-power me-2"></i>
              Machine successfully {machine.status === 'ON' ? 'started' : 'stopped'}.
            </div>
          </Alert>
        )}

        <Row className="mb-4 align-items-center">
          <Col>
  <div className="d-flex align-items-center">
    <i className="bi bi-gear-fill fs-3 text-primary me-3"></i>
    <div>
      <h1 style={titleStyle} className="fw-bold mb-0">{machine.name}</h1>
      <p className="text-dark mb-0">Name: {machine.machineName}</p>
    </div>
  </div>
</Col>

          <Col xs="auto">
            <Badge pill bg={machine.status === 'ON' ? 'success' : 'secondary'} style={badgeStyle} className="px-3 py-2 shadow-sm">
              {machine.status === 'ON' ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <Card className="mb-4 shadow-sm" style={cardStyle}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Card.Title className="mb-0 d-flex align-items-center" style={{ color: 'lightyellow' }}>
                    <i className="bi bi-lightning-fill text-warning me-2"></i>
                    Energy Dashboard
                  </Card.Title>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Current power consumption (kW)</Tooltip>}>
                    <Badge bg="light" text="dark" className="fs-6">
                      {machine.energyConsumption*100} kW
                    </Badge>
                  </OverlayTrigger>
                </div>

                <ProgressBar
                  now={machine.energyConsumption*100}
                  max={MACHINE_MAX_POWER}
                  variant={consumptionVariant}
                  striped
                  animated={machine.status === 'ON'}
                  className="mb-4"
                  style={{ height: '10px' }}
                />

                <Row>
                  <Col md={6} className="mb-3">
                    <Card className="h-100 border-0" style={{ ...cardStyle, backgroundColor: 'rgba(40,40,40,0.5)' }}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-light"> Energy</span>
                          <i className="bi bi-activity text-primary"></i>
                        </div>
                        <h3 className="fw-bold text-light">{machine.energyConsumption*100} kWh</h3>
                        <small className="text-light"></small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Card className="h-100 border-0" style={{ ...cardStyle, backgroundColor: 'rgba(40,40,40,0.5)' }}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-light">Efficiency</span>
                          <i className="bi bi-graph-up text-success"></i>
                        </div>
                        <h3 className="fw-bold">
                          <Badge bg={efficiencyVariant} className="px-2 py-1">{efficiency}%</Badge>
                        </h3>
                        <small className="text-light">Current rating</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Card className="h-100 border-0" style={{ ...cardStyle, backgroundColor: 'rgba(40,40,40,0.5)' }}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-light">Cost</span>
                          <i className="bi bi-currency-dollar text-info"></i>
                        </div>
                        <h3 className="fw-bold">${calculateCost()}</h3>
                        <small className="text-light">Estimated cost</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Card className="h-100 border-0" style={{ ...cardStyle, backgroundColor: 'rgba(40,40,40,0.5)' }}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-light">Uptime</span>
                          <i className="bi bi-clock-history text-warning"></i>
                        </div>
                        <h3 className="fw-bold">
  {new Date(machine.controlTime).toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}
</h3>
<small className="text-light">Operational time</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <div className="d-flex justify-content-center mt-4">
                  <Button
                    variant={machine.status === 'ON' ? 'danger' : 'success'}
                    onClick={toggleMachineStatus}
                    disabled={actionLoading || mode === 'AUTOMATIC'}
                    size="lg"
                    style={{ minWidth: '150px', fontWeight: '600' }}
                  >
                    {actionLoading ? (
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : (
                      machine.status === 'ON' ? 'Turn OFF' : 'Turn ON'
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm" style={cardStyle}>
              <Card.Body>
                <Card.Title style={titleStyle}>Machine Info</Card.Title>
                <ListGroup variant="flush" className="text-light">
                  <ListGroup.Item style={{ backgroundColor: 'transparent' }}>
                    <strong>ID:</strong> {machine.id}
                  </ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: 'transparent' }}>
                    <strong>Location:</strong> {machine.location || 'Unknown'}
                  </ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: 'transparent' }}>
                    <strong>Mode:</strong> {mode}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MachineDetail;
