import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as RoleService from "../../services/RoleService";
import "./roles.css";

function UserRole() {
  const params = useParams();
  const [permissionRoles, setPermissionRoles] = useState([]);
  const [totalPermission, setTotalPermission] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [disableButton, setdisableButton] = useState(false);

  useEffect(() => {
    const setPermissionAll = (dataArray) => {
      const permissionsArray = [];
      dataArray.forEach((item) => {
        item.permissions.forEach((permission) => {
          if (permission.has_access) {
            permissionsArray.push(permission.id);
          }
        });
      });
      setTotalPermission(permissionsArray);
    };

    const getRole = (id) => {
      RoleService.getUserWisePermissions(id).then((response) => {
        console.log(response);
        setPermissionRoles(response.data.permissions);
        setLoading(false);
        setPermissionAll(response.data.permissions);
        setUser(response.data.user);
      });
    };
    getRole(params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event, index, i, id) => {
    const newArray = [...totalPermission];
    if (event.target.checked) {
      permissionRoles[index].permissions[i].has_access = true;
      newArray.push(id);
      setTotalPermission(newArray);
    } else {
      permissionRoles[index].permissions[i].has_access = false;
      newArray.splice(
        newArray.findIndex((k) => k === id),
        1
      );
      setTotalPermission(newArray);
    }
  };
  const hangleMotherChange = (event, index) => {
    const newArray = [...totalPermission];
    if (event.target.checked) {
      permissionRoles[index].permissions.forEach((element) => {
        element.has_access = true;
        newArray.push(element.id);
      });
    } else {
      permissionRoles[index].permissions.forEach((element) => {
        element.has_access = false;
        newArray.splice(
          newArray.findIndex((k) => k === element.id),
          1
        );
      });
    }
    setTotalPermission(newArray);
  };

  const updateRoles = (e) => {
    setdisableButton(true);
    RoleService.updateUsersPermission(params.id, {
      permissions: totalPermission,
    })
      .then((response) => {
        setdisableButton(false);
        toastMessageShow("success", "Roles update succssfully");
      })
      .catch((err) => {
        setdisableButton(false);
        toastMessageShow("error", "Somethig went wrong.");
      });
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
    <div>
      {loading && <p>Loading...</p>}

      {/* <h4 style={{ marginLeft: "6px" }}>{user.username}</h4> */}
      <div className="row p-2">
        <div className="col-md-6">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/user-management">User Management</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Role Detail
              </li>
            </ol>
          </nav>
        </div>
        <div className="col-md-6">
          <h4 style={{ marginLeft: "6px", float: "right" }}>
            User: {user.username}
          </h4>
        </div>
      </div>
      <div className="row">
        {permissionRoles &&
          permissionRoles.map((data, index) => {
            return (
              <div className="col-md-4 mt-4" key={index}>
                <Card style={{ padding: "2px" }}>
                  <CardContent>
                    <div className="card-title">
                      <Checkbox
                        onChange={(e) => hangleMotherChange(e, index)}
                      />{" "}
                      <span>Module : {data.name}</span>
                    </div>
                    <div className="check-list" style={{ paddingLeft: "5px" }}>
                      <ul>
                        {data.permissions &&
                          data.permissions.map((permission, i) => {
                            return (
                              <li style={{ listStyle: "none" }} key={i}>
                                <Checkbox
                                  onChange={(e) =>
                                    handleChange(e, index, i, permission.id)
                                  }
                                  checked={permission.has_access}
                                />{" "}
                                <span>{permission.name}</span>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
      </div>
      <div className="row">
        <div className="update-button">
          <Button
            variant="contained"
            onClick={updateRoles}
            disabled={disableButton}
          >
            Update
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UserRole;
