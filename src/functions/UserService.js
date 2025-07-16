

// src/api/api.js
// src/userService.js

export const handleUserAddition = async ( id, userPass,city,firstName,lastName,email,role) => {
  const newUser = {id,firstName,role, lastName,email,city,userPass };
    try {
      const response = await fetch("http://localhost:8081/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add user");
      }
  
      const addedUser = await response.json();
       
      
      alert("User added successfully!");
    } catch (error) {
      alert("Failed to add user.");
    }
  };
  export const handlePasswordUpdate = async ( id,userPass) => {
    try {
      const updatedUser = { id, userPass}; 
  
      const response = await fetch(`http://localhost:8081/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
  
      const userData = await response.json();
      console.log("Updated user:", userData);
  
      
      
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
    };
export async function fetchUserById(userId) {
  try {
    const response = await fetch(`http://localhost:8081/api/users/${userId}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch user data");
    }

    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Received invalid JSON from server");
    }
  } catch (error) {
    console.error("Error fetching user:", error.message);
    throw error;
  }
}


export async function deleteUserById(userId) {
  try {
    const response = await fetch(`http://localhost:8081/api/users/${userId}`, {
      method: "DELETE",
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || "Failed to delete user");
    }

    return text; 
  } catch (error) {
    console.error("Error in deleteUserById:", error);
    throw error;
  }
}
