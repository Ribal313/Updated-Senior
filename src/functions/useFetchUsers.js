import { useEffect, useState } from "react";

function useFetchUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch function that can be called to fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8081/api/users/all");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // initial fetch when the hook is used
  useEffect(() => {
    fetchUsers();
  }, []);

  // Return state and fetchUsers function to allow manual refetch
  return { users, loadingUsers: loading, errorUsers: error, refetchUsers: fetchUsers };
}

export default useFetchUsers;
