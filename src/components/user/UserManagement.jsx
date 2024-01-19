import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import EyeIcon from "@material-ui/icons/RemoveRedEye";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
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
import * as UserService from "../../services/UserService";
import Popup from "../popup/Popup";
import UserForm from "./UserForm";
import "./users.css";

const statusItems = [
  { title: "Select Status" },
  { title: "Active", id: 1 },
  { title: "Inactive", id: 2 },
];

const roleNameItems = [
  { name: "Select Role", id: "" },
  { name: "Master Admin", id: 10 },
  { name: "Super Admin", id: 1 },
  { name: "Location Admin", id: 2 },
  { name: "Customer", id: 3 },
  { name: "Account", id: 5 },
];

const textFilterInitialValues = {
  username: "",
  email: "",
};
const selectFilterInitialValues = {
  role: "",
  status: "",
};

function UserManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { search } = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [users, setUsers] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [textFilterValues, setTextFilterValues] = useState(
    textFilterInitialValues
  );
  const [selectFilterValues, setSelectFilterValues] = useState(
    selectFilterInitialValues
  );
  const [filterUrls, setFilterUrls] = useState(null);

  useEffect(() => {
    const getUsers = (page) => {
      setLoading(true);
      UserService.getUsers(page)
        .then((response) => {
          setUsers(response.data.data);
          setCount(response.data.meta.last_page);
          setMetaData(response.data.meta);
          setLoading(false);
        })
        .catch((err) => {
          // toastMessageShow("error", "Something went Wrong !!!");
          setLoading(false);
        });
    };

    let restUrl = `?page=${currentPage}`;

    if (filterUrls) {
      restUrl += filterUrls;
    }

    getUsers(restUrl);
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
      const { page, role, status, username, email } = result;

      setCurrentPage(page ?? 1);
      setSelectFilterValues({ ...selectFilterValues, status, role });
      setTextFilterValues({
        ...textFilterValues,
        username,
        email,
      });
    }
  }, []);

  const getAllUsers = (page) => {
    UserService.getUsers(page)
      .then((response) => {
        setUsers(response.data.data);
        setCount(response.data.meta.last_page);
        setMetaData(response.data.meta);
        setLoading(false);
      })
      .catch((err) => {});
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
  }, [selectFilterValues]);

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
        UserService.deleteUser(rowData)
          .then((response) => {
            toastMessageShow("success", response.data.message);
            getAllUsers("?page=1");
          })
          .catch((err) => {
            toastMessageShow("error", "Something went Wrong !!!");
          });
      }
    } else if (type === "view") {
      navigate(`/user-management/${rowData}`);
    }
  };

  const addOrEdit = (user, resetForm) => {
    setButtonDisabled(true);

    if (user.id === 0) {
      UserService.insertUser(user)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          getAllUsers("?page=1");
          formClear(resetForm);
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong  !!!");
          formClear(resetForm);
        });
    } else {
      UserService.updateUser(user)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          getAllUsers("?page=1");
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

  const pageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleStatusChange = (userId) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure want to active/inactive this user ?")) {
      UserService.statusChangeUser(userId)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          getAllUsers("?page=1");
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong  !!!");
        });
    }
  };

  const handlePermisson = (userid) => {
    navigate(`/acl/users/${userid}`);
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
                  Users
                </li>
              </ol>
            </nav>
            <div className="card card-height-100">
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {languageStrings.users}
                </h4>

                <div className="flex-shrink-0">
                  {/* {authData.permissions?.["users.store"] && ( */}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addEditRecord}
                  >
                    {languageStrings.add_new}
                  </button>
                  {/* )} */}
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
                          <td> {languageStrings.user_name} </td>
                          <td> {languageStrings.email} </td>
                          <td> {languageStrings.role_name} </td>
                          <td> {languageStrings.location} </td>
                          <td> {languageStrings.status}</td>
                          <td> {languageStrings.permission} </td>
                          <td> {languageStrings.status_change} </td>
                          <td> {languageStrings.action}</td>
                        </tr>
                        <tr>
                          <td></td>
                          <td>
                            <div
                              className="form-group"
                              style={{ width: "130px" }}
                            >
                              <input
                                type="text"
                                name="username"
                                onChange={handleTextFilter}
                                onKeyUp={enterSearch}
                                value={textFilterValues.username}
                                className="form-control"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              className="form-group"
                              style={{ width: "130px" }}
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
                              style={{ minWidth: "140px" }}
                            >
                              <select
                                name="role"
                                onChange={handleSelectFilter}
                                value={selectFilterValues.role}
                                className="form-select form-control"
                              >
                                {roleNameItems.map((item, index) => (
                                  <option value={item.id} key={index}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td></td>
                          <td>
                            <div
                              className="form-group"
                              style={{ width: "130px" }}
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
                          users &&
                          // eslint-disable-next-line array-callback-return
                          users.map((user, index) => (
                            <tr key={user.id}>
                              <td>
                                <span className="text-muted">{index + 1}</span>
                              </td>
                              <td>
                                <p className="mb-0">{user.username}</p>
                              </td>
                              <td>
                                <p className="mb-0">{user.email}</p>
                              </td>
                              <td>
                                <p className="mb-0">{user.role_name}</p>
                              </td>
                              <td>
                                <p className="mb-0">{user.location_name}</p>
                              </td>
                              <td>
                                <p className="mb-0">
                                  <span
                                    className={
                                      user.status === 1
                                        ? `badge badge-soft-success`
                                        : `badge badge-soft-danger`
                                    }
                                  >
                                    {" "}
                                    {user.status_name}{" "}
                                  </span>
                                </p>
                              </td>
                              <td>
                                <button
                                  onClick={(e) => handlePermisson(user.id)}
                                  className="btn btn-default btn-sm"
                                  style={{
                                    border: "1px solid gray",
                                    borderRadius: "5px",
                                    boxShadow: "4px",
                                    color: "blue",
                                  }}
                                >
                                  Permisson
                                </button>
                              </td>
                              <td>
                                <button
                                  onClick={(e) => handleStatusChange(user.id)}
                                  className="btn btn-default btn-sm"
                                  style={{
                                    border: "1px solid gray",
                                    borderRadius: "5px",
                                    boxShadow: "4px",
                                    color:
                                      user.status === 1 ? "orange" : "green",
                                  }}
                                >
                                  {user.status === 1 ? "Inactive" : "Active"}
                                </button>
                              </td>

                              <td>
                                <>
                                  {/* {authData.permissions?.["users.view"] && ( */}
                                  <EyeIcon
                                    style={{
                                      margin: "7px",
                                      cursor: "pointer",
                                    }}
                                    onClick={(e) =>
                                      handleClick(e, user.id, "view")
                                    }
                                    className="view-button"
                                  />
                                  {/* )} */}

                                  {/* {authData.permissions?.["users.update"] && ( */}
                                  <EditIcon
                                    style={{ margin: "7px", cursor: "pointer" }}
                                    onClick={(e) =>
                                      handleClick(e, user, "edit")
                                    }
                                  />
                                  {/* )} */}
                                  {/* {authData.permissions?.["users.destroy"] && ( */}
                                  <DeleteIcon
                                    style={{ margin: "7px", cursor: "pointer" }}
                                    onClick={(e) =>
                                      handleClick(e, user.id, "delete")
                                    }
                                  />
                                  {/* )} */}
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
          title="User Form"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <UserForm
            recordForEdit={recordForEdit}
            addOrEdit={addOrEdit}
            buttonDisabled={buttonDisabled}
          />
        </Popup>

        <ToastContainer />
      </div>
    </>
  );
}

export default UserManagement;
