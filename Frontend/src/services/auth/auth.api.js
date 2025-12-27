import { api } from "../../api/client";

export const authApi = {
    register: (payload) => api.post("/auth/register", payload).then((r) => r.data),
    login: (payload) => api.post("/auth/login", payload).then((r) => r.data),
};
// export async function registerUser(payload) {
//     const res = await api.post("/auth/register", payload);
//     return res.data;
// }

// export async function loginUser(payload) {
//     const res = await api.post("/auth/login", payload);
//     return res.data;
// }
