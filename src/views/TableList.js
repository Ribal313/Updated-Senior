import React, { useState } from "react";
import useFetchUsers from "functions/useFetchUsers";
import useFetchMachine from "functions/useFetchMachines";
import { deleteUserById } from "functions/UserService";
import { Table, Button, Container, Spinner, Alert } from "react-bootstrap";

function UsersAndMachines() {
  const { users, loadingUsers, errorUsers, refetchUsers } = useFetchUsers();
  const { machines, loadingMachines, errorMachines } = useFetchMachine();
  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setDeletingId(id);
      const result = await deleteUserById(id);
      alert(result);
      await refetchUsers();
    } catch (err) {
      alert(err.message || "Failed to delete user.");
    } finally {
      setDeletingId(null);
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
      <Container style={{ maxWidth: "960px" }}>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: "15px",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            color: "#e0e0e0",
            padding: "25px 30px",
            width: "100%",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              letterSpacing: "0.05em",
              color: "#f5f5f5",
              marginBottom: "1.5rem",
              textShadow: "0 0 6px rgba(255, 255, 255, 0.7)",
            }}
          >
            Users
          </h2>

          {loadingUsers && (
            <div className="text-center my-4">
              <Spinner animation="border" variant="light" />
            </div>
          )}

          {errorUsers && <Alert variant="danger">{errorUsers}</Alert>}

          {!loadingUsers && !errorUsers && (
       <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "rgba(255, 255, 255, 0.1)", // very light translucent white background
    color: "#ffffff", // solid white text
    border: "2px solid #ffffff", // solid white border
    borderRadius: "10px",
  }}
>
  <thead>
    <tr>
      <th style={{
        border: "1px solid #ffffff",
        padding: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      }}>ID</th>
      <th style={{
        border: "1px solid #ffffff",
        padding: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      }}>First Name</th>
      <th style={{
        border: "1px solid #ffffff",
        padding: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      }}>Last Name</th>
      <th style={{
        border: "1px solid #ffffff",
        padding: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      }}>Email</th>
      <th style={{
        border: "1px solid #ffffff",
        padding: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      }}>City</th>
      <th style={{
        border: "1px solid #ffffff",
        padding: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      }}>Action</th>
    </tr>
  </thead>
  <tbody>
    {users.filter(u => u.id !== 1).length === 0 ? (
      <tr>
        <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#fff" }}>
          No users found.
        </td>
      </tr>
    ) : (
      users.filter(u => u.id !== 1).map(u => (
        <tr key={u.id} style={{ border: "1px solid #fff" }}>
          <td style={{ border: "1px solid #fff", padding: "10px" }}>{u.id}</td>
          <td style={{ border: "1px solid #fff", padding: "10px" }}>{u.firstName}</td>
          <td style={{ border: "1px solid #fff", padding: "10px" }}>{u.lastName}</td>
          <td style={{ border: "1px solid #fff", padding: "10px" }}>{u.email}</td>
          <td style={{ border: "1px solid #fff", padding: "10px" }}>{u.city}</td>
          <td style={{ border: "1px solid #fff", padding: "10px" }}>
            <button
              onClick={() => handleDeleteUser(u.id)}
              disabled={deletingId === u.id}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: deletingId === u.id ? "not-allowed" : "pointer",
              }}
            >
              {deletingId === u.id ? "Deleting..." : "Delete"}
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>


          )}

          <h2
            style={{
              fontWeight: "bold",
              letterSpacing: "0.05em",
              color: "#f5f5f5",
              marginTop: "3rem",
              marginBottom: "1.5rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.3)",
              paddingTop: "1rem",
              textShadow: "0 0 6px rgba(255, 255, 255, 0.7)",
            }}
          >
            Machines
          </h2>

          {loadingMachines && (
            <div className="text-center my-4">
              <Spinner animation="border" variant="light" />
            </div>
          )}

          {errorMachines && <Alert variant="danger">{errorMachines}</Alert>}

         {!loadingMachines && !errorMachines && (
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "rgba(255, 255, 255, 0.1)", // very light translucent white background
      color: "#ffffff", // solid white text
      border: "2px solid #ffffff", // solid white border
      borderRadius: "10px",
      marginTop: "10px",
    }}
  >
    <thead>
      <tr>
        <th
          style={{
            border: "1px solid #ffffff",
            padding: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          Name
        </th>
        <th
          style={{
            border: "1px solid #ffffff",
            padding: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          Status
        </th>
      </tr>
    </thead>
    <tbody>
      {machines.length === 0 ? (
        <tr>
          <td
            colSpan="2"
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#fff",
            }}
          >
            No machines found.
          </td>
        </tr>
      ) : (
        machines.map((m) => (
          <tr key={m.id} style={{ border: "1px solid #fff" }}>
            <td style={{ border: "1px solid #fff", padding: "10px" }}>
              {m.machineName}
            </td>
            <td style={{ border: "1px solid #fff", padding: "10px" }}>
              {m.status}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
)}

        </div>
      </Container>
    </div>
  );
}

export default UsersAndMachines;
