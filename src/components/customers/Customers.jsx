import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
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
import "react-toastify/dist/ReactToastify.css";
import languageStrings from "../../localization/language";
import MyPagination from "../../pagination/MyPagination";
import * as CustomerService from "../../services/CustomerService";
import CustomerModal from "./CustomerModal";
import "./customers.css";

const statusItems = [
  { title: "Select Status" },
  { title: "Active", id: 1 },
  { title: "Inactive", id: 2 },
];

const textFilterInitialValues = {
  customer_name: "",
  company_name: "",
  email: "",
  phone: "",
  city: "",
};
const selectFilterInitialValues = {
  status: "",
};

const base_url = process.env.REACT_APP_API_BASE_URL;

function Customers() {
  const authData = useSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useSearchParams();
  const { search } = useLocation();

  // eslint-disable-next-line no-unused-vars
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [metaData, setMetaData] = useState({});
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustoemrs] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();
  const [globalSearchValue, setGlobalSearchValue] = useState("");
  const [textFilterValues, setTextFilterValues] = useState(
    textFilterInitialValues
  );
  const [selectFilterValues, setSelectFilterValues] = useState(
    selectFilterInitialValues
  );
  const [filterUrls, setFilterUrls] = useState(null);

  useEffect(() => {
    const getCustomers = (page) => {
      setLoading(true);
      CustomerService.getCustomers(page)
        .then((response) => {
          setCustoemrs(response.data.data);
          setCount(response.data.meta.last_page);
          setMetaData(response.data.meta);
          setLoading(false);
          setSearchLoading(false);
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong !!!");
          setLoading(false);
          setSearchLoading(false);
        });
    };

    let restUrl = `?page=${currentPage}`;

    if (filterUrls) {
      restUrl += filterUrls;
    }

    getCustomers(restUrl);
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
      const { page, customer_name, company_name, email, phone, city, status } =
        result;

      setCurrentPage(page ?? 1);
      setSelectFilterValues({ ...selectFilterValues, status });
      setTextFilterValues({
        ...textFilterValues,
        customer_name,
        company_name,
        email,
        phone,
        city,
      });
    }
  }, []);

  const getAllCustomers = (page) => {
    setLoading(true);
    CustomerService.getCustomers(page).then((response) => {
      setCustoemrs(response.data.data);
      setCount(response.data.meta.last_page);
      setMetaData(response.data.meta);
      setLoading(false);
    });
  };

  useEffect(() => {
    let filterUrl = "";
    Object.keys(selectFilterValues).forEach((item) => {
      if (selectFilterValues[item]?.length) {
        filterUrl += `&${item}=${selectFilterValues[item]}`;
      }
    });

    Object.keys(textFilterValues).forEach((item) => {
      if (textFilterValues[item]?.length) {
        filterUrl += `&${item}=${textFilterValues[item]}`;
      }
    });

    if (filterUrl) {
      setFilterUrls(filterUrl);
    }
    return () => {
      setState({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectFilterValues]);

  const addEditRecord = (id, type) => {
    setOpenPopup(true);
    setRecordForEdit(null);
  };

  const handleClick = (e, rowData, type) => {
    if (type === "edit") {
      CustomerService.getCustomerById(rowData)
        .then((response) => {
          setRecordForEdit(response.data.data);
          setOpenPopup(true);
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong !!!");
        });
    } else if (type === "delete") {
      if (window.confirm("Are your sure to delete..??")) {
        CustomerService.deleteCustomer(rowData)
          .then((response) => {
            toastMessageShow("success", response.data.message);
            getAllCustomers("?page=1");
          })
          .catch((err) => {
            toastMessageShow("error", "Something went Wrong !!!");
          });
      }
    } else if (type === "view") {
      navigate(`/customers/${rowData.id}`);
    }
  };

  const addOrEdit = (state, resetForm, setErrorClass, setBackendErros) => {
    setButtonDisabled(true);

    if (state.id === 0) {
      CustomerService.insertCustomer(state)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          getAllCustomers("?page=1");
          setErrorClass("");
          formClear(resetForm);
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
      CustomerService.updateCustomer(state)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          formClear(resetForm);
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong !!!");
          // formClear(resetForm);
          setButtonDisabled(false);
        });
    }
  };

  const formClear = (callback) => {
    callback();
    setRecordForEdit(null);
    setOpenPopup(false);
    setButtonDisabled(false);
  };

  const searchHandleCancel = () => {
    setTextFilterValues(textFilterInitialValues);
    setSelectFilterValues(selectFilterInitialValues);
    setFilterUrls(null);
    setCurrentPage(1);
  };

  const searchHandleClick = () => {
    let filterUrl = "";
    Object.keys(selectFilterValues).forEach((item) => {
      if (selectFilterValues[item]?.length) {
        filterUrl += `&${item}=${selectFilterValues[item]}`;
      }
    });

    Object.keys(textFilterValues).forEach((item) => {
      if (textFilterValues[item]?.length) {
        filterUrl += `&${item}=${textFilterValues[item]}`;
      }
    });

    if (filterUrl) {
      setFilterUrls(filterUrl);
    }
  };

  const handleSelectFilter = (e) => {
    const { name, value } = e.target;
    setSelectFilterValues({
      ...selectFilterValues,
      [name]: value,
    });
  };

  const handleTextFilter = (e) => {
    const { name, value } = e.target;
    setTextFilterValues({
      ...textFilterValues,
      [name]: value,
    });
  };

  const enterSearch = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      searchHandleClick();
    }
  };

  const globalSearchClick = () => {
    if (globalSearchValue) {
      setSearchLoading(true);
      setFilterUrls(`&customer_global_search=${globalSearchValue}`);
      if (filterUrls === `&customer_global_search=${globalSearchValue}`) {
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
        setFilterUrls(`&customer_global_search=${globalSearchValue}`);
        if (filterUrls === `&customer_global_search=${globalSearchValue}`) {
          setSearchLoading(false);
        }
      } else {
        setCurrentPage(1);
        setFilterUrls(``);
      }
    }
  };

  const pageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const exportCustomer = () => {
    let url = base_url + `/customers/export/excel`;
    if (filterUrls) {
      url =
        base_url +
        `/customers/export/excel?auth_user_id=${authData.userData.id}${filterUrls}`;
    }
    console.log(url);
    window.location = url;
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

  return (
    <>
      <div>
        <div className="row">
          <div className="col-xl-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Agent and Customer
                </li>
              </ol>
            </nav>
            <div className="card card-height-100">
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {languageStrings.agent_and_customer}
                </h4>
                <div className="from-group" style={{ marginRight: "3px" }}>
                  <input
                    type="text"
                    placeholder={`${languageStrings.agent_and_customer} Global Search`}
                    className="form-control"
                    value={globalSearchValue}
                    style={{ width: "250px" }}
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
                <div className="" style={{ marginRight: "10px" }}>
                  <button className="btn btn-primary" onClick={exportCustomer}>
                    <i className="las la-file" aria-hidden="true"></i>{" "}
                    {languageStrings.export}
                  </button>
                </div>
                <div className="flex-shrink-0">
                  {authData.permissions?.["customers.store"] && (
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
                          <td> {languageStrings.customer_id} </td>
                          <td> {languageStrings.name} </td>
                          <td> {languageStrings.company_name} </td>
                          <td> {languageStrings.email} </td>
                          <td> {languageStrings.phone_uae} </td>
                          <td> {languageStrings.city} </td>
                          <td> {languageStrings.status} </td>
                          <td> {languageStrings.total_vehicles} </td>
                          <td> {languageStrings.created_at} </td>
                          <td> {languageStrings.created_by} </td>
                          <td> {languageStrings.action} </td>
                        </tr>
                        <tr>
                          <td></td>
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
                                value={textFilterValues.customer_name}
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
                                name="company_name"
                                onChange={handleTextFilter}
                                onKeyUp={enterSearch}
                                value={textFilterValues.company_name}
                                className="form-control"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              className="form-group"
                              style={{ width: "150px" }}
                            >
                              <input
                                type="text"
                                name="email"
                                onChange={handleTextFilter}
                                onKeyUp={enterSearch}
                                value={textFilterValues.email}
                                className="form-control"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              className="form-group"
                              style={{ width: "150px" }}
                            >
                              <input
                                type="text"
                                name="phone"
                                onChange={handleTextFilter}
                                onKeyUp={enterSearch}
                                value={textFilterValues.phone}
                                className="form-control"
                              />
                            </div>
                          </td>

                          <td>
                            <div
                              className="form-group"
                              style={{ width: "140px" }}
                            >
                              <input
                                type="text"
                                name="city"
                                onChange={handleTextFilter}
                                onKeyUp={enterSearch}
                                value={textFilterValues.city}
                                className="form-control"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              className="form-group"
                              style={{ width: "150px" }}
                            >
                              <select
                                name="status"
                                onChange={handleSelectFilter}
                                value={selectFilterValues.status}
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
                          <td></td>
                          <td></td>
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
                        {!loading &&
                          customers &&
                          // eslint-disable-next-line array-callback-return
                          customers.map((customer) => (
                            <tr key={customer.id}>
                              <td>
                                <span className="text-muted">
                                  {customer.user_id}
                                </span>
                              </td>
                              <td>
                                <p className="mb-0">{customer.customer_name}</p>
                              </td>
                              <td>
                                <p className="mb-0">{customer.company_name}</p>
                              </td>
                              <td>
                                <p className="mb-0">{customer.email}</p>
                              </td>
                              <td>
                                <p className="mb-0">{customer.phone}</p>
                              </td>

                              <td>
                                <p className="mb-0">{customer.city_name}</p>
                              </td>
                              <td>
                                <p className="mb-0">{customer.status_name}</p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  {customer.vehicles_count}
                                </p>
                              </td>
                              <td>
                                <p className="mb-0">{customer?.created_at}</p>
                              </td>
                              <td>
                                <p className="mb-0">{customer?.created_by}</p>
                              </td>

                              <td>
                                <>
                                  {authData.permissions?.["customers.view"] && (
                                    <EyeIcon
                                      style={{
                                        margin: "7px",
                                        cursor: "pointer",
                                      }}
                                      onClick={(e) =>
                                        handleClick(e, customer, "view")
                                      }
                                      className="view-button"
                                    />
                                  )}

                                  {authData.permissions?.[
                                    "customers.update"
                                  ] && (
                                    <EditIcon
                                      style={{
                                        margin: "7px",
                                        cursor: "pointer",
                                      }}
                                      onClick={(e) =>
                                        handleClick(e, customer.id, "edit")
                                      }
                                    />
                                  )}
                                  {authData.permissions?.[
                                    "customers.destroy"
                                  ] && (
                                    <DeleteIcon
                                      style={{
                                        margin: "7px",
                                        cursor: "pointer",
                                      }}
                                      onClick={(e) =>
                                        handleClick(e, customer.id, "delete")
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

        <CustomerModal
          title="Export Create"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit}
          buttonDisabled={buttonDisabled}
        ></CustomerModal>

        <ToastContainer />
      </div>
    </>
  );
}

export default Customers;
