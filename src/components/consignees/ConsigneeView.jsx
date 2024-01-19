import { Grid } from "@material-ui/core";
import React from "react";

function ConsigneeView({ recordData }) {
  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <p>State Name :</p>
              </div>
              <div className="col-md-6">
                <p>{recordData.name}</p>
              </div>
              <div className="col-md-6">
                <p>Status :</p>
              </div>
              <div className="col-md-6">
                <p>{recordData.status === 1 ? "Active" : "InActive"}</p>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default ConsigneeView;
