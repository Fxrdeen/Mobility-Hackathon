import { create } from "zustand";

const useStore = create((set) => ({
  latitude: 0.0,
  longitude: 0.0,
  setLatitude: (latitude) => set({ latitude }),
  setLongitude: (longitude) => set({ longitude }),
  Lat:0.0,
  Lng:0.0,
  setLat:(lat:number)=>set({Lat:lat}),
  setLng:(lng:number)=>set({Lng:lng}),
}));

export default useStore;
