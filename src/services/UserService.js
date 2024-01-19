import ApiClient from "../api/ApiClient";
export  const insertUser = async (data) => {
   try{
        return  await ApiClient.post(`/users`, data);
   } catch (e) {
       return e;
   }
}

export const updateUser = async (data) => {
    try{
        return await ApiClient.put(`/users/${data.id}`, data);
   } catch (e) {
       return e;
   }
}

export const deleteUser = async (data) => {
    try{
        return await ApiClient.delete(`/users/${data}`);
   } catch (e) {
       return e;
   }
}

export const getUserById = async (data) => {
    try{
        return await ApiClient.get(`/users/${data}`);
   } catch (e) {
       return e;
   }
}

export const getUsers = async (restUrl) => {
    try{
        return await ApiClient.get(`/users${restUrl}`);
   } catch (e) {
       return e;
   }
}

export const statusChangeUser = async (userId) => {
    try{
        return await ApiClient.get(`/users/${userId}/change-status`);
   } catch (e) {
       return e;
   }
}
