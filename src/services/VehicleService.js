import ApiClient from "../api/ApiClient";
export const insertVehicle = async (data) => {
  try {
    return await ApiClient.post(`/vehicles`, data);
  } catch (e) {
    if (e.response.status === 422) {
      return Promise.reject(e.response);
    } else {
      return Promise.reject(e);
    }
  }
};

export const updateVehicle = async (data) => {
  try {
    return await ApiClient.put(`/vehicles/${data.id}`, data);
  } catch (e) {
    return e;
  }
};

export const deleteVehicle = async (data) => {
  try {
    return await ApiClient.delete(`/vehicles/${data}`);
  } catch (e) {
    return e;
  }
};

export const getVehicleById = async (data) => {
  try {
    return await ApiClient.get(`/vehicles/${data}`);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const getVehicles = async (restUrl) => {
  try {
    return await ApiClient.get(`/vehicles${restUrl}`);
  } catch (e) {
    return e;
  }
};

export const getNote = async (vehicleId) => {
  try {
    return await ApiClient.get(`/notes?vehicle_id=${vehicleId}`);
  } catch (e) {
    return e;
  }
};

export const getNotes = async (restUrl) => {
  try {
    return await ApiClient.get(`/notes${restUrl}&unread_only=true`);
  } catch (e) {
    return e;
  }
};

export const addNote = async (vehicleId, data) => {
  try {
    return await ApiClient.post(`/notes?vehicle_id=${vehicleId}`, data);
  } catch (e) {
    return e;
  }
};

export const changeConversation = async (id, data) => {
  try {
    return await ApiClient.post(`/vehicles/${id}/change-note-status`, data);
  } catch (e) {
    return e;
  }
};

export const getCustomersItem = async (restUrl) => {
  try {
    return await ApiClient.get(`${restUrl}`);
  } catch (e) {
    return e;
  }
};

export const getVehicleTypes = async (restUrl) => {
  try {
    return await ApiClient.get(`${restUrl}`);
  } catch (e) {
    return e;
  }
};

export const getVinsItem = async (restUrl) => {
  try {
    return await ApiClient.get(`${restUrl}`);
  } catch (e) {
    return e;
  }
};

export const getColorItems = async () => {
  try {
    return await ApiClient.get(`/vehicles/colors`);
  } catch (e) {
    return e;
  }
};

export const getCheckboxItems = async () => {
  try {
    return await ApiClient.get(`/vehicles/checkbox-items`);
  } catch (e) {
    return e;
  }
};

// export const getConditionItems = async () => {
//     try{
//         return await ApiClient.get(`/vehicles/condition-items`);
//    } catch (e) {
//        return e;
//    }
// }
export const getLocationItems = async () => {
  try {
    return await ApiClient.get(`/location-items`);
  } catch (e) {
    return e;
  }
};

export const getVehicleCondition = async (id) => {
  try {
    return await ApiClient.get(`/vehicles/condition-report-html/${id}`);
  } catch (e) {
    return e;
  }
};
