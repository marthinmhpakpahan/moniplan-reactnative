import { getUserSession } from "@/utils/session";
import axios from "axios";

const BASE_URL = "http://192.168.1.28:8080"

type WhereFilterOp =
  "<" | "<=" | "==" | "!=" | ">=" | ">" |
  "array-contains" | "in" | "not-in" | "array-contains-any";

export const indexTransaction = async (_month: Number, _year: Number) => {
  try {
    const user = await getUserSession()
    const response = await axios.get(BASE_URL + "/api/v1/transaction?month="+_month+"&year="+_year, {
      headers: {
        "Authorization": "Bearer " + user.token
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Index Transaction failed:", error.response.data);
      throw new Error(error.response.data.message || "Index Transaction failed");
    }
    throw error;
  }
};

export const createTransaction = async (_category_id: number, _amount: number, _type: string, _remarks: string) => {
  try {
    const user = await getUserSession()
    const response = await axios.post(BASE_URL + "/api/v1/transaction/create", {
      category_id: _category_id, amount: _amount, type: _type, remarks: _remarks
    }, {
      headers: {
        "Authorization": "Bearer " + user.token
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Create Category failed:", error.response.data);
      throw new Error(error.response.data.message || "Create Category failed");
    }
    throw error;
  }
};
