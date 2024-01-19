import EyeIcon from "@material-ui/icons/RemoveRedEye";
import React, { useEffect, useState } from "react";
import * as AccountingService from "../../services/AccountingService";

const Accounting = () => {
  const [loading, setLoading] = useState(true);
  const [accountingInfo, setAccountingInfo] = useState([]);

  useEffect(() => {
    const getAccountingInfo = () => {
      AccountingService.getAccountingInfo()
        .then((response) => {
          setAccountingInfo(response.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAccountingInfo();
  }, []);

  return (
    <div>
      <div className="col-xl-12">
        <div className="card" style={{ padding: "15px" }}>
          <div className="card-header align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">Accounting Details</h4>
            <div className="flex-shrink-0"></div>
          </div>
          {loading && <p>Loading....</p>}
          {accountingInfo && (
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="card-body">
                  <div className="table-responsive table-card">
                    <table className="table table-bordered table-centered align-middle table-rap mb-0">
                      <thead>
                        <tr>
                          <td>Customer Name</td>
                          <td>Invoice Date</td>
                          <td>Invoice No</td>
                          <td>Total Amount</td>
                          <td>Vin</td>
                          <td>Total Paid Amount</td>
                          <td>Balance Due</td>
                          <td>Payment Status</td>
                          <td>Invoice Pdf</td>
                        </tr>
                      </thead>
                      <tbody>
                        {accountingInfo.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item.customer_name}</td>
                              <td>{item.invoice_date}</td>
                              <td>{item.invoice_no}</td>
                              <td>{item.total_amount}</td>
                              <td>{item.vehicle_vin}</td>
                              <td>{item.total_paid_amount}</td>
                              <td>{item.balance_due}</td>
                              <td>{item.payment_status}</td>
                              <td>
                                <a
                                  href={`${item.invoice_pdf}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <EyeIcon
                                    style={{
                                      margin: "7px",
                                      cursor: "pointer",
                                    }}
                                    className="view-button"
                                  />
                                </a>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Accounting;
