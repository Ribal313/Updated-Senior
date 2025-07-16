// src/hooks/useFetchMachines.js
import { useEffect, useState } from "react";

function useFetchMachines() {
  const [machines, setMachines] = useState([]);
  const [loadingMachines, setLoadingMachines] = useState(true);
  const [errorMachines, setErrorMachines] = useState(null);

  useEffect(() => {
    async function fetchMachines() {
      try {
        const res = await fetch("http://localhost:8081/api/machines/latest-machine"); 
        if (!res.ok) throw new Error("Failed to fetch machines");
        const data = await res.json();
        setMachines(data);
      } catch (err) {
        setErrorMachines(err.message || "Unknown error");
      } finally {
        setLoadingMachines(false);
      }
    }
    fetchMachines();
  }, []);

  return { machines, loadingMachines, errorMachines };
}

export default useFetchMachines;
