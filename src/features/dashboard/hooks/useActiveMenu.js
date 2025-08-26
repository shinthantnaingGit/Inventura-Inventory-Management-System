const { create } = require("zustand");

const useActiveMenu = create((set) => ({
  active: "inventory",
  setActive: (menu) => set((state) => ({ active: menu })),
}));
export default useActiveMenu;
