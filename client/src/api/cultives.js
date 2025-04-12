import axios from './axios';

export const getCultivesRequest = () => axios.get("/api/registros");

export const getCultiveRequest = (id) => axios.get(`/api/registros/${id}`);

export const createCultiveRequest = (cultive) => axios.post("/api/registros", cultive);

export const updateCultiveRequest = (cultive) => axios.put(`/api/registros/${cultive.id}`, cultive);

export const deleteCultiveRequest = (id) => axios.delete(`/api/registros/${id}`);