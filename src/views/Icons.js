import React from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
// Example machines data with image URLs
const machines = [
  { id: 1, name: "Blender", description: "Description of Machine 1", image:"/machines.jpg" },
  { id: 2, name: "Cartoner", description: "Description of Machine 2", image:"/machines.jpg" },
  { id: 3, name: "Chocolate Filling", description: "Description of Machine 3", image:"/machines.jpg" },
  { id: 4, name: "Refrigerator", description: "Description of Machine 4", image:"/machines.jpg"},
];

const MachineList = () => {
  const history = useHistory();

  const handleCardClick = (name) => {
    history.push(`/machines/${name}`);
  };

  return (
    <Container>
    <Row className="g-4 mt-2">
      {machines.map((machine) => (
        <Col xs={12} md={6} key={machine.id}>
          <Card
            onClick={() => handleCardClick(machine.name)}
            className="shadow-lg border-0 overflow-hidden transition-all hover-transform"
            style={{
              cursor: "pointer",
              height: "350px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            {/* Background image with gradient overlay */}
            <div 
              className="card-bg-image h-100 w-100"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url(${machine.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <Card.Body className="d-flex flex-column justify-content-between h-100 p-4 text-white">
                {/* Top content (badge/tag if needed) */}
                <div style={{ alignSelf: "flex-start" }}>
                  {/* <span className="badge bg-primary">New</span> */}
                </div>
                
                {/* Button with machine name */}
                <div className="text-center mt-auto"> {/* mt-auto pushes button to bottom */}
                  <Button 
                    variant="outline-light" 
                    size="lg"
                    className="rounded-pill px-4 fw-medium border-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(machine.name);
                    }}
                    style={{
                      backdropFilter: "blur(5px)",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      transition: "all 0.3s ease",
                      fontSize: "1.25rem",
                      minWidth: "200px"
                    }}
                  >
                    {machine.name}
                  </Button>
                </div>
              </Card.Body>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);
};



export default MachineList;