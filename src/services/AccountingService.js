import ApiClient from "../api/ApiClient";
export  const getAccountingInfo = async () => {
   try{
        return  await ApiClient.get(`/invoices`);
   } catch (e) {
        return Promise.reject(e);
   }
}



