import { BASE_URL, redirectToDashboard } from "@/utils/helper";
import { getUserSession, removeUserSession } from "@/utils/session";
import axios from "axios";
import { Transactions } from "../models/transactions";

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
    console.error("Index Transaction failed:", error.response.data);
    removeUserSession()
    redirectToDashboard()
  }
};

export const createTransaction = async (_transaction_date: string , _category_id: number, _amount: number, _type: string, _remarks: string) => {
  try {
    const user = await getUserSession()
    console.log("createTransaction", _transaction_date)
    const response = await axios.post(BASE_URL + "/api/v1/transaction/create", {
      transaction_date: _transaction_date, category_id: _category_id, amount: _amount, type: _type, remarks: _remarks
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

export const deleteTransaction = async (transaction_id: string) => {
  try {
    const user = await getUserSession()
    const response = await axios.get(BASE_URL + "/api/v1/transaction/delete/"+transaction_id, {
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
