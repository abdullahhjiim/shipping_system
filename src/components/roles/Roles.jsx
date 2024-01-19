import EyeIcon from "@material-ui/icons/RemoveRedEye";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import languageStrings from "../../localization/language";
import * as RoleService from "../../services/RoleService";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const getRoles = () => {
      RoleService.getRoles().then((response) => {
        setRoles(response.data);
        setLoading(false);
        console.log(roles);
      });
    };
    getRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (e, id) => {
    navigate(`/roles/${id}`);
  };

  return (
    <div>
      <div className="col-xl-12">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Roles
            </li>
          </ol>
        </nav>
        <div className="card">
          <div className="card-header align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">
              {languageStrings.roles}
            </h4>
            <div className="flex-shrink-0"></div>
          </div>

          <div className="card-body">
            <div className="table-responsive table-card">
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

              {!loading && roles.length === 0 && (
                <div>
                  <h5 colSpan={32}>No Record Found</h5>
                </div>
              )}
              <table className="table table-borderless table-centered align-middle table-rap mb-0">
                <thead className="text-muted table-light">
                  <tr style={{ width: "100%" }}>
                    <th scope="col" style={{ width: "10%" }}>
                      #
                    </th>
                    <th scope="col" style={{ width: "15%" }}>
                      {languageStrings.title}
                    </th>
                    <th scope="col" style={{ maxWidth: "60%" }}>
                      {languageStrings.permission}
                    </th>
                    <th scope="col" style={{ width: "15%" }}>
                      {languageStrings.action}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {roles &&
                    // eslint-disable-next-line array-callback-return
                    roles.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{data.id}</td>
                          <td>{data.name}</td>
                          <td>
                            {data.permissions.map((permission, i) => {
                              return (
                                <p
                                  key={i}
                                  className="badge badge-soft-primary"
                                  style={{ margin: "2px" }}
                                >
                                  {permission.name}
                                </p>
                              );
                            })}
                          </td>
                          <td>
                            <span className="text-success">
                              <EyeIcon
                                style={{
                                  margin: "7px",
                                  cursor: "pointer",
                                }}
                                onClick={(e) => handleClick(e, data.id)}
                                className="view-button"
                              />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roles;
