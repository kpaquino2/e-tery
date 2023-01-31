import { create } from "zustand";

const useSearch = create((set, get) => ({
  query: "",
  setQuery: (q) => set(() => ({ query: q })),
  getQuery: () => get().query,
}));

export default useSearch;
