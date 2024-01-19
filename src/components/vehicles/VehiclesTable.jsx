import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
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
import makeAnimated from "react-select/animated";
import { ToastContainer, toast } from "react-toastify";
import Viewer from "react-viewer";
import languageStrings from "../../localization/language";
import { addToCarts } from "../../redux/carts/cartsSlice";
import * as VehicleService from "../../services/VehicleService";
import NoteModal from "../note/NoteModal";
import VehicleModal from "../popup/VehicleModal";
import MyPagination from "./MyPagination";
import VehicleImportModal from "./VehicleImportModal";
import "./vehiclesTable.css";

const keysItems = [
  { title: "Select Keys", id: "" },
  { title: "Yes", id: "1" },
  { title: "No", id: "2" },
];

const vehicleTypeItems = [
  { title: "Select Type", id: "" },
  { title: "Sedan", id: "Sedan" },
  { title: "Van", id: "Van" },
  { title: "Pickup", id: "Pickup" },
  { title: "Truck", id: "Truck" },
  { title: "Mortorcycle", id: "Mortorcycle" },
  { title: "JEEP", id: "JEEP" },
  { title: "CROSSOVER", id: "CROSSOVER" },
];

const statusItems = [
  { title: "Select Status", id: "" },
  { title: "PICKED UP", id: 5 },
  { title: "ON HAND", id: 1 },
  { title: "INSIDE THE PORT", id: 2 },
  { title: "SHIPPED TO TRANSIT", id: 4 },
  { title: "ARRIVED TO TRANSIT", id: 10 },
  { title: "IN SARAKHS", id: 11 },
  { title: "ON THE WAY TO DESTINATION", id: 12 },
  { title: "ARRIVED TO DESTINATION", id: 15 },
  { title: "ARRIVED TO FINAL DESTINATION", id: 17 },
];

const noteItems = [
  { title: "Select Note", id: "" },
  { title: "Open", id: 2 },
  { title: "Closed", id: 1 },
];

const filterInitialValues = {
  keys: "",
  vehicle_type: "",
  title: "",
  location_id: "",
  status: "",
  loading_type: "",
  notes: "",
  customer_user_id: "",
  agent_user_id: "",
};

const filterTextInitialValues = {
  // towing_request_date: "",
  pickup_date: "",
  loading_date: "",
  year: "",
  make: "",
  model: "",
  color: "",
  vin: "",
  lot_number: "",
  title_received_date: "",
  container_no: "",
};

const base_url = process.env.REACT_APP_API_BASE_URL;

function VehiclesTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const authData = useSelector((state) => state.auth);
  const cartData = useSelector((state) => state.carts);

  const { search } = useLocation();
  const checkoutState = useSelector((state) => state.carts);

  // eslint-disable-next-line no-unused-vars
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openPopup, setOpenPopup] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [globalSearchValue, setGlobalSearchValue] = useState("");
  const [locationItems, setLocationItems] = useState([]);

  const [filterValues, setFilterValues] = useState(filterInitialValues);
  const [filterTextValues, setFilterTextValues] = useState(
    filterTextInitialValues
  );
  const [filterUrls, setFilterUrls] = useState(null);
  const [sort, setSort] = useState({});
  const [notePopup, setNotePopup] = useState(false);
  const [noteData, setNoteData] = useState({});
  const [imgVehicleId, setImgVehicleId] = useState(null);
  const [imgPopup, setImgPopup] = useState(false);
  const animatedComponet = makeAnimated();
  const [agentUser, setAgentUser] = useState({});
  const [customertUser, setCustomerUser] = useState({});
  const [vehicleTypes, setVehicleTypes] = useState([]);

  const [vehicleImages, setVehicleImages] = useState([]);

  console.log(vehicleImages);

  useEffect(() => {
    VehicleService.getLocationItems()
      .then((response) => {
        // console.log(response);
        setLocationItems(response.data.data ?? []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const getVehicles = (restUrl) => {
      setLoading(true);
      VehicleService.getVehicles(restUrl)
        .then((response) => {
          setVehicles(response.data.data);
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

  function removePlus(str) {
    if (str) {
      return str.split("+").join(" ");
    }
  }

  useEffect(() => {
    if (search) {
      const result = getSearchParams(search);
      const {
        page,
        year,
        make,
        model,
        color,
        vin,
        lot_number,
        container_no,
        title_received_date,
        loading_date,
        // towing_request_date,
        keys,
        vehicle_type,
        title,
        location_id,
        status,
        loading_type,
        notes,
        customer_user_id,
        agent_user_id,
        agent_user_name,
        cust_user_name,
      } = result;
      setCurrentPage(page ?? 1);

      setAgentUser({
        label: removePlus(agent_user_name),
        value: agent_user_id,
      });

      setCustomerUser({
        label: removePlus(cust_user_name),
        value: customer_user_id,
      });

      setFilterValues({
        ...filterValues,
        keys,
        vehicle_type,
        title,
        location_id,
        status,
        loading_type,
        notes,
        customer_user_id,
        agent_user_name,
        cust_user_name,
        agent_user_id,
      });
      setFilterTextValues({
        ...filterTextValues,
        year,
        make,
        model,
        color,
        vin,
        lot_number,
        container_no,
        title_received_date,
        loading_date,
        // towing_request_date,
      });
    }
  }, []);

  const getAllVehicles = (restUrl) => {
    setLoading(true);
    VehicleService.getVehicles(restUrl).then((response) => {
      setVehicles(response.data.data);
      setCount(response.data.meta.last_page);
      setMetaData(response.data.meta);
      setLoading(false);
    });
  };

  const handleClick = (e, rowData, type) => {
    if (type === "edit") {
      VehicleService.getVehicleById(rowData.id)
        .then((response) => {
          setRecordForEdit(response.data.data);
          setOpenPopup(true);
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong !!!");
        });
    } else if (type === "delete") {
      if (window.confirm("Are your sure to delete..??")) {
        VehicleService.deleteVehicle(rowData)
          .then((response) => {
            toastMessageShow("success", response.data.message);
            // tableRef.current.onQueryChange();
            getAllVehicles("?page=1");
          })
          .catch((err) => {
            toastMessageShow("error", "Something went Wrong !!!");
          });
      }
    } else if (type === "view") {
      navigate(`/vehicles/${rowData}`);
    }
  };

  const vehicleTypesSearch = () => {
    const url = `/search/vehicle-types`;

    VehicleService.getVehicleTypes(url)
      .then((response) => {
        const json = response.data;
        console.log(json);
        setVehicleTypes([{ title: "Select Type", id: "" }, ...json]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addEditRecord = (id, type) => {
    setRecordForEdit(null);
    setOpenPopup(true);
  };

  const addOrEdit = (vehicles, resetForm, setErrorClass, setBackendErros) => {
    setButtonDisabled(true);

    if (vehicles.id === 0) {
      VehicleService.insertVehicle(vehicles)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          getAllVehicles("?page=1");
          formClear(resetForm, setErrorClass);
          vehicleTypesSearch();
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
      VehicleService.updateVehicle(vehicles)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          getAllVehicles("?page=1");
          formClear(resetForm, setErrorClass);
          vehicleTypesSearch();
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setAgentUser({});
    setCustomerUser({});
  };

  const globalSearchClick = () => {
    if (globalSearchValue) {
      setSearchLoading(true);
      setFilterUrls(`&vehicle_global_search=${globalSearchValue}`);
      if (filterUrls === `&vehicle_global_search=${globalSearchValue}`) {
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
        setFilterUrls(`&vehicle_global_search=${globalSearchValue}`);
        if (filterUrls === `&vehicle_global_search=${globalSearchValue}`) {
          setSearchLoading(false);
        }
      } else {
        setCurrentPage(1);
        setFilterUrls(``);
      }
    }
  };

  const sortHanlde = (sortColumn) => {
    let sortDecision = "asc";
    if (sort && sort[sortColumn]) {
      if (sort[sortColumn].toString() === "asc") {
        sortDecision = "desc";
      }
    }
    setSort({ [sortColumn]: sortDecision });
    const sortUrl = `&order_by_column=${sortColumn}&order_by=${sortDecision}`;
    setFilterUrls(sortUrl);
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

  const openCloseNote = (flag, vehicle) => {
    setNotePopup(flag);
    setNoteData(vehicle);
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
    // console.log(item);
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

  const exportVehicle = () => {
    let url =
      base_url + `/vehicles/export-excel?auth_user_id=${authData.userData.id}`;
    if (filterUrls) {
      url =
        base_url +
        `/vehicles/export-excel?auth_user_id=${authData.userData.id}${filterUrls}`;
    }
    window.location = url;
  };

  const imgViewer = (vehicleImgId) => {
    setImgPopup(true);
    setImgVehicleId(vehicleImgId);
  };

  const handleAgentAutoInputChange = (e) => {
    setAgentUser(e);

    setFilterValues({
      ...filterValues,
      agent_user_id: e.value,
      agent_user_name: e.label,
    });
  };

  // console.log(agentUser);
  const handleCustomerAutoInputChange = (e) => {
    setCustomerUser(e);

    setFilterValues({
      ...filterValues,
      customer_user_id: e.value,
      cust_user_name: e.label,
    });
  };

  useEffect(() => {
    vehicleTypesSearch();
  }, []);

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

  const agentLoadOptions = (inputText, callback) => {
    const url = `/agents-item?customer_name=${inputText}`;

    VehicleService.getCustomersItem(url)
      .then((response) => {
        const json = response.data.data;
        callback(
          json.map((i) => ({
            label: i.name,
            value: i.user_id,
            agent_company_name: i.company_name,
            legacy_agent_id: i.legacy_customer_id,
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(vehicleImages);

  useEffect(() => {
    setLoading(true);
    const getAllImage = () => {
      VehicleService.getVehicleById(imgVehicleId)
        .then((res) => {
          console.log(res.data);
          setVehicleImages(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };
    if (imgVehicleId) {
      getAllImage();
    }
  }, [imgVehicleId]);

  return (
    <div>
      {!authData.permissions?.["vehicles.index"] && (
        <div>
          <h2 className="text-center">{languageStrings.note_allow_show}</h2>
        </div>
      )}
      {authData.permissions?.["vehicles.index"] && (
        <div className="row">
          <div className="col-xl-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Vehicles
                </li>
              </ol>
            </nav>
            <div className="card card-height-100">
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {languageStrings.vehicles}
                </h4>
                <div className="from-group" style={{ marginRight: "3px" }}>
                  <input
                    type="text"
                    placeholder="Vehicle Global Search"
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

                {authData.permissions?.["vehicles.store"] && (
                  <div className="" style={{ marginRight: "10px" }}>
                    <button
                      className="btn btn-info"
                      onClick={() => setOpenImport(true)}
                    >
                      Import Vehicle
                    </button>
                  </div>
                )}

                <div className="" style={{ marginRight: "10px" }}>
                  <button className="btn btn-primary" onClick={exportVehicle}>
                    {languageStrings.export_vehicles}
                  </button>
                </div>

                <div className="" style={{ marginRight: "10px" }}>
                  <Link className="btn btn-primary" to="/notes">
                    {languageStrings.notes}
                  </Link>
                </div>

                <div className="flex-shrink-0">
                  {authData.permissions?.["vehicles.store"] && (
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

                {!loading && (
                  <div className="table-responsive table-card">
                    <table className="table table-centered table-hover align-middle table-nowrap mb-0">
                      <thead>
                        <tr>
                          <td> {languageStrings.photo}</td>
                          <td> {languageStrings.total_photos}</td>
                          <td> {languageStrings.add}</td>
                          <td> {languageStrings.loading_date}</td>
                          <td> Arrived Date</td>
                          <td> {languageStrings.status}</td>
                          <td>
                            <div
                              className=""
                              onClick={(e) => sortHanlde("make")}
                              style={{ cursor: "pointer" }}
                            >
                              {languageStrings.make}{" "}
                              <ArrowUpwardIcon
                                hidden={!sort.make || sort.make === "desc"}
                              />
                              <ArrowDownwardIcon hidden={sort.make === "asc"} />
                            </div>{" "}
                          </td>
                          <td>
                            {" "}
                            <div
                              className=""
                              onClick={(e) => sortHanlde("model")}
                              style={{ cursor: "pointer" }}
                            >
                              {languageStrings.model}{" "}
                              <ArrowUpwardIcon
                                hidden={!sort.model || sort.model === "desc"}
                              />
                              <ArrowDownwardIcon
                                hidden={sort.model === "asc"}
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              className=""
                              onClick={(e) => sortHanlde("vin")}
                              style={{ cursor: "pointer" }}
                            >
                              {languageStrings.vin}{" "}
                              <ArrowUpwardIcon
                                hidden={!sort.vin || sort.vin === "desc"}
                              />
                              <ArrowDownwardIcon hidden={sort.vin === "asc"} />
                            </div>
                          </td>
                          <td> {languageStrings.color}</td>
                          <td>
                            <div
                              className=""
                              onClick={(e) => sortHanlde("year")}
                              style={{ cursor: "pointer" }}
                            >
                              {languageStrings.year}{" "}
                              <ArrowUpwardIcon
                                hidden={!sort.year || sort.year === "desc"}
                              />
                              <ArrowDownwardIcon hidden={sort.year === "asc"} />
                            </div>
                          </td>

                          <td>
                            <div
                              className=""
                              onClick={(e) => sortHanlde("lot_number")}
                              style={{ cursor: "pointer" }}
                            >
                              {languageStrings.lot_number}{" "}
                              <ArrowUpwardIcon
                                hidden={
                                  !sort.lot_number || sort.lot_number === "desc"
                                }
                              />
                              <ArrowDownwardIcon
                                hidden={sort.lot_number === "asc"}
                              />
                            </div>{" "}
                          </td>
                          <td> {languageStrings.agent_name}</td>
                          <td> {languageStrings.customer_name}</td>
                          <td> {languageStrings.note}</td>
                          <td> {languageStrings.search}</td>
                          <td> {languageStrings.action}</td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <div
                              className="form-group"
                              style={{ minWidth: "100px" }}
                            >
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
                          <td></td>
                          <td>
                            <div
                              className="form-group"
                              style={{ minWidth: "100px" }}
                            >
                              <select
                                name="status"
                                onChange={handleFilter}
                                value={filterValues.status}
                                className="form-select form-control"
                              >
                                {statusItems.map((item, index) => (
                                  <option value={item.id} key={index}>
                                    {item.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div
                              className="form-group"
                              style={{ minWidth: "100px" }}
                            >
                              <input
                                type="text"
                                name="make"
                                onChange={handleTextFilter}
                                onKeyUp={enterSearch}
                                value={filterTextValues.make}
                                className="form-control"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              className="form-group"
                              style={{ minWidth: "100px" }}
                            >
                              <input
                                type="text"
                                name="model"
                                onChange={handleTextFilter}
                                onKeyUp={enterSearch}
                                value={filterTextValues.model}
                                className="form-control"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              className="form-group"
                              style={{ minWidth: "100px" }}
                            >
                              <input
                                type="text"
                                name="vin"
                                onChange={handleTextFilter}
                                onKeyUp={enterSearch}
                                value={filterTextValues.vin}
                                className="form-control"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              className="form-group"
                              style={{ minWidth: "100px" }}
                            >
                              <input
                                type="text"
                                name="color"
                                onChange={handleTextFilter}
                                onKeyUp={enterSearch}
                                value={filterTextValues.color}
                                className="form-control"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              className="form-group"
                              style={{ minWidth: "100px" }}
                            >
                              <input
                                type="text"
                                name="year"
                                onChange={handleTextFilter}
                                onKeyUp={enterSearch}
                                value={filterTextValues.year}
                                className="form-control"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              className="form-group"
                              style={{ minWidth: "100px" }}
                            >
                              <input
                                type="text"
                                name="lot_number"
                                onChange={handleTextFilter}
                                onKeyUp={enterSearch}
                                value={filterTextValues.lot_number}
                                className="form-control"
                              />
                            </div>
                          </td>

                          <td style={{ minWidth: "200px" }}>
                            <div
                              className="form-group"
                              style={{ minWidth: "200px" }}
                            >
                              <input
                                type="text"
                                name="agent_name"
                                onChange={handleTextFilter}
                                onKeyUp={enterSearch}
                                value={filterTextValues.agent_name}
                                className="form-control"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              className="form-group"
                              style={{ minWidth: "200px" }}
                            >
                              <input
                                type="text"
                                name="customer_name"
                                onChange={handleTextFilter}
                                onKeyUp={enterSearch}
                                value={filterTextValues.customer_name}
                                className="form-control"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              className="form-group"
                              style={{ minWidth: "100px" }}
                            >
                              <select
                                name="notes"
                                onChange={handleFilter}
                                value={filterValues.notes}
                                className="form-select form-control"
                              >
                                {noteItems.map((item, index) => (
                                  <option value={item.id} key={index}>
                                    {item.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td></td>
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
                        {vehicles &&
                          // eslint-disable-next-line array-callback-return
                          vehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="flex-shrink-0 me-2">
                                    {vehicle.thumbnail && (
                                      <img
                                        src={vehicle.thumbnail}
                                        alt="img"
                                        className="avatar-sm p-2 cursor-pointer"
                                        onClick={() => imgViewer(vehicle.id)}
                                      />
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="text-muted">
                                  {vehicle.total_photos}
                                </span>
                              </td>

                              <td>
                                {authData.permissions?.["containers.store"] && (
                                  <p className="mb-0">
                                    {vehicle.status === 1 && (
                                      <button
                                        style={{
                                          fontSize: "30px",
                                          border: "none",
                                          background: "transparent",
                                        }}
                                        className={
                                          setCondition(vehicle.id).flag
                                        }
                                        onClick={() =>
                                          setCondition(vehicle.id).add
                                            ? removeFromCart(vehicle)
                                            : addToCart(vehicle)
                                        }
                                      >
                                        {setCondition(vehicle.id).add ? (
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
                              <td>
                                <p className="mb-0">{vehicle.loading_date}</p>
                              </td>
                              <td>
                                <p className="mb-0">{vehicle.arrived_date}</p>
                              </td>
                              <td>
                                <p className="mb-0">{vehicle.status_name}</p>
                              </td>
                              <td>
                                <p className="mb-0">{vehicle.make}</p>
                              </td>
                              <td>
                                <p className="mb-0">{vehicle.model}</p>
                              </td>
                              <td>
                                <p className="mb-0">{vehicle.vin}</p>
                              </td>
                              <td>
                                <p className="mb-0">{vehicle.color}</p>
                              </td>
                              <td>
                                <p className="mb-0">{vehicle.year}</p>
                              </td>
                              <td>
                                <p className="mb-0">{vehicle.lot_number}</p>
                              </td>

                              <td>
                                <p className="mb-0">{vehicle?.agent_name}</p>
                              </td>
                              <td>
                                <p className="mb-0">{vehicle?.customer_name}</p>
                              </td>
                              <td>
                                <p className={`mb-0`}>
                                  <Link
                                    to=""
                                    onClick={(e) =>
                                      openCloseNote(true, vehicle)
                                    }
                                    className={vehicle.note_status.class}
                                  >
                                    {vehicle.note_status.label}
                                  </Link>
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  <a
                                    target="_blank"
                                    href={`https://www.google.com/search?tbm=isch&as_q=${
                                      vehicle.year
                                    }++${vehicle.model}++${vehicle.make}++${
                                      vehicle.color ?? ""
                                    }`}
                                    rel="noreferrer"
                                  >
                                    Search
                                  </a>
                                </p>
                              </td>
                              <td>
                                <>
                                  {authData.permissions?.["vehicles.view"] && (
                                    <EyeIcon
                                      style={{
                                        margin: "7px",
                                        cursor: "pointer",
                                      }}
                                      onClick={(e) =>
                                        handleClick(e, vehicle.id, "view")
                                      }
                                      className="view-button"
                                    />
                                  )}
                                  {authData.permissions?.[
                                    "vehicles.update"
                                  ] && (
                                    <EditIcon
                                      style={{
                                        margin: "7px",
                                        cursor: "pointer",
                                      }}
                                      onClick={(e) =>
                                        handleClick(e, vehicle, "edit")
                                      }
                                    />
                                  )}

                                  {authData.permissions?.["vehicles.destroy"] &&
                                    (vehicle.status === 1 ||
                                      vehicle.status === 5) && (
                                      <DeleteIcon
                                        style={{
                                          margin: "7px",
                                          cursor: "pointer",
                                        }}
                                        onClick={(e) =>
                                          handleClick(e, vehicle.id, "delete")
                                        }
                                      />
                                    )}
                                </>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

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
      <VehicleModal
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        recordForEdit={recordForEdit}
        addOrEdit={addOrEdit}
        buttonDisabled={buttonDisabled}
      ></VehicleModal>

      <VehicleImportModal
        openPopup={openImport}
        setOpenPopup={setOpenImport}
      ></VehicleImportModal>

      <NoteModal
        title=""
        openPopup={notePopup}
        setOpenPopup={setNotePopup}
        noteData={noteData}
        setCurrentPage={setCurrentPage}
      ></NoteModal>

      {imgPopup && vehicleImages?.photos?.length && (
        <Viewer
          visible={imgPopup}
          onClose={() => {
            setImgPopup(false);
          }}
          activeIndex={0}
          images={
            vehicleImages?.photos &&
            vehicleImages?.photos.length > 0 &&
            vehicleImages?.photos.map(
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

export default VehiclesTable;
