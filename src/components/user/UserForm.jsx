import { Grid } from "@material-ui/core";
import Multiselect from "multiselect-react-dropdown";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import * as VehicleService from "../../services/VehicleService";
import Controls from "../controls/Controls";
import { Form, useForm } from "../useForm/UseForm";

const statusItems = [
  { id: "1", title: "Active" },
  { id: "2", title: "Inactive" },
];

const roleNameItems = [
  { name: "Master Admin", id: 10 },
  { name: "Super Admin", id: 1 },
  { name: "Location Admin", id: 2 },
  { name: "Account", id: 5 },
];

const initialFValues = {
  id: 0,
  username: "",
  email: "",
  status: "1",
  password: "",
  role: "",
  locations: [],
};

export default function UserForm(props) {
  const [buttonText, setButtonText] = useState();
  const [locationOptions, setLocationOptions] = useState([]);
  const [preSelectedValue, setPreSelectedValue] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [errorClass, setErrorClass] = useState("");

  const { addOrEdit, recordForEdit, buttonDisabled } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("username" in fieldValues)
      temp.username = fieldValues.username ? "" : "This field is required.";

    if ("email" in fieldValues)
      temp.email = fieldValues.email ? "" : "This field is required.";

    if ("role" in fieldValues)
      temp.role = fieldValues.role ? "" : "This field is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorClass("was-validated");
    if (validate()) {
      let finalValue = { ...values, locations: selectedLocation };
      addOrEdit(finalValue, resetForm);
    }
  };

  useEffect(() => {
    const getLocations = () => {
      VehicleService.getLocationItems()
        .then((response) => {
          setLocationOptions(response.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    };

    getLocations();
  }, []);

  useEffect(() => {
    if (recordForEdit != null) {
      setValues({
        ...recordForEdit,
      });
      setPreSelectedValue(recordForEdit.location_selected);
      setSelectedLocation(recordForEdit.locations ?? []);
      setButtonText("Update");
    } else {
      setButtonText("Save");
    }
  }, [recordForEdit, setValues]);

  const onSelect = (selectedList, selectedItem) => {
    const cloneArr = [...selectedLocation];
    cloneArr.push(selectedItem.id);
    setSelectedLocation(cloneArr);
  };
  const onRemove = (selectedList, selectedItem) => {
    const cloneArr = [...selectedLocation];
    let index = cloneArr.findIndex((ele) => ele === selectedItem.id);
    cloneArr.splice(index, 1);
    setSelectedLocation(cloneArr);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className={`needs-validation ${errorClass}`}
      noValidate
    >
      <Grid container>
        <Grid item xs={12}>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label mb-0">Username</label>
              <Controls.Input
                name="username"
                label="Username"
                value={values.username}
                onChange={handleInputChange}
                required="required"
              />
              <div className="invalid-feedback">
                Please provide a valid username.
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label mb-0">Email</label>
              <Controls.Input
                name="email"
                label="Email"
                value={values.email}
                onChange={handleInputChange}
                required="required"
              />
              <div className="invalid-feedback">
                Please provide a valid username.
              </div>
            </div>
            <div className="col-md-6">
              <br />
              <label className="form-label mb-0">Password</label>
              <Controls.Input
                name="password"
                type="password"
                label="Password"
                value={values.password}
                onChange={handleInputChange}
                required={recordForEdit?.id ? false : true}
              />
              <div className="invalid-feedback">Please input password.</div>
            </div>
            <div className="col-md-6">
              <br />
              <label className="form-label mb-0">Role Name</label>
              <Controls.Select
                name="role"
                label="Role Name"
                value={values.role}
                onChange={handleInputChange}
                options={roleNameItems}
                required="required"
              />
              <div className="invalid-feedback">Please select a Role.</div>
            </div>

            <div className="col-md-6">
              <br />
              <Controls.RadioGroup
                name="status"
                label="Status"
                value={values.status === 1 || values.status === "1" ? "1" : "2"}
                onChange={handleInputChange}
                items={statusItems}
              />
            </div>

            {values.role && values.role == 2 && (
              <div className="col-md-6">
                <br />
                <label className="form-label mb-0">Location</label>
                <Multiselect
                  options={locationOptions}
                  selectedValues={preSelectedValue}
                  onSelect={onSelect}
                  onRemove={onRemove}
                  displayValue="name"
                />
              </div>
            )}
          </div>
        </Grid>
        <Grid item xs={12}>
          <div
            className="pull-right"
            style={{ display: "flex", flexDirection: "row-reverse" }}
          >
            {buttonDisabled && <Spinner animation="border" size="sm" />}

            <Controls.Button
              size="medium"
              type="submit"
              text={buttonText}
              disabled={buttonDisabled}
            />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
