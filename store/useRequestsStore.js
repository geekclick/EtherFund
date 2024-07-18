import { create } from 'zustand';

const useRequestsStore = create((set) => ({
    requestCount: 0,
    requests: null,
    setRequestsCount: (n) => set(() => ({ requestCount: n })),
    setRequests: (list) => set(() => ({ requests: list })),
}));

export default useRequestsStore;
