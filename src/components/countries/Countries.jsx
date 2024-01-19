import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import EyeIcon from "@material-ui/icons/RemoveRedEye";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import languageStrings from "../../localization/language";
import MyPagination from "../../pagination/MyPagination";
import * as CountryService from "../../services/CountryService";
import Popup from "../popup/Popup";
import "./countries.css";
import CountryForm from "./CountryForm";
import CountryView from "./CountryView";

const statusItems = [
  { title: "" },
  { title: "Active", id: 1 },
  { title: "Inactive", id: 2 },
];

const textFilterInitialValues = {
  name: "",
};
const selectFilterInitialValues = {
  status: "",
};

function Countries() {
  const authData = useSelector((state) => state.auth);

  // eslint-disable-next-line no-unused-vars
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [countries, setCountries] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openPopup, setOpenPopup] = useState(false);
  const [viewPopup, setViewPopup] = useState(false);
  const [recordForView, setRecordForView] = useState(null);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [globalSearchValue, setGlobalSearchValue] = useState("");
  const [textFilterValues, setTextFilterValues] = useState(
    textFilterInitialValues
  );
  const [selectFilterValues, setSelectFilterValues] = useState(
    selectFilterInitialValues
  );
  const [filterUrls, setFilterUrls] = useState(null);

  useEffect(() => {
    const getCountries = (restUrl) => {
      setLoading(true);
      CountryService.getCountries(restUrl)
        .then((response) => {
          setCountries(response.data.data);
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

    getCountries(restUrl);

    return () => {
      setState({});
    };
  }, [currentPage, filterUrls]);

  useEffect(() => {
    let filterUrl = "";
    Object.keys(selectFilterValues).forEach((item) => {
      if (selectFilterValues[item].length) {
        filterUrl += `&${item}=${selectFilterValues[item]}`;
      }
    });

    if (filterUrl) {
      setFilterUrls(filterUrl);
    }
    return () => {
      setState({});
    };
  }, [selectFilterValues]);

  const getAllCountry = () => {
    setLoading(true);
    CountryService.getCountries("?page=1")
      .then((response) => {
        setCountries(response.data.data);
        setCount(response.data.meta.last_page);
        setMetaData(response.data.meta);
        setLoading(false);
      })
      .catch((err) => {
        toastMessageShow("error", "Something went Wrong !!!");
        setLoading(false);
      });
  };

  const addEditRecord = (id, type) => {
    setOpenPopup(true);
    setRecordForEdit(null);
  };

  const handleClick = (e, rowData, type) => {
    if (type === "edit") {
      setRecordForEdit(rowData);
      setOpenPopup(true);
    } else if (type === "delete") {
      if (window.confirm("Are your sure to delete..??")) {
        CountryService.deleteCountry(rowData)
          .then((response) => {
            toastMessageShow("success", response.data.message);
            getAllCountry();
          })
          .catch((err) => {
            toastMessageShow("error", "Something went Wrong !!!");
          });
      }
    } else if (type === "view") {
      setViewPopup(true);
      setRecordForView(rowData);
    }
  };

  const addOrEdit = (location, resetForm) => {
    setButtonDisabled(true);
    if (location.id === 0) {
      CountryService.insertCountry(location)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          getAllCountry();
          formClear(resetForm);
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong  !!!");
          formClear(resetForm);
        });
    } else {
      CountryService.updateCountry(location)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          getAllCountry();
          formClear(resetForm);
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong !!!");
          formClear(resetForm);
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
  };

  const searchHandleClick = () => {
    let filterUrl = "";
    Object.keys(selectFilterValues).forEach((item) => {
      if (selectFilterValues[item].length) {
        filterUrl += `&${item}=${selectFilterValues[item]}`;
      }
    });

    Object.keys(textFilterValues).forEach((item) => {
      if (textFilterValues[item].length) {
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
    console.log(e);
    if (e.key === "Enter" || e.keyCode === 13) {
      searchHandleClick();
    }
  };

  const globalSearchClick = () => {
    if (globalSearchValue) {
      setSearchLoading(true);
      setFilterUrls(`&country_global_search=${globalSearchValue}`);
      if (filterUrls === `&country_global_search=${globalSearchValue}`) {
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
        setFilterUrls(`&country_global_search=${globalSearchValue}`);
        if (filterUrls === `&country_global_search=${globalSearchValue}`) {
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
                  Countries
                </li>
              </ol>
            </nav>
            <div className="card card-height-100">
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {languageStrings.countries}
                </h4>
                <div className="from-group" style={{ marginRight: "3px" }}>
                  <input
                    type="text"
                    placeholder={languageStrings.global_search}
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
                <div className="flex-shrink-0">
                  {authData.permissions?.["countries.store"] && (
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
                          <td> # </td>
                          <td> {languageStrings.name} </td>
                          <td> {languageStrings.status}</td>
                          <td> {languageStrings.action}</td>
                        </tr>
                        <tr>
                          <td></td>
                          <td>
                            <div
                              className="form-group"
                              style={{ width: "180px" }}
                            >
                              <input
                                type="text"
                                name="name"
                                onChange={handleTextFilter}
                                onKeyUp={enterSearch}
                                value={textFilterValues.name}
                                className="form-control"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              className="form-group"
                              style={{ width: "140px" }}
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
                          countries &&
                          // eslint-disable-next-line array-callback-return
                          countries.map((country) => (
                            <tr key={country.id}>
                              <td>
                                <span className="text-muted">{country.id}</span>
                              </td>
                              <td>
                                <p className="mb-0">{country.name}</p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  <span
                                    className={
                                      country.status === 1
                                        ? `badge badge-soft-success`
                                        : `badge badge-soft-danger`
                                    }
                                  >
                                    {" "}
                                    {country.status_name}{" "}
                                  </span>
                                </p>
                              </td>

                              <td>
                                <>
                                  {authData.permissions?.["countries.view"] && (
                                    <EyeIcon
                                      style={{
                                        margin: "7px",
                                        cursor: "pointer",
                                      }}
                                      onClick={(e) =>
                                        handleClick(e, country, "view")
                                      }
                                      className="view-button"
                                    />
                                  )}

                                  {authData.permissions?.[
                                    "countries.update"
                                  ] && (
                                    <EditIcon
                                      style={{
                                        margin: "7px",
                                        cursor: "pointer",
                                      }}
                                      onClick={(e) =>
                                        handleClick(e, country, "edit")
                                      }
                                    />
                                  )}
                                  {authData.permissions?.[
                                    "countries.destroy"
                                  ] && (
                                    <DeleteIcon
                                      style={{
                                        margin: "7px",
                                        cursor: "pointer",
                                      }}
                                      onClick={(e) =>
                                        handleClick(e, country.id, "delete")
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

        <Popup
          title="Country Form"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <CountryForm
            recordForEdit={recordForEdit}
            addOrEdit={addOrEdit}
            buttonDisabled={buttonDisabled}
          />
        </Popup>

        <Popup
          title="Country View"
          openPopup={viewPopup}
          setOpenPopup={setViewPopup}
        >
          <CountryView recordData={recordForView} />
        </Popup>

        <ToastContainer />
      </div>
    </>
  );
}

export default Countries;
