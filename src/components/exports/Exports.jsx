import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import EyeIcon from "@material-ui/icons/RemoveRedEye";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import languageStrings from "../../localization/language";
import MyPagination from "../../pagination/MyPagination";
import * as ExportService from "../../services/ExportService";
import * as PortService from "../../services/PortService";
import ExportModal from "./ExportModal";
import "./exports.css";
import ImgGalleryExp from "./ImgGalleryExp";
// import AddIcon from "@mui/icons/Add";
import AddIcon from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";

import { addToCarts } from "../../redux/carts/cartsSlice";

const statuses = [
  { id: "", title: "Select Status" },
  { id: 2, title: "Inside The Port" },
  { id: 4, title: "Shipped To Transit" },
  { id: 10, title: "Arrived To Transit" },
];

const filterInitialValues = {
  container_type: "",
  port_of_loading: "",
  port_of_discharge: "",
  status: "",
};

const filterTextInitialValues = {
  loading_date: "",
  eta: "",
  container_number: "",
  ar_number: "",
  manifest_date: "",
  terminal: "",
};

const base_url = process.env.REACT_APP_API_BASE_URL;

function Exports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { search } = useLocation();
  const authData = useSelector((state) => state.auth);
  const cartData = useSelector((state) => state.carts);
  const checkoutState = useSelector((state) => state.carts);
  // const animatedComponet = makeAnimated();
  // eslint-disable-next-line no-unused-vars
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [exports, setExports] = useState([]);
  const [portLoadingData, setPortLoadingData] = useState([]);
  const [portDischargeData, setPortDischargeData] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [globalSearchValue, setGlobalSearchValue] = useState("");

  const [filterValues, setFilterValues] = useState(filterInitialValues);
  const [filterTextValues, setFilterTextValues] = useState(
    filterTextInitialValues
  );
  const [filterUrls, setFilterUrls] = useState(null);
  const [imgExportId, setImgExportId] = useState(null);
  const [imgPopup, setImgPopup] = useState(false);
  const [expandAll, setExpendAll] = useState(false);

  useEffect(() => {
    const getVehicles = (page) => {
      setLoading(true);
      ExportService.getExports(page)
        .then((response) => {
          // console.log("response.data.data", response.data.data);
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

    // if (searchParams.get("customer_user_id")) {
    //   restUrl += `&customer_user_id=${searchParams.get("customer_user_id")}`;
    // }

    if (filterUrls) {
      restUrl += filterUrls;
    }

    getVehicles(restUrl);
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
        container_number,
        ar_number,
        manifest_date,
        terminal,
      });
    }
  }, []);

  const getExports = (page) => {
    setLoading(true);
    ExportService.getExports(page)
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

  const handleClick = (e, rowData, type) => {
    if (type === "edit") {
      ExportService.getExportById(rowData.id)
        .then((response) => {
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
            getExports("?page=1");
          })
          .catch((err) => {
            toastMessageShow("error", "Something went Wrong !!!");
          });
      }
    } else if (type === "view") {
      navigate(`/exports/${rowData}`);
    }
  };

  const addEditRecord = (id, type) => {
    setOpenPopup(true);
    setRecordForEdit(null);
  };

  const addOrEdit = (exports, resetForm, setErrorClass, setBackendErros) => {
    setButtonDisabled(true);
    if (exports.id === 0) {
      ExportService.insertExport(exports)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          formClear(resetForm, setErrorClass);
          getExports("?page=1");
        })
        .catch((err) => {
          if (err.status && err.status === 422) {
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
          getExports("?page=1");
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

  const exportTransit = () => {
    let url =
      base_url +
      `/exports/export-excel?type=1&auth_user_id=${authData.userData.id}`;
    if (filterUrls) {
      url =
        base_url +
        `/exports/export-excel?type=1&auth_user_id=${authData.userData.id}${filterUrls}`;
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

  const setCondition = (id) => {
    let flag = "button_class";
    let add = false;
    if (cartData && cartData.allVehicleIDs.length > 0) {
      let isExits = cartData.allVehicleIDs.find((e) => {
        return e === id;
      });
      if (isExits) {
        flag = "add_button";
        add = true;
      }
    }
    return { flag, add };
  };

  const removeFromCart = (item) => {
    const processStatus =
      item.status === 1 ? "checkoutsTransit" : "checkoutsDestination";

    let items = localStorage.getItem(processStatus);
    if (items) {
      items = JSON.parse(items);
    } else {
      items = {};
    }

    if (items && Object.keys(items).length) {
      let cloneArr = items[item.location_id];

      let index = cloneArr.findIndex((ele) => ele.id === item.id);
      cloneArr.splice(index, 1);

      items[item.location_id] = cloneArr;
      let cloneId = [...checkoutState.allVehicleIDs];
      let filterId = cloneId.filter((e) => e !== item.id);
      dispatch(
        addToCarts({
          type: processStatus,
          data: items,
          allVehicleIDs: [...filterId],
        })
      );
    }

    localStorage.setItem(processStatus, JSON.stringify(items));
  };

  const addToCart = (item) => {
    console.log("item", item);
    const keyVehicles =
      item.status === 1 ? "checkoutsTransit" : "checkoutsDestination";

    let allVehicleIds = cartData.allVehicleIDs
      ? [...cartData.allVehicleIDs]
      : [];

    let items = localStorage.getItem(keyVehicles);
    if (items) {
      items = JSON.parse(items);
    } else {
      items = {};
    }

    if (items && items.hasOwnProperty(item.location_id)) {
      let ifExits = items[item.location_id].find((el) => el.id === item.id);
      if (!ifExits) {
        items[item.location_id].push(item);
        allVehicleIds.push(item.id);
      }
    } else {
      items[item.location_id] = [item];
      allVehicleIds.push(item.id);
    }

    allVehicleIds = [...new Set(allVehicleIds)];

    localStorage.setItem(keyVehicles, JSON.stringify(items));
    dispatch(
      addToCarts({
        type: keyVehicles,
        data: items,
        allVehicleIDs: allVehicleIds,
      })
    );
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
          <p className="mb-0">{exports.loading_date}</p>
        </td>

        <td>
          <p className="mb-0">{exports.eta}</p>
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
            {authData.permissions?.["containers.view"] && (
              <EyeIcon
                style={{
                  margin: "7px",
                  cursor: "pointer",
                }}
                onClick={(e) => handleClick(e, exports.id, "view")}
                className="view-button"
              />
            )}
            {authData.permissions?.["containers.update"] && (
              <EditIcon
                style={{
                  margin: "7px",
                  cursor: "pointer",
                }}
                onClick={(e) => handleClick(e, exports, "edit")}
              />
            )}
            {authData.permissions?.["containers.destroy"] &&
              (exports.status === 2 || exports.status === 4) && (
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
          <td colSpan={10}>
            <div className="table-responsive">
              <table className="table table-info">
                <thead>
                  <tr>
                    <th scope="col">YEAR</th>
                    <th scope="col">MAKE</th>
                    <th scope="col">MODEL</th>
                    <th scope="col">ADD</th>
                    <th scope="col">COLOR</th>
                    <th scope="col">VIN</th>
                    <th scope="col">LOT NUMBER</th>
                    <th scope="col">AGENT NAME</th>
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
                        <td>
                          {authData.permissions?.["containers.store"] && (
                            <p className="mb-0">
                              {e.status === 10 && (
                                <button
                                  style={{
                                    fontSize: "30px",
                                    border: "none",
                                    background: "transparent",
                                  }}
                                  className={setCondition(e.id).flag}
                                  onClick={() =>
                                    setCondition(e.id).add
                                      ? removeFromCart(e)
                                      : addToCart(e)
                                  }
                                >
                                  {setCondition(e.id).add ? (
                                    <i
                                      className="las la-minus-circle"
                                      aria-hidden="true"
                                    ></i>
                                  ) : (
                                    <i
                                      className="las la-plus-circle"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                </button>
                              )}
                            </p>
                          )}
                        </td>
                        <td>{e.color}</td>
                        <td>{e.vin}</td>
                        <td>{e.lot_number}</td>
                        <td>
                          <Link
                            to={`/customers/${e?.agent_id}`}
                            target="_blank"
                          >
                            {e.customer_name}
                          </Link>
                        </td>
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
              <td> {languageStrings.loading_date}</td>
              <td> {languageStrings.eta}</td>
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

  return (
    <div>
      {!authData.permissions?.["containers.index"] && (
        <div>
          <h2 class="text-center">{languageStrings.note_allow_show}</h2>
        </div>
      )}
      {authData.permissions?.["containers.index"] && (
        <div className="row">
          <div className="col-xl-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Export to Transit
                </li>
              </ol>
            </nav>
            <div className="card card-height-100">
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {languageStrings.export_to_transit}
                </h4>
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
                    onClick={exportTransit}
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

      <ExportModal
        title="Export Create"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        recordForEdit={recordForEdit}
        addOrEdit={addOrEdit}
        buttonDisabled={buttonDisabled}
      ></ExportModal>

      <ImgGalleryExp
        title=""
        openPopup={imgPopup}
        setOpenPopup={setImgPopup}
        exportId={imgExportId}
        type={1}
      ></ImgGalleryExp>

      <ToastContainer />
    </div>
  );
}

export default Exports;
