import { api } from "../../api/client";

// customer only
export const parcelsApi = {
    book: (payload) => api.post("/parcels/book", payload).then((r) => r.data),
};
