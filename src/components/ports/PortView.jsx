import { Grid } from "@material-ui/core";
import React from "react";

function PortView({ recordData }) {
  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <p>Ports Name :</p>
              </div>
              <div className="col-md-6">
                <p>{recordData.name}</p>
              </div>
              <div className="col-md-6">
                <p>Ports Lat :</p>
              </div>
              <div className="col-md-6">
                <p>{recordData.lat}</p>
              </div>
              <div className="col-md-6">
                <p>Ports Long :</p>
              </div>
              <div className="col-md-6">
                <p>{recordData.long}</p>
              </div>
              <div className="col-md-6">
                <p>Status :</p>
              </div>
              <div className="col-md-6">
                <p>{recordData.status === 1 ? "Active" : "Inactive"}</p>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default PortView;
