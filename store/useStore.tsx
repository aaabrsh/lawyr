import create from "zustand";
import { persist } from "zustand/middleware";

// const store = (set) => ({

//   addsearchText: (searchText) => set({ searchText: searchText }),
//   // removeUser: () => set({ userProfile: null }),
// });

const useStore = create((set) => ({
  addsearchText: (searchText: any) => set({ searchText: searchText }),
  removeSearchText: () => set({ searchText: "s" }),
  addPdfUrl: (pdf_url: string) => set({ pdf_url: pdf_url }),
  addPdfFile: (blobFile: string) => set({ blobFile: blobFile }),
}));

// const useStore = create(
//   persist(store, {
//     name: "search",
//   })
// );

export default useStore;
