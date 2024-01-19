import * as markerjs2 from "markerjs2";
import React, { useEffect, useState } from "react";
// import Gallery from "react-grid-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Viewer from "react-viewer";
import ApiClient from "../../api/ApiClient";
import carvector from "../../assets/carvector.jpeg";
import languageStrings from "../../localization/language";
import * as VehicleService from "../../services/VehicleService";
import VehicleConditionModal from "./VehicleConditionModal";
const Vehicle = () => {
  const authData = useSelector((state) => state.auth);

  const param = useParams();
  const [loading, setLoading] = useState(null);
  const [allowAccess, setAllowAccess] = useState(true);
  const [vehicle, setVehicle] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const [galleryPopUp, setGalleryPopUp] = useState(false);
  const [isOpenCoditionalPhoto, setIsOpenCoditionalPhoto] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  console.log(activeIndex);

  const getVehicle = () => {
    setLoading(true);
    VehicleService.getVehicleById(param.id)
      .then((res) => {
        setVehicle(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setAllowAccess(false);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    getVehicle();
  }, [param]);

  const downloadFile = (type) => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    let final_url = baseUrl;
    if (type == "photos") {
      final_url += `/vehicles/${param.id}/download-photos`;
    } else if (type == "documents") {
      final_url += `/vehicles/${param.id}/download-documents?type=1`;
    } else if (type == "invoices") {
      final_url += `/vehicles/${param.id}/download-documents?type=2`;
    }
    window.open(final_url, "_blank");
  };

  const { photos } = vehicle;

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

  useEffect(() => {
    if (isOpenCoditionalPhoto) {
      const vehiclePhoto = document.getElementById("condition-photo");
      if (vehiclePhoto) {
        const markerArea = new markerjs2.MarkerArea(vehiclePhoto);

        markerArea.addEventListener("render", (event) => {
          fetch(event.dataUrl)
            .then((response) => response.blob())
            .then((data) => {
              const _fileName =
                "user-" + Math.floor(Math.random() * 10000) + ".jpg";
              var _makeFile = new File([data], _fileName, {
                type: "image/jpg",
              });

              if (_makeFile) {
                const formData = new FormData();
                formData.append("file", _makeFile);
                const _id = vehicle?.id;

                if (_id) {
                  ApiClient.post(
                    `vehicles/${_id}/vector-photo-upload`,
                    formData
                  )
                    .then((res) => {
                      setIsOpenCoditionalPhoto(false);
                      getVehicle();
                    })
                    .catch((err) => {
                      console.log("err", err.response);
                    });
                }
              }
            });
        });

        // start creating a new marker each time a marker is created
        markerArea.addEventListener("markercreate", (event) => {
          event.markerArea.createNewMarker(event.marker.typeName);
        });

        // make sure clicking close wasn't an accident
        markerArea.addEventListener("close", (event) => {
          setIsOpenCoditionalPhoto(false);
        });

        // launch marker.js
        markerArea.show();
      } else {
        // markerArea.close();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenCoditionalPhoto]);

  const _toggleConditionalPhoto = () => {
    setIsOpenCoditionalPhoto(!isOpenCoditionalPhoto);
  };

  console.log("setIsOpenCoditionalPhoto", isOpenCoditionalPhoto);

  let exportData = vehicle?.export_destination_id
    ? vehicle?.export_destination
    : vehicle?.export;

  return (
    <div>
      {(!authData.permissions?.["vehicles.view"] || allowAccess === false) && (
        <div>
          <h2 className="text-center">{languageStrings.note_allow_show}</h2>
        </div>
      )}
      {authData.permissions?.["vehicles.view"] && allowAccess && (
        <div>
          <div className="col-xl-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/vehicles">Vehicles</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {languageStrings.vehicle_detail}
                </li>
              </ol>
            </nav>
            <div className="card">
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {languageStrings.vehicle_detail}
                </h4>
                <div className="flex-shrink-0"></div>
                <button
                  className="btn btn-success btn-sm cursor-pointer"
                  onClick={() => setOpenPopup(true)}
                >
                  {languageStrings.vehicle_condition}
                </button>
              </div>
              {loading && <p>Loading....</p>}
              {vehicle && (
                <div className="row mt-2">
                  <div className="col-md-6">
                    <div className="card-body mb-3">
                      <div className="table-responsive table-card">
                        <table className="table table-bordered table-centered align-middle table-rap mb-0">
                          <tbody>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Agent Name </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.agent_name}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Customer Name </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.customer_name}
                              </td>
                            </tr>

                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>VCR </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>{vehicle.vcr}</td>
                            </tr>
                            {/* <tr>
                            <td style={{ width: "50%" }}>
                              {" "}
                              <b>HAT </b>{" "}
                            </td>
                            <td style={{ width: "50%" }}>{vehicle.hat_number}</td>
                          </tr> */}
                            {/* <tr>
                            <td style={{ width: "50%" }}>
                              {" "}
                              <b>Buyer No</b>{" "}
                            </td>
                            <td style={{ width: "50%" }}>{vehicle.buyer_no}</td>
                          </tr> */}
                            {/* <tr>
                            <td style={{ width: "50%" }}>
                              {" "}
                              <b>Handed Over Date</b>{" "}
                            </td>
                            <td style={{ width: "50%" }}>
                              {vehicle.handed_over_date}
                            </td>
                          </tr> */}
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>VIN</b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>{vehicle.vin}</td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Year </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>{vehicle.year}</td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Make </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>{vehicle.make}</td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>LOT Number </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.lot_number}
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
                                <b>Agent Company Name </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.agent_company_name}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Color </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>{vehicle.color}</td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Keys </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.keys_name}
                              </td>
                            </tr>
                            {/* <tr>
                            <td style={{ width: "50%" }}>
                              {" "}
                              <b>Storage Amount </b>{" "}
                            </td>
                            <td style={{ width: "50%" }}>
                              {vehicle.storage_amount}
                            </td>
                          </tr> */}
                            {/* <tr>
                            <td style={{ width: "50%" }}>
                              {" "}
                              <b>Check No </b>{" "}
                            </td>
                            <td style={{ width: "50%" }}>
                              {vehicle.check_number}
                            </td>
                          </tr> */}
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Shipping Price ($)</b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>{vehicle.value}</td>
                            </tr>
                            {/* <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Add. CHGS </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.additional_charges}
                              </td>
                            </tr> */}
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Location </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.location_name}
                              </td>
                            </tr>

                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Key Note </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.key_note}
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
            <div className="card">
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {languageStrings.towing_request_details}
                </h4>
                <div className="flex-shrink-0"></div>
              </div>
              {loading && <p>Loading....</p>}
              {vehicle.towing_request && (
                <div className="row mt-2">
                  <div className="col-md-6">
                    <div className="card-body">
                      <div className="table-responsive table-card">
                        <table className="table table-bordered table-centered align-middle table-rap mb-0">
                          <tbody>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Damage </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.towing_request.damaged == 1
                                  ? "Yes"
                                  : "No"}
                              </td>
                            </tr>

                            {/* <tr>
                            <td style={{ width: "50%" }}>
                              {" "}
                              <b>Towed from</b>{" "}
                            </td>
                            <td style={{ width: "50%" }}>{vehicle.towed_from}</td>
                          </tr> */}

                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Note </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.towing_request.note}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card-body mb-3">
                      <div className="table-responsive table-card">
                        <table className="table table-centered table-bordered align-middle table-rap mb-0">
                          <tbody>
                            {/* <tr>
                            <td style={{ width: "50%" }}>
                              {" "}
                              <b>Towed Amount </b>{" "}
                            </td>
                            <td style={{ width: "50%" }}>
                              {vehicle.towed_amount}
                            </td>
                          </tr> */}
                            {/* <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Towing Request Date </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.towing_request.towing_request_date}
                              </td>
                            </tr> */}
                            {/* <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Pickup Date </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.towing_request.pickup_date}
                              </td>
                            </tr> */}
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Pictures </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.towing_request.pictures == 1
                                  ? "Yes"
                                  : "No"}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Received Date</b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.towing_request.deliver_date}
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
          {/* <div className="col-xl-12">
          <div className="card">
            <div className="card-header align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">Title Details</h4>
              <div className="flex-shrink-0"></div>
            </div>
            {loading && <p>Loading....</p>}
            {vehicle && vehicle.towing_request && (
              <div className="row">
                <div className="col-md-6">
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table className="table table-bordered table-centered align-middle table-rap mb-0">
                        <tbody>
                          <tr>
                            <td style={{ width: "50%" }}>
                              {" "}
                              <b>Title </b>{" "}
                            </td>
                            <td style={{ width: "50%" }}>
                              {vehicle.towing_request.title_received}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "50%" }}>
                              {" "}
                              <b>Title Type </b>{" "}
                            </td>
                            <td style={{ width: "50%" }}>
                              {vehicle.title_type_name}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "50%" }}>
                              {" "}
                              <b>Title Amount </b>{" "}
                            </td>
                            <td style={{ width: "50%" }}>
                              {vehicle.title_amount}
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
                              <b>Title Received Date </b>{" "}
                            </td>
                            <td style={{ width: "50%" }}>
                              {vehicle.title_received_date}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "50%" }}>
                              {" "}
                              <b>Title No </b>{" "}
                            </td>
                            <td style={{ width: "50%" }}>
                              {vehicle.title_number}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "50%" }}>
                              {" "}
                              <b>Title state </b>{" "}
                            </td>
                            <td style={{ width: "50%" }}>
                              {vehicle.towing_request.title_state}
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
        </div> */}
          <div className="col-xl-12">
            <div className="card">
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {vehicle?.export_destination_id
                    ? "Destination Export Detail"
                    : languageStrings.short_export_information}
                </h4>
                <div className="flex-shrink-0"></div>
              </div>
              {loading && <p>Loading....</p>}
              {vehicle && exportData && (
                <div className="row">
                  <div className="col-md-6">
                    <div className="card-body">
                      <div className="table-responsive table-card">
                        <table className="table table-bordered table-centered align-middle table-rap mb-0">
                          <tbody>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Status </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.status_name}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Export Date </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {exportData.cmr_date}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Eta </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>{exportData.eta}</td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Booking No </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {exportData.booking_no}
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
                                <b>Serial Number </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {exportData.serial_number}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Container Number </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {vehicle.container_number}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>Destination </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {exportData.destination}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                {" "}
                                <b>AR Number </b>{" "}
                              </td>
                              <td style={{ width: "50%" }}>
                                {exportData.ar_number}
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
            <div className="card" style={{ position: "unset" }}>
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {/* {languageStrings.short_export_information} */}
                  Conditional Vehilce Photo
                </h4>

                {!isOpenCoditionalPhoto && (
                  <button
                    className="btn btn-primary"
                    onClick={_toggleConditionalPhoto}
                  >
                    Update Photo
                  </button>
                )}
                <div className="flex-shrink-0"></div>
              </div>
              <div className="card-body">
                {isOpenCoditionalPhoto && (
                  <img
                    src={carvector}
                    alt="Ikadf"
                    // onClick={showMarkerArea}
                    className="img-fluid"
                    id="condition-photo"
                  />
                )}

                {vehicle?.car_vector_photo && !isOpenCoditionalPhoto && (
                  <img
                    src={vehicle?.car_vector_photo}
                    alt="Ikadf"
                    className="img-fluid"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="col-xl-12">
            <div className="card">
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {languageStrings.vehicle_photos}
                </h4>
                <div className="flex-shrink-0">
                  {vehicle.photos && vehicle.photos.length > 0 && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => downloadFile("photos")}
                    >
                      <i className="las la-download" aria-hidden="true"></i>
                      {languageStrings.download}
                    </button>
                  )}
                </div>
              </div>
              {loading && <p>Loading....</p>}
              <div className="row m-2">
                {vehicle.photos &&
                  vehicle.photos.map((objectPhoto, index) => (
                    <div
                      className="col-md-3 cursor-pointer"
                      style={{ padding: "2px" }}
                      key={index}
                      onClick={(e) => {
                        setGalleryPopUp(true);
                        setActiveIndex(index);
                      }}
                    >
                      <div className="">
                        {objectPhoto.type !== "pdf" && (
                          <img
                            src={objectPhoto.url}
                            alt=""
                            height={200}
                            width="100%"
                            style={{ borderRadius: "5px" }}
                          />
                        )}

                        {objectPhoto.type === "pdf" && (
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
                  {languageStrings.vehicle_documents}
                </h4>
                <div className="flex-shrink-0">
                  {vehicle.documents && vehicle.documents.length > 0 && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => downloadFile("documents")}
                    >
                      <i className="las la-download" aria-hidden="true"></i>
                      {languageStrings.download}
                    </button>
                  )}
                </div>
              </div>
              {loading && <p>Loading....</p>}
              <div className="row m-2">
                {vehicle.documents &&
                  vehicle.documents.map((objectPhoto, index) => (
                    <div className="col-md-3 " key={index}>
                      <div className="">
                        {objectPhoto.type !== "pdf" && (
                          <img
                            src={objectPhoto.url}
                            style={{ padding: "2px", borderRadius: "5px" }}
                            alt=""
                            height={200}
                            width="100%"
                          />
                        )}

                        {objectPhoto.type === "pdf" && (
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

          <div className="col-xl-12">
            <div className="card">
              <div className="card-header align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1">
                  {languageStrings.vehicle_invoices}
                </h4>
                <div className="flex-shrink-0">
                  {vehicle.invoices && vehicle.invoices.length > 0 && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => downloadFile("invoices")}
                    >
                      <i className="las la-download" aria-hidden="true"></i>
                      {languageStrings.download}
                    </button>
                  )}
                </div>
              </div>
              {loading && <p>Loading....</p>}
              <div className="row m-2">
                {vehicle.invoices &&
                  vehicle.invoices.map((objectPhoto, index) => (
                    <div className="col-md-3" key={index}>
                      <div className="">
                        {objectPhoto.type !== "pdf" && (
                          <img
                            src={objectPhoto.url}
                            style={{ padding: "2px" }}
                            alt=""
                            height={200}
                            width="100%"
                          />
                        )}

                        {objectPhoto.type === "pdf" && (
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
          <VehicleConditionModal
            title=""
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
            vehicle={vehicle}
          ></VehicleConditionModal>

          {galleryPopUp && vehicle?.photos?.length && (
            <Viewer
              visible={galleryPopUp}
              onClose={() => {
                setGalleryPopUp(false);
              }}
              activeIndex={activeIndex}
              images={
                vehicle?.photos &&
                vehicle?.photos.length > 0 &&
                vehicle?.photos.map(
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
export default Vehicle;
