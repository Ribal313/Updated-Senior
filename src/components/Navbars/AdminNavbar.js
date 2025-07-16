import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { Mode } from "functions/machineControl";


function Header() {
  const history = useHistory();
  const location = useLocation();

  const [currentMode, setCurrentMode] = useState(
    localStorage.getItem("machineMode") || "Not selected"
  );

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "machineMode") {
        const newMode = event.newValue || "MANUAL";
        setCurrentMode(newMode);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    history.push("/login");
  };

  const handleAccountClick = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      history.push(`/account`);
    } else {
      alert("User not logged in");
    }
  };

  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    const node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  const handleSetMode = async (mode) => {
    const upperMode = mode.toUpperCase();

    // Update UI first
    setCurrentMode(upperMode);
    localStorage.setItem("machineMode", upperMode);

    // Call backend
    try {
      const result = await Mode(mode);
      if (!result) {
        throw new Error("Backend response invalid");
      }
    } catch (error) {
      console.error("Failed to set mode:", error);
      alert("Failed to switch mode. Reverting.");
      setCurrentMode("MANUAL");
      localStorage.setItem("machineMode", "MANUAL");
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
          <Button
            variant="dark"
            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
            onClick={mobileSidebarToggle}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
        </div>

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Left side - mode display */}
          <Nav className="mr-auto" navbar>
            <Nav.Item className="ml-3 mt-2">
              <span>
                <strong>Mode:</strong> {currentMode.toUpperCase()}
              </span>
            </Nav.Item>
          </Nav>

          {/* Right side - account, mode switch, logout */}
          <Nav className="ml-auto" navbar>
            <Nav.Item>
              <Nav.Link className="m-0" onClick={handleAccountClick}>
                <span className="no-icon">Account</span>
              </Nav.Link>
            </Nav.Item>

            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                as={Nav.Link}
                id="navbarDropdownMenuLink"
                variant="default"
                className="m-0"
              >
                <span className="no-icon">Set Mode</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSetMode("manual")}>
                  Manual Control
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSetMode("automatic")}>
                  Automatic Control
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Nav.Item>
              <Nav.Link className="m-0" onClick={handleLogout}>
                <span className="no-icon">Log out</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
