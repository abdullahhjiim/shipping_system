import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Remove from "@material-ui/icons/Remove";
import EyeIcon from "@material-ui/icons/RemoveRedEye";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Viewer from "react-viewer";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import languageStrings from "../../localization/language";
import MyPagination from "../../pagination/MyPagination";
import * as ExportService from "../../services/ExportService";
import * as PortService from "../../services/PortService";
import * as VehicleService from "../../services/VehicleService";
import DestinationExportModal from "./DestinationExportModal";
import "./exports.css";

const statuses = [
  { id: "", title: "Select Status" },
  { id: 12, title: "On The Way To Destination" },
  { id: 15, title: "Arrived To Destination" },
  { id: 17, title: "Arrived To Final Destination" },
];

const filterInitialValues = {
  container_type: "",
  port_of_loading: "",
  port_of_discharge: "",
  status: "",
  cust_user_name: "",
};

const filterTextInitialValues = {
  loading_date: "",
  export_date: "",
  eta: "",
  booking_number: "",
  container_number: "",
  ar_number: "",
  manifest_date: "",
  terminal: "",
};

const base_url = process.env.REACT_APP_API_BASE_URL;

function DestinationExports() {
  const navigate = useNavigate();
  const authData = useSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useSearchParams();
  const { search } = useLocation();

  // eslint-disable-next-line no-unused-vars
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [exports, setExports] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [globalSearchValue, setGlobalSearchValue] = useState("");

  const [portLoadingData, setPortLoadingData] = useState([]);
  const [portDischargeData, setPortDischargeData] = useState([]);
  const [filterValues, setFilterValues] = useState(filterInitialValues);
  const [filterTextValues, setFilterTextValues] = useState(
    filterTextInitialValues
  );
  const [filterUrls, setFilterUrls] = useState(null);
  const [imgExportId, setImgExportId] = useState(null);
  const [imgPopup, setImgPopup] = useState(false);
  const [expandAll, setExpendAll] = useState(false);

  const [exportImages, setExportImages] = useState([]);

  console.log(exportImages);

  useEffect(() => {
    PortService.getPortItems(1)
      .then((response) => {
        setPortLoadingData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    PortService.getPortItems(2)
      .then((response) => {
        setPortDischargeData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const _oldData = exports.map((e) => {
      return {
        ...e,
        expand: expandAll,
      };
    });
    setExports(_oldData);
  }, [expandAll]);

  console.log(imgExportId);
  console.log(imgPopup);

  useEffect(() => {
    setLoading(true);
    const getAllImage = () => {
      ExportService.getExportById(imgExportId, 2)
        .then((res) => {
          setExportImages(res.data.export_details);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };
    if (imgExportId) {
      getAllImage();
    }
  }, [imgExportId]);

  useEffect(() => {
    const getExports = (restUrl) => {
      setLoading(true);
      ExportService.getExports(restUrl)
        .then((response) => {
          const _exportData = response.data.data.map((e) => {
            return {
              ...e,
              expand: false,
            };
          });
          setExports(_exportData);
          setCount(response.data.meta.last_page);
          setMetaData(response.data.meta);
          setLoading(false);
          setSearchLoading(false);
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong !!!");
          setLoading(false);
        });
    };

    let restUrl = `?page=${currentPage}`;

    if (filterUrls) {
      restUrl += filterUrls;
    }

    restUrl += "&type=2";

    getExports(restUrl);
    setSearchParams(restUrl);
    return () => {
      setState({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterUrls, searchParams]);

  const getSearchParams = (search) => {
    const searchSlice = search.slice(1);
    const makeArr = searchSlice.split("&");

    const result = {};
    makeArr.map((e) => {
      const sp = e.split("=");
      result[sp[0]] = sp[1];
    });

    return result;
  };

  useEffect(() => {
    if (search) {
      const result = getSearchParams(search);
      const {
        page,
        container_type,
        port_of_loading,
        port_of_discharge,
        status,
        cust_user_name,
        loading_date,
        eta,
        booking_number,
        container_number,
        ar_number,
        manifest_date,
        terminal,
      } = result;

      setCurrentPage(page ?? 1);

      setFilterValues({
        ...filterValues,
        container_type,
        port_of_loading,
        port_of_discharge,
        status,
        cust_user_name,
      });
      setFilterTextValues({
        ...filterTextValues,
        loading_date,
        eta,
        booking_number,
        container_number,
        ar_number,
        manifest_date,
        terminal,
      });
    }
  }, []);

  const getAllExports = (restUrl) => {
    ExportService.getExports(restUrl)
      .then((response) => {
        const _exportData = response.data.data.map((e) => {
          return {
            ...e,
            expand: false,
          };
        });
        setExports(_exportData);
        setCount(response.data.meta.last_page);
        setMetaData(response.data.meta);
      })
      .catch((err) => {
        toastMessageShow("error", "Something went Wrong !!!");
      });
  };

  const handleClick = (e, rowData, type) => {
    if (type === "edit") {
      ExportService.getExportById(rowData.id, 2)
        .then((response) => {
          console.log(response);
          setRecordForEdit(response.data);
          setOpenPopup(true);
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong !!!");
        });
    } else if (type === "delete") {
      if (window.confirm("Are your sure to delete..??")) {
        ExportService.deleteExport(rowData)
          .then((response) => {
            toastMessageShow("success", response.data.message);
            getAllExports("?page=1&type=2");
          })
          .catch((err) => {
            toastMessageShow("error", "Something went Wrong !!!");
          });
      }
    } else if (type === "view") {
      navigate(`/destination-exports/${rowData}`);
    }
  };

  const addEditRecord = (id, type) => {
    setOpenPopup(true);
    setRecordForEdit(null);
  };

  const addOrEdit = (exports, resetForm, setErrorClass, setBackendErros) => {
    setButtonDisabled(true);
    if (exports.id === 0) {
      ExportService.insertExport(exports, 2)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          formClear(resetForm, setErrorClass);
          getAllExports("?page=1&type=2");
        })
        .catch((err) => {
          if (err.status && err.status === 422) {
            console.log(err.data);
            setBackendErros(err.data);
          } else {
            toastMessageShow("error", "Something went Wrong  !!!");
          }
          setButtonDisabled(false);
        });
    } else {
      ExportService.updateExport(exports)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          formClear(resetForm, setErrorClass);
          getAllExports("?page=1&type=2");
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong !!!");
          // formClear(resetForm, setErrorClass);
          setButtonDisabled(false);
        });
    }
  };

  const formClear = (callback, setErrorClass) => {
    callback();
    setRecordForEdit(null);
    setOpenPopup(false);
    setButtonDisabled(false);
    setErrorClass("");
  };

  const pageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilterValues({
      ...filterValues,
      [name]: value,
    });
  };

  const handleTextFilter = (e) => {
    const { name, value } = e.target;
    setFilterTextValues({
      ...filterTextValues,
      [name]: value,
    });
  };

  const enterSearch = (e) => {
    console.log(e);
    if (e.key === "Enter" || e.keyCode === 13) {
      searchHandleClick();
    }
  };

  useEffect(() => {
    let filterUrl = "";
    Object.keys(filterValues).forEach((item) => {
      if (filterValues[item]) {
        filterUrl += `&${item}=${filterValues[item]}`;
      }
    });

    Object.keys(filterTextValues).forEach((item) => {
      if (filterTextValues[item]?.length) {
        filterUrl += `&${item}=${filterTextValues[item]}`;
      }
    });

    if (filterUrl) {
      setFilterUrls(filterUrl);
    }
    return () => {
      setState({});
    };
  }, [filterValues]);

  const searchHandleClick = () => {
    let filterUrl = "";
    Object.keys(filterValues).forEach((item) => {
      if (filterValues[item]?.length) {
        filterUrl += `&${item}=${filterValues[item]}`;
      }
    });

    Object.keys(filterTextValues).forEach((item) => {
      if (filterTextValues[item]?.length) {
        filterUrl += `&${item}=${filterTextValues[item]}`;
      }
    });

    if (filterUrl) {
      setFilterUrls(filterUrl);
    }
  };

  const searchHandleCancel = () => {
    setFilterValues(filterInitialValues);
    setFilterTextValues(filterTextInitialValues);
    setFilterUrls(null);
    setCurrentPage(1);
  };

  const globalSearchClick = () => {
    if (globalSearchValue) {
      setSearchLoading(true);
      setFilterUrls(`&export_global_search=${globalSearchValue}`);
      if (filterUrls === `&export_global_search=${globalSearchValue}`) {
        setSearchLoading(false);
      }
    } else {
      setCurrentPage(1);
      setFilterUrls(``);
    }
  };

  const handleGlobalSearch = (e) => {
    if (e.key === "Enter") {
      if (globalSearchValue) {
        setSearchLoading(true);
        setFilterUrls(`&export_global_search=${globalSearchValue}`);
        if (filterUrls === `&export_global_search=${globalSearchValue}`) {
          setSearchLoading(false);
        }
      } else {
        setCurrentPage(1);
        setFilterUrls(``);
      }
    }
  };

  const exportDestination = () => {
    let url =
      base_url +
      `/exports/export-excel?type=2&auth_user_id=${authData.userData.id}`;
    if (filterUrls) {
      url =
        base_url +
        `/exports/export-excel?type=2&auth_user_id=${authData.userData.id}${filterUrls}`;
    }
    window.location = url;
  };

  const imgViewer = (expImgId) => {
    setImgPopup(true);
    setImgExportId(expImgId);
  };

  const toastMessageShow = (type, message) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const customerLoadOptions = (inputText, callback) => {
    const url = `/customers-item?customer_name=${inputText}`;

    VehicleService.getCustomersItem(url)
      .then((response) => {
        const json = response.data.data;
        callback(
          json.map((i) => ({
            label: i.name,
            value: i.user_id,
            company_name: i.company_name,
            legacy_customer_id: i.legacy_customer_id,
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const _handleExpendAll = () => {
    setExpendAll(!expandAll);
  };

  const _handleExpend = (id) => {
    const _exportsUpdate = exports.map((e) => {
      if (e.id === id) {
        if (e.expand) {
          return {
            ...e,
            expand: false,
          };
        } else {
          return {
            ...e,
            expand: true,
          };
        }
      } else {
        return e;
      }
    });

    setExports(_exportsUpdate);
  };

  const _makeRows = (exports) => {
    let rows = [];

    let firstRow = (
      <tr key={exports.id}>
        <td>
          <span className="icon-lg bg-primary d-block rounded-circle cursor-pointer text-white">
            {exports.expand ? (
              <Remove onClick={() => _handleExpend(exports.id)} />
            ) : (
              <AddIcon onClick={() => _handleExpend(exports.id)} />
            )}
          </span>
        </td>
        <td>
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0 me-2">
              {exports.thumbnail && (
                <img
                  src={exports.thumbnail}
                  alt=""
                  className="avatar-sm p-2 cursor-pointer"
                  onClick={() => imgViewer(exports.id)}
                />
              )}
            </div>
          </div>
        </td>
        <td>
          <span className="text-muted">{exports.total_photos}</span>
        </td>
        <td>
          <p className="mb-0">{exports.loading_date}</p>
        </td>
        <td>
          <p className="mb-0">{exports.cmr_date}</p>
        </td>
        <td>
          <p className="mb-0">{exports.eta}</p>
        </td>
        <td>
          <p className="mb-0">{exports.booking_number}</p>
        </td>
        <td>
          <p className="mb-0">{exports.container_number}</p>
        </td>

        <td>
          <p className="mb-0">{exports.port_of_loading_name}</p>
        </td>
        <td>
          <p className="mb-0">{exports.port_of_discharge_name}</p>
        </td>

        <td>
          <p className="mb-0">{exports.status_name}</p>
        </td>
        <td>
          <p className="mb-0">{exports.manifest_date}</p>
        </td>

        {/* <td>
                            <p className="mb-0">{exports.terminal}</p>
                          </td> */}

        <td>
          <>
            {authData.permissions?.["exports.view"] && (
              <EyeIcon
                style={{
                  margin: "7px",
                  cursor: "pointer",
                }}
                onClick={(e) => handleClick(e, exports.id, "view")}
                className="view-button"
              />
            )}
            {authData.permissions?.["exports.store"] && (
              <EditIcon
                style={{
                  margin: "7px",
                  cursor: "pointer",
                }}
                onClick={(e) => handleClick(e, exports, "edit")}
              />
            )}
            {authData.permissions?.["exports.destroy"] &&
              exports.status === 12 && (
                <DeleteIcon
                  style={{
                    margin: "7px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => handleClick(e, exports.id, "delete")}
                />
              )}
          </>
        </td>
      </tr>
    );

    rows.push(firstRow);

    if (exports.expand && exports?.vehicles.length > 0) {
      const secondRow = (
        <tr>
          <td colSpan={14}>
            <div className="table-responsive">
              <table className="table table-info">
                <thead>
                  <tr>
                    <th scope="col">YEAR</th>
                    <th scope="col">MAKE</th>
                    <th scope="col">MODEL</th>
                    <th scope="col">COLOR</th>
                    <th scope="col">VIN</th>
                    <th scope="col">LOT NUMBER</th>
                    <th scope="col">AGENT NAME</th>
                    <th scope="col">CUSTOMER NAME</th>
                    <th scope="col">VIEW</th>
                  </tr>
                </thead>
                <tbody>
                  {exports?.vehicles.map((e) => {
                    return (
                      <tr key={e.id}>
                        <td>{e.year}</td>
                        <td>{e.make}</td>
                        <td>{e.model}</td>
                        <td>{e.color}</td>
                        <td>{e.vin}</td>
                        <td>{e.lot_number}</td>
                        <td>
                          <Link
                            to={`/customers/${e?.agent_id}`}
                            target="_blank"
                          >
                            {e.agent_name}
                          </Link>
                        </td>
                        <td>{e.customer_name}</td>
                        <td>
                          <Link to={`/vehicles/${e.id}`} target="_blank">
                            <EyeIcon
                              style={{
                                cursor: "pointer",
                              }}
                              className="view-button"
                            />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      );
      rows.push(secondRow);
    }
    return rows;
  };

  const _makeTable = (exports) => {
    const exportRows =
      exports &&
      exports.map((e) => {
        return _makeRows(e);
      });

    return (
      <div className="table-responsive table-card">
        <table className="table table-centered table-hover align-middle table-nowrap mb-0">
          <thead>
            <tr>
              <td></td>
              <td> {languageStrings.cmr_photo}</td>
              <td> {languageStrings.total_photos}</td>
              <td> {languageStrings.loading_date}</td>
              {/* <td> {languageStrings.export_date}</td> */}
              <td> CMR Date</td>
              <td> {languageStrings.eta}</td>
              <td> {languageStrings.booking_no}</td>
              <td> {languageStrings.ship_number}</td>
              <td> {languageStrings.port_of_loading}</td>
              <td> {languageStrings.port_of_discharge}</td>
              <td> {languageStrings.status}</td>
              <td> {languageStrings.inside_the_port_date}</td>
              {/* <td> Terminal</td> */}
              <td> {languageStrings.action}</td>
            </tr>
            <tr>
              <td>
                <span className="icon-lg bg-primary d-block rounded-circle cursor-pointer text-white">
                  {expandAll ? (
                    <Remove onClick={_handleExpendAll} />
                  ) : (
                    <AddIcon onClick={_handleExpendAll} />
                  )}
                </span>
              </td>
              <td></td>
              <td></td>

              <td>
                <div className="form-group" style={{ minWidth: "100px" }}>
                  <input
                    type="text"
                    name="loading_date"
                    onChange={handleTextFilter}
                    onKeyUp={enterSearch}
                    value={filterTextValues.loading_date}
                    className="form-control"
                  />
                </div>
              </td>
              <td>
                <div className="form-group" style={{ minWidth: "100px" }}>
                  <input
                    type="text"
                    name="cmr_date"
                    onChange={handleTextFilter}
                    onKeyUp={enterSearch}
                    value={filterTextValues.cmr_date}
                    className="form-control"
                  />
                </div>
              </td>

              <td>
                <div className="form-group" style={{ minWidth: "100px" }}>
                  <input
                    type="text"
                    name="eta"
                    onChange={handleTextFilter}
                    onKeyUp={enterSearch}
                    value={filterTextValues.eta}
                    className="form-control"
                  />
                </div>
              </td>
              <td>
                <div className="form-group" style={{ minWidth: "100px" }}>
                  <input
                    type="text"
                    name="booking_number"
                    onChange={handleTextFilter}
                    onKeyUp={enterSearch}
                    value={filterTextValues.booking_number}
                    className="form-control"
                  />
                </div>
              </td>
              <td>
                <div className="form-group" style={{ minWidth: "100px" }}>
                  <input
                    type="text"
                    name="container_number"
                    onChange={handleTextFilter}
                    onKeyUp={enterSearch}
                    value={filterTextValues.container_number}
                    className="form-control"
                  />
                </div>
              </td>

              <td>
                <div className="form-group" style={{ minWidth: "160px" }}>
                  <select
                    name="port_of_loading"
                    onChange={handleFilter}
                    value={filterValues.port_of_loading}
                    className="form-select form-control"
                  >
                    <option value="">Select Loading Port</option>
                    {portLoadingData.map((item, index) => (
                      <option value={item.id} key={index}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
              <td>
                <div className="form-group" style={{ minWidth: "160px" }}>
                  <select
                    name="port_of_discharge"
                    onChange={handleFilter}
                    value={filterValues.port_of_discharge}
                    className="form-select form-control"
                  >
                    <option value="">Select Discharge Port</option>
                    {portDischargeData.map((item, index) => (
                      <option value={item.id} key={index}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </td>

              <td>
                <div className="form-group" style={{ minWidth: "100px" }}>
                  <select
                    name="status"
                    onChange={handleFilter}
                    value={filterValues.status}
                    className="form-select form-control"
                  >
                    {statuses.map((item, index) => (
                      <option value={item.id} key={index}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
              <td>
                <div className="form-group" style={{ minWidth: "100px" }}>
                  <input
                    type="text"
                    name="manifest_date"
                    onChange={handleTextFilter}
                    onKeyUp={enterSearch}
                    value={filterTextValues.manifest_date}
                    className="form-control"
                  />
                </div>
              </td>

              {/* <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <input
                            type="text"
                            name="terminal"
                            onChange={handleTextFilter}
                            onKeyUp={enterSearch}
                            value={filterTextValues.terminal}
                            className="form-control"
                          />
                        </div>
                      </td> */}

              <td>
                <>
                  <SearchIcon
                    style={{ cursor: "pointer", margin: "7px" }}
                    onClick={searchHandleClick}
                  />
                  <CancelIcon
                    onClick={searchHandleCancel}
                    style={{ cursor: "pointer", margin: "7px" }}
                  />
                </>
              </td>
            </tr>
          </thead>

          <tbody>
            {!loading && exportRows}
            {loading && (
              <tr>
                <td colSpan={32}>Loading...</td>
              </tr>
            )}
            {!loading && exports.length === 0 && (
              <tr>
                <td colSpan={32}>No Record Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const loadingDateRange = (date) => {
    if (date) {
      let loading_start_date = date[0]?.toISOString().slice(0, 10);
      let loading_end_date = date[1]?.toISOString().slice(0, 10);

      setSearchLoading(true);
      setFilterUrls(
        `&loading_start_date=${loading_start_date}&loading_end_date=${loading_end_date}`
      );
      if (
        filterUrls ===
        `&loading_start_date=${loading_start_date}&loading_end_date=${loading_end_date}`
      ) {
        setSearchLoading(false);
      }
    }
  };

  const etaDateRange = (date) => {
    if (date) {
      let eta_start_date = date[0]?.toISOString().slice(0, 10);
      let eta_end_date = date[1]?.toISOString().slice(0, 10);

      setSearchLoading(true);
      setFilterUrls(
        `&eta_start_date=${eta_start_date}&eta_end_date=${eta_end_date}`
      );
      if (
        filterUrls ===
        `&eta_start_date=${eta_start_date}&eta_end_date=${eta_end_date}`
      ) {
        setSearchLoading(false);
      }
    }
  };

  const dateRangeClean = () => {
    setCurrentPage(1);
    setFilterUrls(``);
  };

  return (
    <div>
      {!authData.permissions?.["exports.index"] && (
        <div>
          <h2 class="text-center">{languageStrings.note_allow_show}</h2>
        </div>
      )}
      {authData.permissions?.["exports.index"] && (
        <div className="row">
          <div className="col-xl-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Export to Destination
                </li>
              </ol>
            </nav>
            <div className="card card-height-100">
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {languageStrings.export_to_destination}
                </h4>
                <div className="from-group" style={{ marginRight: "3px" }}>
                  <DateRangePicker
                    appearance="default"
                    placeholder="Eta Date Range"
                    style={{ width: 230 }}
                    onOk={etaDateRange}
                    onClean={dateRangeClean}
                    format="yyyy-MM-dd"
                  />
                </div>
                <div className="from-group" style={{ marginRight: "3px" }}>
                  <DateRangePicker
                    appearance="default"
                    placeholder="Loading Date Range"
                    style={{ width: 230 }}
                    onOk={loadingDateRange}
                    onClean={dateRangeClean}
                    format="yyyy-MM-dd"
                  />
                </div>
                <div className="from-group" style={{ marginRight: "3px" }}>
                  <input
                    type="text"
                    placeholder={languageStrings.export_global_search}
                    className="form-control"
                    value={globalSearchValue}
                    onKeyDown={(e) => handleGlobalSearch(e)}
                    onChange={(e) => setGlobalSearchValue(e.target.value)}
                  />
                </div>
                <div className="" style={{ marginRight: "10px" }}>
                  <button
                    className="btn btn-success"
                    onClick={globalSearchClick}
                    disabled={searchLoading}
                  >
                    {" "}
                    {searchLoading && <Spinner animation="border" size="sm" />}
                    {languageStrings.search}
                  </button>
                </div>

                <div className="" style={{ marginRight: "5px" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={exportDestination}
                  >
                    {languageStrings.export_excel}
                  </button>
                </div>

                <div className="flex-shrink-0">
                  {authData.permissions?.["exports.store"] && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={addEditRecord}
                    >
                      {languageStrings.add_new}
                    </button>
                  )}
                </div>
              </div>

              <div className="card-body">
                {loading && (
                  <div
                    className="d-flex justify-content-center align-items-center py-5"
                    style={{ minHeight: "400px" }}
                  >
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}

                {!loading && _makeTable(exports)}

                <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                  <div className="flex-shrink-0">
                    <div className="text-muted">
                      Showing{" "}
                      <span className="fw-semibold">
                        from {metaData.from} to {metaData.to}{" "}
                      </span>
                      of <span className="fw-semibold"> {metaData.total}</span>{" "}
                      Results
                    </div>
                  </div>

                  <ul className="pagination pagination-separated pagination-lg mb-0">
                    <MyPagination
                      count={count}
                      currentPage={currentPage}
                      pageChange={pageChange}
                    />
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DestinationExportModal
        title="Destination Export Create"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        recordForEdit={recordForEdit}
        addOrEdit={addOrEdit}
        buttonDisabled={buttonDisabled}
      ></DestinationExportModal>

      {/* <ImgGalleryExp
        title=""
        openPopup={imgPopup}
        setOpenPopup={setImgPopup}
        exportId={imgExportId}
        type={2}
      ></ImgGalleryExp> */}
      {imgPopup && exportImages?.container_images?.length && (
        <Viewer
          visible={imgPopup}
          onClose={() => {
            setImgPopup(false);
          }}
          activeIndex={0}
          images={
            exportImages?.container_images &&
            exportImages?.container_images.length > 0 &&
            exportImages?.container_images.map(
              (item) =>
                ({
                  src: `${item?.url}`,
                } ?? [])
            )
          }
        />
      )}

      <ToastContainer />
    </div>
  );
}

export default DestinationExports;
