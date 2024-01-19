import ApiClient from "../api/ApiClient";
export  const insertPort = async (data) => {
   try{
        const response =  await ApiClient.post(`/ports`, data);
        console.log(response);
        return response;
   } catch (e) {
       console.log(e);
       return e;
   }
}

export const updatePort = async (data) => {
    try{
        return await ApiClient.put(`/ports/${data.id}`, data);
   } catch (e) {
       return e;
   }
}

export const deletePort = async (data) => {
    try{
        return await ApiClient.delete(`/ports/${data}`);
   } catch (e) {
       return e;
   }
}

export const getPorts = async (restUrl) => {
    try{
        return await ApiClient.get(`/ports${restUrl}`);
   } catch (e) {
       return e;
   }
}

export const getPortItems = async (type) => {
    try {
        return await ApiClient.get(`port-items/${type}`)
    } catch (e) {
        Promise.reject(e);
    }
}