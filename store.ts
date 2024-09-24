import { create } from "zustand";

const useStore = create((set) => ({
  latitude: 0.0,
  longitude: 0.0,
  setLatitude: (latitude) => set({ latitude }),
  setLongitude: (longitude) => set({ longitude }),
}));

export default useStore;
