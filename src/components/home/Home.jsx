import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
// import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import languageStrings from "../../localization/language";
import * as DashboardService from "../../services/DashboardService";
import { getVehicles } from "../../services/VehicleService";
import "./home.css";

export default function Home() {
  // const authData = useSelector((state) => state.auth);
  // const [message, setMessage] = useState();
  const [loading, setLoading] = useState(true);
  const [statusOverview, setStatusOverview] = useState([]);
  const [vehicleStatus, setVehicleStatus] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   let myDate = new Date();
  //   let currentHour = myDate.getHours();

  //   let msg;

  //   if (currentHour < 12) msg = "Good Morning";
  //   else if (currentHour === 12) msg = "Good Noon";
  //   else if (currentHour >= 12 && currentHour <= 17) msg = "Good Afternoon";
  //   else if (currentHour >= 17 && currentHour <= 24) msg = "Good Evening";

  //   setMessage(msg);
  // }, []);

  useEffect(() => {
    const getStatusOverview = () => {
      setLoading(true);
      DashboardService.getStatusOverview()
        .then((response) => {
          setStatusOverview(response.data.status_overview);
          setVehicleStatus(response.data.location_wise_vehicles);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };
    getStatusOverview();
  }, []);

  const handelSearchValue = (event) => {
    let value = event.target.value;
    setSearchValue(value);
  };

  const handleSearchClick = () => {
    setSearchLoading(true);
    if (searchValue) {
      const restUrl = `?limit=10&page=1&vehicle_global_search=${searchValue}`;
      getVehicles(restUrl)
        .then((response) => {
          setVehicles(response.data.data);
          setSearchLoading(false);
        })
        .catch((error) => {
          setSearchLoading(false);
          console.log(error);
        });
    } else {
      setVehicles([]);
      setSearchLoading(false);
    }
  };

  const clickVin = (id) => {
    navigate(`/vehicles/${id}`);
  };

  return (
    <>
      {/* <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">Dashboard</h4>

            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link to="#">Dashboards</Link>
                </li>
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </div> */}

      <div className="row">
        <div className="col">
          <div className="h-100">
            <div className="row mb-3 pb-1">
              <div className="col-12">
                <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                  {/* <div className="flex-grow-1">
                    <h4 className="fs-16 mb-1">
                      {message}, {authData && authData.userData.name}!
                    </h4>
                    <p className="text-muted mb-0">
                      Here's what's happening with your store today.
                    </p>
                  </div> */}
                  <div className="flex-grow-1"></div>
                  <div className="mt-3 mt-lg-0">
                    <form action="">
                      <div className="row g-3 mb-0 align-items-center">
                        <div className="col-sm-auto">
                          <div
                            className="input-group"
                            style={{ minWidth: "400px" }}
                          >
                            <input
                              type="text"
                              placeholder={
                                languageStrings.vehicle_search_by_vin
                              }
                              className="form-control border-0 fs-13"
                              value={searchValue}
                              onChange={(e) => handelSearchValue(e)}
                            />

                            <div
                              className="input-group-text bg-secondary border-secondary text-white"
                              style={{ cursor: "pointer" }}
                              onClick={handleSearchClick}
                              disabled={searchLoading}
                            >
                              <i className="las la-search"></i>
                              {searchLoading && (
                                <Spinner animation="border" size="sm" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="row"
              style={{ display: vehicles.length > 0 ? "block" : "none" }}
            >
              <div className="col-xl-12 col-md-12">
                <div className="card">
                  <div className="card-body">
                    <table className="table align-middle table-bordered table-wrap">
                      <thead className="vehicle-status-table-head">
                        <tr>
                          <th scope="col">CUSTOMER NAME</th>
                          <th scope="col">COMPANY NAME</th>
                          <th scope="col">VIN</th>
                          <th scope="col">STATUS</th>
                          <th scope="col">LOT NUMBER</th>
                          <th scope="col">ALL VEHICLES</th>
                          <th scope="col">ALL EXPORTS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicles &&
                          vehicles.map((vehicle, index) => (
                            <tr key={index}>
                              <td>{vehicle.customer_name}</td>
                              <td>{vehicle.company_name}</td>
                              <td>
                                <Link
                                  target="_blank"
                                  to={`/vehicles/${vehicle.id}`}
                                >
                                  {vehicle.vin}
                                </Link>

                                {/* <span onClick={() => clickVin(vehicle.id)}>
                                  {vehicle.vin}
                                </span> */}
                              </td>
                              <td>{vehicle.status_name}</td>
                              <td>{vehicle.lot_number}</td>
                              <td>
                                <Link
                                  to={`/vehicles?customer_user_id=${vehicle.customer_user_id}`}
                                  target="_blank"
                                >
                                  <span className="badge badge-soft-primary">
                                    <button className="btn btn-default btn-sm">
                                      View
                                    </button>
                                  </span>
                                </Link>
                              </td>
                              <td>
                                <Link
                                  to={`/exports?customer_user_id=${vehicle.customer_user_id}`}
                                  target="_blank"
                                >
                                  <span className="badge badge-soft-primary">
                                    <button className="btn btn-default btn-sm">
                                      View
                                    </button>
                                  </span>
                                </Link>
                              </td>
                            </tr>
                          ))}

                        {loading && (
                          <tr>
                            <td colSpan={12}>Loading</td>
                          </tr>
                        )}
                        {!loading && vehicles.length === 0 && (
                          <tr>
                            <td colSpan={12}>No Record Found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {statusOverview &&
                statusOverview.map((status, index) => (
                  <div className="col-xl-3 col-md-6" key={index}>
                    <div className="card card-animate">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1 overflow-hidden">
                            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                              {status.label}
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-end justify-content-between mt-4">
                          <div>
                            <Link
                              to={
                                status.status
                                  ? `/vehicles?status=${status.status}`
                                  : `/vehicles`
                              }
                              className=" text-muted"
                            >
                              <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                                <span className="badge badge-soft-primary">
                                  {status.total}
                                </span>
                              </h4>
                            </Link>
                          </div>
                          <div className="flex-shrink-0">
                            <img
                              src={status.logo}
                              alt=""
                              height={60}
                              width={60}
                            />
                            {/* <img
                              src="http://backend.aslshipping.com/images/car_on_the_way.png"
                              alt=""
                              height={60}
                              width={60}
                            /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="row">
              <div className="col-xl-12 col-md-12">
                <div className="card">
                  <div className="card-header align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                      {languageStrings.vehicle_status}
                    </h4>
                  </div>

                  <div className="card-body">
                    <table className="table align-middle table-bordered table-wrap">
                      <thead className="vehicle-status-table-head">
                        <tr>
                          <th scope="col">{languageStrings.location}</th>
                          <th scope="col">{languageStrings.all_vehicle}</th>
                          <th scope="col">
                            {languageStrings.arrived_to_destination}
                          </th>
                          <th scope="col">
                            {languageStrings.arrived_to_transit}
                          </th>
                          <th scope="col">{languageStrings.inside_the_port}</th>
                          <th scope="col">{languageStrings.car_on_hand}</th>
                          <th scope="col">
                            {languageStrings.shipped_to_transit}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicleStatus &&
                          vehicleStatus.map((vstatus, index) => (
                            <tr key={index}>
                              <th scope="row">{vstatus.location_name}</th>
                              <td>
                                <Link
                                  to={
                                    vstatus.location_id
                                      ? `/vehicles?location_id=${vstatus.location_id}`
                                      : `/vehicles`
                                  }
                                >
                                  {vstatus.status_overview.all_vehicles}
                                </Link>
                              </td>
                              <td>
                                <Link
                                  to={
                                    vstatus.location_id
                                      ? `/vehicles?location_id=${vstatus.location_id}&status=15`
                                      : `/vehicles?status=15`
                                  }
                                >
                                  {
                                    vstatus.status_overview
                                      .arrived_to_destination
                                  }
                                </Link>
                              </td>
                              <td>
                                <Link
                                  to={
                                    vstatus.location_id
                                      ? `/vehicles?location_id=${vstatus.location_id}&status=6`
                                      : `/vehicles?status=6`
                                  }
                                >
                                  {vstatus.status_overview.arrived_to_transit}
                                </Link>
                              </td>
                              <td>
                                <Link
                                  to={
                                    vstatus.location_id
                                      ? `/vehicles?location_id=${vstatus.location_id}&status=2`
                                      : `/vehicles?status=2`
                                  }
                                >
                                  {vstatus.status_overview.manifest}
                                </Link>
                              </td>
                              <td>
                                <Link
                                  to={
                                    vstatus.location_id
                                      ? `/vehicles?location_id=${vstatus.location_id}&status=1`
                                      : `/vehicles?status=1`
                                  }
                                >
                                  {vstatus.status_overview.on_hand}
                                </Link>
                              </td>
                              <td>
                                <Link
                                  to={
                                    vstatus.location_id
                                      ? `/vehicles?location_id=${vstatus.location_id}&status=4`
                                      : `/vehicles?status=4`
                                  }
                                >
                                  {vstatus.status_overview.shipped}
                                </Link>
                              </td>
                            </tr>
                          ))}

                        {loading && (
                          <tr>
                            <td colSpan={12}>Loading</td>
                          </tr>
                        )}
                        {!loading && vehicleStatus.length === 0 && (
                          <tr>
                            <td colSpan={12}>No Record Found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
