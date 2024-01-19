import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as UserService from "../../services/UserService";

function User() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    const getuser = () => {
      UserService.getUserById(params.id)
        .then((response) => {
          setUser(response.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getuser();
  }, [params]);

  return (
    <div>
      <div className="col-xl-12">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/user-management">Users</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              User Detail
            </li>
          </ol>
        </nav>
        <div className="card" style={{ padding: "15px" }}>
          <div className="card-header align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">User Detail</h4>
            <div className="flex-shrink-0"></div>
          </div>
          {loading && <p>Loading....</p>}
          {user && (
            <div className="row mt-3">
              <div className="col-md-6">
                <div className="card-body">
                  <div className="table-responsive table-card">
                    <table className="table table-bordered table-centered align-middle table-rap mb-0">
                      <tbody>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Custoemr ID </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{user.user_id}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>user Name </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{user.user_name}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Company Name </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{user.company_name}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Email </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{user.email}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Phone</b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{user.phone}</td>
                        </tr>

                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Address line 1 </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>
                            {user.address_line_1}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Address line 2 </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>
                            {user.address_line_2}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card-body">
                  <div className="table-responsive table-card">
                    <table className="table table-centered table-bordered align-middle table-rap mb-0">
                      <tbody>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Country </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{user.country_name}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>State </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{user.state_name}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>City </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{user.city_name}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Zip Code </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{user.zip_code}</td>
                        </tr>

                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Status </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{user.status_name}</td>
                        </tr>

                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Note </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{user.note}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="col-xl-12">
        <div className="card" style={{ padding: "15px" }}>
          <div className="card-header align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">user Documents</h4>
            <div className="flex-shrink-0">
              {/* {user && user.user_documents.length > 0 && (
                <button
                  className="btn btn-sm btn-success"
                  onClick={downloadattachment}
                >
                  <i className="las la-download" aria-hidden="true"></i>{" "}
                  Download
                </button>
              )} */}
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              {user &&
                user.user_documents &&
                user.user_documents.map((objectPhoto, index) => (
                  <div className="col-md-2" key={index}>
                    <div className="" style={{ position: "relative" }}>
                      {objectPhoto.type !== "application/pdf" &&
                        objectPhoto.type !== "pdf" && (
                          <img
                            src={objectPhoto.url}
                            alt=""
                            height={200}
                            width="100%"
                            style={{ borderRadius: "5px" }}
                          />
                        )}

                      {(objectPhoto.type === "application/pdf" ||
                        objectPhoto.type === "pdf") && (
                        <iframe
                          src={objectPhoto.url}
                          title={objectPhoto.name}
                          frameBorder="0"
                          height={200}
                          width="100%"
                        ></iframe>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
