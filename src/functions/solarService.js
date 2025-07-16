
// services/solarService.js

export async function fetchSolarEnergyById(id) {
    try {
      const response = await fetch(`http://localhost:8081/api/solarPanel/`);
  
      if (!response.ok) {
        throw new Error("Failed to fetch solar panel data");
      }
  
      const data = await response.json();
      console.log(data.energyProduce);
      return data.energyProduce; // Adjust this based on the actual DTO structure
      
    } catch (error) {
      console.error("Error fetching solar panel energy:", error);
      return null;
    }
  }
  