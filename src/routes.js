import { jwtDecode } from "jwt-decode"; 
import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import Icons from "views/Icons.js";
import Maps from "views/Maps.js";
import Notifications from "views/Notifications.js";

const baseRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "Machines",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "nc-icon nc-pin-3",
    component: Maps,
    layout: "/admin"
  },
];

const getDashboardRoutes = () => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const role = decoded.role || decoded.authorities || decoded.roles;

        const isAdmin = role === "ADMIN" || (Array.isArray(role) && role.includes("ADMIN"));

        if (isAdmin) {
          return [
            ...baseRoutes,
            {
              path: "/user",
              name: "User Profile",
              icon: "nc-icon nc-circle-09",
              component: UserProfile,
              layout: "/admin"
            },
            {
              path: "/table",
              name: "Table List",
              icon: "nc-icon nc-notes",
              component: TableList,
              layout: "/admin"
            },
          ];
        }
      }
    } catch (error) {
      console.error("Error decoding token or accessing localStorage:", error);
    }
  }

  return baseRoutes;
};

export default getDashboardRoutes;
