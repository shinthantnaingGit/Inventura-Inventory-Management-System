import useAccountStore from "@/store/useAccountStore";

export const token = useAccountStore.getState().token;

