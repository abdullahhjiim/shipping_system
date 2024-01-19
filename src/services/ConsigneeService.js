import ApiClient from "../api/ApiClient";
export  const insertConsignee = async (data) => {
   try{
        return  await ApiClient.post(`/consignees`, data);
   } catch (e) {
       return e;
   }
}

export const updateConsignee = async (data) => {
    try{
        return await ApiClient.put(`/consignees/${data.id}`, data);
   } catch (e) {
       return e;
   }
}

export const deleteConsignee = async (data) => {
    try{
        return await ApiClient.delete(`/consignees/${data}`);
   } catch (e) {
       return e;
   }
}

export const getConsigneeById = async (data) => {
    try{
        return await ApiClient.get(`/consignees/${data}`);
   } catch (e) {
       return e;
   }
}

export const getAllConsigneeForSelect = async (data) => {
    try{
        return await ApiClient.get(`/consignees`);
   } catch (e) {
       return e;
   }
}

export const getConsignees = async (restUrl) => {
    try{
        return await ApiClient.get(`/consignees${restUrl}`);
   } catch (e) {
       return e;
   }
}


