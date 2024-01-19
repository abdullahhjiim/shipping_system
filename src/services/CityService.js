import ApiClient from "../api/ApiClient";
export  const insertCity = async (data) => {
   try{
        return  await ApiClient.post(`/cities`, data);
   } catch (e) {
       return e;
   }
}

export const updateCity = async (data) => {
    try{
        return await ApiClient.put(`/cities/${data.id}`, data);
   } catch (e) {
       return e;
   }
}

export const deleteCity = async (data) => {
    try{
        return await ApiClient.delete(`/cities/${data}`);
   } catch (e) {
       return e;
   }
}

export const getCityById = async (data) => {
    try{
        return await ApiClient.get(`/cities/${data}`);
   } catch (e) {
       return e;
   }
}

export const getCities = async (restUrl) => {
    try{
        return await ApiClient.get(`/cities${restUrl}`);
   } catch (e) {
       return e;
   }
}
