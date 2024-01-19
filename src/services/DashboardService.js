import ApiClient from "../api/ApiClient";

export  const getStatusOverview = async () => {
   try{
        return  await ApiClient.get(`/dashboard`);
   } catch (e) {
       return e;
   }
}
