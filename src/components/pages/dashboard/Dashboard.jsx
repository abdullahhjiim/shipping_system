import React from "react";
import { Outlet } from "react-router-dom";
// import Home from "../../home/Home";
// import Locations from "../../locations/Locations";
import Sidebar from "../../sidebar/Sidebar";
import Topbar from "../../topbar/Topbar";
import "./dashboard.css";

function Dashboard() {
  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="vertical-overlay"></div>
      <div className="main-content">
        <div className="page-content-padding">
          <div className="container-fluid">
            {/* <Routes>
              <Route path="dashboard" element={<Home />} />
              <Route path="locations" element={<Locations />} />
            </Routes> */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
