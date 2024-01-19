/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import languageStrings from "../../localization/language";

function Sidebar() {
  const authData = useSelector((state) => state.auth);

  const handleClose = () => {
    let element = document.getElementById("sidebar_all_menu");
    element.classList.add("d-none");
  };

  languageStrings.setLanguage(authData?.language ?? "en");

  return (
    <div
      className="app-menu navbar-menu d-none d-md-block"
      id="sidebar_all_menu"
      style={{ height: "100vh", overflow: "scroll" }}
    >
      <div className="navbar-brand-box">
        <Link to="/" className="logo logo-dark">
          <span className="logo-sm">
            <img src="assets/images/greenline-logo.png" alt="" height="22" />
          </span>
          <span className="logo-lg">
            <img src="assets/images/greenline-logo.png" alt="" height="70" />
          </span>
        </Link>

        <Link to="/" className="logo logo-light">
          <span className="logo-sm">
            <img src="assets/images/greenline-logo.png" alt="" height="22" />
          </span>
          <span className="logo-lg">
            <img src="assets/images/greenline-logo.png" alt="" height="17" />
          </span>
        </Link>
        <button
          type="button"
          className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
          id="vertical-hover"
        >
          <i className="ri-record-circle-line"></i>
        </button>
      </div>

      <div id="scrollbar">
        <div className="container-fluid">
          <div id="two-column-menu"></div>
          <ul className="navbar-nav" id="navbar-nav">
            <li className="menu-title d-md-none" onClick={handleClose}>
              <span data-key="t-menu" style={{ fontSize: "16px" }}>
                X
              </span>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link menu-link"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarDashboards"
                to="/dashboard"
              >
                <i className="las la-address-card"></i>
                {""}
                <span data-key="t-dashboards">{languageStrings.dashboard}</span>
              </Link>
            </li>

            <li className="nav-item">
              {authData.permissions?.["customers.index"] && (
                <Link
                  to="/customers"
                  className="nav-link"
                  data-key="t-analytics"
                >
                  <i className="las la-users"></i>{" "}
                  <span data-key="t-widgets">{languageStrings.customers}</span>{" "}
                </Link>
              )}
            </li>

            {/* <li className="nav-item">
              {authData.permissions?.["consignees.index"] && (
                <Link
                  to="/consignees"
                  className="nav-link"
                  data-key="t-analytics"
                >
                  <i className="las la-flask"></i>{" "}
                  <span data-key="t-widgets">Consignees</span>{" "}
                </Link>
              )}
            </li> */}

            <li className="nav-item">
              {authData.permissions?.["vehicles.index"] && (
                <Link
                  to="/vehicles"
                  className="nav-link"
                  data-key="t-analytics"
                >
                  <i className="las la-car"></i>{" "}
                  <span data-key="t-widgets">{languageStrings.vehicles}</span>{" "}
                </Link>
              )}
            </li>

            <li className="nav-item">
              {authData.permissions?.["containers.index"] && (
                <Link to="/exports" className="nav-link" data-key="t-analytics">
                  <i className="las la-file"></i>{" "}
                  <span data-key="t-widgets">
                    {languageStrings.export_to_transit}
                  </span>{" "}
                </Link>
              )}
            </li>

            <li className="nav-item">
              {authData.permissions?.["exports.index"] && (
                <Link
                  to="/destination-exports"
                  className="nav-link"
                  data-key="t-analytics"
                >
                  <i className="las la-file"></i>{" "}
                  <span data-key="t-widgets">
                    {languageStrings.export_to_destination}
                  </span>{" "}
                </Link>
              )}
            </li>
            <li className="nav-item">
              {[1, 10, 2, 5, 7].find(
                (ele) => authData.userData.role === ele
              ) && (
                <a
                  target="_blank"
                  href={`${process.env.REACT_APP_API_ACCOUNTING_BASE_URL}/auth/galaxy/login/${authData.userData.id}`}
                  className="nav-link"
                  data-key="t-analytics"
                >
                  <i className="las la-calculator"></i>{" "}
                  <span data-key="t-widgets">{languageStrings.accounting}</span>{" "}
                </a>
              )}
            </li>
            <li className="nav-item">
              {[3].find((ele) => authData.userData.role === ele) && (
                <Link
                  to="/accounting"
                  className="nav-link"
                  data-key="t-analytics"
                >
                  <i className="las la-calculator"></i>{" "}
                  <span data-key="t-widgets">{languageStrings.accounting}</span>{" "}
                </Link>
              )}
            </li>
            {(authData.userData.role == 1 || authData.userData.role == 10) && (
              <li className="nav-item">
                <a
                  className="nav-link menu-link"
                  href="#sidebarSettings"
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="sidebarSettings"
                >
                  <i className="las la-globe"></i>{" "}
                  <span data-key="t-dashboards">
                    {languageStrings.settings}
                  </span>
                </a>
                <div className="collapse menu-dropdown" id="sidebarSettings">
                  <ul className="nav nav-sm flex-column">
                    <li className="nav-item">
                      {authData.permissions?.["locations.index"] && (
                        <Link
                          to="/locations"
                          className="nav-link"
                          data-key="t-analytics"
                        >
                          {languageStrings.locations}{" "}
                        </Link>
                      )}

                      {authData.permissions?.["countries.index"] && (
                        <Link
                          to="/countries"
                          className="nav-link"
                          data-key="t-analytics"
                        >
                          {languageStrings.countries}{" "}
                        </Link>
                      )}

                      {/* {authData.permissions?.["states.index"] && (
                        <Link
                          to="/states"
                          className="nav-link"
                          data-key="t-analytics"
                        >
                          {languageStrings.states}{" "}
                        </Link>
                      )} */}

                      {authData.permissions?.["cities.index"] && (
                        <Link
                          to="/cities"
                          className="nav-link"
                          data-key="t-analytics"
                        >
                          {languageStrings.cities}{" "}
                        </Link>
                      )}

                      {authData.userData.role === 10 && (
                        <Link
                          to="/roles"
                          className="nav-link"
                          data-key="t-analytics"
                        >
                          {languageStrings.roles}{" "}
                        </Link>
                      )}

                      {authData.userData.role === 10 && (
                        <Link
                          to="/user-management"
                          className="nav-link"
                          data-key="t-analytics"
                        >
                          {languageStrings.user_management}{" "}
                        </Link>
                      )}
                    </li>
                  </ul>
                </div>
              </li>
            )}

            {(authData.userData.role == 1 || authData.userData.role == 10) && (
              <li className="nav-item">
                <a
                  className="nav-link menu-link"
                  href="#sidebarPorts"
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="sidebarPorts"
                >
                  <i className="las la-globe"></i>{" "}
                  <span data-key="t-dashboards">
                    {languageStrings.galaxy_ports}
                  </span>
                </a>
                <div className="collapse menu-dropdown" id="sidebarPorts">
                  <ul className="nav nav-sm flex-column">
                    <li className="nav-item">
                      {authData.userData.role === 10 && (
                        <Link
                          to="/port-of-loading"
                          className="nav-link"
                          data-key="t-analytics"
                        >
                          {languageStrings.port_of_loading}{" "}
                        </Link>
                      )}

                      {authData.userData.role === 10 && (
                        <Link
                          to="/port-of-discharge"
                          className="nav-link"
                          data-key="t-analytics"
                        >
                          {languageStrings.port_of_discharge}{" "}
                        </Link>
                      )}
                    </li>
                  </ul>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
