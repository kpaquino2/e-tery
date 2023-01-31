import { create } from "zustand";

const useSearch = create((set, get) => ({
  query: "",
  setQuery: (q) => set(() => ({ query: q.trim() })),
}));

export default useSearch;
