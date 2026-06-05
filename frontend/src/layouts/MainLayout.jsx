import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#07090f",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          marginLeft: "268px",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />

        <main
          style={{
            flex: 1,
            padding: "28px 28px 40px",
            maxWidth: "1400px",
            width: "100%",
          }}
        >
          <div className="page-enter">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;