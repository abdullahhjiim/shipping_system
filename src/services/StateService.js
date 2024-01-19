import ApiClient from "../api/ApiClient";
export  const insertState = async (data) => {
   try{
        return  await ApiClient.post(`/states`, data);
   } catch (e) {
       return e;
   }
}

export const updateState = async (data) => {
    try{
        return await ApiClient.put(`/states/${data.id}`, data);
   } catch (e) {
       return e;
   }
}

export const deleteState = async (data) => {
    try{
        return await ApiClient.delete(`/states/${data}`);
   } catch (e) {
       return e;
   }
}

export const getStateById = async (data) => {
    try{
        return await ApiClient.get(`/states/${data}`);
   } catch (e) {
       return e;
   }
}

export const getAllStateForSelect = async () => {
    try{
        return await ApiClient.get(`/states`);
   } catch (e) {
       return e;
   }
}

export const getStates = async (restUrl) => {
    try{
        return await ApiClient.get(`/states${restUrl}`);
   } catch (e) {
       return e;
   }
}
