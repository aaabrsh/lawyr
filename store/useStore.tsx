import create from "zustand";
import { persist } from "zustand/middleware";

// const store = (set) => ({

//   addsearchText: (searchText) => set({ searchText: searchText }),
//   // removeUser: () => set({ userProfile: null }),
// });

const useStore = create((set) => ({
  addsearchText: (searchText: any) => set({ searchText: searchText }),
  removeSearchText: () => set({ searchText: "s" }),
}));

// const useStore = create(
//   persist(store, {
//     name: "search",
//   })
// );

export default useStore;
