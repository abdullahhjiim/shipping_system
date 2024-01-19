import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import EyeIcon from "@material-ui/icons/RemoveRedEye";
import MaterialTable from "material-table";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as ConsigneeService from "../../services/ConsigneeService";
import MaterialTableIcon from "../icons/MaterialTableIcon";
import { PatchedPagination } from "../pagination/PatchedPagination";
import Popup from "../popup/Popup";
import ConsigneeForm from "./ConsigneeForm";
import "./consignees.css";
import ConsigneeView from "./ConsigneeView";

function Consignees() {
  const authData = useSelector((state) => state.auth);
  const tableRef = useRef();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [viewPopup, setViewPopup] = useState(false);
  const [recordForView, setRecordForView] = useState(null);

  const addEditRecord = (id, type) => {
    setOpenPopup(true);
    setRecordForEdit(null);
  };
  const handleClick = (e, rowData, type) => {
    if (type === "edit") {
      ConsigneeService.getConsigneeById(rowData.id)
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
        ConsigneeService.deleteConsignee(rowData)
          .then((response) => {
            toastMessageShow("success", response.data.message);
            tableRef.current.onQueryChange();
          })
          .catch((err) => {
            toastMessageShow("error", "Something went Wrong !!!");
          });
      }
    } else if (type === "view") {
      setViewPopup(true);
      setRecordForView(rowData);
    }
  };

  const addOrEdit = (state, resetForm) => {
    if (state.id === 0) {
      ConsigneeService.insertConsignee(state)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          tableRef.current.onQueryChange();
          resetForm();
          setRecordForEdit(null);
          setOpenPopup(false);
        })
        .catch((err) => {
          console.log(err);
          toastMessageShow("error", "Something went Wrong  !!!");
        });
    } else {
      ConsigneeService.updateConsignee(state)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          tableRef.current.onQueryChange();
          resetForm();
          setRecordForEdit(null);
          setOpenPopup(false);
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong !!!");
        });
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

  const columns = [
    {
      title: "ID",
      field: "id",
      filtering: false,
      align: "center",
    },
    {
      title: "Consignee Name",
      field: "consignee_name",
      align: "left",
    },
    {
      title: "Customer Name",
      field: "coustomer_name",
      align: "left",
    },
    {
      title: "Phone",
      field: "phone",
      align: "left",
    },
    {
      title: "Action",
      field: "id",
      filtering: false,
      render: (rowData) => (
        <>
          {authData.permissions?.["consigness.view"] && (
            <EyeIcon
              style={{
                margin: "7px",
                cursor: "pointer",
              }}
              onClick={(e) => handleClick(e, rowData, "view")}
              className="view-button"
            />
          )}
          {authData.permissions?.["consigness.update"] && (
            <EditIcon
              style={{ margin: "7px", cursor: "pointer" }}
              onClick={(e) => handleClick(e, rowData, "edit")}
            />
          )}
          {authData.permissions?.["consigness.destroy"] && (
            <DeleteIcon
              style={{ margin: "7px", cursor: "pointer" }}
              onClick={(e) => handleClick(e, rowData.id, "delete")}
            />
          )}
        </>
      ),
    },
  ];
  return (
    <>
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          tableRef={tableRef}
          icons={MaterialTableIcon}
          components={{
            Pagination: PatchedPagination,
          }}
          flex={1}
          title="Consignee Data"
          columns={columns}
          data={(query) =>
            new Promise((resolve, reject) => {
              const _token = localStorage.getItem("_token");
              let url = `${process.env.REACT_APP_API_BASE_URL}/consignees?`;
              url += "limit=" + query.pageSize;
              url += "&page=" + (query.page + 1);

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
              tooltip: "Add Consignee",
              isFreeAction: true,
              onClick: (event, rowData) => addEditRecord("", "add"),
              hidden: !authData.permissions?.["consignees.store"],
            },
          ]}
          options={{
            // selection: true,
            filtering: true,
            sorting: true,
            debounceInterval: 900,
            padding: "dense",
            actionsColumnIndex: -1,
            tableLayout: "fixed",
          }}
        />

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
      </div>
      <ToastContainer />
    </>
  );
}

export default Consignees;
