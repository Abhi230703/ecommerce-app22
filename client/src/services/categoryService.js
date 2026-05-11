import API from "./api";

export const fetchCategories = () => API.get("/categories");