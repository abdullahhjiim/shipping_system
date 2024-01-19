import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import EyeIcon from "@material-ui/icons/RemoveRedEye";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyPagination from "../../pagination/MyPagination";
import * as ConsigneeService from "../../services/ConsigneeService";
import Popup from "../popup/Popup";
import ConsigneeForm from "./ConsigneeForm";
import "./consignees.css";
import ConsigneeView from "./ConsigneeView";

const statusItems = [
  { title: "" },
  { title: "Active", id: 1 },
  { title: "In-Active", id: 2 },
];

const textFilterInitialValues = {
  consignee_name: "",
  phone: "",
};
const selectFilterInitialValues = {
  customer_name: "",
};

function Consignees() {
  const authData = useSelector((state) => state.auth);

  // eslint-disable-next-line no-unused-vars
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [consignees, setConsignees] = useState([]);
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
    const getConsignees = (page) => {
      setLoading(true);
      ConsigneeService.getConsignees(page)
        .then((response) => {
          setConsignees(response.data.data);
          setCount(response.data.meta.last_page);
          setMetaData(response.data.meta);
          setLoading(false);
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

    getConsignees(restUrl);
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

  const addEditRecord = (id, type) => {
    setOpenPopup(true);
    setRecordForEdit(null);
  };

  const handleClick = (e, rowData, type) => {
    if (type === "edit") {
      ConsigneeService.getConsigneeById(rowData)
        .then((response) => {
          setRecordForEdit(response.data.data);
          setOpenPopup(true);
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong !!!");
        });
    } else if (type === "delete") {
      if (window.confirm("Are your sure to delete..??")) {
        ConsigneeService.deleteConsignee(rowData)
          .then((response) => {
            toastMessageShow("success", response.data.message);
            setCurrentPage(1);
            setFilterUrls("");
          })
          .catch((err) => {
            toastMessageShow("error", "Something went Wrong !!!");
          });
      }
    } else if (type === "view") {
      // ConsigneeService.getConsigneeById(rowData)
      //   .then((response) => {
      //     setRecordForEdit(response.data.data);
      //     setOpenPopup(true);
      //   })
      //   .catch((err) => {
      //     toastMessageShow("error", "Something went Wrong !!!");
      //   });
      setViewPopup(true);
      setRecordForView(rowData);
    }
  };

  const addOrEdit = (consignee, resetForm) => {
    if (consignee.id === 0) {
      ConsigneeService.insertConsignee(consignee)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          setCurrentPage(1);
          setFilterUrls("");
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong  !!!");
        });
    } else {
      ConsigneeService.updateConsignee(consignee)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          setCurrentPage(1);
          setFilterUrls("");
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong !!!");
        });
    }

    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
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
    if (e.key === "Enter" || e.keyCode === 13) {
      searchHandleClick();
    }
  };

  const globalSearchClick = () => {
    if (globalSearchValue) {
      setFilterUrls(`&consignee_global_search=${globalSearchValue}`);
    } else {
      setCurrentPage(1);
      setFilterUrls(``);
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
      autoClose: 5000,
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
            <div className="card card-height-100">
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">Consignees</h4>
                <div className="from-group" style={{ marginRight: "3px" }}>
                  <input
                    type="text"
                    placeholder="Consignee Global Search"
                    className="form-control"
                    value={globalSearchValue}
                    onChange={(e) => setGlobalSearchValue(e.target.value)}
                  />
                </div>
                <div className="" style={{ marginRight: "10px" }}>
                  <button
                    className="btn btn-success"
                    onClick={globalSearchClick}
                    disabled={loading}
                  >
                    {" "}
                    {loading && <Spinner animation="border" size="sm" />}
                    Search
                  </button>
                </div>
                <div className="flex-shrink-0">
                  {/* {authData.permissions?.["Consignees.store"] && ( */}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addEditRecord}
                  >
                    Add New
                  </button>
                  {/* )} */}
                </div>
              </div>

              <div className="card-body">
                <div className="table-responsive table-card">
                  <table className="table table-centered table-hover align-middle table-nowrap mb-0">
                    <thead>
                      <tr>
                        <td> # </td>
                        <td> Consignee Name </td>
                        <td> Customer Name </td>
                        <td> Phone </td>
                        <td> Action</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>
                          <div
                            className="form-group"
                            style={{ width: "150px" }}
                          >
                            <input
                              type="text"
                              name="consignee_name"
                              onChange={handleTextFilter}
                              onKeyUp={enterSearch}
                              value={textFilterValues.consignee_name}
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
                              name="state_id"
                              onChange={handleSelectFilter}
                              value={selectFilterValues.state_id}
                              className="form-control"
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
                            style={{ width: "140px" }}
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
                      {consignees &&
                        // eslint-disable-next-line array-callback-return
                        consignees.map((consignee) => (
                          <tr key={consignee.id}>
                            <td>
                              <span className="text-muted">{consignee.id}</span>
                            </td>
                            <td>
                              <p className="mb-0">{consignee.consignee_name}</p>
                            </td>
                            <td>
                              <p className="mb-0">{consignee.customer_name}</p>
                            </td>

                            <td>
                              <p className="mb-0">{consignee.phone}</p>
                            </td>

                            <td>
                              <>
                                {authData.permissions?.["consignees.view"] && (
                                  <EyeIcon
                                    style={{
                                      margin: "7px",
                                      cursor: "pointer",
                                    }}
                                    onClick={(e) =>
                                      handleClick(e, state.id, "view")
                                    }
                                    className="view-button"
                                  />
                                )}

                                {authData.permissions?.[
                                  "consignees.update"
                                ] && (
                                  <EditIcon
                                    style={{ margin: "7px", cursor: "pointer" }}
                                    onClick={(e) =>
                                      handleClick(e, state.id, "edit")
                                    }
                                  />
                                )}
                                {authData.permissions?.[
                                  "consignees.destroy"
                                ] && (
                                  <DeleteIcon
                                    style={{ margin: "7px", cursor: "pointer" }}
                                    onClick={(e) =>
                                      handleClick(e, state.id, "delete")
                                    }
                                  />
                                )}
                              </>
                            </td>
                          </tr>
                        ))}
                      {loading && (
                        <tr>
                          <td colSpan={6}>Loading ...</td>
                        </tr>
                      )}
                      {!loading && consignees.length === 0 && (
                        <tr>
                          <td colSpan={6}>No Record Found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

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
          title="Consignee Form"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <ConsigneeForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
        </Popup>

        <Popup
          title="Consignee View"
          openPopup={viewPopup}
          setOpenPopup={setViewPopup}
        >
          <ConsigneeView recordData={recordForView} />
        </Popup>

        <ToastContainer />
      </div>
    </>
  );
}

export default Consignees;
