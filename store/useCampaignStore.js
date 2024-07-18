import { create } from 'zustand';

const useCampaignStore = create((set) => ({
    campaigns: [{
        name: "Campaign",
        description: "abc",
        creatorId: "123",
        imageURL: "https://imgs.search.brave.com/eaHZVtszMuss97uCnGCdF4gPMnPiy4nCEu5Tgi4gJ5g/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI1/MjkyNDA2Ni9waG90/by9wb29yLWluZGlh/bi1jaGlsZHJlbi1h/c2tpbmctZm9yLWhl/bHAuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPWlDZm55RUpC/QUxkckI4RF9FWjBD/STFsRGdESE1aOHlD/Ynd1YTZlTnlFUTg9",
        id: "11",
        balance: 200,
        target: 500,
        ethPrice: 400

    }],
    setCampaigns: (list) => set((state) => ({ campaigns: list })),
    // decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default useCampaignStore;
