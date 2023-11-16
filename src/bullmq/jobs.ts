import { exportZohoData } from "../utils/axios";

type Jobs = {
  [key: string]: () => Promise<any>;
};

export const jobs: Jobs = {
  update_accounts: async () => await exportZohoData("ACCOUNTS"),
  update_contacts: async () => await exportZohoData("CONTACTS"),
  update_deals: async () => await exportZohoData("DEALS"),
  update_invoices: async () => await exportZohoData("INVOICES"),
};
