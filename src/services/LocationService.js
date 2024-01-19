import ApiClient from "../api/ApiClient";
export  const insertLocation = async (data) => {
   try{
        const response =  await ApiClient.post(`/locations`, data);
        console.log(response);
        return response;
   } catch (e) {
       console.log(e);
       return e;
   }
}

export const updateLocation = async (data) => {
    try{
        return await ApiClient.put(`/locations/${data.id}`, data);
   } catch (e) {
       return e;
   }
}

export const deleteLocation = async (data) => {
    try{
        return await ApiClient.delete(`/locations/${data}`);
   } catch (e) {
       return e;
   }
}

export const getLocations = async (restUrl) => {
    try{
        return await ApiClient.get(`/locations${restUrl}`);
   } catch (e) {
       return e;
   }
}