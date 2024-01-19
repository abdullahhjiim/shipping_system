import EyeIcon from "@material-ui/icons/RemoveRedEye";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Viewer from "react-viewer";
import languageStrings from "../../localization/language";
import * as ExportService from "../../services/ExportService";
import BillOfLoadingModal from "../exports/BillOfLoadingModal";

const Export = () => {
  const authData = useSelector((state) => state.auth);

  const param = useParams();
  const [loading, setLoading] = useState(null);
  const [exports, setExports] = useState({});
  const [vehicles, setvehicles] = useState([]);
  const [allowAccess, setAllowAccess] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);
  const [galleryPopUp, setGalleryPopUp] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const getExport = () => {
      setLoading(true);
      ExportService.getExportById(param.id, 2)
        .then((res) => {
          setExports(res.data.export_details);
          setvehicles(res.data.vehicles);
          setLoading(false);
        })
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            setAllowAccess(false);
          }
          setLoading(false);
        });
    };
    getExport();
  }, [param]);

  const downloadFile = (type) => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    let final_url = baseUrl;
    if (type == "photos") {
      final_url += `/exports/${param.id}/download-photos`;
    } else if (type == "documents") {
      final_url += `/exports/${param.id}/download-documents`;
    }
    window.open(final_url, "_blank");
  };

  const { container_images: photos } = exports;

  // const imgUrls =
  //   photos &&
  //   photos.map((e) => {
  //     return {
  //       src: e.url,
  //       thumbnail: e.url,
  //       thumbnailHeight: 150,
  //       thumbnailWidth: undefined,
  //     };
  //   });

  const imageItems = photos
    ? photos.map((item) => ({
        original: item.url,
        thumbnail: item.url,
      }))
    : [];

  console.log(photos);

  return (
    <div>
      {(!authData.permissions?.["exports.view"] || allowAccess === false) && (
        <div>
          <h2 className="text-center">{languageStrings.note_allow_show}</h2>
        </div>
      )}
      {authData.permissions?.["exports.view"] && allowAccess && (
        <div>
          <div className="col-xl-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/destination-exports">Exports to Destination</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Destination Export Detail
                </li>
              </ol>
            </nav>
            <div className="card" style={{ padding: "15px" }}>
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {languageStrings.destination_export_detail}
                </h4>
                <div className="flex-shrink-0">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => setOpenPopup(true)}
                  >
                    {languageStrings.bill_of_loading}
                  </button>
                </div>
              </div>
              {loading && <p>Loading....</p>}
              {exports && (
                <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="card-body">
                      <div className="table-responsive table-card">
                        <table className="table table-bordered table-centered align-middle table-rap mb-0">
                          <tbody>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>CMR Date </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {exports.cmr_date}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Loading Date </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {exports.loading_date}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Broker Name </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {exports.broker_name}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Booking No </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {exports.booking_number}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Eta</b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>{exports.eta}</td>
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
                                <b>
                                  {exports.cargo_by == "2" ? "Track" : "CMR"}{" "}
                                  Number{" "}
                                </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {exports.container_number}
                              </td>
                            </tr>

                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Port of Loading </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {exports.port_of_loading_name}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Port of Discharge </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {exports.port_of_discharge_name}
                              </td>
                            </tr>

                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Contact Details </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {exports.contact_details}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Loaded By</b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {exports.cargo_by_name}
                              </td>
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
                  {languageStrings.export_vehicle}
                </h4>
                <div className="flex-shrink-0"></div>
              </div>
              {loading && <p>Loading....</p>}
              {vehicles && (
                <div className="row">
                  <div className="col-md-12">
                    <div className="card-body">
                      <div className="table-responsive table-card">
                        <table className="table table-wrap">
                          <thead className="vehicle-status-table-head">
                            <tr>
                              <th scope="col">Year</th>
                              <th scope="col">Make</th>
                              <th scope="col">Model </th>
                              <th scope="col">Color</th>
                              <th scope="col">Vin</th>
                              <th scope="col">Status</th>
                              <th scope="col">Location</th>
                              <th scope="col">Lot No</th>
                              <th scope="col" style={{ minWidth: "100px" }}>
                                Agent Name
                              </th>
                              <th scope="col" style={{ minWidth: "100px" }}>
                                Customer Name
                              </th>
                              <th scope="col">View</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vehicles &&
                              vehicles.map((vehicle, index) => (
                                <tr key={index}>
                                  <td>{vehicle.year}</td>
                                  <td>{vehicle.make}</td>
                                  <td>{vehicle.model}</td>
                                  <td>{vehicle.color}</td>
                                  <td>{vehicle.vin}</td>
                                  <td>{vehicle.status_name}</td>
                                  <td>{vehicle.location_name}</td>
                                  <td>{vehicle.lot_number}</td>
                                  <td>{vehicle.agent_name}</td>
                                  <td>{vehicle.customer_name}</td>
                                  <td>
                                    <Link to={`/vehicles/${vehicle.id}`}>
                                      <EyeIcon
                                        style={{
                                          margin: "7px",
                                          cursor: "pointer",
                                        }}
                                      />
                                    </Link>
                                  </td>
                                </tr>
                              ))}

                            {loading && (
                              <tr>
                                <td colSpan={12}>Loading</td>
                              </tr>
                            )}
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
            <div className="card">
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {languageStrings.export_photos}
                </h4>
                <div className="flex-shrink-0">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => downloadFile("photos")}
                  >
                    <i className="las la-download" aria-hidden="true"></i>
                    {languageStrings.download}
                  </button>
                </div>
              </div>
              {loading && <p>Loading....</p>}
              <div className="row m-2">
                {exports.container_images &&
                  exports.container_images.map((objectPhoto, index) => (
                    <div
                      className="col-md-3 cursor-pointer"
                      style={{padding:'2px'}}
                      key={index}
                      onClick={(e) => {
                        setGalleryPopUp(true);
                        setActiveIndex(index);
                      }}
                    >
                      <div className="">
                        {objectPhoto.type !== "application/pdf" && (
                          <img
                            src={objectPhoto.url}
                            alt=""
                            height={200}
                            width="100%"
                            style={{ borderRadius: "5px" }}
                          />
                        )}

                        {objectPhoto.type === "application/pdf" && (
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
                {/* {photos && photos.length > 0 ? (
                  <Gallery images={imgUrls} showLightboxThumbnails={true} />
                ) : null} */}
              </div>
            </div>
          </div>

          <div className="col-xl-12">
            <div className="card">
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {languageStrings.export_document}
                </h4>
                {exports.documents?.length > 0 && (
                  <div className="flex-shrink-0">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => downloadFile("documents")}
                    >
                      <i className="las la-download" aria-hidden="true"></i>
                      {languageStrings.download}
                    </button>
                  </div>
                )}
                {/* <div className="flex-shrink-0">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => downloadFile("documents")}
                  >
                    <i className="las la-download" aria-hidden="true"></i>
                    {languageStrings.download}
                  </button>
                </div> */}
              </div>
              {loading && <p>Loading....</p>}
              <div className="row m-2">
                {exports.documents &&
                  exports.documents.map((objectPhoto, index) => (
                    <div className="col-md-2" key={index}>
                      <div className="">
                        {objectPhoto.type !== "application/pdf" && (
                          <img
                            src={objectPhoto.url}
                            alt=""
                            height={200}
                            width="100%"
                            style={{ borderRadius: "5px" }}
                          />
                        )}

                        {objectPhoto.type === "application/pdf" && (
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
          <BillOfLoadingModal
            title=""
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
            exports={exports}
          ></BillOfLoadingModal>
          {/* <GalleryModal
            title="Export Photo Gallery"
            openPopup={galleryPopUp}
            setOpenPopup={setGalleryPopUp}
            items={imageItems}
          ></GalleryModal> */}
          {galleryPopUp && photos?.length && (
            <Viewer
              visible={galleryPopUp}
              onClose={() => {
                setGalleryPopUp(false);
              }}
              activeIndex={activeIndex}
              images={
                photos &&
                photos.length > 0 &&
                photos.map(
                  (item) =>
                    ({
                      src: `${item?.url}`,
                    } ?? [])
                )
              }
            />
          )}
        </div>
      )}
    </div>
  );
};
export default Export;
