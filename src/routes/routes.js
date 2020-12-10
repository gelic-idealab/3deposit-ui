import Login from "../pages/Login";
import MainLayout from "../pages/MainLayout";
import Dashboard from "../pages/Dashboard";
import Deposits from "../components/Deposits";
import Deposit from "../pages/Deposit";
import Upload from "../pages/Upload";
import Users from "../pages/Users";
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
        path: "/create",
        name: "Create",
        component: Upload,
      },
      {
        path: "/users",
        name: "Users",
        component: Users
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
