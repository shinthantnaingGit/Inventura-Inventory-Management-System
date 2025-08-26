const { create } = require("zustand");

const useActiveMenu = create((set) => ({
  active: "dashboard",
  setActive: (menu) => set((state) => ({ active: menu })),
}));
export default useActiveMenu;
