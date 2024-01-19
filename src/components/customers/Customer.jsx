import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import languageStrings from "../../localization/language";
import * as CustomerService from "../../services/CustomerService";

function Customer() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState();

  useEffect(() => {
    const getCustomer = () => {
      CustomerService.getCustomerById(params.id)
        .then((response) => {
          setCustomer(response.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getCustomer();
  }, [params]);

  const downloadattachment = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    window.open(
      `${baseUrl}/customers/${params.id}/download-documents`,
      "_blank"
    );
  };

  return (
    <div>
      <div className="col-xl-12">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/customers">Agent and Customer</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
            Agent and Customer Detail
            </li>
          </ol>
        </nav>
        <div className="card" style={{ padding: "15px" }}>
          <div className="card-header align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">
              {languageStrings.agent_and_customer} Detail
            </h4>
            <div className="flex-shrink-0"></div>
          </div>
          {loading && <p>Loading....</p>}
          {customer && (
            <div className="row mt-3">
              <div className="col-md-6">
                <div className="card-body">
                  <div className="table-responsive table-card">
                    <table className="table table-bordered table-centered align-middle table-rap mb-0">
                      <tbody>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>ID</b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{customer.user_id}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Name</b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>
                            {customer.customer_name}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Company Name </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>
                            {customer.company_name}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Email </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{customer.email}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Phone</b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{customer.phone}</td>
                        </tr>

                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Address line 1 </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>
                            {customer.address_line_1}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Address line 2 </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>
                            {customer.address_line_2}
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
                          <td style={{ width: "50%" }}>
                            {customer.country_name}
                          </td>
                        </tr>
                        {/* <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>State </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>
                            {customer.state_name}
                          </td>
                        </tr> */}
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>City </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{customer.city_name}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Zip Code </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{customer.zip_code}</td>
                        </tr>

                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Status </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>
                            {customer.status_name}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Created At </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>
                            {customer?.created_at}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Created By </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>
                            {customer?.created_by}
                          </td>
                        </tr>

                        <tr>
                          <td style={{ width: "50%" }}>
                            {" "}
                            <b>Note </b>{" "}
                          </td>
                          <td style={{ width: "50%" }}>{customer.note}</td>
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
            <h4 className="card-title mb-0 flex-grow-1">
              {languageStrings.agent_and_customer} Documents
            </h4>
            <div className="flex-shrink-0">
              {customer && customer.customer_documents?.length > 0 && (
                <button
                  className="btn btn-sm btn-success"
                  onClick={downloadattachment}
                >
                  <i className="las la-download" aria-hidden="true"></i>{" "}
                  Download
                </button>
              )}
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              {customer &&
                customer.customer_documents &&
                customer.customer_documents.map((objectPhoto, index) => (
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

export default Customer;
