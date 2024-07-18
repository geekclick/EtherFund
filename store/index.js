import { create } from 'zustand';

const useStore = create((set) => ({
    ethPrice: 0,
    setEthPrice: (price) => set((state) => ({ ethPrice: price })),
}));

export default useStore;
