import axios from "axios";
import fs from "fs";
import path from "path";
import { app } from "../../../index";

export const zoho_instance = axios.create({
  baseURL: "https://accounts.zoho.eu/oauth/v2",
  timeout: 1000,
});

export const zoho_analytics_instance = axios.create({
  baseURL: "https://analyticsapi.zoho.eu/api/zoho@watts.dk",
  timeout: 1000,
});

export const getZohoToken = async (code: string) => {
  try {
    const response = await zoho_instance.post("/token", null, {
      params: {
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: "authorization_code",
        scope: process.env.ZOHO_SCOPE,
        code: code,
      },
    });
    return response.data;
  } catch (error) {
    console.error((error as Error)?.message);
    throw error;
  }
};

export const refreshZohoToken = async () => {
  try {
    const response = await zoho_instance.post("/token", null, {
      params: {
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: process.env.ZOHO_GRANT_TYPE,
        scope: process.env.ZOHO_SCOPE,
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
      },
    });
    app.locals.access_token = response.data.access_token;
    return response.data;
  } catch (error) {
    console.error((error as Error)?.message);
    throw error;
  }
};

type ZohoExportType = "DEALS" | "CONTACTS" | "INVOICES" | "ACCOUNTS";

type ZohoExportParams = {
  tableName: string;
  workspaceName: string;
  fileName: string;
};

const getExportParams = (type: ZohoExportType): ZohoExportParams | null => {
  switch (type) {
    case "DEALS": {
      return {
        tableName: "Deals (Zoho CRM)",
        workspaceName: "Watts",
        fileName: "deals.csv",
      };
    }
    case "CONTACTS": {
      return {
        tableName: "Kontakter (Zoho CRM)",
        workspaceName: "Watts",
        fileName: "contacts.csv",
      };
    }
    case "INVOICES": {
      return {
        tableName: "Invoices (Zoho Finance)",
        workspaceName: "Watts",
        fileName: "invoices.csv",
      };
    }
    case "ACCOUNTS": {
      return {
        tableName: "Accounts (Zoho Finance)",
        workspaceName: "Watts",
        fileName: "accounts.csv",
      };
    }
    default: {
      return null;
    }
  }
};

export const exportZohoData = async (type: ZohoExportType) => {
  try {
    const params = getExportParams(type);
    if (!params) return;
    const { fileName, tableName, workspaceName } = params;
    const response = await zoho_analytics_instance.get(
      `/${workspaceName}/${tableName}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${app.locals.access_token}`,
        },
        params: {
          ZOHO_ACTION: "EXPORT",
          ZOHO_OUTPUT_FORMAT: "CSV",
          ZOHO_ERROR_FORMAT: "JSON",
          ZOHO_API_VERSION: "1.0",
        },
      }
    );

    fs.writeFile(path.join("src", "files", fileName), response.data, (err) => {
      if (err) {
        console.error("Error writing to file:");
      } else {
        console.log("Data saved to file.");
      }
    });
  } catch (error) {
    console.error((error as Error)?.message);
    throw error;
  }
};
