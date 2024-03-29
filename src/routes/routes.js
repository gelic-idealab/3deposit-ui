import Login from "../pages/Login";
import MainLayout from "../pages/MainLayout";
import Dashboard from "../pages/Dashboard";
import Deposits from "../pages/Deposits";
import Deposit from "../pages/Deposit";
import Upload from "../pages/Upload";
import Admin from "../pages/Admin";
import Metadata from "../pages/Metadata";


const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    component: MainLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "/deposits",
        name: "Deposits",
        component: Deposits,
      },
      {
        path: "/deposits/:id",
        name: "Deposit",
        component: Deposit,
      },
      {
        path: "/upload",
        name: "Upload",
        component: Upload,
      },
      {
        path: "/admin",
        name: "Admin",
        component: Admin
      },
      {
        path: "/metadata",
        name: "Metadata",
        component: Metadata
      }
    ]
  }
];

export default routes;
