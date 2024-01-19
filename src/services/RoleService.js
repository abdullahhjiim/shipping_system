import ApiClient from "../api/ApiClient";
export  const getRoles = async () => {
   try{
        return  await ApiClient.get(`/acl/roles`);
   } catch (e) {
       return e;
   }
}

export  const getRole = async (data) => {
   try{
        return  await ApiClient.get(`/acl/roles/${data}`);
   } catch (e) {
       return e;
   }
}

export  const getPermissions = async () => {
   try{
        return  await ApiClient.get(`/acl/permissions`);
   } catch (e) {
       return e;
   }
}

export  const updateRolesPermission = async (id, data) => {
   try{
        return  await ApiClient.post(`/acl/roles/${id}`, data);
   } catch (e) {
       return e;
   }
}

export  const getUserWisePermissions = async (id) => {
   try{
        return  await ApiClient.get(`/acl/users/${id}`);
   } catch (e) {
       return e;
   }
}
export  const updateUsersPermission = async (id, data) => {
   try{
        return  await ApiClient.post(`/acl/users/${id}`, data);
   } catch (e) {
       return e;
   }
}


