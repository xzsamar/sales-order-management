import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <Sidebar />

     <div
  style={{
    flex: 1,

    marginLeft: "270px",

    minWidth: 0,
  }}
>
        <Navbar />

        <div
          style={{
            padding: "24px",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;