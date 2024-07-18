import { create } from 'zustand';

const useSignerStore = create((set) => ({
    signer: null,
    address: null,
    setSigner: (obj) => set(() => ({ signer: obj })),
    setAddress: (obj) => set(() => ({ address: obj })),
    // decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default useSignerStore;
