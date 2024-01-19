import ApiClient from "../api/ApiClient";
export  const insertExport = async (data) => {
   try{
        return  await ApiClient.post(`/exports`, data);
   } catch (e) {
    if(e.response.status === 422) {
        return  Promise.reject(e.response);
    }else{
       return Promise.reject(e);
    }
   }
}

export const updateExport = async (data) => {
    try{
        return await ApiClient.put(`/exports/${data.id}`, data);
   } catch (e) {
       return e;
   }
}

export const deleteExport = async (data) => {
    try{
        return await ApiClient.delete(`/exports/${data}`);
   } catch (e) {
       return e;
   }
}

export const getExportById = async (data, type = 1) => {
    try{
        return await ApiClient.get(`/exports/${data}?type=${type}`);
   } catch (e) {
       return Promise.reject(e);
   }
}

export const getExports = async (restUrl) => {
    try{
        return await ApiClient.get(`/exports${restUrl}`);
   } catch (e) {
       return e;
   }
}


export const getBillOfLoading = async (id) => {
    try{
        return await ApiClient.get(`/exports/${id}/landing-modal`);
   } catch (e) {
       return e;
   }
}
