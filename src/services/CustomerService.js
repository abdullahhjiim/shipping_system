import ApiClient from "../api/ApiClient";
export  const insertCustomer = async (data) => {
   try{
        return  await ApiClient.post(`/customers`, data);
   } catch (e) {
        if(e.response.status === 422) {
            return  Promise.reject(e.response);
        }else{
           return Promise.reject(e);
        }
   }
}

export const updateCustomer = async (data) => {
    try{
        return await ApiClient.put(`/customers/${data.id}`, data);
   } catch (e) {
       return e;
   }
}

export const deleteCustomer = async (data) => {
    try{
        return await ApiClient.delete(`/customers/${data}`);
   } catch (e) {
       return e;
   }
}

export const getCustomerById = async (data) => {
    try{
        return await ApiClient.get(`/customers/${data}`);
   } catch (e) {
       return e;
   }
}

export const getCustomers = async (restUrl) => {
    try{
        return await ApiClient.get(`/customers${restUrl}`);
   } catch (e) {
       return e;
   }
}
export const getNextCustomerId = async () => {
    try{
        return await ApiClient.get(`/customers/next-customer-id`);
   } catch (e) {
       return e;
   }
}
export const fileStore = async (file) => {
    try{
        return await ApiClient.post(`/customers/file-store`, file);
   } catch (e) {
       return e;
   }
}


