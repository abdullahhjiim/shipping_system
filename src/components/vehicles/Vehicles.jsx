import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import EyeIcon from "@material-ui/icons/RemoveRedEye";
import MaterialTable from "material-table";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as VehicleService from "../../services/VehicleService";
import MaterialTableIcon from "../icons/MaterialTableIcon";
import { PatchedPagination } from "../pagination/PatchedPagination";
import Popup from "../popup/Popup";
import VehicleForm from "./VehicleForm";
import "./vehicles.css";

function Vehicles() {
  const tableRef = useRef();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();

  const addEditRecord = (id, type) => {
    setOpenPopup(true);
    setRecordForEdit(null);
  };
  const handleClick = (e, rowData, type) => {
    if (type === "edit") {
      VehicleService.getVehicleById(rowData.id)
        .then((response) => {
          console.log(response);
          setRecordForEdit(response.data.data);
          setOpenPopup(true);
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong !!!");
        });
    } else if (type === "delete") {
      if (window.confirm("Are your sure to delete..??")) {
        VehicleService.deleteVehicle(rowData)
          .then((response) => {
            toastMessageShow("success", response.data.message);
            tableRef.current.onQueryChange();
          })
          .catch((err) => {
            toastMessageShow("error", "Something went Wrong !!!");
          });
      }
    } else if (type === "view") {
      navigate(`/vehicles/${rowData}`);
    }
  };

  const addOrEdit = (vehicles, resetForm) => {
    if (vehicles.id === 0) {
      VehicleService.insertVehicle(vehicles)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          tableRef.current.onQueryChange();
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong  !!!");
        });
    } else {
      VehicleService.updateVehicle(vehicles)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          tableRef.current.onQueryChange();
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong !!!");
        });
    }

    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
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

  const columns = [
    {
      title: "Photo",
      field: "photo",
      filtering: false,
      align: "center",
    },
    {
      title: "Total Photos",
      field: "total_photos",
      align: "left",
    },
    {
      title: "Damage Claim",
      field: "damage_claim",
      align: "left",
    },
    {
      title: "Claim Status",
      field: "claim_status",
      align: "left",
    },
    {
      title: "Add",
      field: "add",
      align: "left",
    },
    {
      title: "VCR",
      field: "vcr",
      align: "left",
    },
    {
      title: "REQ DATE",
      field: "req_date",
      align: "left",
    },
    {
      title: "DELY DATE",
      field: "dely_date",
      align: "left",
    },
    {
      title: "Days",
      field: "days",
      align: "left",
    },
    {
      title: "Year",
      field: "year",
      align: "left",
    },
    {
      title: "Make",
      field: "make",
      align: "left",
      width: "60px",
    },
    {
      title: "Model",
      field: "model",
      align: "left",
    },
    {
      title: "Color",
      field: "color",
      align: "left",
    },
    {
      title: "Vin",
      field: "vin",
      align: "left",
    },
    {
      title: "Lot no",
      field: "lot_no",
      align: "left",
    },
    {
      title: "Buyer Id",
      field: "buyer_id",
      align: "left",
    },
    {
      title: "Keys",
      field: "keys",
      align: "left",
    },
    {
      title: "Vehicle Type",
      field: "vehicle_type",
      align: "left",
    },
    {
      title: "Title",
      field: "title",
      align: "left",
    },
    {
      title: "Title Received Date",
      field: "title_received_date",
      align: "left",
    },
    {
      title: "Loc",
      field: "loc",
      align: "left",
    },
    {
      title: "Status",
      field: "status",
      align: "left",
    },
    {
      title: "Container No",
      field: "container_no",
      align: "left",
    },
    {
      title: "Eta Date",
      field: "eta_date",
      align: "left",
    },
    {
      title: "Customer Name",
      field: "customer_name",
      align: "left",
    },
    {
      title: "Loading Type",
      field: "loading_type",
      align: "left",
    },
    {
      title: "Created Date",
      field: "created_date",
      align: "left",
    },
    {
      title: "Note",
      field: "note",
      align: "left",
    },
    {
      title: "Search",
      field: "search",
      align: "left",
    },
    {
      title: "Document",
      field: "document",
      align: "left",
    },
    {
      title: "Invoice",
      field: "invoice",
      align: "left",
    },
    {
      title: "Action",
      field: "id",
      filtering: false,
      render: (rowData) => (
        <>
          <EyeIcon
            style={{
              margin: "7px",
              cursor: "pointer",
            }}
            onClick={(e) => handleClick(e, rowData.id, "view")}
            className="view-button"
          />
          <EditIcon
            style={{ margin: "7px", cursor: "pointer" }}
            onClick={(e) => handleClick(e, rowData, "edit")}
          />
          <DeleteIcon
            style={{ margin: "7px", cursor: "pointer" }}
            onClick={(e) => handleClick(e, rowData.id, "delete")}
          />
        </>
      ),
    },
  ];
  return (
    <>
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          components={{
            Pagination: PatchedPagination,
          }}
          tableRef={tableRef}
          icons={MaterialTableIcon}
          flex={1}
          title="Vehicles Data"
          columns={columns}
          data={(query) =>
            new Promise((resolve, reject) => {
              const _token = localStorage.getItem("_token");
              let url = `${process.env.REACT_APP_API_BASE_URL}/vehicles?`;
              url += "limit=" + query.pageSize;
              url += "&page=" + query.page;

              if (query.search) {
                url += "&q=" + query.search;
              }

              if (query.orderBy) {
                url += `&sort=${query.orderBy.field}$order=${query.orderDirection}`;
              }

              if (query.filters.length) {
                // eslint-disable-next-line array-callback-return
                const filter = query.filters.map((filter) => {
                  if (filter.value.length > 0) {
                    return `&${filter.column.field}${filter.operator}${filter.value}`;
                  }
                });
                url += filter.join("");
              }

              console.log(url);
              fetch(url, { headers: { Authorization: `Bearer ${_token}` } })
                .then((res) => res.json())
                .then((result) => {
                  resolve({
                    data: result.data,
                    page: result.meta.current_page - 1,
                    totalCount: result.meta.total - 1 + 1,
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
          }
          actions={[
            {
              icon: MaterialTableIcon.Add,
              tooltip: "Add Vehicle",
              isFreeAction: true,
              onClick: (event, rowData) => addEditRecord("", "add"),
            },
          ]}
          options={{
            filtering: true,
            sorting: true,
            debounceInterval: 900,
            padding: "dense",
            actionsColumnIndex: -1,
            tableLayout: "fixed",
          }}
        />

        <Popup
          title="Vehicle Form"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <VehicleForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
        </Popup>
      </div>
      <ToastContainer />
    </>
  );
}

export default Vehicles;
