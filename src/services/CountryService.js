import ApiClient from "../api/ApiClient";
export  const insertCountry = async (data) => {
   try{
        return  await ApiClient.post(`/countries`, data);
   } catch (e) {
       return e;
   }
}

export const updateCountry = async (data) => {
    try{
        return await ApiClient.put(`/countries/${data.id}`, data);
   } catch (e) {
       return e;
   }
}

export const deleteCountry = async (data) => {
    try{
        return await ApiClient.delete(`/countries/${data}`);
   } catch (e) {
       return e;
   }
}

export const getAllCountryForSelect = async () => {
    try{
        return await ApiClient.get(`/countries`);
   } catch (e) {
       return e;
   }
}

export const getAllCountriesFor = async () => {
    try{
        return await ApiClient.get(`/search/countries`);
   } catch (e) {
       return e;
   }
}

export const getCitiesByCountry=async (url) => {
    try{
        return await ApiClient.get(`/search/cities?country_id=${url}`);
   } catch (e) {
       return e;
   }
}

export const getCustomsCountry = async (restUrl) => {
    try{
        return await ApiClient.get(`${restUrl}`);
   } catch (e) {
       return e;
   }
}

export const getAllStateByCountry = async (countryId) => {
    try{
        return await ApiClient.get(`/states?country_id=${countryId}`);
   } catch (e) {
       return e;
   }
}

export const getAllCities = async () => {
    try{
        return await ApiClient.get(`/search/cities`);
   } catch (e) {
       return e;
   }
}

export const getCitiesByState = async (stateId) => {
    try{
        return await ApiClient.get(`/search/cities?state_id=${stateId}`);
   } catch (e) {
       return e;
   }
}

export const getAllCityByState = async (stateId) => {
    try{
        return await ApiClient.get(`/cities?state_id=${stateId}`);
   } catch (e) {
       return e;
   }
}

export const getCountries = async (restUrl) => {
    try{
        return await ApiClient.get(`/countries${restUrl}`);
   } catch (e) {
       return e;
   }
}